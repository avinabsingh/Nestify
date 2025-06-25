const express = require("express");
const router = express.Router();
const ListingsController = require("../Controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage})

const { checkauthenticate, isOwner } = require("../middleware.js");

router.route("/")
.get(ListingsController.index)
.post(checkauthenticate,upload.single("image"),ListingsController.createNew);


router.get("/new",checkauthenticate,ListingsController.showNew);

router.route("/:id")
.get(ListingsController.show)
.put(checkauthenticate,isOwner,upload.single("image"), ListingsController.update);


router.get("/:id/edit",checkauthenticate,ListingsController.edit);


router.delete("/:id",checkauthenticate,isOwner, ListingsController.delete);




module.exports = router;