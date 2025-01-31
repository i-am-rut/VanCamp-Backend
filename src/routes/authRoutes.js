import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get("/me",protect,  async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

export default router;
