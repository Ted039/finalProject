import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const ProfileSettings = () => {
  const [form, setForm] = useState({ username: '', email: '' })
  const [loading, setLoading] = useState(true)
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
        console.error('Profile fetch failed:', err)
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

      alert('Profile updated!')
    } catch (err) {
      console.error('Profile update failed:', err)
      alert('Failed to update profile')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    const { oldPassword, newPassword, confirmPassword } = passwords

    if (!oldPassword || !newPassword || !confirmPassword) {
      return alert('Please fill out all password fields')
    }
    if (newPassword.length < 6) {
      return alert('New password must be at least 6 characters')
    }
    if (newPassword !== confirmPassword) {
      return alert('Passwords do not match')
    }

    try {
      const token = localStorage.getItem('token')
      await api.put('/users/me/password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Password updated!')
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      console.error('Password update failed:', err)
      alert('Failed to update password')
    }
  }

  if (loading) return <div className="ml-64 text-center mt-10">Loading profile...</div>

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

      {/* Profile Settings */}
      <div className="ml-64 max-w-xl mx-auto mt-12 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Profile Settings</h2>

        {/* Update Username, Email, Avatar */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block font-semibold dark:text-white">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full"
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="h-24 w-24 rounded-full object-cover mt-2"
              />
            )}
          </div>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded dark:bg-gray-900 dark:text-white"
            placeholder="Username"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded dark:bg-gray-900 dark:text-white"
            placeholder="Email"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>

        {/* Update Password */}
        <form onSubmit={handlePasswordChange} className="space-y-4 mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold dark:text-white">Change Password</h3>
          <input
            type="password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, oldPassword: e.target.value }))}
            className="w-full border px-3 py-2 rounded dark:bg-gray-900 dark:text-white"
            placeholder="Current password"
          />
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
            className="w-full border px-3 py-2 rounded dark:bg-gray-900 dark:text-white"
            placeholder="New password"
          />
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full border px-3 py-2 rounded dark:bg-gray-900 dark:text-white"
            placeholder="Confirm new password"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileSettings
