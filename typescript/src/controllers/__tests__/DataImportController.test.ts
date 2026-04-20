import request from 'supertest';
import express from 'express';
import DataImportController from '../DataImportController';
import { processCSVData } from '../../dataSources/StudentTeacherSubjectClassroom/processCSVData';
import { convertCsvToJson } from '../../utils';

// mock dependencies
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
jest.mock('../../dataSources/StudentTeacherSubjectClassroom/processCSVData');
jest.mock('../../utils');

const app = express();
app.use('/api', DataImportController);

describe('POST /api/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no file uploaded', async () => {
    const res = await request(app).post('/api/upload');

    expect(res.status).toBe(400);
  });

  it('should return 204 on successful upload', async () => {
    (convertCsvToJson as jest.Mock).mockResolvedValue([
      {
        teacherEmail: 't@test.com',
        teacherName: 'Teacher',
        studentEmail: 's@test.com',
        studentName: 'Student',
        classCode: 'A1',
        classname: 'Class A1',
        subjectCode: 'ENG',
        subjectName: 'English',
        toDelete: '0',
      },
    ]);

    (processCSVData as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .post('/api/upload')
      .attach('data', Buffer.from('dummy'), 'test.csv');

    expect(res.status).toBe(204);
    expect(processCSVData).toHaveBeenCalled();
  });

  it('should return 500 if processing fails', async () => {
    (convertCsvToJson as jest.Mock).mockResolvedValue([]);
    (processCSVData as jest.Mock).mockRejectedValue(new Error('fail'));

    const res = await request(app)
      .post('/api/upload')
      .attach('data', Buffer.from('dummy'), 'test.csv');

    expect(res.status).toBe(500);
  });
});
