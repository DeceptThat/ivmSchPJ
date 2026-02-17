const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Movement = sequelize.define('Movement', {
    movement_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sku: { type: DataTypes.STRING, allowNull: false },
    staff_id: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING }, // IN, SOLD, DAMAGED, etc.
    quantity: { type: DataTypes.INTEGER },
    expire_date: { type: DataTypes.DATEONLY, allowNull: true },
    ref_no: { type: DataTypes.STRING },
    // --- THE MISSING PIECE ---
    supplier_name: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'movements', timestamps: false });

module.exports = Movement;