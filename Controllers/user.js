const express = require("express");
const passport = require("passport");
const router = express.Router({mergeParams : true});
const User = require("../models/user");

module.exports.signup = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.Completesignup = async (req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({
            email : email,
            username : username,
        });
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }else{
                req.flash("success","Welcome to Nestify!");
                res.redirect("/listings");
            }
        })
        
        console.log(registeredUser);
        
    }catch(err){
        next(err);
    }
};

module.exports.login = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.CompleteLogin = async (req,res,next)=>{
    try{
        req.flash("success","welcome to Nestify")
        // let t = res.locals.redirectUrl||"/listings";
        res.redirect("/listings");

    }catch(err){
        next(err);
    }
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success","logged out");
            res.redirect("/listings");
        }
    })
};
