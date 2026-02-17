const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Supplier = sequelize.define('Supplier', {
    supplier_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    supplier_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    // Split contact_info into specific fields as requested
    email: { 
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: true } // Ensures valid email format
    },
    phone: { 
        type: DataTypes.STRING,
        allowNull: true 
    }
}, { 
    tableName: 'suppliers', 
    timestamps: false 
});

module.exports = Supplier;