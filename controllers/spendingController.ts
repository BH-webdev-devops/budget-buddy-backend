import {Request, Response} from 'express'
import {query} from '../database/db'
import { createClient } from 'redis';

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
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

(async () => {
    await redisClient.connect();
    redisClient.on('error', error => console.error('Redis client error:', error));
    redisClient.on('connect', () => console.log('Redis client connected'));
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
        return res.status(500).json({ message: `Internal server error`, err })
    }
}

export const getAllSpendings = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id;
    const stringifyUserId = userId.toString();
    try {
        console.log(stringifyUserId)
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
    redisClient.del(userId.toString());
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

const convertToYYYYMMDD = (dateString: string): string => {
    const date = new Date(dateString); // Parse the string into a Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    console.log(`${year}-${month}-${day}`);
    return `${year}-${month}-${day}`; // Format as yyyy-MM-dd
};


// what you see on the pie chart
export const retrieveSumOfSpendingsByCategory = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id;
    const { startDate, endDate } = req.query; // Get start and end dates from query parameters
    
    try {
        // Construct the query dynamically based on the presence of startDate and endDate
        let queryText = `SELECT category, SUM(amount) FROM spendings WHERE user_id = $1`;
        const queryParams: any[] = [userId];

        if (startDate) {
            queryText += ` AND date >= $2`;
            queryParams.push( convertToYYYYMMDD(startDate as string));
        }

        if (endDate) {
            queryText += ` AND date <= $3`;
            queryParams.push( convertToYYYYMMDD(endDate as string));
        }

        queryText += ` GROUP BY category`;
        console.log("QUERY TWXT " , queryText);
        const result = await query(queryText, queryParams);
        const spendings = result.rows;

        return res.status(200).json({ message: 'Sum of spendings by category', spendings });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Internal server error` });
    }

};

// This function retrieves all spendings by category grouped by name for a specific user. (what you see when you click a category on the pie chart)
export const retrieveAllSpendingsByCategory = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id;
    const category = req.query.category;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    try {
        // Start constructing the base query
        let queryText = `SELECT name, SUM(amount) FROM spendings WHERE user_id = $1 AND category = $2`;
        const queryParams: any[] = [userId, category];
        
        // Add optional date filters
        if (startDate) {
            queryText += ` AND date >= $3`;
            queryParams.push(convertToYYYYMMDD(startDate as string));
        }
        if (endDate) {
            queryText += ` AND date <= $4`;
            queryParams.push(convertToYYYYMMDD(endDate as string));
        }

        // Add GROUP BY clause
        queryText += ` GROUP BY name`;

        // Execute the query
        const result = await query(queryText, queryParams);
        const spendings = result.rows;

        return res.status(200).json({ message: `All spendings for category ${category}`, spendings });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Internal server error` });
    }
};


// get all spendings between two dates
export const retrieveSpendingsBetweenDates = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id;
    const { startDate, endDate } = req.query;
    console.log("START DATE", startDate);

    try {
        const result = await query(
            `SELECT * 
             FROM spendings 
             WHERE user_id = $1 AND date BETWEEN $2 AND $3`,
            [userId, convertToYYYYMMDD(startDate as string),  convertToYYYYMMDD(endDate as string)]
        );

        const spendings = result.rows;

        return res.status(200).json({ 
            message: `All spendings between ${startDate} and ${endDate}`, 
            spendings 
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Internal server error` });
    }
};

export const deleteSpending = async (req: Request, res: Response): Promise<Response | any> => {
    const userId = (req as Request & { user: any }).user.id;
    redisClient.del(userId.toString());
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