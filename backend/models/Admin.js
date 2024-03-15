const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Admin = sequelize.define('Admin', {
    numero_documento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    nombres:{
        type: DataTypes.STRING,
        allowNull: false
    },
    rol_usuario:{
        type: DataTypes.STRING,
        allowNull: false
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
});

module.exports = Admin;
