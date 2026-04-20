import { processCSVData } from '../processCSVData';

// mock all dependencies
jest.mock('../../Teacher/upsertTeacher');
jest.mock('../../Student/upsertStudent');
jest.mock('../../Subject/upsertSubject');
jest.mock('../../Classroom/upsertClassroom');
jest.mock('../addStudentTeacherSubjectClassroom');
jest.mock('../../StudentClassroom/assignStudentToClassroom');

// mock sequelize transaction
jest.mock('../../../models', () => ({
  sequelize: {
    transaction: jest.fn(),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../../models');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const upsertTeacher = require('../../Teacher/upsertTeacher').upsertTeacher;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const upsertStudent = require('../../Student/upsertStudent').upsertStudent;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const upsertSubject = require('../../Subject/upsertSubject').upsertSubject;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const upsertClassroom = require('../../Classroom/upsertClassroom').upsertClassroom;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assignStudentToClassroom = require('../../StudentClassroom/assignStudentToClassroom').assignStudentToClassroom;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const addSTSC = require('../addStudentTeacherSubjectClassroom').addStudentTeacherSubjectClassroom;

describe('processCSVData', () => {
  const mockTransaction = {
    commit: jest.fn(),
    rollback: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    db.sequelize.transaction.mockResolvedValue(mockTransaction);

    // mock return values
    upsertTeacher.mockResolvedValue({ id: 1 });
    upsertStudent.mockResolvedValue({ id: 2 });
    upsertSubject.mockResolvedValue({ id: 3 });
    upsertClassroom.mockResolvedValue({ id: 4 });

    assignStudentToClassroom.mockResolvedValue({});
    addSTSC.mockResolvedValue({});
  });

  it('should process CSV data successfully and commit transaction', async () => {
    const data = [
      {
        teacherEmail: 't@test.com',
        teacherName: 'Teacher',
        studentEmail: 's@test.com',
        studentName: 'Student',
        classCode: 'A1',
        classname: 'Class A1',
        subjectCode: 'ENG',
        subjectName: 'English',
        toDelete: 'false',
      },
    ];

    await processCSVData(data as any);

    expect(upsertTeacher).toHaveBeenCalled();
    expect(upsertStudent).toHaveBeenCalled();
    expect(upsertSubject).toHaveBeenCalled();
    expect(upsertClassroom).toHaveBeenCalled();
    expect(assignStudentToClassroom).toHaveBeenCalled();
    expect(addSTSC).toHaveBeenCalled();

    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it('should rollback transaction if error occurs', async () => {
    upsertTeacher.mockRejectedValue(new Error('fail'));

    const data = [
      {
        teacherEmail: 't@test.com',
        teacherName: 'Teacher',
        studentEmail: 's@test.com',
        studentName: 'Student',
        classCode: 'A1',
        classname: 'Class A1',
        subjectCode: 'ENG',
        subjectName: 'English',
        toDelete: 'false',
      },
    ];

    await expect(processCSVData(data as any)).rejects.toThrow();

    expect(mockTransaction.rollback).toHaveBeenCalled();
  });
});