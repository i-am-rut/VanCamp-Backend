import asyncHandler from 'express-async-handler';
import razorpay from '../config/razorpayConfig.js';
import Transaction from '../models/Transaction.js';
import crypto from 'crypto';

// Create Razorpay Order
export const createOrder = asyncHandler(async (req, res) => {
  const { bookingId, amount } = req.body;

  const options = {
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    receipt: `receipt_${bookingId}`,
  };

  const order = await razorpay.orders.create(options);

  const transaction = new Transaction({
    bookingId,
    amount,
    razorpayOrderId: order.id,
    status: 'pending',
  });
  await transaction.save();

  res.status(201).json({ orderId: order.id, amount: order.amount });
});

// Verify Payment
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature === razorpaySignature) {
    const transaction = await Transaction.findOne({ razorpayOrderId });
    transaction.razorpayPaymentId = razorpayPaymentId;
    transaction.razorpaySignature = razorpaySignature;
    transaction.status = 'paid';
    await transaction.save();

    res.status(200).json({ message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid signature' });
  }
});
