import {Request, Response} from 'express'
import {query} from '../database/db'

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

export const getUsers = async (req: Request, res: Response): Promise<Response | any> => {
    const userAdmin = (req as Request & { user: any }).user.is_admin
    if (userAdmin === false) {
        return res.status(403).json({message: "Forbidden access"})
    }
    try {
        const result = await query(`SELECT * FROM users`)
        const users = result.rows

        return res.status(200).json({message : 'Data about the users', users})

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}