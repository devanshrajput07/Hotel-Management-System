const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 7000;

mongoose.connect("mongodb://localhost:27017/Hotel-Management-System")
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log("MongoDb Error", err));

//Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  accounttype: {
    type: String,
    enum: ['Customer', 'Hotel Manager', 'Admin'],
    default: 'Customer',
  },
  password: {
    type: String,
    required: true,
  }
});

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

const bookingSchema = new mongoose.Schema({
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Reserved', 'Checked-In', 'Checked-Out'],
    default: 'Reserved',
  },
});

const User = mongoose.model("user", userSchema);
const Room = mongoose.model("room", roomSchema);
const Booking = mongoose.model("booking", bookingSchema);


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rest Api

// Add a User
app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, accounttype, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = await User.create({
      firstName,
      lastName,
      email,
      accounttype,
      password,
    });
    res.status(201).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Implement JWT token generation
    const token = jwt.sign({ id: user._id }, 'your_secret_key');
    res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
});

// Password reset request
app.post('/password/reset', (req, res) => {
  const { email } = req.body;

  // Implement logic to send a password reset email
  // Example code to send a password reset link to the provided email
  const resetToken = jwt.sign({ email }, 'your_secret_key', { expiresIn: '1h' });
  const resetUrl = `http://yourwebsite.com/password/reset/${resetToken}`;
  // Use Nodemailer or any other email service to send the resetUrl to the user's email
});

// Password reset
app.post('/password/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { new_password } = req.body;

  try {
    // Implement logic to verify the token
    const decoded = jwt.verify(token, 'your_secret_key');
    const { email } = decoded;
    // Implement logic to update the password with the new_password
    const user = await User.findOne({ email });
    user.password = new_password;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset error', error: error.message });
  }
});

// List all available rooms
app.get('/room/list', async (req, res) => {
  try {
    const availableRooms = await Room.find({ availability: 'Available' });
    res.status(200).json(availableRooms);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Book a room
app.post('/room/book', async (req, res) => {
  const { hotelId } = req.query;
  const { customerId, checkInDate, checkOutDate } = req.body;

  try {
    const room = await Room.findOne({ hotelId, availability: 'Available' });

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
});

// Update room details
app.put('/room/update', async (req, res) => {
  const { roomId } = req.query;
  const { availability, roomNumber, roomType, price } = req.body;

  try {
    let room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (availability) {
      room.availability = availability;
    }
    if (roomNumber) {
      room.roomNumber = roomNumber;
    }
    if (roomType) {
      room.roomType = roomType;
    }
    if (price) {
      room.price = price;
    }

    room = await room.save();

    res.status(200).json({ message: 'Room details updated successfully', room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Checkout from a room
app.post('/room/checkout', async (req, res) => {
  const { roomId } = req.body;

  try {
    let room = await Room.findById(roomId);

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
});

// List all bookings for a customer
app.get('/booking/list', async (req, res) => {
  const { customerId } = req.query;

  try {
    const bookings = await Booking.find({ customerID: customerId });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// List all bookings for a hotel manager
app.get('/booking/all', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Cancel a booking
app.delete('/booking/cancel', async (req, res) => {
  const { bookingId } = req.query;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'Checked-In' || booking.status === 'Checked-Out') {
      return res.status(400).json({ message: 'Booking is not cancellable' });
    }

    const room = await Room.findById(booking.roomID);
    room.availability = 'Available';
    room.bookings.pull(bookingId);
    await room.save();

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a particular user
app.delete('/admin/delete', async (req, res) => {
  const { userEmail } = req.query;

  try {
    const deletedUser = await User.findOneAndDelete({ email: userEmail });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server started at port:${PORT}`));