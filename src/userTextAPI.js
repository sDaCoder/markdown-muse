import axios from "axios"
// import dotenv from "dotenv"
// dotenv.config({ path: "../.env.local" })

// const baseURL = 'http://localhost:3000/api'
const baseURL = `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api` || 'http://localhost:8000/api'
// const baseURL = 'https://markdown-muse.onrender.com/api'

export const getAllUserTexts = async (userID) => {
    return axios.get(`${baseURL}/${userID}`)
}

export const getUserText = async (userID, textID) => {
    return axios.get(`${baseURL}/${userID}/${textID}`)
}

export const addNewUserText = async (userID, textTitle, text) => {
    return axios.post(`${baseURL}/${userID}`, {
        textTitle,
        text
    })
}

export const updateUserText = async (userID, editId, textTitle, text) => {
    const updatedTextobj = {}
    if (textTitle) updatedTextobj.textTitle = textTitle
    if (text) updatedTextobj.text = text
    return axios.patch(`${baseURL}/${userID}/${editId}`, updatedTextobj)
}

export const deleteUserText = async (userID, textID) => {
    return axios.delete(`${baseURL}/${userID}/${textID}`)
}