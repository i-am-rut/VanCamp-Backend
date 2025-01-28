import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    van: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Van',
    required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    addOns: {
        type: [
          {
            name: { type: String, required: true },
            price: { type: Number, required: true },
          }
        ],
        default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
