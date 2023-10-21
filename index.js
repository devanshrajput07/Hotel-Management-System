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
   password:{
    type:String,
    required:true,
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
app.post('/signup', async(req, res) => {
  try {
    const { firstName, lastName, email, accounttype , password } = req.body;
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

app.listen(PORT, () => console.log(`Server started at port:${PORT}`));
