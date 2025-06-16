import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/ProductService';

export default function Products() {
    const [products, setProducts] = useState([])
    const [error, setError] = useState("");

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts()
                setProducts(data);
            }
            catch (err) {
                console.log(err)
                setError(err.message)
            }
        }
        getProducts();
    }, []);
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full sm:w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-2 w-full sm:w-1/3">
                    {/* Icon + Text */}
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

                    {/* Dropdown */}
                    <select
                        value=''
                        onChange=''
                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="All">All</option>
                        <option value="Electronics">Category 1</option>
                        <option value="Fashion">Category 2</option>
                        <option value="Accessories">Cartegory 3</option>
                    </select>
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
                                src={product.image || '/src/assets/no-img.png'}
                                alt={product.name}
                                className="w-full h-32 object-cover mb-4 rounded"
                            />
                            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                            <p className="text-indigo-600 font-bold mt-1">{product.price}</p>
                        </Link>

                        <button className="mt-3 w-full bg-indigo-600 text-white py-1.5 rounded hover:bg-indigo-700 transition">
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
