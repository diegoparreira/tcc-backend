const {
  Answer,
  Category,
  Comment,
  Content,
  ExtraDoc,
  User,
} = require("./index");

// Define User associations
User.hasMany(Content, { onDelete: "cascade" });
User.hasMany(ExtraDoc, { onDelete: "cascade" });
User.hasMany(Comment, { onDelete: "cascade" });
User.hasMany(Answer, { onDelete: "cascade" });
User.hasMany(Category, { onDelete: "cascade" });

// Define Content associations
Content.belongsTo(User, { foreignKey: { allowNull: false } });
Content.belongsTo(Category, { foreignKey: { allowNull: false } });
Content.hasMany(Comment, { onDelete: "cascade" });
Content.hasMany(ExtraDoc, { onDelete: "cascade" });

// Define ExtraDoc associations
ExtraDoc.belongsTo(User, { foreignKey: { allowNull: false } });

// Define Comment associations
Comment.belongsTo(User, { foreignKey: { allowNull: false } });
Comment.belongsTo(Content, { foreignKey: { allowNull: false } });
Comment.hasMany(Answer, { onDelete: "cascade" });

// Define Answer associations
Answer.belongsTo(User, { foreignKey: { allowNull: false } });
Answer.belongsTo(Comment, { foreignKey: { allowNull: false } });

// Define Category associations
Category.belongsTo(User, { foreignKey: { allowNull: false } });
Category.hasMany(Content, { onDelete: "cascade" });

module.exports = {
  Answer,
  Category,
  Comment,
  Content,
  ExtraDoc,
  User,
};
