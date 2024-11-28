import {Request, Response} from 'express'
import {query} from '../database/db'

export const getUserProfile = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    console.log(userId)
    try {
        const result = await query(`SELECT * FROM users WHERE id = $1`, [userId])
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
    
    // Check if the current user that is logged in is an admin or not
    const userId = (req as Request & { user: any }).user.id;
    const userJson = await query(`SELECT is_admin FROM users WHERE id = $1`, [userId]);
    const isAdmin = userJson.rows[0].is_admin;
    if (!isAdmin) {
        return res.status(403).json({ message: `You don't have permission to view this data` })
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