import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://sda-e2023:test123@init-cluster.gpiom.mongodb.net/markdown-muse?retryWrites=true&w=majority&appName=Init-Cluster');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectDB