import Notification from '../models/Notification.js'; // Make sure this path is correct

export const sendNotification = async (req, res) => {
  const { recipientId, message } = req.body;

  // Basic validation
  if (!recipientId || !message) {
    return res.status(400).json({
      success: false,
      error: 'recipientId and message are required.',
    });
  }

  try {
    const notification = new Notification({
      recipientId,
      message,
      timestamp: new Date(), // Optional: can let schema default handle this
    });

    await notification.save();

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification sent successfully.',
    });
  } catch (error) {
    console.error('🛠 Notification error:', error); // Enhanced logging
    res.status(500).json({
      success: false,
      error: 'Failed to send notification.',
    });
  }
};
