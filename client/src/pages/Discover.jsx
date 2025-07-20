import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import SwapRequestForm from '../components/SwapRequestForm.jsx'
import { useNavigate } from 'react-router-dom'

const Discover = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const allCategories = ['Design', 'Tech', 'Communication', 'Fitness', 'Business']

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/users/others', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUsers(res.data)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError('Could not load members. Please try again.')
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) =>
    user.skills?.join(',').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categoryFiltered = selectedCategory
    ? filteredUsers.filter((user) => user.categories?.includes(selectedCategory))
    : filteredUsers

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold"></h1>
        <div className="space-x-4">
          <button onClick={() => navigate('/dashboard')} className="hover:underline">Dashboard</button>
          <button onClick={() => navigate('/discover')} className="hover:underline">Discover</button>
          <button onClick={() => navigate('/requests')} className="hover:underline">Requests</button>
          <button onClick={() => navigate('/profile')} className="hover:underline">Profile</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Discover Members</h2>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skills or usernames..."
            className="flex-1 px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <div className="flex gap-2 flex-wrap">
            {allCategories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full ${
                  selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 dark:text-white'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* User Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryFiltered.length > 0 ? (
            categoryFiltered.map((user) => (
              <div key={user._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center font-bold text-xl text-gray-800 dark:text-white">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">{user.username}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Skills: {user.skills?.join(', ') || 'None listed'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Categories: {user.categories?.join(', ') || 'Uncategorized'}
                    </p>
                  </div>
                </div>

                {/* Swap Form */}
                <SwapRequestForm
                  toUserId={user._id}
                  toUsername={user.username}
                  onSuccess={() => toast.success('Swap request sent')}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No matching members found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Discover
