import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  registerClient,
  loginClient,
  forgotPassword,
  getClientProfile,
  updateClientProfile,
  uploadClientProfileImage,
  createProject
} from '../controllers/clientController.js';
import { protectClient } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==========================
// Public Routes
// ==========================

// Register a new client
router.post('/register', registerClient);

// Login existing client
router.post('/login', loginClient);

// Forgot password
router.post('/forgot-password', forgotPassword);

// ==========================
// Multer Setup for Image Upload
// ==========================
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ==========================
// Protected Routes (Auth Required)
// ==========================

// Get client profile
router.get('/profile', protectClient, getClientProfile);

// Update client profile
router.put('/profile', protectClient, updateClientProfile);

// Upload profile image
router.post(
  '/upload-profile-image',
  protectClient,
  upload.single('file'),
  uploadClientProfileImage
);

// Create a new project
router.post('/create-project', protectClient, createProject);

export default router;
