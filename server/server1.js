import express from 'express';
import cors from 'cors';
import bycrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sequelize } from './dbConfigSQL.js';
import { UserModelSQL } from './models/UserModelSQL.js';
import { TextModelSQL } from './models/TextModelSQL.js';
import { createNote, deleteNote, getAllNotes, getLatest3Notes, getNoteById, updateNote } from './controllers/textSQL.js';
import { generateAccessToken, generateRefreshToken } from './utils/generateTokens.js';
import cookieParser from 'cookie-parser';

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

const protect = (req, res, next) => {

    const accessToken = req.cookies.accessToken

    if(!accessToken) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        )
        req.user = decoded
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: error.message })
    }
}

app.route('/notes/latest3/:userId')
    .get(getLatest3Notes)
    // .get(protect, getLatest3Notes)

app.route('/notes/:userId')
    .get(getAllNotes)
    .post(createNote)
    // .get(protect, getAllNotes)
    // .post(protect, createNote)

app.route('/notes/:userId/:textId')
    .get(getNoteById)
    .patch(updateNote)
    .delete(deleteNote)
    // .get(protect, getNoteById)
    // .patch(protect, updateNote)
    // .delete(protect, deleteNote)

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await UserModelSQL.findOne({ where: { email } });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bycrypt.hash(password, 10);
        const newUser = await UserModelSQL.create({ name, email, passwordHash: hashedPassword });

        const accessToken = generateAccessToken(newUser)
        const refreshToken = generateRefreshToken(newUser)

        newUser.refreshToken = refreshToken;
        await newUser.save();
        
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.status(200).json({ message: "User registered successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

app.post('/login', async (req, res) => { 
    const { email, password } = req.body;

    try {
        const existingUser = await UserModelSQL.findOne({ where: { email } });
        if(!existingUser) {
            return res.status(400).json({ message: "Create an account to login" });
        }

        const isMatch = await bycrypt.compare(
            password,
            existingUser.passwordHash
        )

        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(existingUser)
        const refreshToken = generateRefreshToken(existingUser)

        existingUser.refreshToken = refreshToken;
        await existingUser.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        })

        res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});