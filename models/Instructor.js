const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');


// Crear el modelo aprendiz con el que se creará la tabla con los campos necesarios.
const Instructor = sequelize.define('Instructores', {
    id_instructor:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    numero_documento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: {
            len: {
                args: [7,10],
                msg: 'El número de documento debe ser de 7 a 10 dígitos'
            }
        }
    },
    tipo_documento: {
        type: DataTypes.STRING,
        allowNull: false,
    },

},{
    sequelize,
    modelName: 'Instructores'
});




// Exportar el modelo para permitir su uso.
module.exports = Instructor;