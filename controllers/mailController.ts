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

    console.log(email);

   
    // Send the email
    await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Test email',
        text: 'Hello, this is a test email from my server'
    });

    res.send('Email sent successfully');
    } catch (error) {
        console.error(error);
        res.send('An error occurred');
    }
};