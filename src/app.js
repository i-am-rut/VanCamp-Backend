import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import vanRoutes from './routes/vanRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'


// load environment variables
dotenv.config()
const app = express()


// Middleware
app.use(express.json())
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 
        ["http://localhost:3000", "https://vancamp.netlify.app"] : 
        "http://localhost:3000",
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser())


// Database Connection
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/vans', vanRoutes)
app.use("/api/transactions", transactionRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/bookings', bookingRoutes)
app.get('/', (req, res) => {
    res.send('Welcome to VanCamp API')
})

// Error Handeling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({message: 'Something went wrong', error: err.message})
}) 


export default app