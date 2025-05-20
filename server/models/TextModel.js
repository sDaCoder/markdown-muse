import mongoose from 'mongoose';

const textSchema = new mongoose.Schema({
    textTitle: {
        type: String,
        default: "Untitled Text"
    },
    text: String,
    lastSaved: {
        type: Date,
        default: Date.now
    }
})

export const Text = mongoose.model('Text', textSchema);