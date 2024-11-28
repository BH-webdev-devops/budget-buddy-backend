import {Router} from 'express'
import { authenticateJWT } from '../middlewares/jwtMiddleware'
import {getUserProfile, getUsers} from '../controllers/userController';

const userRouter : Router = Router()

userRouter.get('/users', authenticateJWT, getUsers);
userRouter.get('/profile', authenticateJWT, getUserProfile);

export default userRouter