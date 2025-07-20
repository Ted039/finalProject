import { useState } from 'react'
import { toast } from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import api from '../api/axios'

const SwapRequestForm = ({ toUserId, toUsername, onSuccess }) => {
  const [offeredSkill, setOfferedSkill] = useState('')
  const [requestedSkill, setRequestedSkill] = useState('')
  const [message, setMessage] = useState('')
  const [date, setDate] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!offeredSkill || !requestedSkill || !message || !date) {
      toast.error('Please fill out all fields')
      return
    }

    const token = localStorage.getItem('token')
    const payload = {
      toUserId,
      offeredSkill,
      requestedSkill,
      message,
      date,
    }

    try {
      await api.post('/swaps/request', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Swap request sent!')
      setOfferedSkill('')
      setRequestedSkill('')
      setMessage('')
      setDate(null)
      onSuccess?.()
    } catch (err) {
      toast.error('Failed to send request')
      console.error('Request error:', err.response?.data || err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4">
      <h4 className="font-semibold mb-2">Send Swap Request to {toUsername}</h4>

      <input
        type="text"
        placeholder="Skill you're offering"
        value={offeredSkill}
        onChange={(e) => setOfferedSkill(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      <input
        type="text"
        placeholder="Skill you want"
        value={requestedSkill}
        onChange={(e) => setRequestedSkill(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-3 py-2 border rounded"
        rows={3}
      />

      <DatePicker
        selected={date}
        onChange={(d) => setDate(d)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText="Select swap date"
        className="w-full px-3 py-2 border rounded"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Send Swap Request
      </button>
    </form>
  )
}

export default SwapRequestForm
