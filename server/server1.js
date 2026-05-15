import express from 'express';
import { sequelize } from './dbConfigSQL.js';
import { UserModelSQL } from './models/UserModelSQL.js';
import { TextModelSQL } from './models/TextModelSQL.js';
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from './controllers/textSQL.js';

const app = express();
const PORT = 8001;

app.use(express.json());
UserModelSQL.hasMany(TextModelSQL, { foreignKey: "userId" });

app.route('/notes/:userId')
    .get(getAllNotes)
    .post(createNote)

app.route('/notes/:userId/:textId')
    .get(getNoteById)
    .patch(updateNote)
    .delete(deleteNote)

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});