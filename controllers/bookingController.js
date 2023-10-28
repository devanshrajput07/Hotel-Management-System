import BookingModel from "../models/Booking.js";
import RoomModel from "../models/Room.js";

class BookController {
    static roomBook = async (req, res) => {
        const { hotelId, customerId, checkInDate, checkOutDate } = req.body;
        try {
            const room = await RoomModel.findOne({ hotelId, availability: 'Available' });
            if (!room) {
                return res.status(404).json({ message: 'No available rooms for the provided hotelId' });
            }
            // Create a booking entry for the customer
            const newBooking = new Booking({
                customerID: customerId,
                roomID: room.id,
                checkInDate,
                checkOutDate,
                status: 'Reserved',
            });
            room.availability = 'Booked';
            room.bookings.push(newBooking.id);
            await room.save();
            await newBooking.save();
            res.status(200).json({ message: 'Room booked successfully', newBooking });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
}

export default BookController