import mongoose from "mongoose";

//Schema
const roomSchema = new mongoose.Schema({
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: String,
      enum: ['Available', 'Booked'],
      default: 'Available',
    },
    bookings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    }],
  });

  const RoomModel = mongoose.model("room", roomSchema);

  export default RoomModel

