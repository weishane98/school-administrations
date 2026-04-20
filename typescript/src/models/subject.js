'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {}

  Subject.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'subject',
    },
  );

  return Subject;
};
