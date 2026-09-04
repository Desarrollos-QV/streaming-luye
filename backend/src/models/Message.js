const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'global',
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true, // Esto agregará createdAt (útil para el orden de los mensajes)
});

module.exports = Message;
