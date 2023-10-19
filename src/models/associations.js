const User = require('./src/models/User');
const Content = require('./src/models/Content');

User.associate = (models) => {
  User.hasMany(models.Content, { foreignKey: 'userId' });
};

Content.associate = (models) => {
  Content.belongsTo(models.User, { foreignKey: 'userId' });
};