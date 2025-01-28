import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order
export const createRazorpayOrder = async (amount, receipt) => {
  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt,
    };
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(`Error creating Razorpay order: ${error.message}`);
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new Error("Payment verification failed");
  }
};
