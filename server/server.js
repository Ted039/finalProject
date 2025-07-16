import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'

dotenv.config()
const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected')
  app.listen(5000, () => console.log('Server running on port 5000'))
})

app.use('/api/users', userRoutes)
