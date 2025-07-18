import { useEffect, useState } from 'react';
import api from '../api/axios';
import SwapRequestForm from '../components/SwapRequestForm.jsx';

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  const allCategories = ['Design', 'Tech', 'Communication', 'Fitness', 'Business'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/users/others', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Could not load members. Please try again.');
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.skills?.join(',').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryFiltered = selectedCategory
    ? filteredUsers.filter((user) => user.categories?.includes(selectedCategory))
    : filteredUsers;

  return (
    <div className="ml-64 max-w-5xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Discover Members</h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search skills or usernames..."
        className="w-full mb-4 px-4 py-2 border rounded"
      />

      {/* 🎯 Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allCategories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded ${
              selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ⚠️ Error Handling */}
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryFiltered.length > 0 ? (
            categoryFiltered.map((user) => (
              <div key={user._id} className="border rounded p-4 shadow-sm">
                <div className="flex items-center gap-4 mb-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center font-bold text-xl">
                      {user.username
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-sm text-gray-600">
                      Skills: {user.skills?.join(', ') || 'None listed'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Categories: {user.categories?.join(', ') || 'Uncategorized'}
                    </p>
                  </div>
                </div>

                {/* 🔁 Swap Request Form */}
                <SwapRequestForm
                  toUserId={user._id}
                  toUsername={user.username}
                  onSuccess={() => console.log('Swap sent')}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No matching members found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Discover;
