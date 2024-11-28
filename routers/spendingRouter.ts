import {Router} from 'express';
import { createSpending} from '../controllers/spendingController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';



const spendingRouter = Router();
spendingRouter.post('/spending', authenticateJWT, createSpending);

export default spendingRouter;