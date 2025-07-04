const apiUrl = import.meta.env.VITE_API_BASE_URL
const token = localStorage.getItem("token");

export const fetchCategories = async () => {
    try {
        const res = await fetch(`${apiUrl}/products/categories/retrieve`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        if (!res.ok) throw new Error("Failed to fetch Categories.");

        return res
    }
    catch (err) {
        console.log(err)
    }
}


export const addProduct= async (requestData) => {
    try {
        const res = await fetch(`${apiUrl}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token.trim(),
            },
            body: JSON.stringify(requestData)
        })
        if (!res.ok) throw new Error("Failed to add product.");
        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const fetchProducts = async () => {
    try {
        const res = await fetch(`${apiUrl}/products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        if (!res.ok) throw new Error("Failed to fetch products.");

        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const fetchProduct = async (id) => {
    try {
        const res = await fetch(`${apiUrl}/products/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        if (!res.ok) setError("Product Not found.");

        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const fetchCart = async () => {
    try {
        const res = await fetch(`${apiUrl}/products/cart/items`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token.trim(),
            }
        })
        if (!res.ok) throw new Error("Failed to fetch Cart.");

        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const addOrUpdateCart = async (requestData) => {
    try {
        const res = await fetch(`${apiUrl}/products/cart/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token.trim(),
            },
            body: JSON.stringify(requestData)
        })
        if (!res.ok) throw new Error("Failed to add item to Cart.");
        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const removeFromCart = async (requestData) => {
    try {
        const res = await fetch(`${apiUrl}/products/cart/items/remove`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token.trim(),
            },
            body: JSON.stringify(requestData)
        })
        if (!res.ok) throw new Error("Failed to remove Item.");

        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const createOrder = async (id) => {
    try {
        const res = await fetch(`${apiUrl}/products/orders/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token.trim(),
            }
        })
        if (!res.ok) throw new Error("Failed to create Order.");
        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const fetchOrders = async () => {
    try {
        const res = await fetch(`${apiUrl}/products/orders/retrieve`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token.trim(),
            }
        })
        if (!res.ok) throw new Error("Failed to fetch Orders.");

        return res
    }
    catch (err) {
        console.log(err)
    }
}

export const fetchOrder = async (id) => {
    try {
        const res = await fetch(`${apiUrl}/products/orders/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token.trim(),
            }
        })
        if (!res.ok) throw new Error("Failed to fetch Order.");
        return res
    }
    catch (err) {
        console.log(err)
    }
}