if(process.env.NODE_ENV != 'production'){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 3000;
const ExpressError = require("./utils/ExpressError.js")
const ejsMate = require("ejs-mate");
const listings  = require("./routes/listings.js");
const review = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require("./routes/user.js");

const Listings = require("./models/listings.js");

const dbUrl = process.env.ATLASDB_URL;

const MongoStore = require('connect-mongo');

app.listen(port,(req,res)=>{
    console.log("server is listening to the port");

})

app.use(express.urlencoded({extended:true}));

const mongoose = require('mongoose');

main().then(()=>{
    console.log("connected to the backend");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}



const methodOverride = require("method-override");
const { error } = require("console");
app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true}));


//Mongo Store 
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 60 * 60,
})

store.on("error", ()=>{
    console.log("Error in the MONGO SESSION STORE",error);

});


// creating session
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires : Date.now() +  1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
};



app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));

// Serialization and De - Serialisation
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));



app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
})


app.get("/listings/destinations",async (req,res)=>{
    let {destination} = req.query;
    console.log(destination);
    let listings = await Listings.find({
        $or: [
            { location: { $regex: destination, $options: 'i' } },
            { country: { $regex: destination, $options: 'i' } }
        ]
    });

    res.render("listings/index.ejs", { allListings: listings });
})

// pbkdf2
app.get("/",async (req,res)=>{
    let allListings =   await Listings.find();
    res.render("listings/index.ejs",{allListings});
})



app.use("/listings",listings);
app.use("/listings/:id/reviews",review);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})



app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err;
    res.render("listings/Error.ejs",{message});
    
})