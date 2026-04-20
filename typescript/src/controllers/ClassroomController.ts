import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from '../config/logger';
import { updateClassroom } from '../dataSources/Classroom/updateClassroom';

const ClassroomController = Express.Router();
const LOG = new Logger('ClassroomController.js');

const classroomHandler: RequestHandler = async (req, res) => {
  const { classCode } = req.params;
  const { className } = req.body;

  if (!classCode || !className){
    return res.status(StatusCodes.BAD_REQUEST).send('Class code and name is required');
  }

  try {
    await updateClassroom(classCode, className);
    return res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err: unknown) {
    if (err instanceof Error) {
      LOG.error(err.message);

      if (err.message === 'Classroom is not found.') {
        return res.status(StatusCodes.BAD_REQUEST).send(err.message);
      }
    }
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

ClassroomController.put('/class/:classCode', classroomHandler);

export default ClassroomController;
