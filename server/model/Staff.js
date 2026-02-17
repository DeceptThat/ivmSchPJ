const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const Staff = sequelize.define('Staff', {
    staff_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    staff_name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'User' } // Admin or User
}, { tableName: 'staff', timestamps: false });

module.exports = Staff;