import axios from 'axios';
import Logger from '../../config/logger';
import type { Student } from 'types';

const LOG = new Logger('externalGetStudents.js');
// External students’ data cannot be stored in the local database.
export const externalGetStudents = async (classCode: string): Promise<Student[] | []>  => {
  try {
    // its 5000 not 8080 as mentioned in the pdf because the port expose in the external docker is 5000 
    LOG.info(`Calling external student API for classCode=${classCode}`);
    const res = await axios.get('http://localhost:5000/students', {
      params: {
        class: classCode,
        offset: 0,
        limit: 1000,
      },
    });

    return res.data.students;
  } catch (error) {
    LOG.error(`External API failed for classCode=${classCode}`);
    return [];
  }
};
