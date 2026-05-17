import { TextModelSQL } from "../models/TextModelSQL.js";
import { UserModelSQL } from "../models/UserModelSQL.js";

export const getAllNotes = async (req, res) => {
    const { userId } = req.params;
    try {
        const notes = await TextModelSQL.findAll({ where: { userId } });
        res.json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getNoteById = async (req, res) => {
    const { userId, textId } = req.params;
    try {
        const note = await TextModelSQL.findOne({ where: { userId, textId } });
        if (note) {
            res.json(note);
        } else {
            res.status(404).json({ error: "Note not found" });
        }
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createNote = async (req, res) => {
    const { userId } = req.params;
    const { textTitle, text } = req.body;
    try {
        const user = await UserModelSQL.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const newNote = await TextModelSQL.create({ userId, textTitle, text });
        res.status(201).json(newNote);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateNote = async (req, res) => {
    const { userId, textId } = req.params;
    const { textTitle, text } = req.body;
    try {
        const note = await TextModelSQL.findOne({ where: { userId, textId } });
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }
        note.textTitle = textTitle || note.textTitle;
        note.text = text || note.text;
        await note.save();
        res.json(note);
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteNote = async (req, res) => {
    const { userId, textId } = req.params;
    try {
        const note = await TextModelSQL.findOne({ where: { userId, textId } });
        if (!note) {
            return res.status(404).json({ error: "Note not found" });
        }
        await note.destroy();
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getLatest3Notes = async (req, res) => {
    const { userId } = req.params;
    try {
        const notes_latest3 = await TextModelSQL.findAll({
            where: { userId },
            order: [['updatedAt', 'DESC']],
            limit: 3
        });
        res.json(notes_latest3);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
