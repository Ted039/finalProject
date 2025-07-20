import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../api/axios'

function Requests() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    api
      .get('/swaps?status=pending', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRequests(res.data))
      .catch(() => toast.error('Error loading requests'))
  }, [])

  const handleResponse = async (id, status) => {
    const token = localStorage.getItem('token')
    try {
      await api.put(`/swaps/${id}/respond`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success(`Request ${status}`)
      setRequests((prev) => prev.filter((r) => r._id !== id))
    } catch (err) {
      toast.error(`Failed to ${status} request`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold dark:text-white mb-4">Pending Swap Requests</h2>
      {requests.length === 0 ? (
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
                  onClick={() => handleResponse(req._id, 'approved')}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleResponse(req._id, 'declined')}
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
  )
}

export default Requests
