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
    }
},{
    sequelize,
    modelName: 'Documentos'
});


module.exports = Documentos;