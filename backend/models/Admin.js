// Admin.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Admin = sequelize.define('Admin', {
    id_admin:{
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
        allowNull: false,
        validate: {
            // Función de validación personalizada para la contraseña
            validarContrasena(value) {
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}/.test(value)) {
                    throw new Error('La contraseña debe tener al menos 8 caracteres, incluir al menos una mayúscula, una minúscula, un carácter especial y cinco números.');
                }
            },
        }
    }
},{
    sequelize,
    modelName: 'Admin'
});

module.exports = Admin;
