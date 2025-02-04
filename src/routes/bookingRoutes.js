import express from 'express';
import { createBooking, getBookingDetails, getBookingsByRenter, cancelBooking, getVanAvailability } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to check van availability
router.get("/availability/:id", getVanAvailability);

// Create a booking
router.post('/create', protect, createBooking);

// Get all bookings by a renter
router.get('/mybookings', protect, getBookingsByRenter);

// Cancel a booking
router.patch('/cancel/:id', protect, cancelBooking);

// Get details of a specific booking
router.get('/:id', protect, getBookingDetails);



export default router;
