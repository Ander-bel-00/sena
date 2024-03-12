const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Fichas = require('../models/Fichas');
const InstructorFicha = require('./InstructorFicha');


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
    nombres: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo_electronico: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numero_celular1: {
        type: DataTypes.STRING,  
        allowNull: false,
        validate: {
            len: {
                args: [10,10],
                msg: 'El número de celular debe tener 10 dígitos'
            }
        }
    },
    numero_celular2: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [10,10],
                msg: 'El número de celular debe tener 10 dígitos'
            }
        }
    },
    fichas_asignadas: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const value = this.getDataValue('fichas_asignadas');
            return value ? value.split(',') : [];
        },
        set(val) {
            this.setDataValue('fichas_asignadas', val.join(','));
        }
    },
    rol_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },

},{
    sequelize,
    modelName: 'Instructores'
});


module.exports = Instructor;