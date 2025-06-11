import React from 'react';
import { Link } from 'react-router-dom';

const sampleOrders = [
    {
        orderId: '1',
        date: '2025-06-10',
        status: 'Shipped',
        totalPrice: 399.97,
    },
    {
        orderId: '2',
        date: '2025-06-08',
        status: 'Processing',
        totalPrice: 249.98,
    },
    {
        orderId: '3',
        date: '2025-06-01',
        status: 'Delivered',
        totalPrice: 149.99,
    },
    {
        orderId: '4',
        date: '2025-05-30',
        status: 'Cancelled',
        totalPrice: 0,
    },
];

export default function OrdersList() {
    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

            {sampleOrders.length === 0 ? (
                <p className="text-gray-600">You have no orders yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow">
                        <thead>
                            <tr className="bg-indigo-600 text-white">
                                <th className="py-3 px-6 text-left">Order ID</th>
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-right">Total</th>
                                <th className="py-3 px-6"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleOrders.map(({ orderId, date, status, totalPrice }) => (
                                <tr
                                    key={orderId}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="py-4 px-6 font-mono text-indigo-700">{orderId}</td>
                                    <td className="py-4 px-6">{date}</td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`inline-block px-3 py-1 rounded text-white ${status === 'Shipped'
                                                    ? 'bg-green-600'
                                                    : status === 'Processing'
                                                        ? 'bg-yellow-500'
                                                        : status === 'Delivered'
                                                            ? 'bg-blue-600'
                                                            : status === 'Cancelled'
                                                                ? 'bg-red-600'
                                                                : 'bg-gray-500'
                                                }`}
                                        >
                                            {status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right font-semibold">
                                        ${totalPrice.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <Link
                                            to={`/orders/${orderId}`}
                                            className="text-indigo-600 hover:underline font-semibold"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
