import { useMemo } from "react";
import "../Pagination.css";

/**
 * Pagination
 *
 * Controlled pagination component — the parent owns `currentPage` and
 * re-fetches /products?page=X whenever `onPageChange` fires.
 *
 * Props:
 *  - currentPage  (number)   1-indexed current page
 *  - totalPages   (number)   total number of pages available
 *  - onPageChange (function) called with the new page number
 *  - siblingCount (number)   how many page numbers to show beside the current one (default 1)
 */
export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
}) {
    const pages = useMemo(
        () => buildPageList(currentPage, totalPages, siblingCount),
        [currentPage, totalPages, siblingCount]
    );

    if (!totalPages || totalPages <= 1) return null;

    const goTo = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange(page);
    };

    return (
        <nav className="pagination" aria-label="Product pages">
            <button
                type="button"
                className="pagination__btn pagination__btn--nav"
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>

            <ul className="pagination__list">
                {pages.map((page, idx) =>
                    page === "…" ? (
                        <li key={`dots-${idx}`} className="pagination__dots" aria-hidden="true">
                            …
                        </li>
                    ) : (
                        <li key={page}>
                            <button
                                type="button"
                                className={
                                    "pagination__btn pagination__btn--num" +
                                    (page === currentPage ? " is-active" : "")
                                }
                                onClick={() => goTo(page)}
                                aria-current={page === currentPage ? "page" : undefined}
                            >
                                {page}
                            </button>
                        </li>
                    )
                )}
            </ul>

            <button
                type="button"
                className="pagination__btn pagination__btn--nav"
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </nav>
    );
}

/**
 * Builds a page list like: 1 … 4 5 [6] 7 8 … 20
 * Returns an array of numbers and "…" separators.
 */
function buildPageList(current, total, siblingCount) {
    const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2 dots, siblings

    if (total <= totalNumbers) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(current - siblingCount, 1);
    const rightSibling = Math.min(current + siblingCount, total);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < total - 1;

    if (!showLeftDots && showRightDots) {
        const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
        return [...leftRange, "…", total];
    }

    if (showLeftDots && !showRightDots) {
        const rightRange = Array.from(
            { length: 3 + siblingCount * 2 },
            (_, i) => total - (3 + siblingCount * 2) + i + 1
        );
        return [1, "…", ...rightRange];
    }

    const middleRange = Array.from(
        { length: rightSibling - leftSibling + 1 },
        (_, i) => leftSibling + i
    );
    return [1, "…", ...middleRange, "…", total];
}
