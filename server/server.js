import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import swapRoutes from './routes/swapRoutes.js'

dotenv.config()
connectDB()

const app = express()
const server = http.createServer(app)

const allowedOrigins = [
  'http://localhost:5173',
  'https://skillswap-omega-eight.vercel.app'
]

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())

//  API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/swaps', swapRoutes)
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
  res.send('SkillSwap API is running...')
})

//  Error handler
app.use((err, req, res, next) => {
  console.error(' Server error:', err.stack)
  res.status(500).json({ message: 'Internal Server Error' })
})

// Track socket connections
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
})

let onlineUsers = {}

io.on('connection', (socket) => {
  console.log(' Connected:', socket.id)

  //  User joins a public room
  socket.on('join_room', ({ room, username }) => {
    socket.join(room)
    onlineUsers[socket.id] = { username, room }

    //  Typing in public room
    socket.on('typing', ({ room, username }) => {
      socket.to(room).emit('user_typing', username)
    })

    //  Broadcast members of the room
    const members = Object.values(onlineUsers).filter(u => u.room === room)
    io.to(room).emit('room_members', members)
    console.log(` ${username} joined room: ${room}`)
  })

  //  Public room message
  socket.on('send_message', ({ room, message, sender }) => {
    if (room && message) {
      io.to(room).emit('receive_message', { message, sender })
    }
  })

  //  Private DM join
  socket.on('join_dm', ({ senderId, receiverId, username }) => {
    const room = [senderId, receiverId].sort().join('_')
    socket.join(room)
    onlineUsers[socket.id] = { username, room }

    const members = Object.values(onlineUsers).filter(u => u.room === room)
    io.to(room).emit('room_members', members)
    console.log(` ${username} joined DM: ${room}`)
  })

  //  Private DM message
  socket.on('send_dm', ({ senderId, receiverId, message, sender }) => {
    const room = [senderId, receiverId].sort().join('_')
    if (message) {
      io.to(room).emit('receive_dm', { message, sender })
    }
  })

  //  Typing in private DM
  socket.on('typing_dm', ({ room, username }) => {
    socket.to(room).emit('user_typing_dm', username)
  })

  //  Disconnect
  socket.on('disconnect', () => {
    const user = onlineUsers[socket.id]
    delete onlineUsers[socket.id]

    if (user?.room) {
      const members = Object.values(onlineUsers).filter(u => u.room === user.room)
      io.to(user.room).emit('room_members', members)
      console.log(` ${user.username} left ${user.room}`)
    } else {
      console.log(` Socket ${socket.id} disconnected`)
    }
  })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` SkillSwap server live on port ${PORT}`);
});
