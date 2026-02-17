const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Item = sequelize.define('Item', {
    item_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    sku: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    item_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    category: { type: DataTypes.STRING },
    sub_category: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(10, 2) },
    stock_quantity: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    // --- THE FIX: Adding the column to track the supplier ---
    last_supplier: { 
        type: DataTypes.STRING, 
        allowNull: true 
    }
}, { 
    tableName: 'items', 
    timestamps: false 
});

module.exports = Item;