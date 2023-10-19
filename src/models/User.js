const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const {Content} = require('./Content');

const _USERS = require('../../data/users.json');

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
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        args: true,
        msg: "Error: enter a valid email."
      }
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
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

User.hasMany(Content);
Content.belongsTo(User);

const createUserData = async () => {
  await User.bulkCreate(_USERS)
  .then(users => {
    console.log('Successful created data');
    console.log(users);
  })
  .catch(error => {
    console.log('Error when creating data: ' + error);
  });
}

module.exports = {User, createUserData};