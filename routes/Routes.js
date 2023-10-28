import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import RoomController from '../controllers/roomController.js';
import BookController from '../controllers/bookingController.js';

// Public Routes
router.post('/signup', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)
router.delete('/admin/delete' , UserController.deleteUser)

//Room Routes
router.get('/room/list', RoomController.roomList)
router.put('/room/update', RoomController.roomUpdate)
router.post('/room/checkout', BookController.roomCheckout)

//Booking Routes
router.post('/room/book', BookController.roomBook)
router.get('booking/list' , BookController.userBooking)
router.get('/booking/all', BookController.Bookings)
router.delete('booking/cancel', BookController.bookingCancel)

export default router