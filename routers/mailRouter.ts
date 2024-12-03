import {Router} from 'express';
import {sendMail} from '../controllers/mailController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';

const mailRouter = Router();   

mailRouter.get('/send-mail', authenticateJWT, sendMail);

export default mailRouter;