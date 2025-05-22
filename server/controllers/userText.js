import { UserText } from "../models/UserTextModel.js";
import { Text } from "../models/TextModel.js";

export const handleGetAllUserTexts = async (req, res) => {
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
}

export const handleAddNewUserText = async (req, res) => {
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
}

export const handleGetUserText = async (req, res) => {
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
}

export const handleUpdateUserText = async (req, res) => {
    const { userId, textId } = req.params;
    const { text, textTitle } = req.body;
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
}

export const handleDeleteUserText = async (req, res) => {
    const { userId, textId } = req.params;
    try {
        const userTextObj = await UserText.findOne({ userId });
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
        await Text.deleteOne({ _id: textId });
        res.status(200).json({
            status: 'success',
            message: 'Text deleted successfully',
            textObj
        })
    } catch (error) {
        res.status(500).json({
            message: 'Some error occured in DELETE request',
            error
        })
    }
}