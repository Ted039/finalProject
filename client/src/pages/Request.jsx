import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?._id;

  const fetchRequests = async () => {
    if (!token) {
      toast.error('Missing authentication token');
      return;
    }

    try {
      const res = await api.get('/swaps?status=pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error loading requests:', err);
      toast.error('Error loading requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleResponse = async (id, status, req) => {
    if (!token || !userId) {
      toast.error('Missing user credentials');
      return;
    }

    try {
      await api.put(`/swaps/${id}/respond`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Request ${status}`);

      if (status === 'approved') {
        const title = `Collab on ${req.offeredSkill}`;

        const projectPayload = {
          title,
          partnerId: req.fromUser?._id,
          skill: req.offeredSkill,
          swapId: id,
        };

        const response = await api.post('/projects/start', projectPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const newProject = response.data;
        toast.success('Project started');

        await api.post('/notifications/send', {
          recipientId: req.fromUser?._id,
          message: `Your swap request has been approved! A project titled "${title}" has just started.`,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem('newProjectStarted', 'true');
        navigate('/projects'); // Full workspace view
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error responding to swap:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold dark:text-white mb-4">Pending Swap Requests</h2>
      {loading ? (
        <p className="text-gray-500">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req._id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
              <p className="font-medium">{req.message}</p>
              <p className="text-sm text-gray-500">
                Requested by: {req.fromUser?.username || 'Unknown'} | Skill: {req.offeredSkill}
              </p>
              <p className="text-sm text-gray-500">Date: {new Date(req.date).toLocaleString()}</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleResponse(req._id, 'approved', req)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleResponse(req._id, 'declined', req)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Requests;
