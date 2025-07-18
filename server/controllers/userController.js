import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { skillCategoryMap } from '../utils/skillCategories.js';


export const getUserProfile = async (req, res) => {
  try {
    const user = req.user; // added by authMiddleware
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      skills: user.skills,
      avatar: user.avatar || '', // ✅ include avatar
    });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve user profile' });
  }
};

export const addSkillToUser = async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) return res.status(400).json({ message: 'Skill required' });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { skills: skill } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update skills' });
  }
};

export const removeSkillFromUser = async (req, res) => {
  try {
    const { skill } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { skills: skill } },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove skill' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const updatedFields = { username, email };

    // ✅ Include avatar if file was uploaded
    if (req.file) {
      updatedFields.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedFields,
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json({ message: 'Old password incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Password update failed' });
  }
};


export const getAllOtherUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('username skills avatar');

    const enrichedUsers = users.map((user) => {
      const categories = new Set();
      user.skills.forEach((skill) => {
        const category = skillCategoryMap[skill.toLowerCase()];
        if (category) categories.add(category);
      });
      return { ...user.toObject(), categories: Array.from(categories) };
    });

    res.json(enrichedUsers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};


