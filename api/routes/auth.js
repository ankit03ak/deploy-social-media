const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcryptjs");


//REGISTER
router.post("/register", async (req, res) => {

   try {

        //already user exist
       const existingUser = await User.findOne({ email: req.body.email });
       if (existingUser) {
           console.log("User already exists");
           return res.status(400).json({ message: "User already exists" });
        }
        
        
        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);


        // create new user
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPass
           });

           //save user and return respond

       const user = await newUser.save();
       res.status(200).json(user);
   } catch (error) {
    console.log(error)
   }

});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPass) {
      return res.status(400).json({ message: "Wrong password" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});


module.exports = router