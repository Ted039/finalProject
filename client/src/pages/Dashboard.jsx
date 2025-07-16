import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Profile error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      setIsAdding(true);
      const token = localStorage.getItem('token');
      const res = await api.put('/users/me', { skill: newSkill }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setNewSkill('');
    } catch (err) {
      console.error('Add skill error:', err);
      alert('Failed to add skill');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading your dashboard...</div>;
  if (!profile) return <div className="text-center mt-10">Failed to load profile.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {profile.username}</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-600 mb-4">Email: {profile.email}</p>

      <h2 className="text-lg font-semibold mb-2">Your Skills</h2>
      <ul className="list-disc list-inside mb-4">
        {profile.skills.length > 0 ? (
          profile.skills.map((skill, i) => <li key={i}>{skill}</li>)
        ) : (
          <li>No skills listed yet</li>
        )}
      </ul>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Add a skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleAddSkill}
          disabled={isAdding}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isAdding ? 'Adding...' : 'Add Skill'}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
