const bcrypt = require("bcrypt-nodejs")
const passport = require("passport")
const router = require("express").Router()
const DatabaseManager = require("../db")
const fs = require('fs')
const sendEmail = require("./send-email")

const db = DatabaseManager.get();

async function validateResetPasswordUser (req) {
   const db = DatabaseManager.get();
   if (!req.query.email || !req.query.token) {
    return null
   }
   return (await db("revrentals").where({
    email: req.query.email,
    reset_password_token: req.query.token
   }).select())[0]
}

function loginRequired(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login")
  }
  next()
}


function adminRequired(req, res, next) {
  if (!req.user.is_admin) {
    return res.render("403")
  }
  next()
}



router
  // The form to enter the email
  .get("/login/forgot-password", (req, res, next) => {
    res.render("forgot_password")
  })
  // When submitting the form, we need to send the reset link email
  .post("/login/forgot-password", async (req, res, next) => {

     const db = DatabaseManager.get();
     const user = (await db("users").where({
      email: req.body.email
     }).select())[0]

     res.send(`
      If this email is in our database, <strong>a link to reset the password will be sent</strong>. In 5 seconds you will be redirected to the homepage.
      <script>setTimeout(function () { location = "/" }, 5000)</script>
     `)

     if (user) {
        const resetToken = Math.random().toString(36).slice(2)
        await db("users").where({
          email: req.body.email
        }).update({
          reset_password_token: resetToken
        });
        const resetPasswordUrl = `http://${req.headers.host}/login/reset-password?email=${req.body.email}&token=${resetToken}`
        console.log(resetPasswordUrl)

        await sendEmail({
          to: req.body.email,
          subject: 'Reset Password',
          html: `Hey @${user.first_name},<br>

          Please click <a href="${resetPasswordUrl}">here</a> to reset your account password.<br>

          Eventually, you can manually open this url in your browser: ${resetPasswordUrl}.

          Cheers`
        })
     }
  })
  // They open the email and click the reset password url
  // this url will have a querystring with a token
  // e.g. /login/:building/reset-password?token=....
  .get("/login/reset-password", async (req, res, next) => {
     const user = await validateResetPasswordUser(req)

     if (!user) {
        res.status(403).send("Not authorized.");
     }

     res.render("reset_password")
  })
  // Reset the password
  .post("/login/reset-password", async (req, res, next) => {
     const user = await validateResetPasswordUser(req)

     if (user) {
       const db = DatabaseManager.get();

        await db("users").where({
          id: user.id
        }).update({
          reset_password_token: null,
          password: bcrypt.hashSync(req.body.password)
        });

        res.send("Password reset. You now can <a href='/'>log in</a>.");
     } else {
        res.status(403).send("Not authorized.");
     }
  })
  .get("/login", (req, res, next) => {
    res.render("login")
  })
  .post("/login",
    (req, res, next) => {
     // console.log('Setting cookie to: ', req.params.revrentals);
      res.cookie('revrentals', + req.params.revrentals, { httpOnly: true });
      next();
    },
    passport.authenticate("local", {

      successRedirect: "/menu",
      passReqToCallback: true,
      failureRedirect: "back",

    }
  ))

  .get("/logout", (req, res, next) => {
      req.session.destroy((err) => {
        res.redirect("/login")
      })
  })

  .get("/signup",(req, res, next) => {

    res.render("signup")

  })

  .post("/signup", passport.authenticate("local-register", {

    successRedirect: "/users",

    failureRedirect: "/signup",

  }))

// Get the update form
.get("/users/users/:id/edit", loginRequired, adminRequired,  function (req, res) {
  res.render("edit-user")
})
// Post the update form
.post("/users/users/:id/edit", loginRequired, adminRequired, function (req, res, next) {
  delete req.body.id
  db("users").where("id", req.params.id).then(() => {
    res.redirect(req.url)
  }).catch(next)
})
// Get the delete page
.get("/users/users/:id/delete", loginRequired, adminRequired,  function (req, res) {
  res.render("users_delete_confirmation")
})
// Post the delete page
.post("/users/users/:id/delete", loginRequired, adminRequired, function (req, res, next) {
  db("users").where("id", req.params.id).delete().then(() => {
    res.redirect("/users")
  }).catch(next)
})

  .get("/edit-user/:id", loginRequired, adminRequired, async(req, res, next) => {

    try {
      const user = await db("users")
        .where("id", req.params.id)
        .first();


      if(!user){
         return next(new Error('user does not exist'))
      }


      const admin = {
        //is_employee: !user.type ? 'selected' : '',
        is_admin: user.type == 1 ? 'selected' : '',
      };


      res.render("edit-user", { user, admin });

    } catch(e) {
      next(e);
    }

  })

  .post("/edit-user", loginRequired, adminRequired, (req, res, next) => {

    const query = db("users").where("id", req.body.id)

    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password)
    }

    query
      .update(req.body)
      .then(() => {
        res.redirect("/users")
      })
      .catch(next)
  })

  .post("/delete-user/:id", loginRequired,adminRequired, (req, res, next) => {
    const query = db("users").where("id", req.params.id)

    query
      .delete()
      .then((result) => {
        if (result === 0) {
          return res.send("Error, could not delete user")
        }
        res.redirect("/users")
      })
      .catch(next)
  })

module.exports = router
