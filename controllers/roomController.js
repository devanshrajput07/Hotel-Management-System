import BookingModel from "../models/Booking.js";
import RoomModel from "../models/Room.js";
import UserModel from "../models/User.js";

class RoomController {
  static roomList = async (req, res) => {
    try {
      const availableRooms = await RoomModel.find({ availability: 'Available' });
      res.status(200).json(availableRooms);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  };

  static roomUpdate = async (req, res) => {
    const { email, hotelId, updatedavailability } = req.body;
    try {
      const user = await UserModel.findOne({ email: email, accounttype: 'Hotel-Manager' });
      if (!user) {
        return res.send({ status: 'failed', message: 'Not Accessible to you' });
      } else {
        try {
          const room = await RoomModel.findOneAndUpdate(
            { hotelId: hotelId },
            { availability: updatedavailability },
            { new: true }
          );
          if (!room) {
            return res.send({ status: 'failed', message: 'Room not found' });
          }
          res.send({ status: 'success', message: 'Update successful', room });
        } catch (error) {
          console.log(error);
          res.send({ status: 'failed', message: 'Unable to update' });
        }
      }
    } catch (error) {
      console.log(error);
      res.send({ status: 'failed', message: 'An error occurred' });
    }
  }
  
}

export default RoomController;
