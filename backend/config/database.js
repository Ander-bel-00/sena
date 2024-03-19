const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.database || "seep", 
    process.env.user || "Ander", process.env.password || "Ab%1234567", {
    host: process.env.host || "SG-bitter-cobweb-9346-8256-mysql-master.servers.mongodirector.com",
    dialect: process.env.DIALECT_DB || 'mysql',
    port: process.env.port || 3306
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully');
    } catch (err) {
        console.error('Unable to connect to database', err);
    }
}

module.exports = { sequelize, testConnection };
