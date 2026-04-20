import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from '../config/logger';
import upload from '../config/multer';
import { convertCsvToJson } from '../utils';
import { processCSVData } from '../dataSources/StudentTeacherSubjectClassroom/processCSVData';

const DataImportController = Express.Router();
const LOG = new Logger('DataImportController.js');

// TODO: Please implement Question 1 requirement here
const dataImportHandler: RequestHandler = async (req, res) => {
  const { file } = req;
  if (!file){
    return res.status(StatusCodes.BAD_REQUEST).send('File is required');
  }

  const data = await convertCsvToJson(file.path);

  try {
    await processCSVData(data);
    LOG.info(JSON.stringify(data, null, 2));
    return res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (err: unknown) {
    if (err instanceof Error) {
      LOG.error(err.message);
    }
    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

DataImportController.post('/upload', upload.single('data'), dataImportHandler);

export default DataImportController;
