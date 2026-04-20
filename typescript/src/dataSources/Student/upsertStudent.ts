// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');
import type { Student } from 'types';
const { student: StudentModel } = db;
import { Transaction } from 'sequelize';

export const upsertStudent = async (
  email: string,
  name: string,
  transaction: Transaction,
): Promise<Student> => {
  // Teachers and students can be uniquely identified by their email address.
  const existing = await StudentModel.findOne({ where: { email }, transaction });

  // If teacherEmail is the same for multiple rows, always take the teacherName of the latest
  // record. This applies to Students, Classes and Subjects too.
  if (existing) {
    return existing.update({ name }, { transaction });
  }

  return StudentModel.create({ email, name }, { transaction });
};
