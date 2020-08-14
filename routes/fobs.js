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
const getHome = (req, res, next) => {

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
router.get('/fobs', function(req, res){
    res.render("fobs/index");
})

router.get('/fobs/buildings', function(req, res){
    res.render("fobs/buildings");
})
    
router.get('/fobs/buildings/:building_id', function(req, res){
    res.render("fobs/building-item");
})  
router.get('/fobs/buildings/:building_id/delete', function(req, res){
    res.render("fobs/building-item");
})  
router.get('/fobs/buildings/:building_id/edit', function(req, res){
    res.render("fobs/building-item");
})  
router.get('/fobs/buildings/:building_id/apartments', function(req, res){
    res.render("fobs/building-item");
})
router.get('/fobs/buildings/:building_id/apartments/:apartment_id', function(req, res){
    res.render("fobs/building-item");
})
router.get('/fobs/buildings/:building_id/apartments/:apartment_id/edit', function(req, res){
    res.render("fobs/building-item");
})
router.get('/fobs/buildings/:building_id/apartments/:apartment_id/delete', function(req, res){
    res.render("fobs/building-item");
})
router.get('/fobs/history-log', function(req, res){
    res.render("fobs/building-item");
})
router.get('/fobs/history-log/:item_id', function(req, res){
    res.render("fobs/building-item");
})
router.get('/fobs/history-log/:item_id/edit', function(req, res){
    res.render("fobs/building-item");
})    

module.exports = router
