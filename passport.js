const bcrypt = require("bcrypt-nodejs")
const DatabaseManager = require("./db")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const router = require("express").Router()


const { adminRequired } = require("./util")

const db = DatabaseManager.get();

const ROLES = {
  ADMIN: 1,
  SUPER_ADMIN: 2
}

passport.use(new LocalStrategy({ passReqToCallback: true }, authenticate))
passport.use("local-register", new LocalStrategy({passReqToCallback: true}, register))



function authenticate(req, email, password, done){

  db("users")
    //.join( 'users.id')
    .where("email", email)
    .first()
    .then((user) => {
      
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, {message: "invalid user and password combination"})
      }
      user.is_admin = user.type == ROLES.ADMIN || user.type === ROLES.SUPER_ADMIN;
      user.is_super_admin = user.type === ROLES.SUPER_ADMIN
      done(null, user)
    })
    .catch(err => {
      console.log(err);
      done(err);
    })
}



function register(req, email, password, done) {
  let newUser;


  req.body.revrentals = Array.isArray(req.body.revrentals) ? req.body.revrentals : [req.body.revrentals];

  db("users")
    .where("email", email)
    .first()
    .then((user) => {

      if (user) {
        return done(null, false, {message: "an account with that email has already been created"})
      }

      if (password !== req.body.password2) {
        return done(null, false, {message: "passwords don't match"})
      }


      newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: email,
        password: bcrypt.hashSync(password),
        type: req.body.type
      };

      console.log(newUser);
      return db("users")
        .insert(newUser)
        
    }).then(async(ids) => {
      console.log(ids);
      newUser.id = ids[0]

      
      done(null, req.user);
    })
}





passport.serializeUser(function(user, done) {
  done(null, user.id)

})



passport.deserializeUser(function(id, done) {
  db("users")
    .where("id", id)
    .first()
    .then((user) => {
      user.is_admin = user.type === ROLES.ADMIN || user.type === ROLES.SUPER_ADMIN;
      user.is_super_admin = user.type === ROLES.SUPER_ADMIN;
      done(null, user)

    }, done)
})