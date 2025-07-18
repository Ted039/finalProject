import SwapRequest from '../models/SwapRequest.js';

export const sendSwapRequest = async (req, res) => {
  const { toUserId, offeredSkill, requestedSkill } = req.body;

  try {
    const newRequest = await SwapRequest.create({
      fromUser: req.user._id,
      toUser: toUserId,
      offeredSkill,
      requestedSkill,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send swap request' });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({ toUser: req.user._id }).populate('fromUser', 'username avatar');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve requests' });
  }
};

export const respondToRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await SwapRequest.findById(req.params.id);

    if (request.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to respond to request' });
  }
};
