const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Comments = sequelize.define('Comments', {
    content: {
        type: DataTypes.TEXT
    }
});

module.exports = { Comments };