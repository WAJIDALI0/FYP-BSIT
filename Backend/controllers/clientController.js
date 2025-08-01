// controllers/clientController.js
import Client from "../models/Client.js";
import Project from "../models/Project.js";
import path from "path";
import fs from "fs";
import { hashPassword,comparePassword } from "../utils/hashPassword.js";
import nodemailer from 'nodemailer';
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerClient = async (req, res) => {
  try {
    const { firstName, lastName, email, password, companyName, role } = req.body;

    const exists = await Client.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Client already exists." });
    }

    const hashedPassword = await hashPassword(password);

    const newClient = await Client.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      companyName,
      role
    });

    res.status(201).json({
      message: "Client registered successfully",
      token: generateToken(newClient._id),
      client: {
        id: newClient._id,
        name: `${newClient.firstName} ${newClient.lastName}`,
        email: newClient.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if user exists
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(400).json({ message: 'Client not found.' });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login successful.',
      token,
      client: {
        id: client._id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        role: client.role
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `http://localhost:5173/client-reset-password/${resetToken}`;

    // Optional: You can save the token to DB with expiry (not shown here)

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // your email
        pass: process.env.EMAIL_PASS,     // app password from Gmail
      },
    });

    const mailOptions = {
      from: '"Client Support" <no-reply@example.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h3>Password Reset Link</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ...................................................................

// GET Client Profile
export const getClientProfile = async (req, res) => {
  try {
    const client = await Client.findById(req.user._id).select("-password");
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ client });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE Client Profile
export const updateClientProfile = async (req, res) => {
  try {
    const { firstName, lastName, companyName } = req.body;
    const client = await Client.findById(req.user._id);

    if (!client) return res.status(404).json({ message: "Client not found" });

    client.firstName = firstName || client.firstName;
    client.lastName = lastName || client.lastName;
    client.companyName = companyName || client.companyName;

    await client.save();

    res.json({ client });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

// UPLOAD Profile Image
export const uploadClientProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imagePath = `/uploads/${req.file.filename}`;
    const client = await Client.findById(req.user._id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    client.profileImage = imagePath;
    await client.save();

    res.json({ imageUrl: imagePath });
  } catch (err) {
    res.status(500).json({ message: "Image upload failed" });
  }
};

// CREATE Project
export const createProject = async (req, res) => {
  try {
    const { name, description, deadline, price } = req.body;

    const project = new Project({
      name,
      description,
      deadline,
      price,
      client: req.user._id,
    });

    await project.save();

    res.status(201).json({ message: "Project created", project });
  } catch (err) {
    res.status(500).json({ message: "Project creation failed" });
  }
};

