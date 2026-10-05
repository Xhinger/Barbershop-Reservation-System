const express = require("express");
const router = express.Router();

const Appointment = require("../modelss/Appointment");


// GET APPOINTMENTS

router.get("/", async(req,res)=>{

try{

const appointments = await Appointment.find();

res.json(appointments);


}catch(error){

res.status(500).json({
message:error.message
});

}

});



// CREATE APPOINTMENT

router.post("/", async(req,res)=>{

try{


const appointment = new Appointment(req.body);


const saved = await appointment.save();


res.json(saved);


}catch(error){
    
console.log(error);
res.status(500).json({
message:error.message
});

}

});


module.exports = router;