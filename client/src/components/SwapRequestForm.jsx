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
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!offeredSkill || !requestedSkill || !message || !date) {
      toast.error('Please fill out all fields')
      return
    }

    setSubmitting(true)
    const token = localStorage.getItem('token')
    const payload = { toUserId, offeredSkill, requestedSkill, message, date }

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
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-5 p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
        Request a Skill Swap with <span className="text-blue-600">{toUsername}</span>
      </h4>

      <div className="space-y-3">
        <label className="block text-sm text-gray-700 dark:text-white">
          Skill you're offering<span className="text-red-500 ml-1">*</span>
          <input
            type="text"
            value={offeredSkill}
            onChange={(e) => setOfferedSkill(e.target.value)}
            maxLength={50}
            required
            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
          />
        </label>

        <label className="block text-sm text-gray-700 dark:text-white">
          Skill you want<span className="text-red-500 ml-1">*</span>
          <input
            type="text"
            value={requestedSkill}
            onChange={(e) => setRequestedSkill(e.target.value)}
            maxLength={50}
            required
            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
          />
        </label>

        <label className="block text-sm text-gray-700 dark:text-white">
          Message<span className="text-red-500 ml-1">*</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={250}
            required
            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
            placeholder="Tell them why you're interested in this exchange..."
          />
        </label>

        <label className="block text-sm text-gray-700 dark:text-white">
          Proposed Date & Time<span className="text-red-500 ml-1">*</span>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Choose a date"
            required
            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-2 px-4 rounded-md font-medium transition ${
          submitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {submitting ? 'Sending...' : 'Send Swap Request'}
      </button>
    </form>
  )
}

export default SwapRequestForm
