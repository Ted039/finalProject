import { useEffect, useState } from 'react'
import socket from '@/socket'

const ChatRoom = ({ roomName = 'global', currentUser }) => {
  const [message, setMessage] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [members, setMembers] = useState([])
  const [typingUser, setTypingUser] = useState(null)


  useEffect(() => {
    socket.connect()
    socket.emit('join_room', {
      room: roomName,
      username: currentUser?.username || 'Anonymous'
    })

    socket.on('receive_message', (data) => {
      setChatLog((prev) => [...prev, data])
    })

    socket.on('room_members', (users) => {
      setMembers(users)
    })

    return () => {
      socket.disconnect()
      socket.off('receive_message')
      socket.off('room_members')
    }
  }, [roomName, currentUser])

  const sendMessage = () => {
    if (!message.trim()) return
    socket.emit('send_message', {
      room: roomName,
      message,
      sender: currentUser?.username || 'Anonymous'
    })
    setMessage('')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded shadow">
      {/* Chat Section */}
      <div className="col-span-2">
        <h3 className="mb-2 font-semibold">Room: {roomName}</h3>
        <div className="h-48 overflow-y-auto bg-gray-100 p-2 mb-3 rounded">
          {chatLog.map((msg, i) => (
            <p key={i}>
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border rounded w-full mb-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      {/* Member Section */}
      <div className="bg-gray-50 border p-3 rounded">
        <h4 className="font-bold mb-2">Members Online</h4>
        <ul className="space-y-1">
          {members.map((user, i) => (
            <li key={i} className="text-sm text-gray-800">
              • {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ChatRoom
