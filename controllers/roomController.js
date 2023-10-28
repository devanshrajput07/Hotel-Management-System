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
    const { hotelId } = req.query;
    const { email, accounttype, availability } = req.body;
    try {
      const user = await UserModel.find({ email: email, accounttype: 'Hotel-Manager' });
      if (!user) {
        res.send({ status: 'failed', message: 'Not Accessible to you' });
      } else {
        if (hotelId && availability) {
          try {
            const doc = await RoomModel.findOneAndUpdate(
              { hotelId: hotelId },
              { availability: availability },
              { new: true }
            )
            await doc.save()
            res.send({ status: 'success', message: 'Update successful', data: doc });
          } catch (error) {
            console.log(error);
            res.send({ status: 'failed', message: 'Unable to update' });
          }
        }
      }
    } catch (error) {
      console.log(error);
      res.send({ status: 'failed', message: 'An error occurred' });
    }
  }
}

export default RoomController;
