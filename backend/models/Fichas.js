const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Crear modelo de fichas para crear la tabla en la base de datos.

const Fichas = sequelize.define('Fichas', {
    id_ficha: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },

});