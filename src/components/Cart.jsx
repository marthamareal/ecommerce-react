import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOrUpdateCart, createOrder, fetchCart, removeFromCart } from '../services/ProductService';

export default function Cart() {
    const navigate = useNavigate();
    const [availableCartItems, setAvailableCartItems] = useState([])
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const getAvailableCartItems = async () => {
            try {
                const data = await fetchCart();
                setAvailableCartItems(data.items);
            }
            catch (err) {
                console.log(err)
                setError(err.message)
            }
        }
        getAvailableCartItems();
    }, []);

    useEffect(() => {
        setCartItems(availableCartItems);
    }, [availableCartItems]);

    const updateQuantity = async (productId, qty) => {
        if (qty < 1) return;

        // Update cart with API
        try {
            await addOrUpdateCart({ productId: productId, quantity: qty })
        }
        catch (err) {
            console.log(err)
            setError(err.message)
        }
        // Update UI without refreshing page
        setCartItems((items) =>
            items.map((item) =>
                item.productId === productId ? { ...item, quantity: qty } : item
            )
        );
    };

    const removeItem = async (productId) => {
        //  Remove item with API
        try {
            await removeFromCart({ productId: productId })
        }
        catch (err) {
            console.log(err)
            setError(err.message)
        }

        // Update UI without refreshing page
        setCartItems((items) => items.filter((item) => item.productId !== productId));
    };
    const handleCreateOrder = async () => {
        try {
            const result = await createOrder();
            const res = await result.json();
            if (result.status != 201) {
                setError(res.message)
            }
            else {
                navigate("/orders")
            }
        }
        catch (err) {
            console.log(err)
            setError(err.message)
        }
    };

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
            ) : (
                <>
                    <div className="space-y-6">
                        {cartItems.map(({ id, productId, quantity, product }) => (
                            <div
                                key={productId}
                                className="flex flex-col sm:flex-row items-center sm:items-start border rounded-md p-4 gap-4"
                            >
                                <img
                                    src={product.image || '/images/no-img.png'}
                                    alt={product.name}
                                    className="w-32 h-32 sm:w-24 sm:h-24 object-cover rounded"
                                />
                                <div className="flex-1 w-full sm:w-auto text-center sm:text-left overflow-x-hidden">
                                    <h2 className="text-lg font-semibold">{product.name}</h2>
                                    <p className="text-indigo-600 font-semibold">${product.price.toFixed(2)}</p>
                                    <p className="text-gray-700 mb-6 text-justify break-words whitespace-pre-wrap">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                    <label htmlFor={`qty-${id}`} className="sr-only">
                                        Quantity
                                    </label>
                                    <input
                                        id={`qty-${id}`}
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => updateQuantity(productId, parseInt(e.target.value))}
                                        className="w-full sm:w-16 border rounded-md px-2 py-1 text-center"
                                    />
                                    <button
                                        onClick={() => removeItem(productId)}
                                        className="text-red-600 hover:text-red-800 font-semibold whitespace-nowrap"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</div>

                        <div className="flex gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/products')}
                                className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-50 w-full sm:w-auto"
                            >
                                Continue Shopping
                            </button>

                            <button
                                disabled={cartItems.length === 0}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 w-full sm:w-auto"
                                onClick={handleCreateOrder}
                            >
                                Order
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
