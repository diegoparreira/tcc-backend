const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const _CONTENT = require('../../data/content.json');

const Content = sequelize.define('Content', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('video', 'pdf'),
    allowNull: false
  },
  approved: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
  }
});

const createContentData = async () => {
  await Content.bulkCreate(_CONTENT)
  .then(users => {
    console.log('Successful created data');
    console.log(users);
  })
  .catch(error => {
    console.log('Error when creating data: ' + error);
  });
}

module.exports = { Content, createContentData };