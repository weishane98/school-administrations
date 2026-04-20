export interface Teacher {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Classroom {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentClassroom {
  id: number;
  studentId: number;
  classroomId: number;
}

export type StudentClassroomWithStudent = StudentClassroom & {
  student: Student;
};

export interface StudentTeacherSubjectClassroom {
  id: number;
  studentId: number;
  teacherId: number;
  subjectId: number;
  classroomId: number;
}
