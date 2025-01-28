import express from 'express';
import { createOrder, verifyPayment } from '../controllers/razorpayController.js';

const router = express.Router();

// Route to create Razorpay order
router.post('/create-order', createOrder);

// Route to verify payment
router.post('/verify-payment', verifyPayment);

export default router;
