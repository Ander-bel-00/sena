const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');


// Crear modelo de documentos para crear la tabla en la base de datos.

const Documentos = sequelize.define('Documentos', {
    id_documento: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    tipo_documento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    archivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_aprendiz: {
        type: DataTypes.UUID,
        allowNull: false
    },
    numero_documento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            len: {
                args: [7,10],
                msg: 'El número de documento debe ser de 7 a 10 dígitos'
            }
        }
    },
    nombres: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numero_ficha: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    programa_formacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    sequelize,
    modelName: 'Documentos'
});


module.exports = Documentos;