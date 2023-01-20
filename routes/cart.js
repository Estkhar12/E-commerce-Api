import express from "express";
import Cart from "../models/Cart.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "./verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const saveCart = await newCart.save();
    res.status(200).json(saveCart);
  } catch (error) {
    res.status(500).json(error);
  }
});


// //Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // //Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

 //GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId: req.params.userId});
    res.status(200).json (cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //GET ALL 
router.get("/",verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts)
    } catch (error) {
       res.status(500).json(error) 
    }
});

export default router;
