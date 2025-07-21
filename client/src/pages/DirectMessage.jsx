import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import socket from '@/socket'

const DirectMessage = () => {
  const { receiverId } = useParams()
  const { user } = useAuth()

  const senderId = user?._id
  const username = user?.username || 'Anonymous'
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [typingUser, setTypingUser] = useState(null)

  const room = senderId && receiverId ? [senderId, receiverId].sort().join('_') : null

  useEffect(() => {
    if (!room || !username) return

    socket.connect()
    socket.emit('join_dm', { senderId, receiverId, username })

    socket.on('receive_dm', (data) => {
      setChatLog((prev) => [...prev, data])
    })

    socket.on('user_typing_dm', (name) => {
      setTypingUser(name)
      setTimeout(() => setTypingUser(null), 1500)
    })

    return () => {
      socket.disconnect()
      socket.off('receive_dm')
      socket.off('user_typing_dm')
    }
  }, [room, senderId, receiverId, username])

  const sendMessage = () => {
    if (!message.trim() || !senderId || !receiverId) return
    socket.emit('send_dm', {
      senderId,
      receiverId,
      message,
      sender: username
    })
    setMessage('')
  }

  const handleTyping = () => {
    if (room && username) {
      socket.emit('typing_dm', {
        room,
        username
      })
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 border rounded shadow bg-white dark:bg-gray-800 dark:text-white">
      <h3 className="mb-2 font-semibold">Private Chat</h3>
      <div className="h-48 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-2 mb-3 rounded">
        {chatLog.map((msg, i) => (
          <p key={i}>
            <strong>{msg.sender}:</strong> {msg.message}
          </p>
        ))}
      </div>
      {typingUser && (
        <p className="text-sm text-gray-500 dark:text-gray-300 italic">
          {typingUser} is typing...
        </p>
      )}
      <input
        type="text"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
          handleTyping()
        }}
        className="p-2 border rounded w-full mb-2 dark:bg-gray-900"
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Send
      </button>
    </div>
  )
}

export default DirectMessage
