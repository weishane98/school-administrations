// Sequelize models are initialized using CommonJS.
// Using require here to ensure compatibility with Sequelize config setup.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const db = require('../../models');
const {
  studentClassroom: StudentClassroom,
  student: StudentModel,
  classroom: Classroom,
} = db;
import type { StudentData } from 'StudentData';
import { externalGetStudents } from './externalGetStudents';
import type { Student, StudentClassroomWithStudent } from 'types';

export const getStudents = async (
  classCode: string,
  offset: number,
  limit: number,
): Promise<StudentData> => {
  const classroom = await Classroom.findOne({
    where: { code: classCode },
  });

  let localStudents = [];

  // get internal student records
  if (classroom) {
    const records = await StudentClassroom.findAll({
      where: { classroomId: classroom.id },
      include: [
        {
          model: StudentModel,
          as: 'student',
        },
      ],
    });

    localStudents = records.map((r: StudentClassroomWithStudent) => ({
      id: r.student.id,
      name: r.student.name,
      email: r.student.email,
      isExternal: false,
    }));
  }

  // get external student records
  // External students’ data are to be fetched on demand via ExternalStudentListing API.
  const externalStudentsRaw = await externalGetStudents(classCode);

  const externalStudents = externalStudentsRaw.map((s: Student) => ({
    ...s,
    isExternal: true,
  }));

  const allStudents = [...localStudents, ...externalStudents];

  // sort by alphanumerical order. Can also deduplicate if required since email is unique identifier.
  allStudents.sort((a, b) => a.name.localeCompare(b.name));

  // pagination
  // StudentListing API should return local and external students in a single paginated list.
  // StudentListing API should return only the required list of students, based on offset and limit.
  // StudentListing API only needs to support infinite scrolling i.e. skipping of pages is not required.
  const paginated = allStudents.slice(offset, offset + limit);

  return {
    count: allStudents.length,
    students: paginated,
  };
};
