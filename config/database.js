const {Sequelize} = require('sequelize');
const debug = require('debug')('app:database');

const sequelize = new Sequelize('juntos', 'root', '1234', {
    host: '127.0.0.1',
    dialect: 'mariadb',
    port: 3306,
    logging: debug
});

module.exports = sequelize;