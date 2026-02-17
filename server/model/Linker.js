const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// --- 1. IMPORT ALL MODELS FROM THEIR FILES ---
// Do not define models here. Just require the files.
const Notification = require('./Notification.js'); 
const Staff = require('./Staff.js');
const Item = require('./Item.js');
const Sale = require('./Sale.js');
const Supplier = require('./Supplier.js');
const Movement = require('./Movement.js');
const Schedule = require('./Schedule.js');

// --- 2. RELATIONSHIPS ---
// Standard links between your existing tables
Staff.hasMany(Sale, { foreignKey: 'staff_id' });
Sale.belongsTo(Staff, { foreignKey: 'staff_id' });

Staff.hasMany(Movement, { foreignKey: 'staff_id' });
Movement.belongsTo(Staff, { foreignKey: 'staff_id' });

Item.hasMany(Movement, { foreignKey: 'sku', sourceKey: 'sku' });
Movement.belongsTo(Item, { foreignKey: 'sku', targetKey: 'sku' });

Staff.hasMany(Schedule, { foreignKey: 'staff_id' });
Schedule.belongsTo(Staff, { foreignKey: 'staff_id' });

// --- 3. EXPORT BLOCK ---
module.exports = { 
    Staff, 
    Item, 
    Movement, 
    Schedule, 
    Supplier, 
    Sale, 
    Notification, // Now it exports the file-based model correctly
    sequelize 
};