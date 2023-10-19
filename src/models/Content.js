const { DataTypes, Model } = require('sequelize');
const _CONTENT = require('../../data/content.json');

class Content extends Model {
  static associate(models){
    console.log('Debugando associate');
    console.log('model');
    console.log(model);
    // this.belongsTo(models.User, { as: 'userRef', foreignKey: 'userId'});
  }

  static init(sequelize){
    super.init(
      {
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
      },
      {
        sequelize,
        modelName: 'Contents'
      }
    );
  }

  static createContentData = async () => {
    await this.bulkCreate(_CONTENT)
    .then(users => {
      console.log('Successful created data');
      console.log(users);
    })
    .catch(error => {
      console.log('Error when creating data: ' + error);
    });
  }
}


module.exports = Content;