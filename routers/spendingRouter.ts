import {Router} from 'express';
import { retrieveSpendingsBetweenDates, createSpending, getAllSpendings, getSpendingById, updateSpending, deleteSpending, retrieveSumOfSpendingsByCategory, retrieveAllSpendingsByCategory} from '../controllers/spendingController';
import { authenticateJWT } from '../middlewares/jwtMiddleware';



const spendingRouter = Router();
spendingRouter.post('/spending', authenticateJWT, createSpending);
spendingRouter.get('/spending', authenticateJWT, getAllSpendings);
spendingRouter.get('/spending/:id', authenticateJWT, getSpendingById);
spendingRouter.put('/spending/:id', authenticateJWT, updateSpending);
spendingRouter.delete('/spending/:id', authenticateJWT, deleteSpending);
spendingRouter.get('/spending-sum', authenticateJWT, retrieveSumOfSpendingsByCategory);
spendingRouter.get('/spending-by-category', authenticateJWT, retrieveAllSpendingsByCategory);
spendingRouter.get('/spending-date', authenticateJWT, retrieveSpendingsBetweenDates);

export default spendingRouter;