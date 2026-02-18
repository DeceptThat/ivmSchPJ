const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'ivm_app',                          // Database Name
    'hladies',                          // User
    '8L45GMYmyf0yRJSVvYzrsldfggdwTRzg', // Password
    {
        host: 'dpg-d6aj3jp5pdvs73ep9570-a.singapore-postgres.render.com', // External Host
        port: 5432,
        dialect: 'postgres',
        logging: false,
        // --- REQUIRED FOR RENDER CLOUD ---
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // This allows the secure connection to Render
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

module.exports = sequelize;