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
    await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Test email',
        text: `Hello ${email}, here are your spendings:`,
        // Send the spendings as a folder
        attachments: spendings.rows.map((spending: any) => {
            return {
                filename: `${spending.date}`,
                content: Buffer.from(`
                Spending name: ${spending.name}
                Spending amount: ${spending.amount}
                Spending date: ${spending.date}
                Spending category: ${spending.category}
                `),
                contentType: 'text/plain',
                contentDisposition: 'attachment'
            };
        })
    });

    res.send('Email sent successfully');
    } catch (error) {
        console.error(error);
        res.send('An error occurred');
    }
};