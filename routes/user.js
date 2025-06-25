const express = require("express");
const passport = require("passport");
const router = express.Router({mergeParams : true});
const User = require("../models/user");
const stores = require("../middleware.js");
const userController = require("../Controllers/user.js");

router.route("/signup")
.get(userController.signup)
.post(userController.Completesignup);

router.route("/login")
.get(userController.login)
.post(passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), userController.CompleteLogin)


router.get("/logout",userController.logout);

module.exports = router;