import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import UserCard from '../components/UserCard'

const Discover = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
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
        console.error(err)
        setError('Failed to fetch users.')
      } finally {
        setLoading(false)
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* NavBar stays the same */}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Discover Members</h2>

        {/* Search & Filters */}
        <section className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by skill or name"
            className="w-full md:w-1/2 px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          />
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading members...</p>
        ) : categoryFiltered.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No matching members found.</p>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryFiltered.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}

export default Discover
