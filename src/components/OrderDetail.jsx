import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchOrder } from '../services/ProductService';
import { STATUS_META, DEFAULT_STATUS_META, ORDER_LIFECYCLE } from '../constants/OrderStatus';
import '../css/Order.css';

const OFF_PATH_STATUSES = ['REJECTED', 'CANCELED'];

export default function OrderDetail() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        const getOrder = async () => {
            try {
                const res = await fetchOrder(id);
                const data = await res.json();
                if (res.status === 200) setOrder(data);
                else setError(data.message ?? 'Order not found.');
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="orders-skeleton h-8 w-48 rounded-lg bg-gray-100 mb-6" />
                <div className="orders-skeleton h-28 rounded-xl bg-gray-100 mb-4" />
                <div className="orders-skeleton h-64 rounded-xl bg-gray-100" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-8 text-center">
                    <p className="font-semibold text-rose-700">Couldn't load this order</p>
                    <p className="mt-1 text-sm text-rose-600">{error}</p>
                    <Link to="/orders" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                        ← Back to orders
                    </Link>
                </div>
            </div>
        );
    }

    const meta = STATUS_META[order.status] ?? DEFAULT_STATUS_META;
    const isOffPath = OFF_PATH_STATUSES.includes(order.status);
    const stepIndex = ORDER_LIFECYCLE.indexOf(order.status);
    const itemCount = order.items?.length ?? 0;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Link
                to="/orders"
                className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All orders
            </Link>

            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Order <span className="font-mono text-gray-400">#{order.id}</span>
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Placed{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </p>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.bg} ${meta.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                </span>
            </div>

            {/* Lifecycle progress */}
            {isOffPath ? (
                <div className={`mb-6 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${meta.bg} ${meta.text} border-current/10`}>
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    This order was {meta.label.toLowerCase()} and won't continue through fulfillment.
                </div>
            ) : (
                <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                    <ol className="flex items-center">
                        {ORDER_LIFECYCLE.map((step, i) => {
                            const stepMeta = STATUS_META[step];
                            const done = i < stepIndex;
                            const current = i === stepIndex;
                            return (
                                <li key={step} className="flex flex-1 items-center last:flex-none">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-4 ${done || current
                                                    ? `${stepMeta.bar} text-white ring-white`
                                                    : 'bg-gray-100 text-gray-400 ring-white'
                                                }`}
                                        >
                                            {done ? (
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            ) : (
                                                i + 1
                                            )}
                                        </div>
                                        <span className={`text-xs font-medium ${current ? stepMeta.text : 'text-gray-400'}`}>
                                            {stepMeta.label}
                                        </span>
                                    </div>
                                    {i < ORDER_LIFECYCLE.length - 1 && (
                                        <div className={`mx-2 h-0.5 flex-1 rounded ${done ? stepMeta.bar : 'bg-gray-100'}`} />
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            )}

            {/* Summary stats */}
            <div className="mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-3">
                <div className="bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Items</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{itemCount}</p>
                </div>
                <div className="bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total</p>
                    <p className="mt-1 font-mono text-lg font-semibold text-gray-900">
                        ${Number(order.total ?? 0).toFixed(2)}
                    </p>
                </div>
                <div className="bg-white p-4 col-span-2 sm:col-span-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Order ID</p>
                    <p className="mt-1 truncate font-mono text-lg font-semibold text-gray-900">{order.id}</p>
                </div>
            </div>

            {/* Products */}
            <div className="rounded-xl border border-gray-200 bg-white">
                <h2 className="border-b border-gray-100 px-5 py-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Products
                </h2>
                <ul>
                    {order.items?.map(({ id: itemId, quantity, product }) => (
                        <li
                            key={itemId}
                            className="flex items-center gap-4 border-b border-dashed border-gray-100 px-5 py-4 last:border-b-0"
                        >
                            <img
                                src={product.image || '/images/no-img.png'}
                                alt={product.name}
                                className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-gray-100"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">
                                    {quantity} × ${product.price.toFixed(2)}
                                </p>
                            </div>
                            <p className="font-mono font-semibold text-gray-900">
                                ${(product.price * quantity).toFixed(2)}
                            </p>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                    <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">Total</span>
                    <span className="font-mono text-xl font-bold text-gray-900">
                        ${Number(order.total ?? 0).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
