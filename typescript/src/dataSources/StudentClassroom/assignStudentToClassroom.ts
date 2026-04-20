// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');
import type { Classroom, Student, StudentClassroom } from 'types';
const { studentClassroom: StudentClassroomModel } = db;
import { Transaction } from 'sequelize';
import Logger from '../../config/logger';

const LOG = new Logger('assignStudentToClassroom.js');
export const assignStudentToClassroom = async (
  student: Student,
  classroom: Classroom,
  transaction: Transaction,
): Promise<StudentClassroom | null> => {
  try {
    const existing = await StudentClassroomModel.findOne({
      where: {
        studentId: student.id,
        classroomId: classroom.id,
      },
      transaction,
    });

    if (existing) {
      return existing;
    }

    return StudentClassroomModel.create(
      {
        studentId: student.id,
        classroomId: classroom.id,
      },
      { transaction },
    );
  } catch (error: unknown) {
    if (error instanceof Error){
      LOG.error(
        `Failed to assign student ${student.id} to classroom ${classroom.id}: ${error.message}`
      );
    }
    throw error;
  }
};
