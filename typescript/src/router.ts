import Express from 'express';
import DataImportController from './controllers/DataImportController';
import HealthcheckController from './controllers/HealthcheckController';
import StudentController from './controllers/StudentController';
import ClassroomController from './controllers/ClassroomController';
import ReportingController from './controllers/ReportingController';

const router = Express.Router();

router.use('/', DataImportController);
router.use('/', HealthcheckController);
router.use('/', StudentController);
router.use('/', ClassroomController);
router.use('/', ReportingController);

export default router;
