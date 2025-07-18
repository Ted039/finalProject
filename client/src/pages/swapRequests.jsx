import { useEffect, useState } from 'react';
import api from '../api/axios';

const SwapRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/swaps', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    };
    fetchRequests();
  }, []);

  const handleResponse = async (id, status) => {
    const token = localStorage.getItem('token');
    await api.put(`/swaps/${id}/respond`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
  };

  return (
    <div className="ml-64 max-w-3xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Swap Requests</h2>
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req._id} className="border p-4 rounded">
              <p><strong>{req.fromUser.username}</strong> offers <span className="font-bold">{req.offeredSkill}</span> for your <span className="font-bold">{req.requestedSkill}</span></p>
              {req.status === 'pending' ? (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleResponse(req._id, 'accepted')} className="px-3 py-1 bg-green-500 text-white rounded">Accept</button>
                  <button onClick={() => handleResponse(req._id, 'declined')} className="px-3 py-1 bg-red-500 text-white rounded">Decline</button>
                </div>
              ) : (
                <p>Status: <span className="font-semibold">{req.status}</span></p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SwapRequests;
