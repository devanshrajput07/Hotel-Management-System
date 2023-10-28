import BookingModel from "../models/Booking.js";
import RoomModel from "../models/Room.js";

class BookController {
    static roomBook = async (req, res) => {
        const { hotelId } = req.query;
        const { customerId, checkInDate, checkOutDate } = req.body;
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

    static roomCheckout = async (req, res) => {
        const { roomId } = req.body;
        try {
          let room = await BookingModel.findById(roomId); 
          if (!room) {
            return res.status(404).json({ message: 'Room not found' });
          }
          if (room.availability !== 'Booked') {
            return res.status(400).json({ message: 'Room is not currently booked' });
          }
          room.availability = 'Available';
          room.bookings = []; 
          room = await room.save();
          res.status(200).json({ message: 'Checkout successful', room });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error', error: error.message });
        }
      }

    static userBooking = async (req, res) => {
        const { customerId } = req.body;
        try {
          const bookings = await BookingModel.find({ customerId: customerId });
          res.status(200).json({ bookings });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error', error: error.message });
        }
      }

      static Bookings = async (req, res) => {
        try {
          const bookings = await BookingModel.find();
          res.status(200).json({ bookings });
        } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
        }
      }

      static bookingCancel = async (req, res) => {
        const { bookingId , hotelId } = req.body;
        try {
          const booking = await BookingModel.findById(bookingId);    
          if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
          }   
          if (booking.status === 'Checked-In' || booking.status === 'Checked-Out') {
            return res.status(400).json({ message: 'Booking is not cancellable' });
          }
          const room = await RoomModel.findById(hotelId);
          room.availability = 'Available';
          room.bookings.pull(bookingId);
          await room.save();     
          await BookingModel.findByIdAndDelete(bookingId);    
          res.status(200).json({ message: 'Booking canceled successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error', error: error.message });
        }
      }
}

export default BookController