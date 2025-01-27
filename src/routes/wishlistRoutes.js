import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlistController.js'

const router = express.Router()

router.post('/:vanId', protect, addToWishlist)

router.delete('/:vanId', protect, removeFromWishlist)

router.get('/', protect, getWishlist)

export default router