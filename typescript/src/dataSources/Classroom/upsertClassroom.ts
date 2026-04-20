// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');
import type { Classroom } from 'types';
const { classroom: ClassroomModel } = db;
import { Transaction } from 'sequelize';

export const upsertClassroom = async (
  code: string,
  name: string,
  transaction: Transaction,
): Promise<Classroom> => {
  const existing = await ClassroomModel.findOne({ where: { code }, transaction });

  // If teacherEmail is the same for multiple rows, always take the teacherName of the latest
  // record. This applies to Students, Classes and Subjects too.
  if (existing) {
    return existing.update({ name }, { transaction });
  }

  return ClassroomModel.create({ code, name }, { transaction });
};
