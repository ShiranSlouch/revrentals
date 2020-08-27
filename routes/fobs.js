const passport = require("passport")
const express = require("express")
const router =  express.Router()
const DatabaseManager = require("../db");
const db = DatabaseManager.get();

const moment = require("moment")
const { checkAuthAndMaybeRedirect,
        adminOrSuperadminRequired,
        ifAuthenticatedRedirectToMenu } = require("../util")

const path = require("path")
const multer = require('multer');

// In the pictures folder we will have two folders: commercial and residential
const HISTORY_LOG_UPLOADS = `${__dirname}/../uploads/history-log`

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, HISTORY_LOG_UPLOADS)
  },
  filename: function (req, file, cb) {
    const splits = file.originalname.split(".")
    const ext = splits.slice(-1)[0]
    const fileNameWithoutExt = splits.slice(0, -1).join("_")
    const fileName = `${fileNameWithoutExt}-${Date.now()}.${ext}`

    debugger

    if (typeof req.body.attachments === "string" && !req.body.attachment) {
      req.body.attachment = req.body.attachments
    }

    if (req.body.attachment) {
      req.body.attachment += (PICTURE_SEPARATOR + fileName)
    } else {
      req.body.attachment = fileName
    }

    cb(null, fileName)
  }
})

var uploadFile = multer({ storage: fileStorage })

const fetchHistoryLogItems = all => {
    let query = db("access_devices_history_log")
      .join("buildings", "buildings.id", "=", "access_devices_history_log.building_id")
      .join("apartments", "apartments.id", "=", "access_devices_history_log.apartment_id")
      .join("tenants", "tenants.id", "=", "access_devices_history_log.tenant_id")

    if (!all) {
        query = query.where("access_devices_history_log.end_date", null)
    }

    return query.select(
        "access_devices_history_log.id",
        "access_devices_history_log.access_levels",
        "access_devices_history_log.fobs",
        "access_devices_history_log.access_keys",
        "access_devices_history_log.remote_controllers",
        "access_devices_history_log.start_date",
        "access_devices_history_log.end_date",
        "access_devices_history_log.reasons",
        "access_devices_history_log.update_comments",
        "access_devices_history_log.building_id",
        "access_devices_history_log.apartment_id",
        "access_devices_history_log.tenant_id",
        "access_devices_history_log.total_price",
        "access_devices_history_log.reimbursement_date",
        "access_devices_history_log.check_number",
        "access_devices_history_log.attachment",
        "access_devices_history_log.created_at",
        "access_devices_history_log.updated_at",
        "buildings.address as building_address",
        "apartments.number as apartment_number",
        "tenants.full_name as tenant_full_name",
        "tenants.email as tenant_email",
        "tenants.phone_number as tenant_phone_number"
    )
}

const fetchFobsData = (req, res, next) => {
    Promise.all([
        db("apartments"),
        db("buildings"),
        db("tenants")
    ]).then(([apartments, buildings, tenants]) => {
        res.locals.apartments = apartments
        res.locals.buildings = buildings
        res.locals.tenants = tenants
        next()
    }).catch(next)
}

// GET /fobs
//      ->
// GET /fobs/buildings
// GET /fobs/:building_id/apartments
// GET /fobs/history-log
router.get('/fobs', adminOrSuperadminRequired, (req, res) => {
    res.render("fobs/index");
})

// LIST Buildings
router.get('/fobs/buildings', adminOrSuperadminRequired, (req, res, next) => {
    db("buildings").then(buildings => {
        res.render("fobs/buildings", {
            buildings
        });
    }).catch(next)
})

