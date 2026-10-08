const express = require("express");
const router = express.Router();
const Admin = require("../Models/Admin");


router.post("/login", async (req,res)=>{

    try{

        const {username,password} = req.body;

        const admin = await Admin.findOne({username});

        if(!admin){
            return res.status(401).json({
                message:"Invalid username or password"
            });
        }


        if(password !== admin.password){
            return res.status(401).json({
                message:"Invalid username or password"
            });
        }


        res.json({
            message:"Login successful",
            admin:{
                username: admin.username
            }
        });


    }catch(error){

        res.status(500).json({
            message:"Server error"
        });

    }

});


module.exports = router;