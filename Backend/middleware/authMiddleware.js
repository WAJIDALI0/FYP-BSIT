import jwt from 'jsonwebtoken';
import Client from '../models/Client.js';

// Middleware to protect client routes
export const protectClient = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach the user object (excluding password) to the request
      req.user = await Client.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(404).json({ message: 'Client not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
