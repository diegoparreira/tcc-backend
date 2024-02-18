// Importing necessary dependencies
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

// Defining the Category model
const Category = sequelize.define("Category", {
  // Defining the model fields
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "O nome da categoria não pode estar vazio.",
      },
    },
  },
  color: {
    type: DataTypes.STRING,
    validate: {
      is: {
        args: /^#([0-9a-f]{3}){1,2}$/i,
        msg: "A cor deve ser um valor hexadecimal válido.",
      },
    },
  },
  active: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    validate: {
      isIn: {
        args: [[0, 1]],
        msg: "O valor ativo deve ser 0 (inativo) ou 1 (ativo).",
      },
    },
  },
});

// Exporting the Category model
module.exports = Category;
