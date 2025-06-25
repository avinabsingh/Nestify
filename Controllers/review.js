const Listings = require("../models/listings.js");
const Review = require("../models/review.js");
module.exports.create = async (req,res,next)=>{
    try{
         
        let {id} = req.params;
        console.log(id);
        let listing = await Listings.findById(id);
        console.log(req.body);
        let newReview = new Review({
            rating:req.body.rating,
            comment:req.body.comment,
        });
        newReview.author = req.user._id;
        
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success","Review created");
        res.redirect("/listings");
        console.log("review.added");


    }catch(err){
        next(err);
    }
};

module.exports.delete = async (req,res)=>{
    try{
        let {id,reviewId} = req.params;
        await Listings.findByIdAndUpdate(id,{$pull : {review : reviewId}});
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);

    }catch(err){
        next(err);
    }

};