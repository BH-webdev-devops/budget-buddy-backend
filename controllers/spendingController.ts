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

export const getSpendingById = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id;
    const spendingId = req.params.id
    try {
        const result = await query(`SELECT * FROM spendings WHERE id = $1 AND user_id = $2`, [spendingId, userId])
        const spending = result.rows[0]
        if (!spending) {
            return res.status(404).json({ message: `Spending not found` })
        }
        return res.status(200).json({ message: 'Spending data', spending })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const updateSpending = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id;
    const spendingId = req.params.id
    const { name, amount, date, category } = req.body
    try {
        const result = await query(`UPDATE spendings SET name = $1, amount = $2, date = $3, category = $4 WHERE id = $5 AND user_id = $6 RETURNING *`, [name, amount, date, category, spendingId, userId])
        const spending = result.rows[0]
        if (!spending) {
            return res.status(404).json({ message: `Spending not found` })
        }
        return res.status(200).json({ message: 'Spending updated', spending })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const retrieveSumOfSpendingsByCategory = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user
    try {
        const result = await query(`SELECT category, SUM(amount) FROM spendings WHERE user_id = $1 GROUP BY category`, [userId.id])
        const spendings = result.rows
        return res.status(200).json({ message: 'Sum of spendings by category', spendings })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}


export const deleteSpending = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id;
    const spendingId = req.params.id
    try {
        const result = await query(`DELETE FROM spendings WHERE id = $1 AND user_id = $2`, [spendingId, userId])
        if (result.rowCount === 0) {
            return res.status(404).json({ message: `Spending not found` })
        }
        return res.status(200).json({ message: 'Spending deleted' })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}