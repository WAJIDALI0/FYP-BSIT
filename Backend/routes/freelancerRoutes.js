import express from 'express';
import {
  registerFreelancer,
  loginFreelancer,
  forgotFreelancerPassword,
} from '../controllers/freelancerController.js';

const router = express.Router();

router.post('/register', registerFreelancer);
router.post('/login', loginFreelancer);
router.post('/forgot-password', forgotFreelancerPassword); // ✅ new route

export default router;
