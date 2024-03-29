const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { Content } = require('./Content');
const { ExtraDoc } = require('./ExtraDoc');
const { Comment } = require('./Comment');
const { Answer } = require('./Answer');
const { Category } = require('./Category');

const User = sequelize.define('User', {
  fullName: {
    type: DataTypes.STRING,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 30],
        msg: "Error: Name must has 3 charactes and maximun 100."
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 30],
        msg: "Error: Name must has 3 charactes and maximun 100."
      }
    }
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        args: true,
        msg: "Error: enter a valid email."
      }
    }
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthdate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        args: true,
        msg: "Error: enter a valid date."
      }
    }
  },
  type: {
    type: DataTypes.ENUM('admin', 'mentor', 'student'),
    defaultValue: 'student'
  },
  mentor_flag: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0
  },
  avatar: {
    type: DataTypes.STRING(2048),
    defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png'
  }
}, {
  hooks: {
    beforeCreate: (user) => {
      console.log('Entrou no hook do create');
      console.log(user.firstName);
      console.log(user.lastName);
      user.fullName = `${user.firstName} ${user.lastName}`;
    },
    beforeBulkCreate: (users) => {
      console.log('Entrou no hook do create');
      users.map(user => {
        console.log(user.firstName);
        console.log(user.lastName);
        user.fullName = `${user.firstName} ${user.lastName}`;
      })
    }
  }
});

User.hasMany(Content, {onDelete: 'cascade'});
User.hasMany(ExtraDoc, {onDelete: 'cascade'});
User.hasMany(Comment, {onDelete: 'cascade'});
User.hasMany(Answer, {onDelete: 'cascade'});
User.hasMany(Category, {onDelete: 'cascade'});

Content.belongsTo(User, {foreignKey: {allowNull: false}});
Content.belongsTo(Category, {foreignKey: {allowNull: false}});
Content.hasMany(Comment, {onDelete: 'cascade'});
Content.hasMany(ExtraDoc, {onDelete: 'cascade'});

ExtraDoc.belongsTo(User, {foreignKey: {allowNull: false}});

Comment.belongsTo(User, {foreignKey: {allowNull: false}});
Comment.belongsTo(Content, {foreignKey: {allowNull: false}});
Comment.hasMany(Answer, {onDelete: 'cascade'});

Answer.belongsTo(User, {foreignKey: {allowNull: false}});
Answer.belongsTo(Comment, {foreignKey: {allowNull: false}});

Category.belongsTo(User, {foreignKey: {allowNull: false}});
Category.hasMany(Content, {onDelete: 'cascade'});

module.exports = {User};