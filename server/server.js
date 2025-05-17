import express from 'express';
import cors from 'cors';
import connectDB from './dbConfig.js';
import { Text } from './models/TextModel.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.get('/api', async (req, res) => {
    const texts = await Text.find();
    console.log(texts);
    res.status(200).json({ 
        message: 'This is the API to fetch all the texts',
        texts 
    });
})

app.get('/api/:textId', async (req, res) => {
    const { textId } = req.params;
    try {
        const textObj = await Text.findOne({ _id: textId });
        if(!textObj) {
            return res.status(404).json({
                message: 'Text not found',
            })
        }

        console.log(textObj);
        res.status(200).json({ 
            message: 'This is the API to fetch a specific text',
            textObj 
        });
    } catch (error) {
        res.status(500).json({
            message: 'Some error occured',
            error
        })
    }
})

app.post('/api', async (req, res) => {
    const { text } = req.body;
    const textObj = new Text({ text });
    await textObj.save();
    console.log(textObj);

    res.status(200).json({ 
        status: 'success',
        message: 'Read the text from the reuqest object',
        text
    });
})

app.patch('/api/:textId', async (req, res) => {
    const { textId } = req.params;
    const { text } = req.body;
    try {
        const textObj = await Text.findOne({ _id: textId });
        if(!textObj) {
            return res.status(404).json({
                message: 'Text not found',
            })
        }

        console.log("Old text: ", textObj);
        textObj.text = text;
        await textObj.save();
        console.log("New text: ", textObj);
        res.status(200).json({
            status: 'success',
            message: 'Text updated successfully',
            text
        })
    } catch (error) {
        res.status(500).json({
            message: 'Some error occured',
            error
        })
    }
})

app.delete('/api/:textId', async (req, res) => {
    const { textId } = req.params;
    try {
        const textObj = await Text.findOne({ _id: textId });
        if(!textObj) {
            return res.status(404).json({
                message: 'Text not found',
            })
        }
        console.log(textObj);
        await Text.deleteOne({ _id: textId });
        res.status(200).json({
            status: 'success',
            message: 'Text deleted successfully',
            textObj
        })
    } catch (error) {
        res.status(500).json({
            message: 'Some error occured',
            error
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop the server.`);
})