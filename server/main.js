require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Essential for Frontend connection
const sequelize = require('./config/db.js');
const authRoutes = require('./route/authRoute.js');
const models = require('./model/Linker.js'); 


const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 

const startApp = async () => {
    try {
        // 1. Authenticate with Render
        await sequelize.authenticate();
        console.log('✅ Connected to Online Postgres (Render)');

        // 2. Sync once on startup
        // This ensures the tables exist before the server starts accepting requests
        await sequelize.sync({ alter: true });
        console.log('✅ Database Schema Synced');

        const PORT = process.env.PORT || 5000; 
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Startup Fail: ', error.message);
    }
};

startApp();