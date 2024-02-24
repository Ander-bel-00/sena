const { Sequelize } = require('sequelize');

// Obtener la URL de conexión de JawsDB desde las variables de entorno de Heroku
const jawsdbUrl = process.env.JAWSDB_URL;

// Crear una instancia de Sequelize usando la URL de conexión
const sequelize = new Sequelize(jawsdbUrl, {
  dialect: 'mysql'
});

// Función para probar la conexión
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully');
    } catch(err) {
        console.error('Unable to connect to database', err);
    }
}

module.exports = { sequelize, testConnection };
