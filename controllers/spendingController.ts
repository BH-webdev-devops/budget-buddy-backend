import {Request, Response} from 'express'
import {query} from '../database/db'

export const createSpending = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const { name, amount, date, category } = req.body
    try {
        
        const result = await query(`INSERT INTO spendings (name, amount, date, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, amount, date, category, userId])
        if (!result) {
            return res.status(404).json({ message: `Spending not created` })
        }
        return res.status(201).json({
            message: `Spending created successfully`, task: result.rows[0]
        })
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const getAllSpendings = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id;
    try {
        const result = await query(`SELECT * FROM spendings WHERE user_id = $1`, [userId])
        const spendings = result.rows

        return res.status(200).json({ message: 'All spendings', spendings })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}