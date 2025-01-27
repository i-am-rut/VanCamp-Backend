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

const getRecommendations = asyncHandler(async (req, res) => {
    const { location, category } = req.query

    const query = {}
    if(location) query['details.location'] = location
    if(category) query['details.category'] = category

    const recommendedVans = await Van.find(query).limit(10)
    res.status(200).json(recommendedVans)
})

export { createVan, getVans, getVan, updateAvailability, updateAddOns, getRecommendations }