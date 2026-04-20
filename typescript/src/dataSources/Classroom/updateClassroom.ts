// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');
const { classroom: Classroom } = db;

export const updateClassroom = async (
  code: string,
  className: string,
): Promise<void> => {
  const existing = await Classroom.findOne({ where: { code } });

  if (!existing) {
    throw new Error('Classroom is not found.');
  }
  
  if (existing.name !== className) {
    await existing.update({ name: className });
  }

};
