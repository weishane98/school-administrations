import request from 'supertest';
import app from '../../app';
import { getStudents } from '../../dataSources/Student/getStudents';

jest.mock('../../dataSources/Student/getStudents');
jest.mock('../../models', () => ({
  teacher: {},
  subject: {},
  classroom: {
    findOne: jest.fn(),
  },
  studentClassroom: {
    findAll: jest.fn(),
  },
  studentTeacherSubjectClassroom: {
    findAll: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

describe('GET /api/class/:classCode/students', () => {
  it('should return students successfully', async () => {
    (getStudents as jest.Mock).mockResolvedValue({
      count: 1,
      students: [
        {
          id: 1,
          name: 'Alice',
          email: 'a@test.com',
          isExternal: false,
        },
      ],
    });

    const res = await request(app).get(
      '/api/class/CLASS1/students?offset=0&limit=10'
    );

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it('should return 400 if invalid params', async () => {
    const res = await request(app).get(
      '/api/class/CLASS1/students?offset=abc'
    );

    expect(res.status).toBe(400);
  });
});
