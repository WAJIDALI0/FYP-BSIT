import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import clientRoutes from './routes/clientRoutes.js';
import freelancerRoutes from './routes/freelancerRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/clients', clientRoutes);
app.use('/api/freelancers', freelancerRoutes);

const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err));
