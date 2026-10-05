const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();


// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.use(express.json());


// Routes
const serviceRoutes = require("./routess/serviceRoutes");
const barberRoutes = require("./routess/barberoute");
const appointmentRoutes = require("./routess/appointmentRoutes");

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


// Start Server
app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
});