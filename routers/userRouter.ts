import {Router} from 'express'
import { authenticateJWT } from '../middlewares/jwtMiddleware'
import {getUserProfile} from '../controllers/userController';

const userRouter : Router = Router()

userRouter.get('/profile', authenticateJWT, getUserProfile);

export default userRouter