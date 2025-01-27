import express from "express";
import upload from "../middleware/uploadMiddleware.js"
import { createVan, getVan, getVans } from "../controllers/vanController.js"

const router = express.Router()

router.post('/create', upload.array('images', 5), createVan)

router.get('/', getVans)
router.get('/:id', getVan)

export default router