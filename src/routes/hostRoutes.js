import express from 'express'
import { getHostEarnings } from "../controllers/hostController.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/earnings', protect, getHostEarnings);


export default router