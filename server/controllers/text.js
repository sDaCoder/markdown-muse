import { Text } from "../models/TextModel.js";

export const handleGetAllTexts = async (req, res) => {
    const texts = await Text.find();
    console.log(texts);
    res.status(200).json({
        message: 'This is the API to fetch all the texts',
        texts
    });
}

export const handleAddNewText = async (req, res) => {
    const { text } = req.body;
    const textTitle = req.body.textTitle || 'Untitled Text';
    const textObj = new Text({ text, textTitle, lastSaved: new Date() });
    await textObj.save();
    console.log(textObj);

    res.status(200).json({
        status: 'success',
        message: 'Adding new text to the database',
        text: textObj.text,
        textTitle: textObj.textTitle,
        lastSaved: textObj.lastSaved,
        _id: textObj._id
    });
}

export const handleGetText = async (req, res) => {
    const { textId } = req.params;
    try {
        const textObj = await Text.findOne({ _id: textId });
        if (!textObj) {
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
}

export const handleUpdateText = async (req, res) => {
    const { textId } = req.params;
    const { text, textTitle } = req.body;
    try {
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
            message: 'Some error occured',
            error
        })
    }
}


export const handleDeleteText = async (req, res) => {
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
}