import mongoose from 'mongoose';

const freelancerSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  name: { type: String }, // Full name
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  title: { type: String },
  description: { type: String },
  country: { type: String },
  city: { type: String },
  timezone: { type: String },
  hourlyRate: { type: String },
  totalProjects: { type: String },
  successfulProjects: { type: String },
  averageRating: { type: String },
  keywords: [{ type: String }],
}, { timestamps: true });

const Freelancer = mongoose.model('Freelancer', freelancerSchema);
export default Freelancer;
