const mongoose = require('mongoose');
const Listing = require('../models/listings.js');
const initData = require('./data.js');
main().then(()=>{
    console.log("connected to the backend");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Nestify');


}

let init = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({
      ...obj,owner : "67c2d8b69f64c2f1ad98a903"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

init();