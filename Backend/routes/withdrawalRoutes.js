import express from 'express';
import { sendOTP, submitWithdrawal } from '../controllers/withdrawalController.js';

const router = express.Router();

router.post('/send-code', sendOTP);             // Step 1: Send verification code
router.post('/submit', submitWithdrawal);       // Step 2: Submit withdrawal request

export default router;
