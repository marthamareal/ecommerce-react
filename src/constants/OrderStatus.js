// Central place for order status labels/colors so every page
// (list, detail, anywhere else) stays in sync.

export const STATUS_META = {
    PENDING: { label: 'Pending', dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50', bar: 'bg-gray-400' },
    ACCEPTED: { label: 'Accepted', dot: 'bg-indigo-500', text: 'text-indigo-700', bg: 'bg-indigo-50', bar: 'bg-indigo-500' },
    PROCESSING: { label: 'Processing', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', bar: 'bg-amber-500' },
    COMPLETED: { label: 'Completed', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
    REJECTED: { label: 'Rejected', dot: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', bar: 'bg-orange-500' },
    CANCELED: { label: 'Canceled', dot: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50', bar: 'bg-rose-500' },
};

export const DEFAULT_STATUS_META = {
    label: 'Unknown', dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50', bar: 'bg-gray-400',
};

// Happy-path order, used to drive the progress stepper on the detail page.
// REJECTED / CANCELED are terminal-but-off-path statuses and are handled separately.
export const ORDER_LIFECYCLE = ['PENDING', 'ACCEPTED', 'PROCESSING', 'COMPLETED'];

export function getStatusMeta(status) {
    return STATUS_META[status] ?? DEFAULT_STATUS_META;
}
