
require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session")
const connectSessionKnex = require("connect-session-knex")
const passport = require("passport")
const postsRoutes = require("./routes/post")
const fobsRoutes = require("./routes/fobs")
const authRoutes = require("./routes/auths")
const uploadRoutes = require("./routes/upload")
require("./passport")
const fileUpload = require('express-fileupload');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser');
const connectSession = require('connect-session')
const path = require('path');
const DatabaseManager = require("./db")
const KnexSessionStore = connectSessionKnex(session);

express()

  .set("view engine", "ejs")  // configure template engine
  .use(cookieParser())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .use(session({
    store: new KnexSessionStore({
      knex: DatabaseManager.get()
    }),
    secret: "i love dogs", 
    resave: false, 
    // store: sessionStore,
     saveUninitialized: false }))

  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    
    res.locals = {
 	 req,
	isAdmin: req.user && (req.user.is_admin || req.user.is_super_admin)
    }
    if(!req.cookies)
      res.cookie('revrentals', { httpOnly: true });
    next();
  })
  .use(postsRoutes)
  .use(fobsRoutes)
  .use(authRoutes)

  
  .use('/public', express.static(path.join(__dirname, 'public')))
  .use(fileUpload()) // configure fileupload



  .listen(8888, () => {
    console.log(`Server running on port:8888`);
})
