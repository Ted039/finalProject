import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../api/axios'

const Navbar = () => {
  const navigate = useNavigate()
  const [pendingRequests, setPendingRequests] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token')
      try {
        const res = await api.get('/swaps?status=pending', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setPendingRequests(res.data.length)
      } catch (err) {
        console.warn('Notification fetch failed:', err)
      }
    }
    fetchNotifications()
  }, [])

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold"></h1>
      <div className="flex gap-6 items-center">
        <button onClick={() => navigate('/dashboard')} className="hover:underline">
          Dashboard
        </button>
        <button onClick={() => navigate('/discover')} className="hover:underline">
          Discover
        </button>
        <div className="relative">
          <button onClick={() => navigate('/requests')} className="hover:underline">
            Requests
          </button>
          {pendingRequests > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full px-2">
              {pendingRequests}
            </span>
          )}
        </div>
        <button onClick={() => navigate('/profile')} className="hover:underline">
          Profile
        </button>
      </div>
    </nav>
  )
}

export default Navbar
