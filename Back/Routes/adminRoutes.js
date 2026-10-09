    const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required."
            });
        }

        const admin = await Admin.findOne({
            username: username.trim()
        });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        let validPassword = false;

        // Support the existing plain-text account during migration.
        if (admin.password.startsWith("$2")) {
            validPassword = await bcrypt.compare(
                password,
                admin.password
            );
        } else if (password === admin.password) {
            validPassword = true;

            // Hash the legacy password after successful login.
            admin.password = await bcrypt.hash(password, 12);
            await admin.save();
        }

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured.");
        }

        const token = jwt.sign(
            {
                adminId: admin._id.toString(),
                username: admin.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login successful.",
            token,
            admin: {
                username: admin.username
            }
        });

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            message: "Server error. Please try again."
        });
    }
});

module.exports = router;
