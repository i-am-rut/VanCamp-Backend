import asyncHandler from "express-async-handler"
import User from "../models/User.js"
import Van from "../models/Van.js"

const addToWishlist = asyncHandler(async (req, res) => {
    const { vanId } = req.params

    const van = Van.findById(vanId)
    if (!van) {
        res.status(404)
        throw new Error("Van not found");
    }

    const user = User.findById(req.user.id)
    if (!user.wishlist.includes(vanId)) {
        user.wishlist.push(vanId)
        await user.save()
    }

    res.status(200).json({ message: 'Van added to wishlist' })
})

const removeFromWishlist = asyncHandler(async (req, res) => {
    const { vanId } = req.params

    const user = await User.findById(req.user.id)
    user.wishlist = user.wishlist.filter(id => id.toString() !== vanId)
    await user.save()

    res.status(200).json({message: 'Van removed from wishlist'})
})

const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('wishlist')
    res.status(200).json(user.wishlist)
})

export { addToWishlist, removeFromWishlist, getWishlist }