export interface StudentData {
  count: number;
  students: Student[];
}

interface Student {
    id: number;
    name: string;
    email: string;
    isExternal: boolean;
}
