const express = require("express");
const Listings = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.index = async (req, res) => {
    const { category } = req.query;
    
    let allListings;
    if (category) {
        allListings = await Listings.find({category});
        console.log(allListings);
        res.render("listings/index.ejs", { allListings });
    } else {
        allListings = await Listings.find();
        res.render("listings/index.ejs", { allListings });
    }

    
};

module.exports.showNew = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.createNew = async (req,res,next)=>{
    
    try{
        console.log(req.body);
        let url = req.file.path;
        let filename = req.file.filename;
        let listing1 = new Listings({
            title : req.body.title,
            description : req.body.description,
            location : req.body.location,
            price : req.body.price,
            category : req.body.category,
            
        });
        listing1.image = {url,filename};
        listing1.owner = req.user._id;
        await listing1.save();
        req.flash("success","new Listing Created");
        res.redirect("/listings");
    }catch(err){
        next(err);
    }
    
};

module.exports.show = async (req,res)=>{
    let {id} = req.params;
    let pl = await Listings.findById(id).populate({path:"reviews",populate :{path:"author"}}).populate("owner");
    res.render("listings/show.ejs",{pl});
};

module.exports.edit = async (req,res)=>{
    let {id} = req.params;
    let data1 = await Listings.findById(id);
    console.log(data1);
    res.render("listings/edit.ejs",{data1});
};

module.exports.update = async (req,res)=>{
    
    console.log(req.body);

    let {id} = req.params;
    let listing = await Listings.findByIdAndUpdate(id,{...req.body});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = {url,filename};
        await listing.save();
    }

    res.redirect("/listings");


};

module.exports.delete = async (req,res)=>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};