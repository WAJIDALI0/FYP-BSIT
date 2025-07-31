import express from 'express';
import {
  registerFreelancer,
  loginFreelancer,
  forgotFreelancerPassword,
  resetFreelancerPassword,
  updateFreelancerEmail,
  updateFreelancerProfile,
} from '../controllers/freelancerController.js';
import { protectFreelancer } from '../middleware/authFreelancer.js';

const router = express.Router();

router.post('/register', registerFreelancer);
router.post('/login', loginFreelancer);
router.post('/forgot-password', forgotFreelancerPassword); // ✅ new route
router.post('/update-email', protectFreelancer, updateFreelancerEmail);
router.post('/reset-password', protectFreelancer, resetFreelancerPassword);
router.put('/profile', protectFreelancer, updateFreelancerProfile);

export default router;
