import { getStudents } from '../getStudents';
import { externalGetStudents } from '../externalGetStudents';

jest.mock('../externalGetStudents');
jest.mock('../../../models', () => ({
  studentClassroom: { findAll: jest.fn() },
  classroom: { findOne: jest.fn() },
}));

// Sequelize models are exported via CommonJS.
// Using require here for compatibility with the existing setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../../models');

describe('getStudents service', () => {
  it('should merge and paginate students', async () => {
    db.classroom.findOne.mockResolvedValue({ id: 1 });

    db.studentClassroom.findAll.mockResolvedValue([
      { student: { id: 1, name: 'Bob', email: 'b@test.com' } },
    ]);

    (externalGetStudents as jest.Mock).mockResolvedValue([
      { id: 2, name: 'Alice', email: 'a@test.com' },
    ]);

    const result = await getStudents('A1', 0, 10);

    expect(result.count).toBe(2);
    expect(result.students[0].name).toBe('Alice'); // sorted
  });
});