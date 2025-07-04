import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addOrUpdateCart, fetchCategories, fetchProducts } from '../services/ProductService';

export default function ProductsList() {
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState("")
    const [categories, setCategories] = useState([])
    const [error, setError] = useState("");
    const navigate = useNavigate();
    let isAdmin = localStorage.getItem("isAdmin") === "true"

    const addToCart = async (productId, qty = 1) => {
        // Add to cart with API
        try {
            await addOrUpdateCart({ productId: productId, quantity: qty })
            navigate("/cart")
        }
        catch (err) {
            console.log(err)
            setError(err.message)
        }
    };

    useEffect(() => {
        const getProducts = async () => {
            try {
                const result = await fetchProducts()
                const data = await result.json();
                if (result.status == 200) {
                    // Apply filtes: NOTE base them on API after filter is added
                    const filteredProducts = category
                        ? data.filter((p) => p.category.name === category)
                        : data;
                    setProducts(filteredProducts);
                }
            }
            catch (err) {
                console.log(err)
                setError(err.message)
            }
        }
        getProducts();
    }, [category]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const result = await fetchCategories()
                const data = await result.json();
                if (result.status == 200) setCategories(data);
            }
            catch (err) {
                console.log(err)
                setError(err.message)
            }
        }
        getCategories();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full sm:w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Filter + Button in a Row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-1/2 justify-end">
                    {/* Filter Dropdown */}
                    <div className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-1 text-gray-700 font-medium whitespace-nowrap">
                            <svg
                                className="w-5 h-5 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 14.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-6.586L3.293 6.707A1 1 0 013 6V4z"
                                />
                            </svg>
                            Filter by Categories:
                        </div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All</option>
                            {categories.map((category) => (
                                <option value={category.name} key={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Button */}
                    {isAdmin && (
                        <Link
                            to="/products/add"
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition whitespace-nowrap"
                        >
                            Add Product
                        </Link>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white border shadow-sm rounded-lg p-4 hover:shadow-md transition flex flex-col"
                    >
                        <Link to={`/products/${product.id}`} className="flex-1">
                            <img
                                src={product.image || '/images/no-img.png'}
                                alt={product.name}
                                className="w-full h-32 object-cover mb-4 rounded"
                            />
                            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                            <p className="text-indigo-600 font-bold mt-1">${product.price}</p>
                        </Link>

                        <button
                            onClick={() => addToCart(product.id)}
                            className="mt-3 w-full bg-indigo-600 text-white py-1.5 rounded hover:bg-indigo-700 transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
