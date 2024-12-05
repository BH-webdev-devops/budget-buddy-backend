import {Router} from 'express';
import {downloadExpensesCsv} from '../controllers/downloadController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';

const downloadRouter = Router();   

downloadRouter.get('/download-file', authenticateJWT, downloadExpensesCsv);

export default downloadRouter;