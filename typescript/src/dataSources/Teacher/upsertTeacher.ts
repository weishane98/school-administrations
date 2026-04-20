// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');
import type { Teacher } from 'types';
const { teacher: TeacherModel } = db;
import { Transaction } from 'sequelize';

export const upsertTeacher = async (
  email: string,
  name: string,
  transaction: Transaction,
): Promise<Teacher> => {
  // Teachers and students can be uniquely identified by their email address.
  const existing = await TeacherModel.findOne({ where: { email }, transaction });

  // If teacherEmail is the same for multiple rows, always take the teacherName of the latest
  // record. This applies to Students, Classes and Subjects too.
  if (existing) {
    return existing.update({ name }, { transaction });
  }

  return TeacherModel.create({ email, name }, { transaction });
};
