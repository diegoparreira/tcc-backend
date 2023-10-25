const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        // Check how do only hex values
    },
    active: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    }
});

module.exports = { Category };