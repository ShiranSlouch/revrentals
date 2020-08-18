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
const HISTORY_LOG_UPLOADS = "uploads/history_log"
const PATH_UPLOADS = path.join(__dirname, HISTORY_LOG_UPLOADS)

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PATH_UPLOADS)
  },
  filename: function (req, file, cb) {
    const splits = file.originalname.split(".")  
    const ext = splits.slice(-1)[0]
    const fileNameWithoutExt = splits.slice(0, -1).join("_")
    const fileName = `${fileNameWithoutExt}-${Date.now()}.${ext}`
    cb(null, fileName)
  }
})

var uploadFile = multer({ storage: fileStorage })

// GET /fobs
//      ->
// GET /fobs/buildings
// GET /fobs/:building_id/apartments
// GET /fobs/history-log
router.get('/fobs', (req, res) => {
    res.render("fobs/index");
})

// LIST Buildings
router.get('/fobs/buildings', (req, res, next) => {
    db("buildings").then(buildings => {
        res.render("fobs/buildings", {
            buildings
        });
    }).catch(next)
})

// CREATE Building
router.get('/fobs/new-building', (req, res) => {
    res.render("fobs/buildings/new", {
        item: {}
    });
}).post('/fobs/new-building', (req, res, next) => {
    req.body.updated_at = new Date()
    req.body.created_at = new Date()
    db("buildings").insert(req.body).then(() => {
        res.redirect("/fobs/buildings")
    }).catch(next)
})
    
const NOT_FOUND_ERROR = new Error("Page not found.")
NOT_FOUND_ERROR.statusCode = 404

// GET Building by ID
router.use('/fobs/buildings/:building_id', (req, res, next) => {
    db("buildings").where("id", req.params.building_id).then(buildingItem => {
        buildingItem = buildingItem[0]
        if (!buildingItem) {
            return next(NOT_FOUND_ERROR)
        }
        
        req.building_item = buildingItem
        res.locals.building_item = buildingItem
        res.locals.item = buildingItem
        next()
    }).catch(next)
})

// EDIT Buildings
router.get('/fobs/buildings/:building_id', (req, res) => {
  res.render("fobs/buildings/edit");
})  

// UPDATE Building by ID
router.post('/fobs/buildings/:building_id', (req, res, next) => {
  req.body.updated_at = new Date()
  db("buildings").where("id", req.params.building_id).update(req.body).then(() => {
    res.redirect(`/fobs/buildings`)
  }).catch(next)
})  

// DELETE Building (Confirmation) by id
/*router.get('/fobs/buildings/:building_id/delete', (req, res) => {
    res.render("fobs/buildings/delete");
}).post('/fobs/buildings/:building_id/delete', (req, res) => {
    res.render("fobs/buildings/delete");
})*/

// READ and CREATE apartments for :building
router.get('/fobs/buildings/:building_id/apartments', (req, res, next) => {
    db("apartments").where("building_id", req.params.building_id).then(apartments => {
        res.render("fobs/apartments", {
            apartments
        });
    }).catch(next)
})


// New apartment
router.get('/fobs/buildings/:building_id/new-apartment', (req, res, next) => {
    res.render("fobs/apartments/new");
}).post('/fobs/buildings/:building_id/new-apartment', (req, res, next) => {
    req.body.updated_at = new Date()
    req.body.created_at = new Date()
    req.body.building_id = req.params.building_id
    db("apartments").insert(req.body).then(() => {
        res.redirect(`/fobs/buildings/${req.params.building_id}/apartments`)
    }).catch(next)
})

// GET Apartment by ID
router.use('/fobs/buildings/:building_id/apartments/:apartment_id', (req, res, next) => {
    db("apartments").where("id", req.params.apartment_id).then(apartmentItem => {
        apartmentItem = apartmentItem[0]
        if (!apartmentItem) {
            return next(NOT_FOUND_ERROR)
        }
        req.apartment_item = apartmentItem
        res.locals.apartment_item = apartmentItem
        res.locals.item = apartmentItem
        next()
    }).catch(next)
})

// EDIT Apartments
router.get('/fobs/buildings/:building_id/apartments/:apartment_id', (req, res) => {
  res.render("fobs/apartments/edit");
})  

// UPDATE Apartment by ID
router.post('/fobs/buildings/:building_id/apartments/:apartment_id', (req, res, next) => {
  req.body.updated_at = new Date()
  req.body.building_id = req.params.building_id
  db("apartments").where("id", req.params.apartment_id).update(req.body).then(() => {
    res.redirect(`/fobs/buildings/${req.params.building_id}/apartments`)
  }).catch(next)
})








router.get('/fobs/history-log', (req, res) => {
    res.render("fobs/building-item");
})
router.get('/fobs/history-log/:item_id', (req, res) => {
    res.render("fobs/building-item");
})
router.get('/fobs/history-log/:item_id/edit', (req, res) => {
    res.render("fobs/building-item");
})    

module.exports = router