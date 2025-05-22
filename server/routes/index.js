import { Router } from "express";
import {
    handleAddNewUserText,
    handleDeleteUserText,
    handleGetAllUserTexts,
    handleGetUserText,
    handleUpdateUserText
} from "../controllers/userText.js";

const userTextRouter = Router();

userTextRouter
    .route('/:userId')
    .get(handleGetAllUserTexts)
    .post(handleAddNewUserText)

userTextRouter
    .route('/:userId/:textId')
    .get(handleGetUserText)
    .patch(handleUpdateUserText)
    .delete(handleDeleteUserText)

export default userTextRouter