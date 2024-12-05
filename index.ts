import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 
import { pool } from './database/db';
import authRouter from './routers/authRouter';
import userRouter from './routers/userRouter';
import spendingRouter from './routers/spendingRouter';
import mailRouter from './routers/mailRouter';
import downloadRouter from './routers/downloadRouter';

const PORT = process.env.PORT;
const app = express(); // create express app

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/test', (req, res) => {
    res.send('Test the route');
})

const startServer = async () => {
    try {
        
        const client = await pool.connect();
        
        console.log(`Connection with the database established 🟢`)
        client.release();
        app.use('/api', authRouter, userRouter, spendingRouter, mailRouter, downloadRouter);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer();