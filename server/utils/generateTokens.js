import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.userId,
            name: user.name,
            email: user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.userId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );
};
