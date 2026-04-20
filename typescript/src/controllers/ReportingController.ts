import Express, { RequestHandler } from 'express';
import Logger from '../config/logger';
import { getTeacherWorkload } from '../dataSources/Teacher/getTeacherWorkload';

const ReportingController = Express.Router();
const LOG = new Logger('ReportingController.js');

const getReportWorkload: RequestHandler = async (req, res) => {
  try {
    const students = await getTeacherWorkload();
    // The WorkloadReport API should return the required data in JSON format.
    return res.json(students);
  } catch (err) {
    if (err instanceof Error) {
      LOG.error(err.message);
    }
    return res.status(500).send('Error fetching students');
  }
};

ReportingController.get('/reports/workload', getReportWorkload);

export default ReportingController;
