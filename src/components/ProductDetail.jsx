import React, { useState } from 'react';

const ProductDetail = () => {
    const [quantity, setQuantity] = useState(1);

    const product = {
        id: 1,
        name: 'Premium Sneakers',
        description:
            'Stylish and comfortable sneakers made with high-quality materials. Perfect for everyday use or a night out.',
        price: 79.99,
        image: ''
    };

    const handleQuantityChange = (e) => {
        const value = Math.max(1, Number(e.target.value));
        setQuantity(value);
    };

    const handleAddToCart = () => {
        // Add to cart logic here
        alert(`Added ${quantity} of "${product.name}" to cart.`);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Image */}
            <div>
                <img
                    src={product.image || '/src/assets/no-img.png'}
                    alt={product.name}
                    className="w-full h-auto object-cover rounded-lg shadow"
                />
            </div>

            {/* Product Details */}
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {product.name}
                </h2>
                <p className="text-xl text-indigo-600 font-semibold mb-2">
                    ${product.price.toFixed(2)}
                </p>
                <p className="text-gray-700 mb-6">{product.description}</p>

                <div className="flex items-center mb-4 gap-4">
                    <label htmlFor="quantity" className="text-gray-700">
                        Quantity:
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-center"
                        min="1"
                    />
                </div>

                <button
                    onClick={handleAddToCart}
                    className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition font-semibold"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
