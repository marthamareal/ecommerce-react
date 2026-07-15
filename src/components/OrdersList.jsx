import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../services/ProductService';
import Pagination from './Pagination';
import { STATUS_META, DEFAULT_STATUS_META } from '../constants/OrderStatus';
import '../css/Order.css';

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        const getOrders = async () => {
            try {
                const result = await fetchOrders(page);
                const data = await result.json();
                if (result.status === 200) {
                    setPage(data.page)
                    setPages(data.pages)
                    setOrders(Array.isArray(data.data) ? data.data : []);
                }
                else setError('Something went wrong loading your orders.');
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getOrders();
    }, [page]);

    const ACTIVE_STATUSES = ['PENDING', 'ACCEPTED', 'PROCESSING'];
    const processingCount = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Orders</h1>
                    {!loading && !error && orders.length > 0 && (
                        <p className="mt-1 text-sm text-gray-500">
                            {orders.length} order{orders.length !== 1 ? 's' : ''}
                            {processingCount > 0 && (
                                <span className="text-amber-600"> · {processingCount} in progress</span>
                            )}
                        </p>
                    )}
                </div>
            </div>

            {loading && (
                <div className="space-y-4">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="orders-skeleton h-24 rounded-xl bg-gray-100" />
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-8 text-center">
                    <p className="font-semibold text-rose-700">Couldn't load your orders</p>
                    <p className="mt-1 text-sm text-rose-600">{error}</p>
                </div>
            )}

            {!loading && !error && orders.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                        <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <p className="font-medium text-gray-700">No orders yet</p>
                    <p className="mt-1 text-sm text-gray-500">Everything you order will show up here.</p>
                </div>
            )}

            {!loading && !error && orders.length > 0 && (
                <ul className="space-y-4">
                    {orders.map(({ id, createdAt, status, total }, idx) => {
                        const meta = STATUS_META[status] ?? DEFAULT_STATUS_META;
                        return (
                            <li
                                key={id}
                                className="order-card group relative flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                style={{ animationDelay: `${idx * 60}ms` }}
                            >
                                <span className={`w-1.5 shrink-0 ${meta.bar}`} aria-hidden="true" />

                                <div className="flex flex-1 flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-sm text-gray-400">#{id}</span>
                                        <span className="text-sm text-gray-500">
                                            {new Date(createdAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.bg} ${meta.text}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                                            {meta.label}
                                        </span>
                                    </div>

                                    <div className="hidden h-10 border-l border-dashed border-gray-200 sm:block" />

                                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                                        <span className="font-mono text-lg font-semibold text-gray-900">
                                            ${(total ?? 0).toFixed(2)}
                                        </span>
                                        <Link
                                            to={`/orders/${id}`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
                                        >
                                            Details
                                            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
            {/* Pagination Controls */}
            <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} />
        </div>
    );
}
