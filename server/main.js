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
        await sequelize.authenticate();
        console.log('✅ Connected to Postgres');

        // Initial Sync
        await sequelize.sync({ alter: true });
        console.log('✅ Database Initialized');

        // --- THE AUTO-RESYNC LOOP ---
        // This runs every 30 seconds without stopping the server
        setInterval(async () => {
            try {
                await sequelize.sync({ alter: true });
                console.log('🔄 30s Auto-Resync: Database schema is up to date.');
            } catch (err) {
                console.error('❌ Auto-Resync Failed:', err.message);
            }
        }, 30000); // 30,000 milliseconds = 30 seconds

        const PORT = process.env.PORT || 5000; 
        app.listen(PORT, () => {
            console.log(`🚀 Server: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Fail: ', error.message);
    }
};

startApp();