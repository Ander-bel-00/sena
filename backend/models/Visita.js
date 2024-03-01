// Event.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Visita = sequelize.define('Visita', {
    id_visita:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    tipo_visita: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false
    },
    aprendiz:{
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Visita;
