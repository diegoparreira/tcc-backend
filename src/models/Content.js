// Importing necessary dependencies
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

// Defining the content types
const CONTENT_TYPES = ["video", "pdf"];

// Defining the Content model
const Content = sequelize.define("Content", {
  // Defining the model fields
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "O título do conteúdo não pode estar vazio.",
      },
      len: {
        args: [1, 255],
        msg: "O título deve ter entre 1 e 255 caracteres.",
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "A descrição do conteúdo não pode estar vazia.",
      },
    },
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isUrl: {
        args: true,
        msg: "A URL deve ser uma URL válida.",
      },
    },
  },
  type: {
    type: DataTypes.ENUM(...CONTENT_TYPES),
    allowNull: false,
    validate: {
      isIn: {
        args: [CONTENT_TYPES],
        msg: "O tipo de conteúdo deve ser 'video' ou 'pdf'.",
      },
    },
  },
  approved: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
    validate: {
      isIn: {
        args: [[0, 1]],
        msg: "O valor aprovado deve ser 0 (não aprovado) ou 1 (aprovado).",
      },
    },
  },
});

// Exporting the Content model and the content types
module.exports = { Content, CONTENT_TYPES };
