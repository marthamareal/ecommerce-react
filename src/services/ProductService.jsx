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
