import Booking from '../models/Booking.js';
import Van from '../models/Van.js';

const createBooking = async (req, res) => {
  try {
    const { vanId, startDate, endDate, selectedAddOns } = req.body;
    const renter = req.user._id;

    const van = await Van.findById(vanId);

    if (!van) {
      return res.status(404).json({ message: 'Van not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ message: 'Invalid booking dates' });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const basePrice = days * van.price;

    const addOnsPricing = selectedAddOns.reduce((total, addOn) => {
      const addOnDetail = van.addOns.find((item) => item.name === addOn);
      return addOnDetail ? total + addOnDetail.price : total;
    }, 0);

    const totalPrice = basePrice + addOnsPricing;

    const booking = await Booking.create({
      van: vanId,
      renter,
      startDate,
      endDate,
      addOns: van.addOns.filter((item) => selectedAddOns.includes(item.name)),
      totalPrice,
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
};

const getBookingDetails = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id).populate('van').populate('renter');
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      res.status(200).json(booking);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching booking details', error: error.message });
    }
}

const getBookingsByRenter = async (req, res) => {
    try {
      const bookings = await Booking.find({ renter: req.user._id }).populate('van');
  
      res.status(200).json(bookings);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching bookings', error: error.message });
    }
}

const cancelBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
  
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Update the booking status to cancelled
      booking.status = 'cancelled';
      await booking.save();
  
      res.status(200).json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
      res.status(400).json({ message: 'Error cancelling booking', error: error.message });
    }
}

export { createBooking, getBookingDetails, getBookingsByRenter, cancelBooking  }