const express = require("express");
const router = express.Router({mergeParams : true});
const Listings = require("../models/listings.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { checkauthenticate, isOwner,isAuthor } = require("../middleware.js");
const ReviewController = require("../Controllers/review.js");
router.post("/", checkauthenticate,ReviewController.create);

router.delete("/:reviewId",checkauthenticate,isAuthor,ReviewController.delete);

module.exports = router;