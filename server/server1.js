import express from 'express';
import cors from 'cors';
import { sequelize } from './dbConfigSQL.js';
import { UserModelSQL } from './models/UserModelSQL.js';
import { TextModelSQL } from './models/TextModelSQL.js';
import { createNote, deleteNote, getAllNotes, getLatest3Notes, getNoteById, updateNote } from './controllers/textSQL.js';
import cookieParser from 'cookie-parser';
import { protect } from './middlewares/protectUser.js';
import { loginUser, logoutUser, registerUser, userLoginStatus } from './controllers/userSQL.js';

const app = express();
const PORT = 8001;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

// sequelize.sync({ force: true })
sequelize.sync()
UserModelSQL.hasMany(TextModelSQL, { foreignKey: "userId" });

app.post('/register', registerUser)
app.post('/login', loginUser)
app.post('/logout', logoutUser)
app.get('/status', userLoginStatus)

app.route('/notes/latest3/:userId')
    .get(protect, getLatest3Notes)

app.route('/notes/:userId')
    .get(protect, getAllNotes)
    .post(protect, createNote)

app.route('/notes/:userId/:textId')
    .get(protect, getNoteById)
    .patch(protect, updateNote)
    .delete(protect, deleteNote)

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
