import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

const SignedInJWT = ({ children, fallback = null }) => {
    const auth = useContext(AuthContext)

    if (!auth) {
        return fallback
    }

    const { user, userLoading } = auth

    if (userLoading) {
        return null
    }

    if (!user) {
        return fallback
    }

    return children
}

export default SignedInJWT
