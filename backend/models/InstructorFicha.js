const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Fichas = require('../models/Fichas');

const InstructorFicha = sequelize.define('InstructorFicha', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});

module.exports = InstructorFicha;
