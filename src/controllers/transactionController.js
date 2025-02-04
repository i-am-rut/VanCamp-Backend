import { createRazorpayOrder, verifyRazorpayPayment } from "../utils/razorpayUtils.js";
import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";


const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Fetch the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure the booking is not already paid
    if (booking.status === "Confirmed") {
      return res.status(400).json({ message: "Booking is already paid" });
    }

    // Create Razorpay order
    const receipt = `receipt_${bookingId}`;
    const order = await createRazorpayOrder(booking.price.totalPrice, receipt);

    res.status(201).json({ message: "Order created successfully", order, renterContact: booking.renterContact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { bookingId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // Verify Razorpay payment
    verifyRazorpayPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    // Update booking status
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = "Confirmed";
    await booking.save();

    // Create a new transaction entry
    const transaction = new Transaction({
      booking: bookingId,
      amount: booking.price.totalPrice,
      paymentId: razorpayPaymentId,
      OrderId: razorpayOrderId,
      razorpaySignature,
      status: "paid",
    });

    await transaction.save();

    res.status(200).json({ message: "Payment verified and transaction recorded successfully", booking, transaction });
  } catch (error) {
    console.error(error);
    // Record failed transaction
    const failedTransaction = new Transaction({
      booking: bookingId,
      amount: req.body.amount || 0, 
      paymentId: razorpayPaymentId || "N/A",
      OrderId: razorpayOrderId || "N/A",
      razorpaySignature: razorpaySignature || "N/A",
      status: "failed",
    });

    await failedTransaction.save();
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
};


export { createOrder, verifyPayment}