// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');
import type { Classroom, Student, Subject, Teacher, StudentTeacherSubjectClassroom } from 'types';
const { studentTeacherSubjectClassroom: StudentTeacherSubjectClassroomModel } = db;
import { Transaction } from 'sequelize';
import Logger from '../../config/logger';

const LOG = new Logger('addStudentTeacherSubjectClassroom.js');
export const addStudentTeacherSubjectClassroom = async (
  teacher: Teacher,
  student: Student,
  subject: Subject,
  classroom: Classroom,
  toDelete: string,
  transaction: Transaction,
): Promise<StudentTeacherSubjectClassroom | null> => {
  try {
    const existing = await StudentTeacherSubjectClassroomModel.findOne(
      {
        where: {
          teacherId: teacher.id,
          studentId: student.id,
          subjectId: subject.id,
          classroomId: classroom.id,
        },
        transaction
      }
    );

    const shouldDelete = toDelete === '1';

    if (existing) {
      if (shouldDelete) {
        await existing.destroy({ transaction });
        return existing;
      }
      return existing;
    }

    if (!shouldDelete) {
      return StudentTeacherSubjectClassroomModel.create(
        {
          teacherId: teacher.id,
          studentId: student.id,
          subjectId: subject.id,
          classroomId: classroom.id,
        },
        { transaction },
      );
    }
    return null;
  } catch (error: unknown) {
    if (error instanceof Error){
      LOG.error(
        `Failed to assign student: ${student.id}, teacher: ${teacher.id}, subject: ${subject.id}, classroom: ${classroom.id}: ${error.message}`
      );
    }
    throw error;
  }
};
