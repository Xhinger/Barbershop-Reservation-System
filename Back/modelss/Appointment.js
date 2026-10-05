const mongoose=require("mongoose");


const appointmentSchema=new mongoose.Schema({

customerName:String,
contactNumber:String,

serviceId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Service"
},

barberId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Barber"
},

date:String,
time:String,
status:String,

createdAt:{
type:Date,
default:Date.now
}

});


module.exports=
mongoose.model("Appointment",appointmentSchema);