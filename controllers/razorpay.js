const Razorpay = require("razorpay");
const Order = require("../models/orders");
const controller = require("./controller");
require("dotenv").config();

const purchasepremium = async (req, res) => {
  // try {
  var rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const amount = 2500;
  rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newOrder = new Order({
      orderid: order.id,
      status: "PENDING",
      user: req.authUser._id,
    });
    await newOrder.save();
    return res.status(201).json({ order: newOrder, key_id: rzp.key_id });
  });
  // } catch (err) {
  //   console.log(["purchase premium controller problem", err]);
  //   res
  //     .status(403)
  //     .json({ message: "purchase premium controller problem", error: err });
  // }
};

const updateTransactionStatus = async (req, res) => {
  // try {
  const userId = req.authUser._id;
  const { payment_id, order_id } = req.body;
  console.log({ userId, payment_id, order_id });

  const order = await Order.findOne({ orderid: order_id });
  console.log({ order });
  let promise1, promise2;
  if (order) {
    order.paymentid = payment_id;
    order.status = "SUCCESSFUL";
    promise1 = order.save();
    req.authUser.ispremiumuser = true;
    promise2 = req.authUser.save();
  }
  console.log("updateController2");
  Promise.all([promise1, promise2]).then(() => {
    const ispremiumuser = req.authUser.ispremiumuser;
    console.log({ ispremiumuser });
    return res.status(202).json({
      success: true,
      message: "Transaction Successful",
      token: controller.generateAccessToken(userId, undefined, ispremiumuser),
    });
  });
  // } catch (err) {
  //   console.log(["error in the razorpay controller", err]);
  //   res
  //     .status(403)
  //     .json({ error: err, message: "update Transaction controller problem" });
  // }
};

module.exports = {
  purchasepremium,
  updateTransactionStatus,
};
