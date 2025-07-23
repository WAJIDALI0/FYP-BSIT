import mongoose from 'mongoose';

const freelancerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  skills:    { type: String },
  experience:{ type: String },
  portfolio: { type: String },
}, { timestamps: true });

const Freelancer = mongoose.model('Freelancer', freelancerSchema);
export default Freelancer;
