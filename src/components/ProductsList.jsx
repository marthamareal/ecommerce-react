import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { addOrUpdateCart, fetchCategories, fetchProducts } from '../services/ProductService';
import Pagination from './Pagination';

export default function ProductsList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pages, setPages] = useState(1);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    let isAdmin = localStorage.getItem("isAdmin") === "true";

    // URL is the single source of truth for page + category + search.
    const page = Number(searchParams.get('page')) || 1;
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    // Local, immediate-typing state for the search box. Kept separate from
    // `search` (the URL value) so keystrokes feel instant while the actual
    // request/URL update is debounced.
    const [searchInput, setSearchInput] = useState(search);

    // If the URL's search value changes from outside this input (back/forward
    // navigation, a shared link, etc.), keep the box in sync.
    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    const addToCart = async (productId, qty = 1) => {
        // Add to cart with API
        try {
            await addOrUpdateCart({ productId: productId, quantity: qty });
            navigate("/cart");
        }
        catch (err) {
            console.log(err);
            setError(err.message);
        }
    };

    // Update category and reset page in a single URL change so the two never
    // go out of sync (this is what fixed the "stale page on filter change" bug).
    const handleCategoryChange = (newCategory) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (newCategory) next.set('category', newCategory);
            else next.delete('category');
            next.set('page', '1');
            return next;
        });
    };

    const handlePageChange = (newPage) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('page', String(newPage));
            return next;
        });
    };

    const handleSearchChange = (newSearch) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (newSearch) next.set('search', newSearch);
            else next.delete('search');
            next.set('page', '1');
            return next;
        });
    };

    // Debounce: only push the URL/API update 400ms after the person stops typing.
    useEffect(() => {
        if (searchInput === search) return;
        const timeout = setTimeout(() => {
            handleSearchChange(searchInput);
        }, 400);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const result = await fetchProducts({ page, category, search });
                const data = await result.json();
                if (result.status == 200) {
                    setPages(data.pages);
                    setProducts(Array.isArray(data.data) ? data.data : []);
                }
            }
            catch (err) {
                console.log(err);
                setError(err.message);
            }
        };
        getProducts();
    }, [category, page, search]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const result = await fetchCategories();
                const data = await result.json();
                if (result.status == 200) setCategories(data);
            }
            catch (err) {
                console.log(err);
                setError(err.message);
            }
        };
        getCategories();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                {/* Search Input */}
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
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
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All</option>
                            {categories.map((cat) => (
                                <option value={cat.id} key={cat.id}>
                                    {cat.name}
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

            {/* Pagination Controls */}
            <Pagination currentPage={page} totalPages={pages} onPageChange={handlePageChange} />
        </div>
    );
}
