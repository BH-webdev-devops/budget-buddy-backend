import nodemailer from "nodemailer";
import {Request, Response} from 'express'
import {User} from "../types/User"
import {query} from '../database/db'
import dotenv from 'dotenv';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
});

// async..await is not allowed in global scope, must use a wrapper
export const sendMail = async (req: Request, res: Response): Promise<Response | any> => {
    try {
    // Send mail to the mail of the user who is logged in
    const userId = (req as Request & { user: any }).user.id;
    const info = await query(`SELECT email FROM users WHERE id = $1`, [userId]);
    const email = info.rows[0].email;
    // get all spendings
    const spendings = await query(`SELECT * FROM spendings WHERE user_id = $1`, [userId]);

    console.log(email);

   
    // Send the email
    // Create a single CSV file with all the spendings
    let csvContent = `Spending name,Spending amount,Spending date,Spending category\n`;
    spendings.rows.forEach((spending: any) => {
        csvContent += `${spending.name},${spending.amount},${spending.date},${spending.category}\n`;
    });

    await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Test email',
        text: `Hello ${email}, here are your spendings:`,
        attachments: [
            {
                filename: 'spendings.csv',
                content: Buffer.from(csvContent),
                contentType: 'text/csv',
                contentDisposition: 'attachment'
            }
        ]
    });

    res.send('Email sent successfully');
    } catch (error) {
        console.error(error);
        res.send('An error occurred');
    }
};