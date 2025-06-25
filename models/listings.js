const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        url : String,
        filename: String,
    },
    price : Number,
    location  : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },

    category : {
        type : String,
        enum: [
            "Beachfront",
            "City",
            "Mountain",
            "Villa",
            "Treehouse",
            "Cabin",
            "Luxury Penthouse",
            "Ski Chalet",
            "Safari Lodge",
            "Historic House",
            "Private Island",
            "Cottage",
            "Apartment",
            "Castle",
            "Chalet",
            "Beach House"
        ]
    }
})

listSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
})

const Listings = mongoose.model("List",listSchema);
module.exports = Listings;
