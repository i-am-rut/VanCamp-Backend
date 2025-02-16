import express from 'express'
import { getHostEarnings, getHostVans } from "../controllers/hostController.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/earnings', protect, getHostEarnings);

router.get('/vans', protect, getHostVans)


export default router