import express from 'express';
import cors from 'cors';
import connectDB from './dbConfig.js';
import { Text } from './models/TextModel.js';
import { UserText } from './models/UserTextModel.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// app.get('/api', async (req, res) => {
//     const texts = await Text.find();
//     console.log(texts);
//     res.status(200).json({
//         message: 'This is the API to fetch all the texts',
//         texts
//     });
// })

app.get('/api/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const userTextObj = await UserText.findOne({ userId }).populate('texts');
        if (!userTextObj) {
            return res.status(404).json({
                message: 'User not found',
            })
        }
        console.log(userTextObj);

        res.status(200).json({
            message: 'This is the API to fetch all the texts of a specific user',
            userId: userTextObj.userId,
            texts: userTextObj.texts
        });
    } catch (error) {
        res.status(500).json({
            message: 'Some error occured',
            error
        })
    }
})

// app.get('/api/:textId', async (req, res) => {
//     const { textId } = req.params;
//     try {
//         const textObj = await Text.findOne({ _id: textId });
//         if (!textObj) {
//             return res.status(404).json({
//                 message: 'Text not found',
//             })
//         }

//         console.log(textObj);
//         res.status(200).json({
//             message: 'This is the API to fetch a specific text',
//             textObj
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: 'Some error occured',
//             error
//         })
//     }
// })

app.get('/api/:userId/:textId', async (req, res) => {
    const { userId, textId } = req.params;
    try {
        const userTextObj = await UserText.findOne({ userId }).populate('texts');
        if (!userTextObj) {
            return res.status(404).json({
                message: 'User not found',
            })
        }
        const textObj = await Text.findOne({ _id: textId });
        if (!textObj) {
            return res.status(404).json({
                message: 'Text not found',
            })
        }
        console.log(textObj);
        res.status(200).json({
            message: 'This is the API to fetch a specific text for an specific user',
            textObj
        });
    } catch (error) {
        res.status(500).json({
            message: 'Some error occured',
            error
        })
    }
})

// app.post('/api', async (req, res) => {
//     const { text } = req.body;
//     const textTitle = req.body.textTitle || 'Untitled Text';
//     const textObj = new Text({ text, textTitle, lastSaved: new Date() });
//     await textObj.save();
//     console.log(textObj);

//     res.status(200).json({
//         status: 'success',
//         message: 'Adding new text to the database',
//         text: textObj.text,
//         textTitle: textObj.textTitle,
//         lastSaved: textObj.lastSaved,
//         _id: textObj._id
//     });
// })

app.post('/api/:userId', async (req, res) => {
    const { userId } = req.params;
    const { text } = req.body;
    const textTitle = req.body.textTitle || 'Untitled Text';
    const textObj = new Text({ text, textTitle })
    await textObj.save();

    let userTextObj = await UserText.findOne({ userId });
    let message;
    if (!userTextObj) {
        console.log('Creating a new user with the userId: ', userId);
        userTextObj = new UserText({ userId, texts: [textObj] });
        message = 'Adding new user and text to the database';
    }
    else {
        console.log('User found');
        userTextObj.texts.push(textObj);
        message = 'Adding new text to the given user in the database';
    }

    res.status(200).json({
        status: 'success',
        message,
        userId,
        text: textObj.text,
        textTitle: textObj.textTitle,
        lastSaved: textObj.lastSaved,
        _id: textObj._id
    });
    await userTextObj.save();
    console.log(userTextObj);
})

// app.patch('/api/:textId', async (req, res) => {
//     const { textId } = req.params;
//     const { text, textTitle } = req.body;
//     try {
//         const textObj = await Text.findOne({ _id: textId });
//         if (!textObj) {
//             return res.status(404).json({
//                 message: 'Text not found',
//             })
//         }
//         console.log('PATCH Request activated');

//         console.log("Old text: ", textObj);
//         if (text !== undefined) textObj.text = text;
//         if (textTitle !== undefined) textObj.textTitle = textTitle;
//         textObj.lastSaved = new Date();
//         await textObj.save();
//         console.log("New text: ", textObj);
//         res.status(200).json({
//             status: 'success',
//             message: 'Text updated successfully',
//             text: textObj.text,
//             textTitle: textObj.textTitle,
//             lastSaved: textObj.lastSaved,
//             _id: textObj._id
//         })
//     } catch (error) {
//         res.status(500).json({
//             message: 'Some error occured',
//             error
//         })
//     }
// })

app.patch('/api/:userId/:textId', async (req, res) => {
    const { userId, textId } = req.params;
    const { text } = req.body;
    const textTitle = req.body.textTitle || 'Untitled Text';
    try {
        const userTextObj = await UserText.findOne({ userId }).populate('texts');
        if (!userTextObj) {
            return res.status(404).json({
                message: 'User not found',
            })
        }
        const textObj = await Text.findOne({ _id: textId });
        if (!textObj) {
            return res.status(404).json({
                message: 'Text not found',
            })
        }
        console.log('PATCH Request activated');

        console.log("Old text: ", textObj);
        if (text !== undefined) textObj.text = text;
        if (textTitle !== undefined) textObj.textTitle = textTitle;
        textObj.lastSaved = new Date();
        await textObj.save();
        console.log("New text: ", textObj);
        res.status(200).json({
            status: 'success',
            message: 'Text updated successfully',
            text: textObj.text,
            textTitle: textObj.textTitle,
            lastSaved: textObj.lastSaved,
            _id: textObj._id
        })
        
    } catch (error) {
        res.status(500).json({
            message: 'Some error occured in patch request',
            error
        })
    }
})

app.delete('/api/:textId', async (req, res) => {
    const { textId } = req.params;
    try {
        const textObj = await Text.findOne({ _id: textId });
        if (!textObj) {
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