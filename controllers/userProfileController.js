import User from '../models/User.js';

export async function updateProfileImage(req, res) {
  const { userId, img } = req.body;
  if (!userId || !img) {
    return res.status(400).json({ message: 'userId and img are required' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { img },
      { new: true, select: '-password' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
} 