import { useState, useEffect } from 'react';
import api from '../api/axios';

const ProfileSettings = () => {
  const [form, setForm] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({ username: res.data.username, email: res.data.email });
      } catch (err) {
        console.error('Profile fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.put('/users/me/profile', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated!');
    } catch (err) {
      console.error('Profile update failed:', err);
      alert('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return alert('Please fill out all password fields');
    }
    if (newPassword.length < 6) {
      return alert('New password must be at least 6 characters');
    }
    if (newPassword !== confirmPassword) {
      return alert('Passwords do not match');
    }

    try {
      const token = localStorage.getItem('token');
      await api.put('/users/me/password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Password updated!');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password update failed:', err);
      alert('Failed to update password');
    }
  };

  if (loading) return <div className="ml-64 text-center mt-10">Loading profile...</div>;

  return (
    <div className="ml-64 max-w-xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      {/* Update Username & Email */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          placeholder="Username"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
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
        <h3 className="text-lg font-semibold">Change Password</h3>
        <input
          type="password"
          name="oldPassword"
          value={passwords.oldPassword}
          onChange={(e) =>
            setPasswords((prev) => ({ ...prev, oldPassword: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="Current password"
        />
        <input
          type="password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
          placeholder="New password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={(e) =>
            setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
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
  );
};

export default ProfileSettings;
