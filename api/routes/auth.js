const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {


   try {

       const existingUser = await User.findOne({ email: req.body.email });
       if (existingUser) {
          //  console.log("User already exists");
           return res.status(409).json({ message: "User already exists" });
        }
        
        
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);


        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPass
           });


       const user = await newUser.save();
       user.password = undefined;
       return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
       });
   } catch (error) {
    console.error("Register error:", error);
    // console.log(error)

      // Duplicate key error (unique email)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
   }

});

router.post("/login", async (req, res) => {

  // console.log(req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // console.log("toker :", token)

    user.password = undefined;

    return res.status(200).json({
      success: true,
      user,
      accessToken: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});


module.exports = router