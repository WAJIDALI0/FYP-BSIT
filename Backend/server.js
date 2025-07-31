import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import clientRoutes from './routes/clientRoutes.js';
import freelancerRoutes from './routes/freelancerRoutes.js';
import withdrawalRoutes from './routes/withdrawalRoutes.js';



dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ✅ Static Files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ Routes
app.use('/api/clients', clientRoutes);
app.use('/api/freelancers', freelancerRoutes);
app.use('/api/withdrawal', withdrawalRoutes);

// ✅ Connect DB and start server
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection failed:', err.message));
