import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import UserCard from '../components/UserCard'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import EmptyState from '../components/EmptyState'

const Discover = () => {
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('match')

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchData = async () => {
      try {
        const [userRes, catRes] = await Promise.all([
          api.get('/users/others', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/skill-categories')
        ])
        const cleanUsers = Array.from(
          new Map(userRes.data.map(user => [user._id, user])).values()
        )
        setUsers(cleanUsers)
        setCategories(catRes.data)
      } catch (err) {
        console.error(err)
        setError('Failed to load data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const normalize = val => val?.toLowerCase().trim()

  const searchFiltered = users.filter(user => {
    const nameMatch = normalize(user.username).includes(normalize(searchTerm))
    const skillMatch = user.skills?.some(skill =>
      typeof skill === 'string'
        ? normalize(skill).includes(normalize(searchTerm))
        : normalize(skill?.name).includes(normalize(searchTerm))
    )
    return nameMatch || skillMatch
  })

  const categoryFiltered = selectedCategory
    ? searchFiltered.filter(user =>
        user.skills?.some(skill =>
          typeof skill === 'object' &&
          normalize(skill.category) === normalize(selectedCategory)
        )
      )
    : searchFiltered

  const sortedUsers = categoryFiltered.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.username.localeCompare(b.username)
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return 0
    }
  })

  const recommendedUsers = sortedUsers.slice(0, 3)

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white tracking-tight">
          Discover Members
        </h2>

        {/* 🔗 Quick Links */}
        <nav className="flex flex-wrap gap-3 mb-6">
          <button onClick={() => navigate('/top-rated')} className="quick-btn">🔥 Top Rated</button>
          <button onClick={() => navigate('/recent')} className="quick-btn">🕒 Recently Joined</button>
          <button onClick={() => navigate('/suggestions')} className="quick-btn">🧠 Suggestions</button>
        </nav>

        {/* 🔍 Search & Filter Controls */}
        <section className="mb-8 space-y-4 md:flex md:items-center md:justify-between">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by skill or name"
            className="w-full md:w-1/2 px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />

          <div className="flex flex-wrap gap-3 items-center">
            <select
              className="border px-3 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="match">Best Match</option>
              <option value="newest">Newest</option>
              <option value="name">A–Z</option>
            </select>

            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-3 py-1 border rounded text-sm hover:bg-blue-100 dark:hover:bg-blue-800 transition"
            >
              {viewMode === 'grid' ? '📋 List View' : '🔳 Grid View'}
            </button>

            {selectedCategory && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  toast.success('Filters cleared')
                }}
                className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-600 hover:bg-red-200 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        {/* 💡 Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)
              }
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 hover:scale-105 ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* 🌟 Recommended Section */}
        {!loading && recommendedUsers.length > 0 && (
          <section className="mt-4 mb-10">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Recommended For You
            </h3>
          </section>
        )}

        {/* 💬 Feedback States */}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {loading ? (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} height={150} borderRadius={12} />
            ))}
          </section>
        ) : sortedUsers.length === 0 ? (
          <div className="text-center mt-10">
            <EmptyState />
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              No matching members found. Try another skill or category!
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedUsers.map((user) => (
              <div key={user._id} className="hover:shadow-lg hover:scale-[1.02] transition-transform duration-200">
                <UserCard user={user} />
              </div>
            ))}
          </section>
        ) : (
          <ul className="space-y-4">
            {sortedUsers.map((user) => (
              <li key={user._id} className="rounded shadow p-4 bg-white dark:bg-gray-800">
                <UserCard user={user} compact />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

export default Discover
