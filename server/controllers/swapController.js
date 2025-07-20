import SwapRequest from '../models/SwapRequest.js'

// Send a new swap request
export const sendSwapRequest = async (req, res) => {
  const { toUserId, offeredSkill, requestedSkill, message, date } = req.body

  if (!toUserId || !offeredSkill || !requestedSkill || !message || !date) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  try {
    const newRequest = await SwapRequest.create({
      fromUser: req.user._id,
      toUser: toUserId,
      offeredSkill,
      requestedSkill,
      message,
      date,
      status: 'pending',
    })

    res.status(201).json(newRequest)
  } catch (error) {
    console.error('Swap request error:', error)
    res.status(500).json({ message: 'Failed to send swap request' })
  }
}

// Get all swap requests sent to the logged-in user
export const getMyRequests = async (req, res) => {
  try {
    const { status } = req.query
    const filter = { toUser: req.user._id }
    if (status) filter.status = status

    const requests = await SwapRequest.find(filter)
      .populate('fromUser', 'username avatar')
      .sort({ createdAt: -1 })

    res.json(requests)
  } catch (error) {
    console.error('Failed to retrieve requests:', error)
    res.status(500).json({ message: 'Failed to retrieve requests' })
  }
}


export const respondToRequest = async (req, res) => {
  const { status } = req.body
  const validStatuses = ['approved', 'declined']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' })
  }

  try {
    const request = await SwapRequest.findById(req.params.id)
    if (!request) {
      return res.status(404).json({ message: 'Request not found' })
    }

    // Ensure current user is authorized to respond
    if (request.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // Update status only
    request.status = status

    // ✅ Save without triggering full validation (skip missing `date` check)
    await request.save({ validateModifiedOnly: true })

    res.json({ message: `Request ${status}`, request })
  } catch (err) {
    console.error('Respond error:', err)
    res.status(500).json({ message: 'Failed to respond to request' })
  }
}
