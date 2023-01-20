import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

const stripe = Stripe(process.env.STRIPE_KEY);

router.post("/stripe", async (req, res) => {
  const cartItems = req.body.cartItems;
  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: "INR",
      product_data: {
        name: item.title,
        images: [item.img],
        description: item.desc,

        metadata: { id: item._id },
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({ url: session.url });
});

// router.post("/payment", async(req, res) => {
//   stripe.change.create(
//     {
//       source: req.body.tokenId,
//       amount: req.body.amount,
//       currency: "usd",
//     },
//     (stripeErr, stripeRes) => {
//       if (stripeErr) {
//         res.status(500).json(stripeErr);
//       } else {
//         res.status(200).json(stripeRes);
//       }
//     }
//   );
// });

export default router;
