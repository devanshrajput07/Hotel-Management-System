import RoomModel from "../models/Room.js";

class RoomController{
    static roomList = async (req, res) => {
        try {
          const availableRooms = await RoomModel.find({ availability: 'Available' });
          res.status(200).json(availableRooms);
        } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
        }
      }
}

export default RoomController