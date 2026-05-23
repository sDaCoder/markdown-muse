import axios from "axios"
import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [userLoading, setUserLoading] = useState(true)

    const checkAuth = async () => {
        setUserLoading(true)

        try {
            const res = await axios.get("http://localhost:8001/status", {
                withCredentials: true
            })

            setUser(res.data.loggedIn ? res.data.user : null)
        } catch (error) {
            console.log(error)
            setUser(null)
        } finally {
            setUserLoading(false)
        }
    }

    const logout = async () => {
        await axios.post("http://localhost:8001/logout", {}, {
            withCredentials: true
        })

        setUser(null)
    }

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            userLoading,
            refreshAuth: checkAuth,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}
