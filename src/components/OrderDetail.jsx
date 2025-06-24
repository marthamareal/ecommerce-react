import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrder } from '../services/ProductService';

export default function OrderDetail() {
    const [order, setOrder] = useState("")
    const [error, setError] = useState("");
    const { id } = useParams();

    useEffect(() => {
        const getOrder = async () => {
            try {
                const res = await fetchOrder(id)
                const data = await res.json();
                if (res.status == 200) {
                    setOrder(data)
                }
                else {
                    setError(data.message)
                }

            }
            catch (err) {
                console.log(err)
                setError(err.message)
            }
        }
        getOrder();
    }, [id]);

    if (error) {
        return <p className="text-red-500 text-center p-4">{error}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Order Details</h1>

            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
                <p><span className="font-semibold">Order ID:</span> {order.id}</p>
                <p><span className="font-semibold">Order Date:</span> {
                    new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    })
                }</p>
                <p className="font-semibold">
                    <span className="font-semibold">Items:</span> {order.items?.length}
                </p>
                <p className="font-semibold">
                    <span className="font-semibold">Total Amount:</span> ${order.total}
                </p>
                <p>
                    <span className="font-semibold">Status:</span>{' '}
                    <span
                        className={`inline-block px-2 py-1 rounded text-white ${order.status === 'PROCESSED'
                            ? 'bg-green-600'
                            : order.status === 'ACCEPTED'
                                ? 'bg-yellow-500'
                                : 'bg-gray-500'
                            }`}
                    >
                        {order.status}
                    </span>
                </p>
            </div>

            {/* Ordered Products */}
            <div className="border rounded-lg p-4 bg-white shadow">
                <h2 className="text-xl font-semibold mb-4">Products</h2>
                <ul>
                    {order?.items?.map(({ id, quantity, product }) => (
                        <li
                            key={id}
                            className="flex items-center gap-4 border-b last:border-b-0 py-3"
                        >
                            <img
                                src={product.image || '/images/no-img.png'}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-gray-600">
                                    Quantity: {quantity} × ${product.price.toFixed(2)}
                                </p>
                            </div>
                            <p className="font-semibold">
                                ${(product.price * quantity).toFixed(2)}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
