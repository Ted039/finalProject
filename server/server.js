import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import swapRoutes from './routes/swapRoutes.js';


dotenv.config();
const app = express();

connectDB();
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/uploads', express.static('uploads'));
app.use('/api/swaps', swapRoutes);



app.get('/', (req, res) => {
  res.send('SkillSwap API is running...');
});

app.use((err, req, res, next) => {
  console.error('💥', err.stack);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
