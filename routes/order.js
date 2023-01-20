import express from "express";
import Order from "../models/Order.js";
import {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "./verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const saveOrder = await newOrder.save();
    res.status(200).json(saveOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // //Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// //GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date(); //march
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1)); // febraury
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1)); // january

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
