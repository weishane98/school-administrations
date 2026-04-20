'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StudentTeacherSubjectClassroom extends Model {
    static associate(models) {
      StudentTeacherSubjectClassroom.belongsTo(models.student, {
        foreignKey: 'studentId',
        targetKey: 'id',
        as: 'student',
      });

      StudentTeacherSubjectClassroom.belongsTo(models.teacher, {
        foreignKey: 'teacherId',
        targetKey: 'id',
        as: 'teacher',
      });

      StudentTeacherSubjectClassroom.belongsTo(models.subject, {
        foreignKey: 'subjectId',
        targetKey: 'id',
        as: 'subject',
      });

      StudentTeacherSubjectClassroom.belongsTo(models.classroom, {
        foreignKey: 'classroomId',
        targetKey: 'id',
        as: 'classroom',
      });
    }
  }

  StudentTeacherSubjectClassroom.init(
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
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'subjects',
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
      modelName: 'studentTeacherSubjectClassroom',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['studentId', 'teacherId', 'subjectId', 'classroomId'],
        },
        { fields: ['classroomId'] },
        { fields: ['teacherId'] },
      ],
    },
  );

  return StudentTeacherSubjectClassroom;
};
