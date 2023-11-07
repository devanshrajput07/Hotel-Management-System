import express from 'express';
import UserController from '../controllers/userController.js';
import RoomController from '../controllers/roomController.js';
import BookController from '../controllers/bookingController.js';
const app = express()
import ejs from "ejs";
app.set("view engine", "ejs");

// Public Routes
app.post('/signup', UserController.userRegistration)
app.post('/login', UserController.userLogin)
app.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
app.post('/reset-password/:id/:token', UserController.userPasswordReset)
app.delete('/admin/delete' , UserController.deleteUser)

//Room Routes
app.get('/room/list', RoomController.roomList)
app.put('/room/update', RoomController.roomUpdate)
app.post('/room/checkout', BookController.roomCheckout)

//Booking Routes
app.post('/room/book', BookController.roomBook)
app.get('booking/list' , BookController.userBooking)
app.get('/booking/all', BookController.Bookings)
app.delete('booking/cancel', BookController.bookingCancel)

export default app