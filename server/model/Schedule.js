const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Schedule = sequelize.define('Schedule', {
    sched_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    staff_name: { type: DataTypes.STRING, allowNull: false },
    shift: { type: DataTypes.STRING, allowNull: false }, // e.g., Morning, Afternoon, Night
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' } // Pending, Completed
}, { tableName: 'schedules', timestamps: false });

module.exports = Schedule;