const apiUrl = import.meta.env.VITE_API_BASE_URL

export const registerUser = async (body) => {
    try {
        const res = await fetch(`${apiUrl}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(body)
        })
        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const loginUser = async (body) => {
    try {
        const res = await fetch(`${apiUrl}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(body)
            }
        )
        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const forgotPassword = async (body) => {
    try {
        const res = await fetch(`${apiUrl}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(body)
        })
        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const resetPassword = async (token, body) => {
    try {
        const res = await fetch(`${apiUrl}/auth/reset-password/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(body)
        })
        return res
    }
    catch (err) {
        console.log(err)
    }
}
