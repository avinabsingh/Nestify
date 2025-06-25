const Listings = require("./models/listings.js");
const Review = require("./models/review.js");
module.exports.checkauthenticate = (req,res,next)=>{

    if(!req.isAuthenticated()){
        // req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();
}


module.exports.isOwner = async  (req,res,next)=>{
    let {id} = req.params;
    let listing1 =await  Listings.findById(id);
    if(!listing1.owner._id.equals(res.locals.curUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect("/listings");
    }
    next();
};

module.exports.isAuthor = async  (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review1 =await  Review.findById(reviewId);
    if(!review1.author._id.equals(res.locals.curUser._id)){
        req.flash("error","You are not the owner of this review");
        return res.redirect("/listings");
    }
    next();
};



