export type WorkloadReportData = Record<TeacherName, TeacherWorkload[]>;

type TeacherName = string;

interface TeacherWorkload {
    subjectCode: string;
    subjectName: string;
    numberOfClasses: number;
}
