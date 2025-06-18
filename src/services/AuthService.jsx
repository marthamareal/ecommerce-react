export const registerUser = async (body) => {
    try {
        const res = await fetch("http://localhost:5000/api/users/register", {
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
        const res = await fetch("http://localhost:5000/api/auth/login",
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
        const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
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
        const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
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
