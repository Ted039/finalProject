import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const sections = ['Profile Info', 'Account & Security', 'Preferences', 'Notifications']

const SettingsDashboard = () => {
  const [activeSection, setActiveSection] = useState('Profile Info')
  const [form, setForm] = useState({ username: '', email: '' })
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setForm({ username: res.data.username, email: res.data.email })
        if (res.data.avatar) setAvatarPreview(res.data.avatar)
      } catch (err) {
        setError('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('username', form.username)
    formData.append('email', form.email)
    if (avatarFile) formData.append('avatar', avatarFile)

    try {
      const token = localStorage.getItem('token')
      await api.put('/users/me/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('Profile updated.')
    } catch (err) {
      alert('Update failed.')
    }
  }

  const updatePassword = async (e) => {
    e.preventDefault()
    const { oldPassword, newPassword, confirmPassword } = passwords
    if (!oldPassword || !newPassword || !confirmPassword) return alert('Fill all fields.')
    if (newPassword.length < 6) return alert('Password must be at least 6 characters.')
    if (newPassword !== confirmPassword) return alert('Passwords do not match.')

    try {
      const token = localStorage.getItem('token')
      await api.put('/users/me/password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Password updated.')
    } catch (err) {
      alert('Password update failed.')
    }
  }

  if (loading) {
    return <div className="text-center mt-12 text-gray-700 dark:text-white">Loading settings...</div>
  }

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 shadow">
        <h2 className="text-lg font-bold mb-4 dark:text-white">Settings</h2>
        <ul className="space-y-3">
          {sections.map((section) => (
            <li key={section}>
              <button
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === section
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {section}
              </button>
              
            </li>
          ))}
        </ul>
      </aside>

      {/* Section Content */}
      <main className="flex-1 p-8 space-y-8">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">{activeSection}</h1>

        {activeSection === 'Profile Info' && (
          <form onSubmit={updateProfile} className="space-y-4">
            <div>
              <label className="block text-sm dark:text-white mb-1">Avatar</label>
              <input type="file" accept="image/*" onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700"
              />

              {avatarPreview && (
                <img src={avatarPreview} alt="Avatar" className="h-20 w-20 rounded-full mt-3" />
              )}
            </div>
            <input
              name="username"
              value={form.username}
              onChange={handleFormChange}
              placeholder="Username"
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="Email"
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
            />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Save Profile
            </button>
          </form>
        )}

        {activeSection === 'Account & Security' && (
          <form onSubmit={updatePassword} className="space-y-3">
            <input
              type="password"
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
            />
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
            />
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm New Password"
              className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Update Password
            </button>
          </form>
        )}

        {activeSection === 'Preferences' && (
          <div className="text-gray-700 dark:text-gray-300">
            Preferences section coming soon...
          </div>
        )}

        {activeSection === 'Notifications' && (
          <div className="text-gray-700 dark:text-gray-300">
            Notification settings will be added soon...
          </div>
        )}



        
      </main>
    </div>
  )
}

export default SettingsDashboard
