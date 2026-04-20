import { upsertTeacher } from '../Teacher/upsertTeacher';
import { CsvItem } from 'CsvItem';
import { upsertStudent } from '../Student/upsertStudent';
import { upsertSubject } from '../Subject/upsertSubject';
import { upsertClassroom } from '../Classroom/upsertClassroom';
import { addStudentTeacherSubjectClassroom } from './addStudentTeacherSubjectClassroom';
import type { Classroom, Student, Subject, Teacher } from 'types';
import { assignStudentToClassroom } from '../StudentClassroom/assignStudentToClassroom';
import Logger from '../../config/logger';
// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');

type NormalizedItem = {
  teacherEmail: string;
  teacherName: string;
  studentEmail: string;
  studentName: string;
  classCode: string;
  className: string;
  subjectCode: string;
  subjectName: string;
  toDelete: string;
};

const LOG = new Logger('processCSVData.js');

export const processCSVData = async (data: CsvItem[]): Promise<void> => {
  LOG.info(`Starting CSV import. Total rows: ${data.length}`);

  const normalizeRow = (row: CsvItem): NormalizedItem => ({
    ...row,
    // Note: CSV and type given (CsvItem) uses `classname` (lowercase) while internal model and pdf description uses `className`
    className: row.classname,
  });

  const transaction = await db.sequelize.transaction();
  try {
    for (const raw of data) {
      const record = normalizeRow(raw);

      const teacher = await upsertTeacher(
        record.teacherEmail,
        record.teacherName,
        transaction,
      );
      const student = await upsertStudent(
        record.studentEmail,
        record.studentName,
        transaction,
      );
      const subject = await upsertSubject(
        record.subjectCode,
        record.subjectName,
        transaction,
      );
      const classroom = await upsertClassroom(
        record.classCode,
        record.className,
        transaction,
      );

      await assignStudentToClassroom(
        student as Student,
        classroom as Classroom,
        transaction,
      );

      await addStudentTeacherSubjectClassroom(
        teacher as Teacher,
        student as Student,
        subject as Subject,
        classroom as Classroom,
        record.toDelete,
        transaction,
      );
    }
    await transaction.commit();
    LOG.info(`CSV import completed successfully. Total rows: ${data.length}`);
  } catch (err) {
    await transaction.rollback();
    LOG.error(`CSV import failed. Rolled back transaction: ${err instanceof Error ? err.message : err}`);
    throw err;
  }
  return;
};
