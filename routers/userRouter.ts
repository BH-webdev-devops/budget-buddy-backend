import {Router} from 'express'
import { authenticateJWT } from '../middlewares/jwtMiddleware'
import {getIdByEmail, getUserProfile, getUsers} from '../controllers/userController';

const userRouter : Router = Router()

userRouter.get('/users', authenticateJWT, getUsers);
userRouter.get('/profile', authenticateJWT, getUserProfile);
userRouter.post('/users/getIdByEmail', authenticateJWT, getIdByEmail);

export default userRouter