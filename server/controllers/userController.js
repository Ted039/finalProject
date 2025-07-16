// controllers/userController.js
export const getUserProfile = async (req, res) => {
  try {
    const user = req.user; // added by authMiddleware
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      skills: user.skills,
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

