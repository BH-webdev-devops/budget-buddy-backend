import {Request, Response} from 'express'
import {query} from '../database/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {User} from "../types/User"

export const registerUser = async (req: Request, res: Response): Promise<Response | any> => {

    const {username, email, password, is_admin} = req.body
    let is_admin_bool = true
    if (is_admin === null || is_admin === undefined || is_admin === false) {
        is_admin_bool = false
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        await query("INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id", [username, email, hashedPassword, is_admin_bool]);
        
        return res.status(201).json({message: "User was created successfully!"})
    } catch(err) {
        console.log(err)
        return res.status(500).json({message: "Internal server error!"})
    }
}

export const loginUser = async (req: Request, res: Response): Promise<Response | any> => {

    const {email, password} = req.body
    const user = (req as Request & {user: User}).user

    try {
        const isMatch = await bcrypt.compare(password, user.password)
        
        if (!isMatch) {
            return res.status(400).json({message: "Invalid credentials!"})
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET as string, {expiresIn: '2h'})
        return res.status(200).json({user : {
            id : user.id,
            username : user.username,
            email : user.email, 
        }, token, message: "User successfully Logged in!"})

    } catch (err) {
        console.log(err)
        return res.status(500).json({message: "Internal server error!"})
    }
} 