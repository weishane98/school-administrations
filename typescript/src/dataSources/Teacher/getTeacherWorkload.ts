// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Sequelize } = require('sequelize');
const {
  teacher: Teacher,
  subject: Subject,
  studentTeacherSubjectClassroom: StudentTeacherSubjectClassroom,
} = db;
import type { WorkloadReportData } from 'WorkloadReportData';
import Logger from '../../config/logger';

type TeacherWorkloadRecord = {
  teacherId: number;
  subjectId: number;
  classroomCount: string | number;
  'teacher.name': string;
  'teacher.email': string;
  'subject.code': string;
  'subject.name': string;
};

const LOG = new Logger('externalGetStudents.js');

export const getTeacherWorkload = async (): Promise<WorkloadReportData> => {
  try {
    // get all the teachers and subjects grouped up and count the number of classroom for that teacher and subject
    const records = (await StudentTeacherSubjectClassroom.findAll({
      attributes: [
        'teacherId',
        'subjectId',
        [
          Sequelize.fn(
            'COUNT',
            Sequelize.fn('DISTINCT', Sequelize.col('classroomId')),
          ),
          'classroomCount',
        ],
      ],
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'code'],
        },
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'name', 'email'],
        },
      ],
      group: ['teacherId', 'subjectId', 'subject.id', 'teacher.id'],
      raw: true,
    })) as TeacherWorkloadRecord[];
  
    // accummulate the data to return desired format
    // The data required for each teacher are:
    // a) Subject Code
    // b) Subject Name
    // c) How many classes is the Teacher teaching for the Subject (in a)
    const results = records.reduce<WorkloadReportData>(
      (acc, record: TeacherWorkloadRecord) => {
        const teacherName = record['teacher.name'] ?? record['teacher.email'];
  
        if (!acc[teacherName]) {
          acc[teacherName] = [];
        }
  
        acc[teacherName].push({
          subjectCode: record['subject.code'],
          subjectName: record['subject.name'],
          numberOfClasses: Number(record.classroomCount),
        });
        return acc;
      },
      {},
    );
  
    return results;
  } catch (err) {
    LOG.error(
      `Failed to fetch teacher workload: ${
        err instanceof Error ? err.message : err
      }`
    );
    throw err;
  }
};
