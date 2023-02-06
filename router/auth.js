const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("../DB/conn");
const User = require("../Model/userSchema");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  res.send("Hello World from the Router js");
});

// Using Promises
/*router.post("/register", (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
   return res.status(422).json({ error: "please filled the field property" });
  }

  User.findOne({ email: email }).then((userExist) => {
    if (userExist) {
     return res.status(422).json({ error: "Email already exists" });
    }
    const user = new User({name, email, phone, work, password, cpassword});
    user.save().then(()=>{
        res.status(201).json({message:"User registerd successfully"})
    }).catch((err)=> res.status(500).json({error:"Failed to registerd"}))
  }).catch(err => {console.log(err)});
});*/

// Using async & await
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  // console.log('-------', req.body)
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "please filled the field property" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password does not match" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      // userschema.pre method works here....
      await user.save();
      res.status(201).json({ message: "User registerd successfully" });
    }
  } catch (error) {
    console.log(err);
  }
});

// Login route
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please filled the property" });
    }
    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);
    if (userLogin) {
      const isMatched = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie('jwtoken', token,{
        expires:new Date(Date.now()+ 25892000000),
        httpOnly:true
      })

      if (!isMatched) {
        res.status(400).json({ error: "Invalid credentials" });
      } else {
        res.json({ message: "User Signin successful" });
      }
    } else {
      res.status(400).json({ error: "Invalid credentialssss" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
