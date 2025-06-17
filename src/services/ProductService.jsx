const token = localStorage.getItem("token");

export const fetchProducts = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
        if (!res.ok) throw new Error("Failed to fetch products.");

        const data = await res.json();
        return data
    }
    catch (err) {
        console.log(err)
    }
}

export const fetchProduct = async (id) => {
    try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
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
        const res = await fetch("http://localhost:5000/api/products/cart/items", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token.trim(),
            }
        })
        if (!res.ok) throw new Error("Failed to fetch Cart.");

        const data = await res.json();
        return data
    }
    catch (err) {
        console.log(err)
    }
}

export const addOrUpdateCart = async (requestData) => {
    try {
        const res = await fetch("http://localhost:5000/api/products/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token.trim(),
            },
            body: JSON.stringify(requestData)
        })
        if (!res.ok) throw new Error("Failed to add item to Cart.");
        const data = await res.json();
        return data
    }
    catch (err) {
        console.log(err)
    }
}

export const removeFromCart = async (requestData) => {
    try {
        const res = await fetch("http://localhost:5000/api/products/cart/items/remove", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token.trim(),
            },
            body: JSON.stringify(requestData)
        })
        if (!res.ok) throw new Error("Failed to remove Item.");

        const data = await res.json();
        return data
    }
    catch (err) {
        console.log(err)
    }
}
