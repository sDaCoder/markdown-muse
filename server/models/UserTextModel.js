import mongoose from "mongoose";
import Text from "./TextModel.js";

const userTextSchema = new mongoose.Schema({
    userID: String,
    texts: [Text.Schema]
})
    
export const UserText = mongoose.model('UserText', userTextSchema);