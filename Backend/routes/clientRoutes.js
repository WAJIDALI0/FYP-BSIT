import express from 'express';
import { registerClient, loginClient,forgotPassword } from '../controllers/clientController.js';

const router = express.Router();

// POST /api/clients/register
router.post('/register', registerClient);

// POST /api/clients/login
router.post('/login', loginClient);
// POST /api/clients/forgot-password
router.post('/forgot-password', forgotPassword);

export default router;
