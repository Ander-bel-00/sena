const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.DB_NAME || "seep", 
process.env.USER_DB || "root", process.env.PASSWORD_DB || "root", {
  host: process.env.HOST_NAME || "localhost",
  dialect: process.env.DIALECT_DB || 'mysql',
  port: process.env.PORTDB || 3306
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
