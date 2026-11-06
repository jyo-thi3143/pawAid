const express = require("express");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) =>{
    const {username, password } =req.body;

    if(username!== process.env.ADMIN_USERNAME) {
        return res.status(401).json({message: "Invalid username or password"});
    }

    const passwordMatches = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH
    );

    if (!passwordMatches){
        return res.status(401).json({message: "Invlaid username or passowrd"});
    }

    const token = jwt.sign(
        {role: "admin"},
        process.env.JWT_SECRET,
        {expiresIn: "2h"}
    );

    res.json({token});


});

function requireAdmin(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ message: "Authentication requires"});
    }

    const token = authHeader.split("")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "admin"){
            return res.status(403).json({message: "Admin access required"});
        }

        next();
    
    } catch(error){
      return res.status(401).josn({message: "Invalid or expired token"});

    }

}
module.exports = { router, requireAdmin };

