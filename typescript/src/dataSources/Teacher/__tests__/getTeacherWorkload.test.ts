import { getTeacherWorkload } from '../getTeacherWorkload';

// mock models
jest.mock('../../../models', () => ({
  studentTeacherSubjectClassroom: {
    findAll: jest.fn(),
  },
}));

// Sequelize models are exported via CommonJS.
// Using require here for compatibility with the existing setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../../models');

describe('getTeacherWorkload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should group workload by teacher correctly', async () => {
    db.studentTeacherSubjectClassroom.findAll.mockResolvedValue([
      {
        'teacher.name': 'John',
        'teacher.email': 'john@test.com',
        'subject.code': 'ENG',
        'subject.name': 'English',
        classroomCount: 2,
      },
      {
        'teacher.name': 'John',
        'teacher.email': 'john@test.com',
        'subject.code': 'MATH',
        'subject.name': 'Math',
        classroomCount: 3,
      },
    ]);

    const result = await getTeacherWorkload();

    expect(result).toEqual({
      John: [
        {
          subjectCode: 'ENG',
          subjectName: 'English',
          numberOfClasses: 2,
        },
        {
          subjectCode: 'MATH',
          subjectName: 'Math',
          numberOfClasses: 3,
        },
      ],
    });
  });
});