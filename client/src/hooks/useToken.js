import { useState } from "react"

function useToken() {
    function getToken() {
        const tokenStr = localStorage.getItem("token")
        const userToken = JSON.parse(tokenStr)
        return userToken
    }

    const [ token, setToken ] = useState(getToken())
    function saveToken(userToken) {
        localStorage.setItem("token", JSON.stringify(userToken))
        setToken(userToken)
    }
    return {
        setToken: saveToken,
        token
    }
}

export default useToken