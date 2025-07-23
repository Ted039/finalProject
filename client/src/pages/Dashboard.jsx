import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import SuggestedMatches from '../components/SuggestedMatches';
import MainLayout from '../components/MainLayout';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [profileRes, swapRes] = await Promise.all([
          api.get('/users/me', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/swaps?status=pending', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setProfile(profileRes.data);
        setPendingRequests(swapRes.data.length);
      } catch (err) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const getSkillLevel = (skills = []) =>
    skills.length >= 6 ? 'advanced' : skills.length >= 3 ? 'intermediate' : 'beginner';

  const skillLevel = profile ? getSkillLevel(profile.skills) : 'beginner';

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
      toast.success('Skill added');
    } catch (err) {
      toast.error('Failed to add skill');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.put('/users/me/skills/remove', { skill: skillToRemove }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      toast.success(`Removed skill: ${skillToRemove}`);
    } catch (err) {
      toast.error('Failed to remove skill');
    }
  };

  if (loading) return (
    <MainLayout>
      <div className="text-center mt-10">Loading your dashboard...</div>
    </MainLayout>
  );
  if (!profile) return (
    <MainLayout>
      <div className="text-center mt-10">Failed to load profile.</div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-gray-800 p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              Welcome, {profile.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Email: {profile.email}</p>
          </div>

          {/* Avatar */}
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              className={`w-20 h-20 rounded-full object-cover ${
                skillLevel === 'advanced'
                  ? 'border-4 border-yellow-400'
                  : skillLevel === 'intermediate'
                  ? 'border-2 border-blue-500'
                  : 'border border-gray-300'
              }`}
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-xl font-semibold">
              {profile.username.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* 🔔 Notification Badge */}
        <div className="mb-6">
          {pendingRequests > 0 ? (
            <div className="flex items-center gap-2 text-sm text-red-600">
              {pendingRequests > 1 ? 's' : ''}. <button
                onClick={() => navigate('/requests')}
                className="underline text-blue-600 hover:text-blue-800"
              >
              
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500"></div>
          )}
        </div>

        {/* Suggested Matches */}
        <SuggestedMatches skills={profile.skills} currentUserId={profile._id} />


        {/* Skills */}
        <h2 className="text-lg font-semibold mb-2 dark:text-white">Your Skills</h2>
        {profile.skills.length > 0 ? (
          <ul className="space-y-2 mb-6">
            {profile.skills.map((skill, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded"
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
          <p className="text-gray-500 mb-4">No skills listed yet.</p>
        )}

        {/* Add Skill Form */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 border px-3 py-2 rounded dark:bg-gray-900 dark:text-white"
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
    </MainLayout>
  );
};

export default Dashboard;
