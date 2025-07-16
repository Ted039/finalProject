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
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
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

