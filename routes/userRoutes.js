import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';

// Public Routes
router.post('/signup', UserController.userRegistration)

export default router