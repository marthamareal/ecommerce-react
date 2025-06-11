import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialCartItems = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        quantity: 1,
        image: '',
    },
    {
        id: 2,
        name: 'Smart Watch',
        price: 149.99,
        quantity: 2,
        image: '',
    },
    {
        id: 3,
        name: 'Leather Wallet',
        price: 39.99,
        quantity: 1,
        image: '',
    },
];

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(initialCartItems);

    const updateQuantity = (id, qty) => {
        if (qty < 1) return;
        setCartItems((items) =>
            items.map((item) =>
                item.id === id ? { ...item, quantity: qty } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
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
                        {cartItems.map(({ id, name, price, quantity, image }) => (
                            <div
                                key={id}
                                className="flex flex-col sm:flex-row items-center sm:items-start border rounded-md p-4 gap-4"
                            >
                                <img
                                    src={image || '/src/assets/no-img.png'}
                                    alt={name}
                                    className="w-32 h-32 sm:w-24 sm:h-24 object-cover rounded"
                                />
                                <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                                    <h2 className="text-lg font-semibold">{name}</h2>
                                    <p className="text-indigo-600 font-semibold">${price.toFixed(2)}</p>
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
                                        onChange={(e) => updateQuantity(id, parseInt(e.target.value))}
                                        className="w-full sm:w-16 border rounded-md px-2 py-1 text-center"
                                    />
                                    <button
                                        onClick={() => removeItem(id)}
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
                                    onClick={() => navigate('/orders/1')} 
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
