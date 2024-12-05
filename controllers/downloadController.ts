// allow the user to download a file in csv format - the file contains all the spendings of the user
// we will create a button oin frontend that allows the user to download the file
import { Request, Response } from 'express';
import { query } from '../database/db';
import dotenv from 'dotenv';
import { Parser } from 'json2csv';

dotenv.config();

export const downloadExpensesCsv = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as Request & { user: any }).user.id;

    try {
        const result = await query(`SELECT name, amount, date, category FROM spendings WHERE user_id = $1`, [userId]);
        const spendings = result.rows;

        if (spendings.length === 0) {
            res.status(404).json({ message: 'No spendings found for the user' });
            return;
        }

        const fields = ['name', 'amount', 'date', 'category'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(spendings);

        res.header('Content-Type', 'text/csv');
        res.attachment('spendings.csv');
        res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};