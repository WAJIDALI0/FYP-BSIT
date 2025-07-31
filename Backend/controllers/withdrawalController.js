import Withdrawal from '../models/Withdrawal.js';

// In-memory OTP store (for demo)
const otpStore = {};

export const sendOTP = async (req, res) => {
  const { number } = req.body;

  if (!number) return res.status(400).json({ message: 'Mobile number required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[number] = otp;

  console.log(`OTP for ${number}: ${otp}`); // ✅ In real app, integrate SMS API like Twilio

  res.status(200).json({ message: 'OTP sent successfully (demo only)' });
};

export const submitWithdrawal = async (req, res) => {
  const { name, number, code } = req.body;

  if (!name || !number || !code) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (otpStore[number] !== code) {
    return res.status(401).json({ message: 'Invalid verification code' });
  }

  try {
    const withdrawal = await Withdrawal.create({
      name,
      number,
      code,
      verified: true,
    });

    // Simulate EasyPaisa payment here (mock only)
    console.log(`💸 Payment sent to ${number} (EasyPaisa simulation)`);

    res.status(201).json({
      message: 'Withdrawal submitted successfully',
      withdrawalId: withdrawal._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Withdrawal failed. Try again.' });
  }
};
