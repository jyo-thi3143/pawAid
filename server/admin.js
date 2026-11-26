const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    console.log("Admin username loaded:", process.env.ADMIN_USERNAME);
    console.log(
        "Password hash loaded:",
        Boolean(process.env.ADMIN_PASSWORD_HASH)
    );

    console.log(
        "Username matches:",
        username === process.env.ADMIN_USERNAME
    );

    const passwordMatches = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
    );

    console.log("Password matches:", passwordMatches);

    if (username !== process.env.ADMIN_USERNAME || !passwordMatches) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const token = jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    res.json({ token });
});

function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = { router, requireAdmin };