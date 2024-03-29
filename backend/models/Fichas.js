const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Instructor = require('../models/Instructor');


// Crear modelo de fichas para crear la tabla en la base de datos.

const Fichas = sequelize.define('Fichas', {
    id_ficha: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    numero_ficha: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    programa_formacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nivel_formacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    titulo_obtenido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_fin_lectiva: {
        type: DataTypes.DATE,
        allowNull: false,
    },

},{
    sequelize,
    modelName: 'Fichas'
});


module.exports = Fichas;