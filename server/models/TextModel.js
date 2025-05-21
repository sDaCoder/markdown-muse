import mongoose from 'mongoose';

export const textSchema = new mongoose.Schema({
    textTitle: {
        type: String,
        default: "Untitled Text"
    },
    text: String,
    lastSaved: {
        type: Date,
        default: () => new Date()
    }
})

export const Text = mongoose.model('Text', textSchema);