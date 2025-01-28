import Razorpay from 'razorpay';
import crypto from 'crypto';
import Transaction from '../models/Transaction.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // Create a Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
    };
    const order = await razorpay.orders.create(options);

    // Save the transaction in the database
    const transaction = await Transaction.create({
      booking: bookingId,
      amount,
      orderId: order.id,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Razorpay order created successfully',
      order,
      transaction,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating Razorpay order', error: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify the signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature === razorpaySignature) {
      // Update the transaction status to success
      const transaction = await Transaction.findOneAndUpdate(
        { orderId: razorpayOrderId },
        { status: 'success', paymentId: razorpayPaymentId },
        { new: true }
      );

      res.status(200).json({
        message: 'Payment verified and transaction updated successfully',
        transaction,
      });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error verifying payment', error: error.message });
  }
};
