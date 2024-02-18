// Importing necessary dependencies
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

// Defining the Answer model
const Answer = sequelize.define("Answer", {
  // Defining the model fields
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "O conteúdo da resposta não pode estar vazio.",
      },
    },
  },
  approved: {
    type: DataTypes.TINYINT(1),
    defaultValue: 0,
    validate: {
      isIn: {
        args: [[0, 1]],
        msg: "O valor aprovado deve ser 0 (não aprovado) ou 1 (aprovado).",
      },
    },
  },
});

// Exporting the Answer model
module.exports = Answer;
