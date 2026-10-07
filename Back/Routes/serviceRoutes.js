const express = require("express");
const router = express.Router();

const Service = require("../Models/Service");
console.log("SERVICE ROUTE LOADED");

// GET ALL SERVICES
router.get("/", async (req,res)=>{

    try{

        const services = await Service.find();

        res.json(services);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});


// ADD SERVICE
router.post("/", async(req,res)=>{

    try{

        const service = new Service(req.body);

        const savedService = await service.save();

        res.json(savedService);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

});


module.exports = router;