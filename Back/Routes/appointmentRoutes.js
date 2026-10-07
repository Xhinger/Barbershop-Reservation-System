const express = require("express");
const router = express.Router();
const transporter = require("../email");
const Appointment = require("../Models/Appointment");


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


// GET APPOINTMENT BY ID
router.get("/:id", async(req,res)=>{
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// CREATE APPOINTMENT

router.post("/", async(req,res)=>{

    console.log("POST APPOINTMENT RECEIVED");
    console.log(req.body);


try{


const appointment = new Appointment(req.body);


const saved = await appointment.save();
console.log("Sending email to:", req.body.contactNumber);
await transporter.sendMail({

    from:process.env.EMAIL_USER,

    to:req.body.contactNumber,

    subject:"Sañados Barbershop Appointment Confirmation",

    html:`

    <h2>Your Appointment is Confirmed</h2>

    <p>Name: ${req.body.customerName}</p>

    <p>Service: ${req.body.service}</p>

    <p>Date: ${req.body.date}</p>

    <p>Time: ${req.body.time}</p>

    <p>Status: Pending</p>

    <br>

    <p>Thank you for choosing Sañados Barbershop.</p>

    `
});

console.log("Email sent!");


res.json(saved);


}catch(error){
    
console.log(error);
res.status(500).json({
message:error.message
});

}

});


// UPDATE APPOINTMENT
router.put("/:id", async(req,res)=>{
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/:id", async(req,res)=>{
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// DELETE APPOINTMENT
router.delete("/:id", async(req,res)=>{
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.json({ message: "Appointment deleted", id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;