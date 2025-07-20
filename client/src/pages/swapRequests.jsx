import { useState } from 'react';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../api/axios';

const SwapRequest = ({ targetUser, skills = ['Web Development', 'Python', 'UI Design'], onRequestSent }) => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [swapTime, setSwapTime] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkill || !message || !swapTime) {
      toast.error('Please fill out all fields');
      return;
    }

    const token = localStorage.getItem('token');
    const payload = {
      toUser: targetUser?._id,
      offeredSkill: selectedSkill,
      message,
      date: swapTime,
    };

    toast.promise(
      api.post('/api/swaps/request', payload, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      {
        loading: 'Sending swap request...',
        success: 'Request sent successfully!',
        error: 'Failed to send request',
      }
    ).then(() => {
      setSelectedSkill('');
      setMessage('');
      setSwapTime(null);
      onRequestSent?.(); // optional callback
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        Request Skill Swap with {targetUser?.name || 'User'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Skill Selection */}
        <div>
          <label htmlFor="skill" className="block mb-2 text-gray-700 dark:text-gray-200">Choose Skill</label>
          <select
            id="skill"
            name="skill"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a skill</option>
            {skills.map((skill, idx) => (
              <option key={idx} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block mb-2 text-gray-700 dark:text-gray-200">Message</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Explain what you'd like to learn or offer..."
            rows={3}
            className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Date Picker */}
        <div>
          <label htmlFor="swapTime" className="block mb-2 text-gray-700 dark:text-gray-200">Preferred Swap Time</label>
          <DatePicker
            id="swapTime"
            selected={swapTime}
            onChange={setSwapTime}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select date and time"
            className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send Request
        </button>
      </form>
    </div>
  );
};

export default SwapRequest;
