import {Router} from 'express';
import { createSpending, getAllSpendings, getSpendingById, updateSpending, deleteSpending, retrieveSumOfSpendingsByCategory, retrieveAllSpendingsByCategory} from '../controllers/spendingController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';



const spendingRouter = Router();
spendingRouter.post('/spending', authenticateJWT, createSpending);
spendingRouter.get('/spending', authenticateJWT, getAllSpendings);
spendingRouter.get('/spending/:id', authenticateJWT, getSpendingById);
spendingRouter.put('/spending/:id', authenticateJWT, updateSpending);
spendingRouter.delete('/spending/:id', authenticateJWT, deleteSpending);
spendingRouter.get('/spending-sum', authenticateJWT, retrieveSumOfSpendingsByCategory);
spendingRouter.get('/spending-by-category', authenticateJWT, retrieveAllSpendingsByCategory);

export default spendingRouter;