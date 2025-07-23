import User from '../models/User.js'

export const endorseSkill = async (req, res) => {
  try {
    const targetUserId = req.params.userId
    const { skill } = req.body
    const endorserId = req.user._id

    if (!skill) return res.status(400).json({ message: 'Skill required' })

    const targetUser = await User.findById(targetUserId)
    const alreadyEndorsed = targetUser.endorsements.some(
      (e) => e.skill === skill && e.from === endorserId.toString()
    )
    if (alreadyEndorsed) {
      return res.status(400).json({ message: 'You already endorsed this skill' })
    }

    targetUser.endorsements.push({ skill, from: endorserId })
    await targetUser.save()

    res.json({ message: 'Skill endorsed successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to endorse skill' })
  }
}
