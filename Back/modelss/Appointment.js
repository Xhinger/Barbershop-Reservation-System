const mongoose = require("mongoose");


const appointmentSchema = new mongoose.Schema({

customerName:String,
contactNumber:String,
service:String,
barber:String,
date:String,
time:String,
message:String,

status:{
    type:String,
    default:"Pending"
},

createdAt:{
    type:Date,
    default:Date.now
}

});


module.exports = mongoose.model(
    "Appointment",
    appointmentSchema
);