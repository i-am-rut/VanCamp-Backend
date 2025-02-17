import express from "express";
import upload from "../middleware/uploadMiddleware.js"
import { protect } from '../middleware/authMiddleware.js'
import { createVan, editVan, getRecommendations, getVan, getVans, updateAddOns, updateAvailability, deleteVan } from "../controllers/vanController.js"

const router = express.Router()

router.post('/create', upload.array('images', 5), createVan)

router.get('/', getVans)
router.get('/:id', getVan)
router.get('/recommendations', getRecommendations)

router.put('/:id/availability', updateAvailability)
router.put('/:id/add-ons', updateAddOns)

router.patch("/edit/:vanId", editVan)

router.delete("/:id", protect, deleteVan)

export default router