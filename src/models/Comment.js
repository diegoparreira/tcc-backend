const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT
    },
    approved: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0
    }
});

module.exports = { Comment };