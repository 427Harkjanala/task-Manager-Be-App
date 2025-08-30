const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Enable CORS for your frontend
app.use(cors({
    origin: 'http://localhost:5173', // React app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// ✅ Handle Preflight Requests (OPTIONS)
app.options('*', cors());

// Middleware to parse JSON
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);   // Use /api/auth for authentication
app.use('/api/tasks', taskRoutes);  // Use /api/tasks for tasks

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
