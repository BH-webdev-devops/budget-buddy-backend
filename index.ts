import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 
import { pool } from './database/db';

const PORT = process.env.PORT;
const app = express(); // create express app

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const startServer = async () => {
    try {
        const client = await pool.connect();
        console.log(`Connection with the database established 🟢`)
        client.release();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer();