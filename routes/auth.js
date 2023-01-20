import express from "express";
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const router = express.Router();

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const saveUser = await newUser.save();
    res.status(200).json(saveUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong creadentials!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    OriginalPassword !== req.body.password &&
      res.status(401).json("Wrong password!");
      
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.MY_SEC,
        { expiresIn: "3d" }
        );
        const { password, ...others } = user._doc;
        
    res.status(200).json({...others, token});
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
