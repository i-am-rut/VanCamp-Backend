import Van from "../models/Van.js";

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

export { createVan, getVans, getVan }