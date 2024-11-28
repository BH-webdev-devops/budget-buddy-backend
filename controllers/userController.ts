import {Request, Response} from 'express'
import {query} from '../database/db'
import {User} from "../types/User"
import bcrypt from 'bcryptjs'

export const getUserProfile = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    try {
        const result = await query(`SELECT id, username, email FROM users WHERE id = $1`, [userId])
        const user = result.rows[0]

        if(!user){
            return res.status(404).json({message : `User not found`})
        }

        return res.status(200).json({message : 'Profile data', user})

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}