import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import MainLayout from '../components/MainLayout'
import SuggestedMatches from '../components/SuggestedMatches'
import BadgePanel from '../components/BadgePanel'

const Dashboard = () => {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('Profile')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newSkill, setNewSkill] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [pendingRequests, setPendingRequests] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return navigate('/')

    const fetchData = async () => {
      try {
        const [profileRes, swapRes] = await Promise.all([
          api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/swaps?status=pending', { headers: { Authorization: `Bearer ${token}` } }),
        ])
        setProfile(profileRes.data)
        setPendingRequests(swapRes.data.length)
      } catch {
        toast.error('Dashboard load failed')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const getSkillLevel = (skills = []) =>
    skills.length >= 6 ? 'Advanced' : skills.length >= 3 ? 'Intermediate' : 'Beginner'

  const skillLevel = profile ? getSkillLevel(profile.skills) : 'Beginner'

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return
    try {
      setIsAdding(true)
      const token = localStorage.getItem('token')
      const res = await api.put('/users/me', { skill: newSkill }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProfile(res.data)
      setNewSkill('')
      toast.success('Skill added!')
    } catch {
      toast.error('Could not add skill')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const token = localStorage.getItem('token')
      const res = await api.put('/users/me/skills/remove', { skill: skillToRemove }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProfile(res.data)
      toast.success(`Removed ${skillToRemove}`)
    } catch {
      toast.error('Could not remove skill')
    }
  }

  if (loading) return (
    <MainLayout>
      <div className="text-center mt-10"> Loading your dashboard...</div>
    </MainLayout>
  )

  if (!profile) return (
    <MainLayout>
      <div className="text-center mt-10 text-red-500"> Failed to load profile.</div>
    </MainLayout>
  )

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        {/* Welcome Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Welcome, {profile.username}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">Skill Level: {skillLevel}</p>
          </div>
          {/* Avatar */}
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              className={`w-20 h-20 rounded-full object-cover border-4 ${
                skillLevel === 'Advanced'
                  ? 'border-yellow-400'
                  : skillLevel === 'Intermediate'
                  ? 'border-blue-400'
                  : 'border-gray-300'
              }`}
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white rounded-full flex items-center justify-center text-xl font-semibold">
              {profile.username.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b pb-2">
          {['Profile', 'Skills', 'Matches', 'Activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-t-md font-medium ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        {activeTab === 'Profile' && (
          <div className="space-y-2 text-sm dark:text-gray-300">
            <p>Email: {profile.email}</p>
            <p>Total Skills: {profile.skills.length}</p>
            <p>Pending Requests: {pendingRequests}</p>

            {/* Add badge/achievement section here */}
            <BadgePanel earnedBadges={profile.badges || []} />

          </div>
        )}

        {activeTab === 'Skills' && (
          <>
            <h2 className="text-lg font-semibold dark:text-white">Manage Your Skills</h2>
            {profile.skills.length ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {profile.skills.map((skill, i) => (
                  <li
                    key={i}
                    className="bg-gray-100 dark:bg-gray-700 flex justify-between items-center px-4 py-2 rounded hover:shadow transition"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mb-4">You have no skills listed yet.</p>
            )}

            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                className="flex-1 px-3 py-2 border rounded dark:bg-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddSkill}
                disabled={isAdding}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isAdding ? 'Adding...' : 'Add Skill'}
              </button>
            </div>
          </>
        )}

        {activeTab === 'Matches' && (
          <SuggestedMatches skills={profile.skills} currentUserId={profile._id} />
        )}

        {activeTab === 'Activity' && (
          <div className="space-y-6 text-sm dark:text-gray-300">
            {/*  Requests */}
            {pendingRequests > 0 && (
              <div>
                You have {pendingRequests} pending request{pendingRequests > 1 ? 's' : ''}.{' '}
                <button
                  onClick={() => navigate('/requests')}
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  View Requests →
                </button>
              </div>
            )}

            {/* Swap History */}
            <div>
              <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-white">Swap History</h3>
              {profile.swapHistory?.length ? (
                <ul className="space-y-3">
                  {profile.swapHistory.map((swap, i) => (
                    <li key={i} className="bg-gray-100 dark:bg-gray-700 p-3 rounded shadow">
                      <p>
                        Swapped <strong>{swap.skillOffered}</strong> for <strong>{swap.skillReceived}</strong>{' '}
                        with <span className="text-blue-600">@{swap.partner}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: {swap.status} • {new Date(swap.date).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No swaps completed yet.</p>
              )}
            </div>

            {/*  Endorsements */}
            <div>
              <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-white">Skill Endorsements</h3>
              {profile.endorsements?.length ? (
                <ul className="space-y-2">
                  {profile.endorsements.map((endorsement, i) => (
                    <li key={i} className="bg-green-100 dark:bg-green-700 p-3 rounded text-gray-700 dark:text-white">
                      <strong>{endorsement.skill}</strong> endorsed by <span className="text-blue-600">@{endorsement.from}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">You haven't received any endorsements yet.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  )
}

export default Dashboard
