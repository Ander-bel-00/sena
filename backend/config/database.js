// Importar el ORM sequelize.
const { Sequelize } = require('sequelize');

// Conectarse a la base de datos (nombre base de datos, usaurio, contraseña).
const sequelize = new  Sequelize("seep","root","root",{
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

// Confirmar que se ha estacblecido la conexión con la base de datos corectamente.
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection established successfully');
    }
    catch(err){
        // En caso de eror en la conexión envía detalles del error por pantalla.
        console.err('Unable to connect to database', err);
    }
}

// Exportar para poder utilizar la base de datos.
module.exports = { sequelize, testConnection};