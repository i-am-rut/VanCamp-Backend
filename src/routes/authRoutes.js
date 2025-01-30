import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/authController.js';

const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

router.post('/logout', logoutUser)

export default router;
