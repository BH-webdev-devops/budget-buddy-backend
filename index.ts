import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 

const PORT = process.env.PORT;
const app = express(); // create express app

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const startServer = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
}

startServer();