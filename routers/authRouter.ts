import {Router} from 'express'
import {checkIfUserExists} from "../middlewares/checkUser"
import {checkUserData} from "../middlewares/checkUserData"
import { registerUser, loginUser } from '../controllers/authController'

const authRouter : Router = Router()

authRouter.post('/register', checkUserData(true), checkIfUserExists(false), registerUser)
authRouter.post('/login', checkUserData(false), checkIfUserExists(true), loginUser)

export default authRouter