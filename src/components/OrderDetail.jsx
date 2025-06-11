import React from 'react';

const sampleOrder = {
    orderId: '1',
    date: '2025-06-10',
    status: 'Pending',
    total: 788,
    items: [
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
    ],
};

export default function OrderDetail() {
    const { orderId, date, status, total, items } = sampleOrder;


    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Order Details</h1>

            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
                <p><span className="font-semibold">Order ID:</span> {orderId}</p>
                <p><span className="font-semibold">Order Date:</span> {date}</p>
                <p className="font-semibold">
                    <span className="font-semibold">Items:</span> {items.length}
                </p>
                <p className="font-semibold">
                    <span className="font-semibold">Total Amount:</span> ${total}
                </p>
                <p>
                    <span className="font-semibold">Status:</span>{' '}
                    <span
                        className={`inline-block px-2 py-1 rounded text-white ${status === 'Shipped'
                                ? 'bg-green-600'
                                : status === 'Processing'
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-500'
                            }`}
                    >
                        {status}
                    </span>
                </p>
            </div>

            {/* Ordered Products */}
            <div className="border rounded-lg p-4 bg-white shadow">
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                <ul>
                    {items.map(({ id, name, price, quantity, image }) => (
                        <li
                            key={id}
                            className="flex items-center gap-4 border-b last:border-b-0 py-3"
                        >
                            <img
                                src={image || '/src/assets/no-img.png'}
                                alt={name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">{name}</p>
                                <p className="text-gray-600">
                                    Quantity: {quantity} × ${price.toFixed(2)}
                                </p>
                            </div>
                            <p className="font-semibold">
                                ${(price * quantity).toFixed(2)}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
