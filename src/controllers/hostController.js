import mongoose from "mongoose";
import Van from "../models/Van.js";
import Booking from "../models/Booking.js";

const getHostVans = async(req, res) => {
  try {

    if (req.user.role !== 'host') {
      return res.status(401).json({ message: "Not authorized, you are not a host" }); 
    }

    const vans = await Van.find({ hostId: req.user.id });

    res.status(200).json(vans);
    
  } catch (error) {
    res.status(400).json({ message: "Error fetching vans", error: error.message })
  }
}


const getHostEarnings = async (req, res) => {
    try {
      const hostId = req.user._id;
      const { filter } = req.query; // "monthly", "yearly", or "total"
  
      // Find all vans owned by the host
      const vans = await Van.find({ hostId }).select("_id name");
  
      if (!vans.length) {
        return res.status(404).json({ message: "No vans found for this host" });
      }
  
      // Extract van IDs
      const vanIds = vans.map((van) => van._id);
  
      // Define date filter
      let dateFilter = {};
      const now = new Date();
      
      if (filter === "monthly") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = { startDate: { $gte: startOfMonth } };
      } else if (filter === "yearly") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        dateFilter = { startDate: { $gte: startOfYear } };
      }
      
      // Fetch bookings based on van ownership and date filter
      const bookings = await Booking.find({
        vanId: { $in: vanIds },
        ...dateFilter,
      }).populate("vanId", "name"); // Populate van name
  
      if (!bookings.length) {
        return res.status(404).json({ message: "No earnings data available for this filter" });
      }
  
      // Calculate total earnings
      const totalEarnings = bookings.reduce((sum, booking) => sum + booking.price.totalPrice, 0);
      const avgEarnings = bookings.length ? totalEarnings / bookings.length : 0;
  
      // Breakdown earnings per van
      const vanEarnings = {};
      bookings.forEach((booking) => {
        const vanName = booking.vanId.name;
        if (!vanEarnings[vanName]) {
          vanEarnings[vanName] = 0;
        }
        vanEarnings[vanName] += booking.price.totalPrice;
      });
  
      res.status(200).json({
        filter: filter || "total",
        totalEarnings,
        avgEarnings,
        totalBookings: bookings.length,
        vanEarnings, // Earnings breakdown per van
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching earnings summary", error: error.message });
    }
}
  

  export { getHostEarnings, getHostVans }