import mongoose from "mongoose";

const vanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Van name is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    images: {
        type: [String],
        default: [],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    category: {
        type: String,
        enum: ['simple', 'rugged', 'luxury'],
        required: [true, 'Category is required'],
    },
    availability: {
        type: [Date],
        default: [],
    },
    insuranceDetails: {
        type: String,
        default: '',
    },
    addOns: {
        type: [
            {
                name: String,
                price: Number,
            },
        ],
        default: [],
    },
    seasonalPricing: {
        type: [
            {
                season: String,
                price: Number,
            },
        ],
        default: [],
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviews: {
        type: [
            {
                userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
                rating: {type: Number, min: 1, max: 5},
                comment: String,
                timestamp: {type: Date, default: Date.now},
            },
        ],
    },
})

const Van = mongoose.model('Van', vanSchema)

export default Van