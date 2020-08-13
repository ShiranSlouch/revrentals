const passport = require("passport")
const router = require("express").Router()
const DatabaseManager = require("../db");
const db = DatabaseManager.get();
const moment = require("moment")
const { checkAuthAndMaybeRedirect,
        adminOrSuperadminRequired,
        ifAuthenticatedRedirectToMenu } = require("../util")
const path = require("path")

const multer = require('multer');

// In the pictures folder we will have two folders: commercial and residential
const PATH_PUBLIC_UPLOADS = "/public/assets/pictures"
const PATH_UPLOADS = path.join(__dirname,'../', PATH_PUBLIC_UPLOADS)

const HOMES = {
  home: {
    uploads_table: "uploads",
    uploads_folder: "residential",
    header_title: "Residential",
    logo_uri: "/public/images/logos/Rev-Rentals-logo-page-001.jpg",
    background_img:"/public/images/background/building.jpg"
  },
  home_2: {
    uploads_table: "uploads2",
    uploads_folder: "commercial",
    header_title: "Commercial",
    logo_uri: "/public/images/logos/Rev-Rentals-logo-0319-01.jpg",
    background_img:"/public/images/background/Featured.jpg"
  }
}

const HIDDEN_HOME = {
  hidden: true,
  Address: "HIDDEN_HOME",
  Apt: -1,
  Size: -1,
  Description: "Hidden home. Used for displaying the last updated time.",
  Price: -1,
  date_of_availability: new Date(),
  contact: "",
  picture: ""
}

// Verify if there is a document that we use to update
// when deleting other documents, to keep the last updated
// time (and to display it in the page)
Object.keys(HOMES).forEach(function (homeId) {
  const table = db(HOMES[homeId].uploads_table)
  HOMES[homeId].id = homeId
  
  table.where("Address", HIDDEN_HOME.Address).then(found => {
    if (!found.length) {
      return table.insert(HIDDEN_HOME).then(() => {
        console.log("Created hidden home in " + homeId)
      })
    }
  }).catch(console.error)
})

const HOME_EXPRESS_ROUTE = `/:home_id(${Object.keys(HOMES).join("|")})`

const getHome = (req, res, next) => {

  const currentHome = HOMES[req.params.home_id]
  if (!currentHome) {
    const err = new Error("Page not found.")
    err.statusCode = 404;
    return next(err)
  }
  req.getPictureUri = picPath => {
    if (!picPath) {
      return ""
    }
    picPath = picPath.split(PICTURE_SEPARATOR)[0]
    return path.join(PATH_PUBLIC_UPLOADS, currentHome.uploads_folder, picPath)
  }

  req.current_home = currentHome
  next()
}

const MULTER_FIELDS = []
for (var i = 1; i <= 50; ++i) {
  MULTER_FIELDS.push({
    name: "picture_" + i,
    maxCount: 1
  })
}

const PICTURE_SEPARATOR = ";;;"

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.current_home.uploads_folder
    cb(null, path.resolve(PATH_UPLOADS, folder))
  },
  filename: function (req, file, cb) {
    const splits = file.originalname.split(".")  
    const ext = splits.slice(-1)[0]
    const fileNameWithoutExt = splits.slice(0, -1).join("_")
    const fileName = `${fileNameWithoutExt}-${Date.now()}.${ext}`


    if (typeof req.body.pictures === "string" && !req.body.picture) {
      req.body.picture = req.body.pictures
    }

    if (req.body.picture) {
      req.body.picture += (PICTURE_SEPARATOR + fileName)
    } else {
      req.body.picture = fileName
    }
    
    cb(null, fileName)
  }
})

var uploadFile = multer({ storage: fileStorage })


const {editUser, editUserPage} = require('./auths');

const getUploadById = (req, res, next) => {
  db(req.current_home.uploads_table).where("id", req.params.id).then(upload => {
    upload = upload[0]
    if (!upload) {
      return res.redirect("/home")
    }
    upload.picture = upload.picture || "";
    upload.pictures = upload.picture.split(PICTURE_SEPARATOR).map(src => ({ title: src, uri: req.getPictureUri(src) }))
    upload.picture_uri = (upload.pictures[0] || { uri: "" }).uri
    req.upload_item = upload
    next()
  }).catch(next)
}


router
  .get('/', ifAuthenticatedRedirectToMenu, function(req, res){
      res.render("index");
  })
  .get('/menu', function(req, res){
      res.render("menu");
  })
  .get("/users", adminOrSuperadminRequired, (req, res, next) => {
    db("users").then((users) => {
      res.render("users", {
        title: "All Users",
        users,
        user: req.user,
        is_admin: req.user.is_admin,
        req
      })
    })
  })

