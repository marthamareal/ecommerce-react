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

export const fetchProducts = async ({
    page = 1,
    category = "",
    search = "",
    featured = false,
    minPrice = "",
    maxPrice = "",
    limit = 10,
} = {}) => {
    try {
        const params = new URLSearchParams();
        params.set("page", page);
        if (category) params.set("category", category);
        if (search) params.set("search", search);
        if (featured) params.set("featured", featured);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        params.set("limit", limit);

        const res = await fetch(`${apiUrl}/products?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        if (!res.ok) throw new Error("Failed to fetch products.");

        return res;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

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

export const fetchOrders = async (page=1) => {
    try {
        const res = await fetch(`${apiUrl}/products/orders/retrieve?page=${page}`, {
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