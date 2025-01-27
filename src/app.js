import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import vanRoutes from './routes/vanRoutes.js'


// load environment variables
dotenv.config()
const app = express()

// Middleware
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/vans', vanRoutes)


// Database Connection
connectDB()

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to VanCamp API')
})

// Error Handeling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({message: 'Something went wrong', error: err.message})
}) 


export default app