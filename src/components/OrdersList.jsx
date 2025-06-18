import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../services/ProductService';

export default function OrdersList() {
    const [orders, setOrders] = useState([])
    const [error, setError] = useState("");

    useEffect(() => {
        const getOrders = async () => {
            try {
                const data = await fetchOrders()
                if (data) setOrders(data);
            }
            catch (err) {
                console.log(err)
                setError(err.message)
            }
        }
        getOrders();
    }, []);
    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

            {orders.length === 0 ? (
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
                            {orders.map(({ id, createdAt, status, total }) => (
                                <tr
                                    key={id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="py-4 px-6 font-mono text-indigo-700">{id}</td>
                                    <td className="py-4 px-6">{
                                        new Date(createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })
                                    }</td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`inline-block px-3 py-1 rounded text-white ${status === 'PROCESSED'
                                                ? 'bg-green-600'
                                                : status === 'PROCESSING'
                                                    ? 'bg-yellow-500'
                                                    : status === 'REJECTED'
                                                        ? 'bg-blue-600'
                                                        : status === 'CANCLED'
                                                            ? 'bg-red-600'
                                                            : 'bg-gray-500'
                                                }`}
                                        >
                                            {status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right font-semibold">
                                        ${total.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <Link
                                            to={`/orders/${id}`}
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
