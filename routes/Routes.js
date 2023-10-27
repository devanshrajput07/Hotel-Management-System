import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import RoomController from '../controllers/roomController.js';

// Public Routes
router.post('/signup', UserController.userRegistration)
router.post('/login', UserController.userLogin)
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)

//Room Routes
router.get('/room/list', RoomController.roomList)

export default router