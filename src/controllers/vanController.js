import Van from "../models/Van.js";
import asyncHandler from "express-async-handler"

const createVan = async (req, res) => {
    try {
        const { name, description, basePrice, location, category, hostId } = req.body

        const images = req.files.map(file => file.path)

        const van = await Van.create({
            name,
            description,
            basePrice,
            location,
            category,
            images,
            hostId,
            hostName,
        })

        res.status(201).json(van)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getVans = async (req, res) => {
    try {
        const vans = await Van.find()
        res.status(200).json(vans)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getVan = async (req, res) => {
    try {
        const van = await Van.findById(req.params.id)
        if (!van) {
            return res.status(404).json({ message: 'Van not found' })
        }
        res.status(200).json(van)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateAvailability = asyncHandler( async (req, res) => {
    const { id } = req.params
    const { availability } = req.body

    const van = await Van.findById(id)
    if(!van) {
        res.status(404)
        throw new Error("Van not found");
    }

    van.availability = availability
    await van.save()

    res.status(200).json({message: 'Availability updated successfully', van})
})

const updateAddOns = asyncHandler(async (req,res) => {
    const { id } = req.params
    const { addOns } = req.body

    const van = await Van.findById(id)
    if(!van) {
        res.status(404)
        throw new Error("Van not found");
    }

    van.addOns = addOns
    await van.save()

    res.status(200).json({message: 'Add-ons updated successfully', van})

})

const getRecommendations = async (req, res) => {
    try {
        const { location, category, userId } = req.query;
        const filters = {};

        // Handle category filter
        if (category) {
            filters['details.category'] = category;
        }

        // Handle location (if provided)
        if (location) {
            const [lat, lng] = location.split(',').map(Number);
            filters['details.location.coordinates'] = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat],
                    },
                    $maxDistance: 50000, // 50 km radius
                },
            };
        }

        // Personalized recommendations (if userId provided)
        let personalizedVans = [];
        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                const wishlistVans = await Van.find({ _id: { $in: user.wishlist } });
                const wishlistCategories = wishlistVans.map(van => van.details.category);

                personalizedVans = await Van.find({
                    'details.category': { $in: wishlistCategories },
                    _id: { $nin: user.wishlist },
                }).limit(5);
            }
        }

        // Fetch recommendations
        const recommendedVans = await Van.find(filters).limit(10);

        // Default popular vans if no filters or personalized results match
        if (!recommendedVans.length && !personalizedVans.length) {
            const popularVans = await Van.find().sort({ 'reviews.rating': -1 }).limit(10);
            return res.json(popularVans);
        }

        // Combine personalized and general recommendations
        const finalRecommendations = [...personalizedVans, ...recommendedVans];
        res.json(finalRecommendations.slice(0, 10));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};

const calculateBookingPrice = (van, startDate, endDate) => {
    let totalPrice = 0;
    let days = 0;
    let currentDate = new Date(startDate);
  
    while (currentDate <= new Date(endDate)) {
      days++;
      const seasonalPrice = van.seasonalPricing.find(
        (season) =>
          currentDate >= new Date(season.startDate) &&
          currentDate <= new Date(season.endDate)
      );
      totalPrice += seasonalPrice ? seasonalPrice.price : van.basePrice;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    // Apply discounts for long-term bookings
    if (days >= 30) {
      totalPrice -= (totalPrice * van.longTermDiscounts.monthly) / 100;
    } else if (days >= 7) {
      totalPrice -= (totalPrice * van.longTermDiscounts.weekly) / 100;
    }
  
    return totalPrice;
};

const deleteVan = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the van to ensure it exists
        const van = await Van.findById(id);

        if (!van) {
            return res.status(404).json({ message: "Van not found" });
        }

        // Authorization check (optional)
        if (van.hostId.toString() !== req.user.id ) {
            // && req.user.role !== 'admin' <=use this if needed
            return res.status(403).json({ message: "You are not authorized to delete this van" });
        }

        // Delete the van
        await Van.findByIdAndDelete(id);

        res.status(200).json({ message: "Van deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
  

export { createVan, getVans, getVan, updateAvailability, updateAddOns, getRecommendations, calculateBookingPrice, deleteVan }