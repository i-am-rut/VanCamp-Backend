import Booking from '../models/Booking.js';
import Van from '../models/Van.js';
import { calculateBookingPrice } from './vanController.js';

const getVanAvailability = async (req, res) => {
  try {
      const { id } = req.params; // Van ID
      const { fromDate, tillDate } = req.query;

      if (!fromDate || !tillDate) {
          return res.status(400).json({ message: "Please provide both fromDate and tillDate" });
      }

      const from = new Date(fromDate);
      const till = new Date(tillDate);

      if (isNaN(from.getTime()) || isNaN(till.getTime())) {
          return res.status(400).json({ message: "Invalid date format" });
      }

      if (from >= till) {
          return res.status(400).json({ message: "fromDate must be earlier than tillDate" });
      }

      // Check if the van exists
      const van = await Van.findById(id);
      if (!van) {
          return res.status(404).json({ message: "Van not found" });
      }

      // Check for overlapping bookings
      const overlappingBookings = await Booking.find({
          vanId: id,
          $or: [
              { startDate: { $lt: till }, endDate: { $gt: from } }, // Existing booking overlaps with requested dates
              { startDate: { $gte: from, $lte: till } }, // Booking starts within the requested range
              { endDate: { $gte: from, $lte: till } } // Booking ends within the requested range
          ]
      });

      const isAvailable = overlappingBookings.length === 0;

      res.status(200).json({ available: isAvailable });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}


 const createBooking = async (req, res) => {
  try {
    const { vanId, startDate, endDate, addOns } = req.body;

    // Fetch van details
    const van = await Van.findById(vanId);
    if (!van) {
      return res.status(404).json({ message: "Van not found" });
    }

    // Validate booking dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "Invalid booking dates" });
    }

    // Check for availability
    const conflictingBooking = await Booking.findOne({
      van: vanId,
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(endDate) } },
        { startDate: { $lte: new Date(startDate) }, endDate: { $gte: new Date(startDate) } },
        { startDate: { $gte: new Date(startDate) }, endDate: { $lte: new Date(endDate) } },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: "Van is not available for the selected dates" });
    }

    // Calculate base booking price
    const basePrice = calculateBookingPrice(van, startDate, endDate);

    // Add add-ons price
    const addOnsPrice = addOns.reduce((total, addOn) => {
      const matchingAddOn = van.addOns.find((vanAddOn) => vanAddOn.name === addOn.name);
      return matchingAddOn ? total + matchingAddOn.price : total;
    }, 0);

    const totalPrice = basePrice + addOnsPrice;

    // Create a booking
    const booking = await Booking.create({
      user: req.user.id,
      van: vanId,
      startDate,
      endDate,
      addOns,
      price: {
        basePrice,
        addOnsPrice,
        totalPrice,
      },
    });

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating booking", error: error.message });
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
    const bookingId = req.params.id;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure the user is the one who created the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Ensure the booking start date hasn't passed
    if (new Date(booking.startDate) <= new Date()) {
      return res.status(400).json({ message: "Cannot cancel a past or ongoing booking" });
    }

    // Update booking status
    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error cancelling booking", error: error.message });
  }
};


export { createBooking, getBookingDetails, getBookingsByRenter, cancelBooking, getVanAvailability }