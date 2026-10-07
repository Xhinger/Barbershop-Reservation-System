const mongoose=require("mongoose");


const barberSchema=new mongoose.Schema({

name:String,
specialization:String,
status:String

});


module.exports=
mongoose.model("Barber",barberSchema);  