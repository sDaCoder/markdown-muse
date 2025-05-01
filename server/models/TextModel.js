import mongoose from 'mongoose';

const textSchema = new mongoose.Schema({
    text: String
})

export const Text = mongoose.model('Text', textSchema);