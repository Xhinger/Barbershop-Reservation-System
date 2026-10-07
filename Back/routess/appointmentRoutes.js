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