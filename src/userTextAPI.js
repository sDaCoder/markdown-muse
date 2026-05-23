import axios from "axios"
// import dotenv from "dotenv"
// dotenv.config({ path: "../.env.local" })

const baseURL = 'http://localhost:8001/notes'
// const baseURL = `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api` || 'http://localhost:8000/api'
// const baseURL = 'https://markdown-muse.onrender.com/api'
export const USER_TEXTS_CHANGED_EVENT = 'markdown-muse:user-texts-changed'

const resolveUserId = (userID) => {
    const numericId = Number(userID)
    return Number.isFinite(numericId) && numericId > 0 ? numericId : 1
}

const normalizeNote = (note) => {
    if (!note) return note

    return {
        ...note,
        _id: note._id ?? note.textId,
        textId: note.textId ?? note._id,
        lastSaved: note.lastSaved ?? note.updatedAt ?? note.createdAt ?? null,
    }
}

const authRequestConfig = {
    withCredentials: true,
}

export const notifyUserTextsChanged = () => {
    window.dispatchEvent(new CustomEvent(USER_TEXTS_CHANGED_EVENT))
}

export const getAllUserTexts = async (userID) => {
    const resolvedUserId = resolveUserId(userID)
    const res = await axios.get(`${baseURL}/${resolvedUserId}`, authRequestConfig)
    return {
        ...res,
        data: {
            texts: Array.isArray(res.data) ? res.data.map(normalizeNote) : [],
        },
    }
}

export const getLatest3UserTexts = async (userID) => {
    const resolvedUserId = resolveUserId(userID)
    const res = await axios.get(`${baseURL}/latest3/${resolvedUserId}`, authRequestConfig)
    return {
        ...res,
        data: {
            texts: Array.isArray(res.data) ? res.data.map(normalizeNote) : [],
        },
    }
}

export const getUserText = async (userID, textID) => {
    const resolvedUserId = resolveUserId(userID)
    const res = await axios.get(`${baseURL}/${resolvedUserId}/${textID}`, authRequestConfig)
    return {
        ...res,
        data: {
            textObj: normalizeNote(res.data),
        },
    }
}

export const addNewUserText = async (
    userID, 
    textTitle = 'Untitled Text', 
    text = '') => {
    const resolvedUserId = resolveUserId(userID)
    const res = await axios.post(`${baseURL}/${resolvedUserId}`, {
        textTitle,
        text
    }, authRequestConfig)
    return {
        ...res,
        data: normalizeNote(res.data),
    }
}

export const updateUserText = async (userID, editId, textTitle, text) => {
    const updatedTextobj = {}
    if (textTitle !== undefined) updatedTextobj.textTitle = textTitle
    if (text !== undefined) updatedTextobj.text = text
    const resolvedUserId = resolveUserId(userID)
    const res = await axios.patch(`${baseURL}/${resolvedUserId}/${editId}`, updatedTextobj, authRequestConfig)
    return {
        ...res,
        data: normalizeNote(res.data),
    }
}

export const deleteUserText = async (userID, textID) => {
    const resolvedUserId = resolveUserId(userID)
    return axios.delete(`${baseURL}/${resolvedUserId}/${textID}`, authRequestConfig)
}
