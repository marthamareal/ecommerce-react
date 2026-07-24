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

    // URL is the single source of truth for page + category + search + price range.
    const page = Number(searchParams.get('page')) || 1;
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    // Local, immediate-typing state for the search box. Kept separate from
    // `search` (the URL value) so keystrokes feel instant while the actual
    // request/URL update is debounced.
    const [searchInput, setSearchInput] = useState(search);
    const [minPriceInput, setMinPriceInput] = useState(minPrice);
    const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);

    // If the URL's values change from outside these inputs (back/forward
    // navigation, a shared link, etc.), keep the fields in sync.
    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    useEffect(() => {
        setMinPriceInput(minPrice);
        setMaxPriceInput(maxPrice);
    }, [minPrice, maxPrice]);

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

    const handlePriceChange = (newMin, newMax) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (newMin) next.set('minPrice', newMin);
            else next.delete('minPrice');
            if (newMax) next.set('maxPrice', newMax);
            else next.delete('maxPrice');
            next.set('page', '1');
            return next;
        });
    };

    const clearPriceFilter = () => {
        setMinPriceInput('');
        setMaxPriceInput('');
        handlePriceChange('', '');
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
        if (minPriceInput === minPrice && maxPriceInput === maxPrice) return;
        const timeout = setTimeout(() => {
            handlePriceChange(minPriceInput, maxPriceInput);
        }, 500);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minPriceInput, maxPriceInput]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const result = await fetchProducts({ page, category, search, minPrice, maxPrice });
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
    }, [category, page, search, minPrice, maxPrice]);

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
            {/* Search + Filters */}
            <div className="mb-6 space-y-3">
                {/* Search Input */}
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="flex flex-wrap items-center gap-3">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-5 h-5 text-indigo-600 shrink-0"
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
                        <select
                            value={category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All categories</option>
                            {categories.map((cat) => (
                                <option value={cat.id} key={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range Filter */}
                    <div className="flex items-center gap-2 border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
                        <span className="text-gray-400 text-sm">$</span>
                        <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            placeholder="Min"
                            value={minPriceInput}
                            onChange={(e) => setMinPriceInput(e.target.value)}
                            className="w-16 sm:w-20 text-sm outline-none"
                        />
                        <span className="text-gray-300">–</span>
                        <span className="text-gray-400 text-sm">$</span>
                        <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            placeholder="Max"
                            value={maxPriceInput}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            className="w-16 sm:w-20 text-sm outline-none"
                        />
                        {(minPriceInput || maxPriceInput) && (
                            <button
                                type="button"
                                onClick={clearPriceFilter}
                                aria-label="Clear price filter"
                                className="text-gray-400 hover:text-gray-600 ml-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Admin Button — pushed to the far end on wide screens, wraps to its own row on narrow ones */}
                    {isAdmin && (
                        <Link
                            to="/products/add"
                            className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition whitespace-nowrap text-sm"
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
                                src={product.images?.[0]?.url || '/images/no-img.png'}
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
