import Van from "../models/Van.js";
import asyncHandler from "express-async-handler"

const createVan = async (req, res) => {
    try {
        const { name, description, price, location, category, hostId } = req.body

        const images = req.files.map(file => file.path)

        const van = await Van.create({
            name,
            description,
            price,
            location,
            category,
            images,
            hostId,
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


export { createVan, getVans, getVan, updateAvailability, updateAddOns, getRecommendations }