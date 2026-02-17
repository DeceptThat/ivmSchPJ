const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('notification', {
    notif_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,  // ONLY THIS ONE
        autoIncrement: true
    },
    message: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    }
}, { 
    tableName: 'notifications', 
    timestamps: true 
});

module.exports = Notification;