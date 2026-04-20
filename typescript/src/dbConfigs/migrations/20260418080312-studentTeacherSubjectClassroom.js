'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('studentTeacherSubjectClassrooms', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      teacherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teachers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      classroomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'classrooms',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addConstraint('studentTeacherSubjectClassrooms', {
      fields: ['studentId', 'teacherId', 'subjectId', 'classroomId'],
      type: 'unique',
      name: 'unique_student_teacher_subject_classroom',
    });

    await queryInterface.addIndex('studentTeacherSubjectClassrooms', ['classroomId']);
    await queryInterface.addIndex('studentTeacherSubjectClassrooms', ['teacherId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('studentTeacherSubjectClassrooms');
  },
};
