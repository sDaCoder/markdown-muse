import { UserModelSQL } from "../models/UserModelSQL.js";
import bycrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
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
}

export const loginUser = async (req, res) => { 
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
}

export const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        if (refreshToken) {
            const existingUser = await UserModelSQL.findOne({ where: { refreshToken } });

            if (existingUser) {
                existingUser.refreshToken = null;
                await existingUser.save();
            }
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

export const userLoginStatus = (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(200).json({ loggedIn: false });
    }

    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        return res.status(200).json({
            loggedIn: true,
            user: decoded
        });
    } catch (error) {
        return res.status(200).json({ loggedIn: false });
    }
}