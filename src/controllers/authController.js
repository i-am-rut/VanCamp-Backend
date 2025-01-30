import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'


const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        httpOnly: true,  // Prevents client-side access
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "Strict", // Prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password, role });
    if (user) {
        res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
        message: 'User successfully registered!',
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
})

export { registerUser ,loginUser, logoutUser }