
import React from 'react';

export default function Pagination({ page, setPage, pages }) {
    const getPageNumbers = () => {
        // if (pages <= 7) {
        //     // Show all if small number of pages
        //     return Array.from({ length: pages }, (_, i) => i + 1);
        // }

        // Near the start (show first 5 pages, ellipsis, last)
        if (pages - page <= 4) {
            return [1, 2, 3, 4, 5, '...', pages];
        }

        // Near the end (show first, ellipsis, last 5 pages)
        if (page >= pages - 3) {
            return [1, '...', pages - 4, pages - 3, pages - 2, pages - 1, pages];
        }

        // In the middle (show first, ellipsis, current ±1, ellipsis, last)
        return [1, '...', page - 1, page, page + 1, '...', pages];
    };
    const pageItems = getPageNumbers();

    return (
        <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
            {/* Prev Button */}
            <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500"
            >
                &laquo;
            </button>

            {/* Page Numbers */}
            {pageItems.map((item, idx) =>
                item === "..." ? (
                    <span key={idx} className="px-2 text-gray-500">
                        ...
                    </span>
                ) : (
                    <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`px-3 py-1 rounded ${item === page
                            ? "bg-indigo-800 text-white"
                            : "bg-white border text-gray-700 hover:bg-indigo-100"
                            }`}
                    >
                        {item}
                    </button>
                )
            )}

            {/* Next Button */}
            <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                disabled={page === pages}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500"
            >
                &raquo;
            </button>
        </div>
    );
}
