import request from 'supertest';
import express from 'express';
import ClassroomController from '../ClassroomController';
import { updateClassroom } from '../../dataSources/Classroom/updateClassroom';

// mock the service
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
jest.mock('../../dataSources/Classroom/updateClassroom');

const app = express();
app.use(express.json());
app.use('/api', ClassroomController);

describe('PUT /api/class/:classCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 204 on success', async () => {
    (updateClassroom as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .put('/api/class/A1')
      .send({ className: 'New Class' });

    expect(res.status).toBe(204);
    expect(updateClassroom).toHaveBeenCalledWith('A1', 'New Class');
  });

  it('should return 400 if missing className', async () => {
    const res = await request(app)
      .put('/api/class/A1')
      .send({});

    expect(res.status).toBe(400);
  });

  it('should return 500 if service throws', async () => {
    (updateClassroom as jest.Mock).mockRejectedValue(new Error('fail'));

    const res = await request(app)
      .put('/api/class/A1')
      .send({ className: 'New Class' });

    expect(res.status).toBe(500);
  });
});