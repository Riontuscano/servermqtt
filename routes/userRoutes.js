import express from 'express';
import { signup, login } from '../controllers/userController.js';
import { updateProfileImage } from '../controllers/userProfileController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.patch('/profile-image', updateProfileImage);

export default router; 