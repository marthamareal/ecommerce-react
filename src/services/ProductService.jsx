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

/**
 * Uploads a single file to S3 via the backend's generic upload endpoint.
 * Does NOT touch the product/DB — it only returns { url, key } for the
 * caller to include in a product create/update payload.
 *
 * Uses XMLHttpRequest (not fetch) so we get real upload progress events.
 */
function uploadFileToS3(file, onProgress) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("images", file); // backend field name, accepts 1+ files

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${apiUrl}/uploads/images`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data.images[0]); // { url, key }
                } catch {
                    reject(new Error("Unexpected response from upload server."));
                }
            } else {
                try {
                    const data = JSON.parse(xhr.responseText);
                    reject(new Error(data.message ?? "Upload failed."));
                } catch {
                    reject(new Error("Upload failed."));
                }
            }
        };
        xhr.onerror = () => reject(new Error("Upload failed."));

        xhr.send(formData);
    });
}

/**
 * Uploads multiple files to S3 in one request (no per-file progress, only
 * an overall one). Useful for the "create product" flow where files are
 * staged and sent together before the product exists.
 */
export async function uploadProductImage(files, onProgress) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${apiUrl}/uploads/images`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data.images); // [{ url, key }, ...]
                } catch {
                    reject(new Error("Unexpected response from upload server."));
                }
            } else {
                try {
                    const data = JSON.parse(xhr.responseText);
                    reject(new Error(data.message ?? "Upload failed."));
                } catch {
                    reject(new Error("Upload failed."));
                }
            }
        };
        xhr.onerror = () => reject(new Error("Upload failed."));

        xhr.send(formData);
    });
}

/**
 * Sends the full desired image set to the product update endpoint.
 * The backend replaces the product's images with exactly this list — order
 * in the array determines `position`, and index 0 becomes `isPrimary`
 * (matching the same convention used on create).
 *
 * Returns the updated product (including resolved `images` with real ids).
 */
async function saveProductImages(productId, images) {
    const res = await fetch(`${apiUrl}/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Could not update images.");
    return data; // updated product, includes `images`
}

/**
 * Uploads one file and appends it to the product's current image set.
 * `currentImages` is whatever the caller already has in state — avoids an
 * extra fetch just to know what's there before appending.
 *
 * Returns the updated product's `images` array.
 */
export async function addProductImage(productId, currentImages, file, onProgress) {
    const uploaded = await uploadFileToS3(file, onProgress); // { url, key }

    const nextImages = [
        ...currentImages.map((img) => ({ url: img.url, key: img.key })),
        { url: uploaded.url, key: uploaded.key },
    ];

    const product = await saveProductImages(productId, nextImages);
    return product.images;
}

export async function deleteProductImage(productId, currentImages, imageId) {
    const nextImages = currentImages
        .filter((img) => img.id !== imageId)
        .map((img) => ({ url: img.url, key: img.key }));

    const product = await saveProductImages(productId, nextImages);
    return product.images;
}

export async function setPrimaryImage(productId, currentImages, imageId) {
    // Primary is derived from array order (index 0), so move the chosen
    // image to the front before saving.
    const target = currentImages.find((img) => img.id === imageId);
    if (!target) throw new Error("Image not found.");

    const rest = currentImages.filter((img) => img.id !== imageId);
    const nextImages = [target, ...rest].map((img) => ({ url: img.url, key: img.key }));

    const product = await saveProductImages(productId, nextImages);
    return product.images;
}

export async function reorderProductImages(productId, orderedImages) {
    const nextImages = orderedImages.map((img) => ({ url: img.url, key: img.key }));
    const product = await saveProductImages(productId, nextImages);
    return product.images;
}
