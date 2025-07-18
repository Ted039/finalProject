import { useState } from 'react';
import api from '../api/axios';

const SwapRequestForm = ({ toUserId, toUsername, onSuccess }) => {
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offeredSkill || !requestedSkill) {
      return alert('Fill in both skills');
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await api.post('/swaps', {
        toUserId,
        offeredSkill,
        requestedSkill,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess();
      alert(`Swap request sent to ${toUsername}`);
      setOfferedSkill('');
      setRequestedSkill('');
    } catch (err) {
      console.error('Request error:', err);
      alert('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input
        type="text"
        value={offeredSkill}
        onChange={(e) => setOfferedSkill(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder="Skill you're offering"
      />
      <input
        type="text"
        value={requestedSkill}
        onChange={(e) => setRequestedSkill(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        placeholder="Skill you want"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Swap Request'}
      </button>
    </form>
  );
};

export default SwapRequestForm;
