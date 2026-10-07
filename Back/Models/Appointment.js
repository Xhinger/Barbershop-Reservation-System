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

cancelledAt:{
    type:Date,
    default:null
},

createdAt:{
    type:String,
    default:()=>{

        return new Date().toLocaleString("en-PH",{
            timeZone:"Asia/Manila"
        });

    }
}

});


module.exports = mongoose.model(
    "Appointment",
    appointmentSchema
);