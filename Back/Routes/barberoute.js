const express = require("express");
const router = express.Router();

const Barber = require("../Models/Barber");
const verifyAdmin = require("../Middleware/authMiddleware");


// GET ALL BARBERS

router.get("/", verifyAdmin, async(req,res)=>{

    try{

        const barbers = await Barber.find();

        res.json(barbers);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});


// ADD BARBER

router.post("/", verifyAdmin, async (req, res) => {

    try{

        const barber = new Barber(req.body);

        const saved = await barber.save();

        res.json(saved);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});


module.exports = router;