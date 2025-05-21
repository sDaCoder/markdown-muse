import mongoose from "mongoose";
import { textSchema, Text } from "./TextModel.js";

const userTextSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        message: 'Clerk did not provide us the UserId from the Client side'
    },
    texts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Text'
    }]
})

export const UserText = mongoose.model('UserText', userTextSchema);