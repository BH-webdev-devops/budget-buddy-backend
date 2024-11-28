import {Router} from 'express';
import { createSpending, getAllSpendings, getSpendingById, updateSpending} from '../controllers/spendingController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';



const spendingRouter = Router();
spendingRouter.post('/spending', authenticateJWT, createSpending);
spendingRouter.get('/spending', authenticateJWT, getAllSpendings);
spendingRouter.get('/spending/:id', authenticateJWT, getSpendingById);
spendingRouter.put('/spending/:id', authenticateJWT, updateSpending);

export default spendingRouter;