.get('/fobs', function(req, res){
      res.render("fobs");
  })

  // Display the listing (uploads table in the db) /home, /home_2, /whatever, /login
.get(HOME_EXPRESS_ROUTE, getHome, checkAuthAndMaybeRedirect, function(req, res){
  db(req.current_home.uploads_table).then(uploads => {
    uploads.forEach(c => {
      if (c.date_of_availability) {
        c.date_of_availability = moment(c.date_of_availability).format("YYYY-MM-DD")
      }
      c.SortAddress = c.Address.replace(/\d/g, "")
      c.picture_uri = req.getPictureUri(c.picture)
    })

    const lastUpdateDate = uploads.sort((a, b) => {
      return a.updated_at > b.updated_at ? -1 : 1
    })[0].updated_at

    if (req.query.sortBy) {
        if (!["asc", "desc"].includes(req.query.sortDir)) {
          req.query.sortDir = "asc"
        }
        if (req.query.sortBy === "Address") {
          req.query.sortBy = "SortAddress"
        }
        const dir = req.query.sortDir === "asc" ? -1 : 1
        uploads.sort((a, b) => {
          return a[req.query.sortBy] < b[req.query.sortBy] ? dir : -1 * dir
        })
    }

    res.render("home", {
      uploads,
      lastUpdateDate: moment(lastUpdateDate).format("LLL"),
      isAdmin: req.user.is_admin || req.user.is_super_admin,
      req
    });
  })  
})
.get(`${HOME_EXPRESS_ROUTE}/new`, getHome, adminOrSuperadminRequired, function (req, res) {
  res.render("upload_create", { req })
})
.post(`${HOME_EXPRESS_ROUTE}/new`, getHome, adminOrSuperadminRequired, uploadFile.fields(MULTER_FIELDS), function (req, res, next) {
  
  // Set null if the body fields are empty
 Object.keys(req.body).forEach(c => { if (!req.body[c]) delete req.body[c] })

  db(req.current_home.uploads_table).insert(req.body).then(() => {
    res.redirect(`/${req.params.home_id}`)
  }).catch(next)
})
// Get the update form
.get(`${HOME_EXPRESS_ROUTE}/uploads/:id/edit`, getHome, adminOrSuperadminRequired, getUploadById, function (req, res) {
  res.render("upload_edit", {
    upload_item: req.upload_item,
    req,
    PICTURE_SEPARATOR
  })
})
// Get the update form
.get(`${HOME_EXPRESS_ROUTE}/uploads/:id/view`, getHome, adminOrSuperadminRequired, getUploadById, function (req, res) {
  res.render("upload_view", {
    upload_item: req.upload_item,
    req
  })
})
// Post the update form
.post(`${HOME_EXPRESS_ROUTE}/uploads/:id/edit`, getHome, adminOrSuperadminRequired, getUploadById, uploadFile.fields(MULTER_FIELDS), function (req, res, next) {

    // Edit process: the pictures will be the existing uploaded pictures
    if (typeof req.body.pictures === "string" && !req.body.picture) {
      req.body.picture = req.body.pictures
    }

    delete req.body.pictures

    next()

}, function (req, res, next) {
  delete req.body.id
  // Set null if the body fields are empty
  Object.keys(req.body).forEach(c => { if (!req.body[c] && c !== "picture") delete req.body[c] })
  
  db(req.current_home.uploads_table).where("id", req.params.id).update(req.body).then(() => {
    res.redirect(`/${req.params.home_id}`)
  }).catch(next)
})
// Get the delete page
.get(`${HOME_EXPRESS_ROUTE}/uploads/:id/delete`, getHome, adminOrSuperadminRequired, getUploadById, function (req, res) {
  res.render("upload_delete_confirmation", {
    upload_item: req.upload_item,
    req
  })
})
// Post the delete page
.post(`${HOME_EXPRESS_ROUTE}/uploads/:id/delete`, getHome, adminOrSuperadminRequired, getUploadById, function (req, res, next) {
   
  db(req.current_home.uploads_table).where("Address", HIDDEN_HOME.Address).update({
    updated_at: new Date()
  }).then(() => {
    return db(req.current_home.uploads_table).where("id", req.params.id).delete()
  }).then(() => {
    res.redirect(`/${req.params.home_id}`)
  }).catch(next)
  
})





module.exports = router


