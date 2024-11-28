import {Router} from 'express';
import { createSpending, getAllSpendings} from '../controllers/spendingController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';



const spendingRouter = Router();
spendingRouter.post('/spending', authenticateJWT, createSpending);
spendingRouter.get('/spending', authenticateJWT, getAllSpendings);

export default spendingRouter;