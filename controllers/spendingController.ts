import {Request, Response} from 'express'
import {query} from '../database/db'
import { createClient } from 'redis';

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    socket: {
        reconnectStrategy: function(retries) {
            if (retries > 20) {
                console.log("Too many attempts to reconnect. Redis connection was terminated");
                return new Error("Too many retries.");
            } else {
                return retries * 500;
            }
        }
    }
});

redisClient.on('error', error => console.error('Redis client error:', error));
redisClient.on('connect', () => console.log('Redis client connected'));

(async () => {
    await redisClient.connect();
})();

const DEFAULT_EXPIRATION = 3600;

export const createSpending = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    console.log(await redisClient.get(userId.toString()));
    redisClient.del(userId.toString());
    console.log(await redisClient.get(userId.toString()));
    const { name, amount, date, category } = req.body
    try {
        
        const result = await query(`INSERT INTO spendings (name, amount, date, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, amount, date, category, userId])
        if (!result) {
            return res.status(404).json({ message: `Spending not created` })
        }
        return res.status(201).json({
            message: `Spending created successfully`, spending: result.rows[0]
        })
    }

    catch (err) {
        console.log(err)
        return res.status(500).json({ message: `Internal server error` })
    }
}

export const getAllSpendings = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id;
    const stringifyUserId = userId.toString();
    try {
        const cachedSpendings = await redisClient.get(stringifyUserId);
        console.log(cachedSpendings)
        if (cachedSpendings) {
            return res.status(200).json({ message: 'All spendings', spendings: JSON.parse(cachedSpendings) });
        }
        const result = await query(`SELECT * FROM spendings WHERE user_id = $1`, [userId])
        const spendings = result.rows
        redisClient.set(stringifyUserId, JSON.stringify(spendings));
        redisClient.expire(stringifyUserId, DEFAULT_EXPIRATION);
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

// create a function that retrieves all spendings for a single category selected by the user
export const retrieveAllSpendingsByCategory = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id
    const category = req.query.category
    try {
        const result = await query(`SELECT * FROM spendings WHERE user_id = $1 AND category = $2`, [userId, category])
        const spendings = result.rows
        return res.status(200).json({ message: `All spendings for category ${category}`, spendings })

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