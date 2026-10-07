const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const transporter = require("./email");
const app = express();


// Middleware
app.use(cors());

app.use(express.json());

app.use((req,res,next)=>{
    console.log("REQUEST:", req.method, req.url);
    next();
});

// Routes
const serviceRoutes = require("./Routes/serviceRoutes");
const barberRoutes = require("./Routes/barberoute");
const appointmentRoutes = require("./Routes/appointmentRoutes");

app.use("/api/services", serviceRoutes);
app.use("/api/barbers", barberRoutes);  
app.use("/api/appointments", appointmentRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log("MongoDB Error:", error);
});


// Test API
app.get("/", (req,res)=>{
    res.send("Barbershop API Running");
});

transporter.verify((error, success)=>{

    if(error){

        console.log("Gmail connection failed:");
        console.log(error);

    }else{

        console.log("Gmail connected successfully");

    }

});
// Start Server
app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
});