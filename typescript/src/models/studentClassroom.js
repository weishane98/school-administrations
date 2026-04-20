'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StudentClassroom extends Model {
    static associate(models) {
      StudentClassroom.belongsTo(models.student, {
        foreignKey: 'studentId',
        targetKey: 'id',
        as: 'student',
      });

      StudentClassroom.belongsTo(models.classroom, {
        foreignKey: 'classroomId',
        targetKey: 'id',
        as: 'classroom',
      });
    }
  }

  StudentClassroom.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      classroomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'classrooms',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'studentClassroom',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['studentId', 'classroomId'],
        },
        { fields: ['classroomId'] },
      ],
    },
  );

  return StudentClassroom;
};
