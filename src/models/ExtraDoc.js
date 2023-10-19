const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ExtraDoc = sequelize.define('ExtraDoc', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    approved: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0
    }
});

module.exports = { ExtraDoc };