import Freelancer from "../models/Freelancer.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import sendEmail from '../utils/sendEmail.js';
import jwt from "jsonwebtoken";

export const registerFreelancer = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, skills, experience, portfolio } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existing = await Freelancer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashed = await hashPassword(password);

    const freelancer = new Freelancer({
      firstName,
      lastName,
      email,
      password: hashed,
      skills,
      experience,
      portfolio
    });

    await freelancer.save();

    res.status(201).json({ message: "Freelancer registered successfully." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginFreelancer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const freelancer = await Freelancer.findOne({ email });
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });

    const isMatch = await comparePassword(password, freelancer.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: freelancer._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ token, freelancer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};


export const forgotFreelancerPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const freelancer = await Freelancer.findOne({ email });
    if (!freelancer)
      return res.status(404).json({ message: 'Freelancer not found' });

    const resetToken = `${freelancer._id}-${Date.now()}`;
    const resetLink = `http://localhost:5173/freelancer-reset-password/${resetToken}`;

    // Send reset link via email
    await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `
        <p>Hello ${freelancer.firstName},</p>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetLink}" target="_blank">Reset Password</a>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    });

    res.status(200).json({
      message: 'Reset link sent successfully!',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

// Update Email
export const updateFreelancerEmail = async (req, res) => {
  try {
    const { id } = req.user; // from JWT
    const { newEmail } = req.body;

    if (!newEmail) return res.status(400).json({ message: "New email required" });

    const exists = await Freelancer.findOne({ email: newEmail });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const updated = await Freelancer.findByIdAndUpdate(
      id,
      { email: newEmail },
      { new: true }
    );

    res.status(200).json({ message: "Email updated", freelancer: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update email" });
  }
};

// Reset Password
export const resetFreelancerPassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const freelancer = await Freelancer.findById(id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });

    const isMatch = await comparePassword(currentPassword, freelancer.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect current password" });

    freelancer.password = await hashPassword(newPassword);
    await freelancer.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password update failed" });
  }
};



export const updateFreelancerProfile = async (req, res) => {
  try {
    const { id } = req.user; // From protect middleware

    const {
      firstName,
      lastName,
      profileImage,
      country,
      city,
      timezone,
      title,
      description,
      hourlyRate,
      totalProjects,
      successfulProjects,
      averageRating,
      keywords
    } = req.body;

    const freelancer = await Freelancer.findById(id);
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Update profile fields
    freelancer.firstName = firstName || freelancer.firstName;
    freelancer.lastName = lastName || freelancer.lastName;
    freelancer.profileImage = profileImage || freelancer.profileImage;
    freelancer.country = country || freelancer.country;
    freelancer.city = city || freelancer.city;
    freelancer.timezone = timezone || freelancer.timezone;
    freelancer.title = title || freelancer.title;
    freelancer.description = description || freelancer.description;
    freelancer.hourlyRate = hourlyRate || freelancer.hourlyRate;
    freelancer.totalProjects = totalProjects || freelancer.totalProjects;
    freelancer.successfulProjects = successfulProjects || freelancer.successfulProjects;
    freelancer.averageRating = averageRating || freelancer.averageRating;
    freelancer.keywords = Array.isArray(keywords) ? keywords : freelancer.keywords;

    await freelancer.save();

    res.status(200).json({ message: 'Profile updated successfully', freelancer });

  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};