// CREATE Building
router.get('/fobs/new-building', adminOrSuperadminRequired, (req, res) => {
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
router.use('/fobs/buildings/:building_id', adminOrSuperadminRequired, (req, res, next) => {
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
router.get('/fobs/buildings/:building_id', adminOrSuperadminRequired, (req, res) => {
  res.render("fobs/buildings/edit");
})

// UPDATE Building by ID
router.post('/fobs/buildings/:building_id', adminOrSuperadminRequired, (req, res, next) => {
  req.body.updated_at = new Date()
  db("buildings").where("id", req.params.building_id).update(req.body).then(() => {
    res.redirect(`/fobs/buildings`)
  }).catch(next)
})

// DELETE Building (Confirmation) by id
router.get('/fobs/buildings/:building_id/delete', adminOrSuperadminRequired, (req, res) => {
    res.render("fobs/buildings/delete");
}).post('/fobs/buildings/:building_id/delete', (req, res) => {
    db("buildings").where("id", req.params.building_id).delete().then(() => {
        res.redirect(`/fobs/buildings`)
    })
})






// LIST Tenants
router.get('/fobs/tenants', adminOrSuperadminRequired, (req, res, next) => {
    db("tenants").then(tenants => {
        res.render("fobs/tenants", {
            tenants
        });
    }).catch(next)
})

// CREATE Tenant
router.get('/fobs/new-tenant', adminOrSuperadminRequired, (req, res) => {
    res.render("fobs/tenants/new", {
        item: {}
    });
}).post('/fobs/new-tenant', (req, res, next) => {
    req.body.updated_at = new Date()
    req.body.created_at = new Date()
    db("tenants").insert(req.body).then(() => {
        res.redirect(req.query.redirect_to_after_post || "/fobs/tenants")
    }).catch(next)
})


// GET Tenant by ID
router.use('/fobs/tenants/:tenant_id', adminOrSuperadminRequired, (req, res, next) => {
    db("tenants").where("id", req.params.tenant_id).then(tenantItem => {
        tenantItem = tenantItem[0]
        if (!tenantItem) {
            return next(NOT_FOUND_ERROR)
        }

        req.tenant_item = tenantItem
        res.locals.tenant_item = tenantItem
        res.locals.item = tenantItem
        next()
    }).catch(next)
})

// EDIT Tenants
router.get('/fobs/tenants/:tenant_id', adminOrSuperadminRequired, (req, res) => {
  res.render("fobs/tenants/edit");
})

// UPDATE Tenant by ID
router.post('/fobs/tenants/:tenant_id', adminOrSuperadminRequired, (req, res, next) => {
  req.body.updated_at = new Date()
  db("tenants").where("id", req.params.tenant_id).update(req.body).then(() => {
    res.redirect(`/fobs/tenants`)
  }).catch(next)
})

// DELETE Tenant (Confirmation) by id
router.get('/fobs/tenants/:tenant_id/delete', adminOrSuperadminRequired, (req, res) => {
    res.render("fobs/tenants/delete");
}).post('/fobs/tenants/:tenant_id/delete', (req, res) => {
    db("tenants").where("id", req.params.tenant_id).delete().then(() => {
        res.redirect(`/fobs/tenants`)
    })
})




// READ and CREATE apartments for :building
router.get('/fobs/buildings/:building_id/apartments', adminOrSuperadminRequired, (req, res, next) => {
    db("apartments").where("building_id", req.params.building_id).then(apartments => {
        res.render("fobs/apartments", {
            apartments
        });
    }).catch(next)
})


// New apartment
router.get('/fobs/buildings/:building_id/new-apartment', adminOrSuperadminRequired, (req, res, next) => {
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
router.use('/fobs/buildings/:building_id/apartments/:apartment_id', adminOrSuperadminRequired, (req, res, next) => {
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
router.get('/fobs/buildings/:building_id/apartments/:apartment_id', adminOrSuperadminRequired, (req, res) => {
  res.render("fobs/apartments/edit");
})

// UPDATE Apartment by ID
router.post('/fobs/buildings/:building_id/apartments/:apartment_id', adminOrSuperadminRequired, (req, res, next) => {
  req.body.updated_at = new Date()
  req.body.building_id = req.params.building_id
  db("apartments").where("id", req.params.apartment_id).update(req.body).then(() => {
    res.redirect(`/fobs/buildings/${req.params.building_id}/apartments`)
  }).catch(next)
})

// DELETE Apartment (Confirmation) by id
router.get('/fobs/buildings/:building_id/apartments/:apartment_id/delete', adminOrSuperadminRequired, (req, res) => {
    res.render("fobs/apartments/delete");
}).post('/fobs/buildings/:building_id/apartments/:apartment_id/delete', (req, res) => {
    db("apartments").where("id", req.params.apartment_id).delete().then(() => {
        res.redirect(`/fobs/buildings/${req.params.building_id}/apartments`)
    })
})


// Rentals
router.get('/fobs/rentals', adminOrSuperadminRequired, (req, res, next) => {
    fetchHistoryLogItems().then(rentals => {
        res.render("fobs/rentals", {
            historyLogItems: rentals
        })
    }).catch(next)
})

router.get('/fobs/new-rental', adminOrSuperadminRequired, fetchFobsData, (req, res) => {
    res.render("fobs/rentals/new", {
        item: {},
        PICTURE_SEPARATOR
    })
})

// LIST History Log Items
router.get('/fobs/history-log', adminOrSuperadminRequired, (req, res, next) => {
    fetchHistoryLogItems(true).then(historyLogItems => {
        res.render("fobs/history-log", {
            historyLogItems
        });
    }).catch(next)
})

const MULTER_FIELDS = []
for (var i = 1; i <= 50; ++i) {
  MULTER_FIELDS.push({
    name: "attachment_" + i,
    maxCount: 1
  })
}

const PICTURE_SEPARATOR = ";;;"

// CREATE History Log Item
router.post('/fobs/new-history-log-item', adminOrSuperadminRequired, uploadFile.fields(MULTER_FIELDS), function (req, res, next) {

    // Edit process: the pictures will be the existing uploaded pictures
    if (typeof req.body.attachments === "string" && !req.body.attachment) {
      req.body.attachment = req.body.attachments
    }

    delete req.body.attachments

    next()

}, (req, res, next) => {
    req.body.updated_at = new Date()
    req.body.created_at = new Date()
    db("access_devices_history_log").insert(req.body).then(() => {
        res.redirect("/fobs/history-log")
    }).catch(next)
})

// GET HL Item by ID
router.use('/fobs/history-log/:item_id', adminOrSuperadminRequired, fetchFobsData, (req, res, next) => {
    db("access_devices_history_log").where("id", req.params.item_id).then(historyLogItem => {
        historyLogItem = historyLogItem[0]
        if (!historyLogItem) {
            return next(NOT_FOUND_ERROR)
        }

        historyLogItem.attachment = historyLogItem.attachment || "";
        historyLogItem.attachments = historyLogItem.attachment.split(PICTURE_SEPARATOR).map(src => ({ title: src, uri: `/fobs/history-log-uploads/${src}` }))
        historyLogItem.attachment_uri = (historyLogItem.attachments[0] || { uri: "" }).uri

        req.history_log_item = historyLogItem
        res.locals.item = historyLogItem
        next()
    }).catch(next)
})

// EDIT HL Item
router.get('/fobs/history-log/:item_id', adminOrSuperadminRequired, (req, res) => {
  res.render("fobs/history-log/edit", {
      PICTURE_SEPARATOR
  });
})

// UPDATE HL Item by ID
router.post('/fobs/history-log/:item_id', adminOrSuperadminRequired, uploadFile.fields(MULTER_FIELDS), function (req, res, next) {

    // Edit process: the pictures will be the existing uploaded pictures
    if (typeof req.body.attachments === "string" && !req.body.attachment) {
      req.body.attachment = req.body.attachments
    }

    delete req.body.attachments

    next()

}, (req, res, next) => {
  req.body.updated_at = new Date()
  db("access_devices_history_log").where("id", req.params.item_id).update(req.body).then(() => {
    res.redirect(req.query.redirect_to_after_post || `/fobs/history-log`)
  }).catch(next)
})

router.get(`/fobs/history-log/:item_id/attachments`, adminOrSuperadminRequired, function (req, res) {
  res.render("upload_view", {
    upload_item: res.locals.item,
    req
  })
})


// Access History Log uploads
router.use("/fobs/history-log-uploads", adminOrSuperadminRequired, express.static(HISTORY_LOG_UPLOADS))

module.exports = router
