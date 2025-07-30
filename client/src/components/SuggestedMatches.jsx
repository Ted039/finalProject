import { useEffect, useState } from 'react'
import api from '../api/axios'

const SuggestedMatches = ({ skills = [], currentUserId }) => {
  const [matches, setMatches] = useState([])
  const [sentRequests, setSentRequests] = useState({})

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const suggestions = res.data
          .filter((user) => user._id !== currentUserId) // exclude self
          .filter((user) =>
            user.skills?.some((skill) => skills.includes(skill))
          )

        setMatches(suggestions)
      } catch (err) {
        console.error('Suggested matches error:', err)
      }
    }

    if (skills.length > 0 && currentUserId) {
      fetchMatches()
    }
  }, [skills, currentUserId])

  const handleSwapRequest = async (targetUserId) => {
    const token = localStorage.getItem('token')
    const payload = {
      toUserId: targetUserId,
      offeredSkill: skills[0] || 'General',
      requestedSkill: 'Any',
      message: 'Hi! I’d love to swap skills with you.',
      date: new Date(),
    }

    try {
      await api.post('/swaps/request', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSentRequests((prev) => ({ ...prev, [targetUserId]: true }))
    } catch (err) {
      console.error('Swap request failed:', err.response?.data || err.message)
    }
  }

  if (matches.length === 0) return null

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3 dark:text-white">Suggested Matches</h3>
      <ul className="space-y-3">
        {matches.map((user) => (
          <li
            key={user._id}
            className="bg-gray-100 dark:bg-gray-700 rounded p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Skills: {user.skills.join(', ')}
              </p>
            </div>
            {sentRequests[user._id] ? (
              <span className="text-green-600 text-sm">Request Sent</span>
            ) : (
              <button
                onClick={() => handleSwapRequest(user._id)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Request Swap
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SuggestedMatches
