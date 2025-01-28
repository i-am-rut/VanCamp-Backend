import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Razorpay order
router.post('/order', protect, createRazorpayOrder);

// Verify Razorpay payment
router.post('/verify', protect, verifyRazorpayPayment);

export default router;
