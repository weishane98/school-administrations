'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('studentClassrooms', {
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

    await queryInterface.addConstraint('studentClassrooms', {
      fields: ['studentId', 'classroomId'],
      type: 'unique',
      name: 'unique_student_classroom',
    });

    await queryInterface.addIndex('studentClassrooms', ['classroomId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('studentClassrooms');
  },
};
