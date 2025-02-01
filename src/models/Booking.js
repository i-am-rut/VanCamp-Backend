import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    vanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Van',
    required: true,
    },
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    renterContact: { 
      type: Number, 
      required: true 
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
    price: {
      basePrice: { type: Number, required: true },
      addOnsPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Completed", "Pending"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
