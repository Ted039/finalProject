import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const ProfileSettings = () => {
  const [form, setForm] = useState({ username: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setForm({ username: res.data.username, email: res.data.email })
        if (res.data.avatar) {
          setAvatarPreview(res.data.avatar)
        }
      } catch (err) {
        setError('Unable to load profile. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('username', form.username)
      formData.append('email', form.email)
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }

      await api.put('/users/me/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      alert('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data.message || 'Failed to update profile.')
      console.error(err)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    const { oldPassword, newPassword, confirmPassword } = passwords
    setError('')

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError('Please fill in all password fields.')
    }
    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters.')
    }
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.')
    }

    try {
      const token = localStorage.getItem('token')
      await api.put('/users/me/password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('Password updated successfully.')
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data.message || 'Failed to update password.')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-white">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white px-6 py-4 shadow flex justify-between">
        <h1 className="text-xl font-bold">SkillSwap</h1>
        <div className="space-x-6">
          <button onClick={() => navigate('/dashboard')} className="hover:underline">Dashboard</button>
          <button onClick={() => navigate('/discover')} className="hover:underline">Discover</button>
          <button onClick={() => navigate('/requests')} className="hover:underline">Requests</button>
          <button onClick={() => navigate('/profile')} className="hover:underline">Profile</button>
        </div>
      </nav>

      {/* Profile Settings */}
      <section className="max-w-2xl mx-auto mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-8">
        <h2 className="text-2xl font-bold text-center dark:text-white">Edit Profile</h2>

        {error && <p className="text-red-600 text-center text-sm">{error}</p>}

        {/* Profile Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-white mb-1">Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="w-full" />
            {avatarPreview && (
              <img src={avatarPreview} alt="Avatar Preview" className="mt-3 h-24 w-24 rounded-full object-cover" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-white mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-white mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Save Profile
          </button>
        </form>

        {/* Password Update Form */}
        <form onSubmit={handlePasswordChange} className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold dark:text-white">Change Password</h3>
          <input
            type="password"
            placeholder="Current password"
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Update Password
          </button>
        </form>
      </section>
    </div>
  )
}

export default ProfileSettings
