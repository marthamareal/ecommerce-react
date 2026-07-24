import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { addOrUpdateCart, fetchProduct } from '../services/ProductService';
import ProductGallery from '../components/ProductGallery';
import '../css/Order.css';

const ProductDetail = () => {
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [addingToCart, setAddingToCart] = useState(false);
    const [added, setAdded] = useState(false);
    const { id } = useParams();

    let token = localStorage.getItem("token");
    if (token === "undefined" || token === "null") token = null;
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const handleQuantityChange = (delta) => {
        setQuantity((q) => Math.max(1, q + delta));
    };

    const handleAddToCart = async () => {
        setAddingToCart(true);
        setAdded(false);
        try {
            await addOrUpdateCart({ productId: product.id, quantity });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (err) {
            console.log(err);
            setError(err.message);
        } finally {
            setAddingToCart(false);
        }
    };

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await fetchProduct(id);
                const data = await res.json();
                if (res.status === 200) {
                    setProduct(data);
                    setImages(data.images ?? []);
                } else {
                    setError(data.message ?? "Product not found.");
                }
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="orders-skeleton aspect-square rounded-2xl bg-gray-100" />
                <div className="space-y-4">
                    <div className="orders-skeleton h-4 w-24 rounded bg-gray-100" />
                    <div className="orders-skeleton h-8 w-3/4 rounded bg-gray-100" />
                    <div className="orders-skeleton h-6 w-32 rounded bg-gray-100" />
                    <div className="orders-skeleton h-24 w-full rounded bg-gray-100" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-lg mx-auto px-4 py-16 text-center">
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-8">
                    <p className="font-semibold text-rose-700">Couldn't load this product</p>
                    <p className="mt-1 text-sm text-rose-600">{error}</p>
                    <Link to="/products" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                        ← Back to products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <Link
                to="/products"
                className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All products
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Gallery */}
                <div>
                    <ProductGallery
                        productId={product.id}
                        images={images}
                        onImagesChange={setImages}
                        isAdmin={isAdmin}
                    />
                </div>

                {/* Details */}
                <div className="flex flex-col">
                    {product.category?.name && (
                        <span className="self-start mb-3 inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                            {product.category.name}
                        </span>
                    )}

                    <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                        {product.name}
                    </h1>

                    <p className="text-2xl text-indigo-600 font-bold mb-6">
                        ${Number(product.price ?? 0).toFixed(2)}
                    </p>

                    {product.description && (
                        <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
                            {product.description}
                        </p>
                    )}

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        {token ? (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Quantity stepper */}
                                <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden self-start">
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                        className="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                                        className="w-12 h-11 text-center border-x border-gray-300 focus:outline-none"
                                        min="1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    className={`flex-1 sm:flex-none px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${added
                                            ? "bg-emerald-600 text-white"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                                        } disabled:opacity-60`}
                                >
                                    {addingToCart ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                            </svg>
                                            Adding…
                                        </>
                                    ) : added ? (
                                        <>✓ Added to Cart</>
                                    ) : (
                                        "Add to Cart"
                                    )}
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                            >
                                Log in to purchase
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
