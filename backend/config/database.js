const { Sequelize } = require('sequelize');


const sequelize = new Sequelize("seep", "root", "root", {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
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
