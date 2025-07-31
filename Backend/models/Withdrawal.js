import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  code: { type: String, required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Withdrawal', withdrawalSchema);
