// Importing necessary dependencies
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

// Defining the User model
const User = sequelize.define('User', {
  // Defining the model fields
  fullName: {
    type: DataTypes.STRING,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 30],
        msg: "O nome deve ter entre 3 e 30 caracteres."
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 30],
        msg: "O sobrenome deve ter entre 3 e 30 caracteres."
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
        msg: "Insira um email válido."
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
        msg: "Insira uma data válida."
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
  // Defining the model hooks
  hooks: {
    beforeCreate: (user) => {
      // Concatenating first name and last name to create full name
      user.fullName = `${user.firstName} ${user.lastName}`;
    },
    beforeBulkCreate: (users) => {
      users.map(user => {
        // Concatenating first name and last name to create full name for each user
        user.fullName = `${user.firstName} ${user.lastName}`;
      })
    }
  }
});

// Exporting the User model
module.exports = User;