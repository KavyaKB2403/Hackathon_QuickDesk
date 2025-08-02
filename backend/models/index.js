const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Token = require('./Token')(sequelize, Sequelize.DataTypes);

// Associations
Token.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Token, { foreignKey: 'userId' });

module.exports = { sequelize, User, Token };
