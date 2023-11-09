require('dotenv').config();
const {Sequelize} = require('sequelize');
const { DATABASE, USER, PASSWORD, HOST, DIALECT, DATABASE_PORT } = process.env; 

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
    host: HOST,
    dialect: DIALECT,
    port: DATABASE_PORT
});

module.exports = sequelize;