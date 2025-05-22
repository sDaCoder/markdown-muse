import express from 'express';
import cors from 'cors';
import connectDB from './dbConfig.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    handleAddNewUserText,
    handleDeleteUserText,
    handleGetAllUserTexts,
    handleGetUserText,
    handleUpdateUserText
} from './controllers/userText.js';
import {
    handleAddNewText,
    handleDeleteText,
    handleGetAllTexts,
    handleGetText,
    handleUpdateText
} from './controllers/text.js';
import userTextRouter from './routes/index.js';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root (one level up from /server)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// app
//     .route('/api')
//     .get(handleGetAllTexts)
//     .post(handleAddNewText)

// app
//     .route('/api/:textId')
//     .get(handleGetText)
//     .patch(handleUpdateText)
//     .delete(handleDeleteText)


// app
//     .route('/api/:userId')
//     .get(handleGetAllUserTexts)
//     .post(handleAddNewUserText)


// app
//     .route('/api/:userId/:textId')
//     .get(handleGetUserText)
//     .patch(handleUpdateUserText)
//     .delete(handleDeleteUserText)

app.use('/api', userTextRouter)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop the server.`);
})