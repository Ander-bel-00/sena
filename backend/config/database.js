const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.JAWSDB_URL) {
  // Si la variable de entorno JAWSDB_URL está definida (como en Heroku), utiliza esa URL
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  // De lo contrario, usa la configuración local
  sequelize = new Sequelize("seep", "root", "root", {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection established successfully');
  } catch (err) {
    console.error('Unable to connect to database', err);
  }
}

module.exports = { sequelize, testConnection };
