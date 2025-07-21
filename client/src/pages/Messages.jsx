import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import ChatRoom from '@/components/ChatRoom/ChatRoom'
import { useAuth } from '@/context/AuthContext'
import MemberCard from '@/components/MemberCard.jsx'

const Messages = () => {
  const { user } = useAuth()
  const currentUser = { username: user?.username || 'Anonymous' }
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)

    // Fetch other users to DM
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/users/others', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers(res.data)
      } catch (err) {
        console.error('Failed to load users:', err)
        setError('Unable to fetch users. Please try again later.')
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <Helmet>
        <title>Messages | SkillSwap</title>
        <meta name="description" content="Join the conversation in SkillSwap's global chat." />
      </Helmet>

      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Group Messages
      </h2>

      <ChatRoom roomName="skillswap" currentUser={currentUser} />

      <h3 className="text-xl font-semibold mt-10 mb-4 text-gray-800 dark:text-gray-100">
        Start a Private Chat
      </h3>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-2">
        {users.length > 0 ? (
          users.map((receiver) => (
            <MemberCard key={receiver._id} receiver={receiver} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No other users found.</p>
        )}
      </div>
    </div>
  )
}

export default Messages
