import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from '../config/logger';
import { getStudents } from '../dataSources/Student/getStudents';

const StudentController = Express.Router();
const LOG = new Logger('StudentController.js');

const getStudentHandler: RequestHandler = async (req, res) => {
  const { classCode } = req.params;
  const { offset = '0', limit = '10' } = req.query;

  if (!classCode) {
    return res.status(StatusCodes.BAD_REQUEST).send('classCode is required');
  }

  const offsetNum = Number(offset);
  const limitNum = Number(limit);

  // check and make sure offset and limit is numbers
  if (isNaN(offsetNum) || isNaN(limitNum)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send('offset and limit must be numbers');
  }

  try {
    LOG.info(`Fetching students for classCode=${classCode}`);
    const students = await getStudents(classCode, offsetNum, limitNum);
    return res.json(students);
  } catch (err) {
    if (err instanceof Error) {
      LOG.error(err.message);
    }
    return res.status(500).send('Error fetching students');
  }
};

StudentController.get('/class/:classCode/students', getStudentHandler);

export default StudentController;
