// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');
const { subject: SubjectModel } = db;
import { Transaction } from 'sequelize';
import type { Subject } from 'types';

export const upsertSubject = async (
  code: string,
  name: string,
  transaction: Transaction,
): Promise<Subject> => {
  const existing = await SubjectModel.findOne({ where: { code }, transaction });

  // If teacherEmail is the same for multiple rows, always take the teacherName of the latest
  // record. This applies to Students, Classes and Subjects too.
  if (existing) {
    return existing.update({ name }, { transaction });
  }

  return SubjectModel.create({ code, name }, { transaction });
};
