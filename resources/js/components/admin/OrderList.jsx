import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, updateOrderPayment, deleteOrder } from '../../api/orders';
import LoadingSpinner from '../common/LoadingSpinner';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Toast from '../common/Toast';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatCurrency } from '../../utils/format';

const STATUS_BADGE = {
    paid      : 'success',
    pending   : 'warning',
    cancelled : 'danger',
};

const PAYMENT_BADGE = {
    cash : 'orange',
    qr   : 'info',
};

const PAYMENT_LABEL = {
    cash : 'Cash',
    qr   : 'QR',
};

function OrderDetail({ order }) {
    return (
        <div className="space-y-4 text-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-400">Customer</p>
                    <p className="font-semibold text-gray-800">{order.customer_name}</p>
                </div>
                <Badge label={order.status} variant={STATUS_BADGE[order.status]} />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                        <span>{item.quantity}× {item.product?.name}</span>
                        <span className="font-medium text-gray-700">{formatCurrency(item.subtotal)}</span>
                    </div>
                ))}
            </div>
            <div className="space-y-1 text-right">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(order.discount)}</span></div>}
                <div className="flex justify-between text-gray-500"><span>Tax (10%)</span><span>{formatCurrency(order.tax)}</span></div>
                <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-100 pt-1 mt-1">
                    <span>Total</span><span className="text-primary-600">{formatCurrency(order.total)}</span>
                </div>
            </div>
            {order.payment_method && (
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Payment</span>
                    <Badge
                        label={PAYMENT_LABEL[order.payment_method] ?? order.payment_method}
                        variant={PAYMENT_BADGE[order.payment_method] ?? 'gray'}
                    />
                </div>
            )}
            <div className="text-xs text-gray-400">
                <p>Cashier: {order.user?.name}</p>
                <p>{new Date(order.created_at).toLocaleString()}</p>
            </div>
        </div>
    );
}

export default function OrderList() {
    const [orders, setOrders]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [page, setPage]         = useState(1);
    const [meta, setMeta]         = useState(null);
    const [detail, setDetail]         = useState(null);
    const [toast, setToast]             = useState(null);
    const [statusFilter, setStatusFilter]   = useState('');
    const [paymentFilter, setPaymentFilter]   = useState('');
    const [payingOrder, setPayingOrder]       = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);

    const fetchAll = (p = 1) => {
        setLoading(true);
        getOrders({ page: p, status: statusFilter || undefined, payment_method: paymentFilter || undefined })
            .then((data) => {
                setOrders(data.data);
                setMeta(data);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchAll(page); }, [page, statusFilter, paymentFilter]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deleteOrder(deleteTarget.id);
            setToast({ message: `Order #${deleteTarget.id} deleted.`, type: 'success' });
            setDeleteTarget(null);
            fetchAll(page);
        } catch {
            setToast({ message: 'Failed to delete order.', type: 'error' });
            setDeleteTarget(null);
        }
    };

    const handleStatusChange = async (order, status) => {
        try {
            await updateOrderStatus(order.id, status);
            setToast({ message: `Order #${order.id} marked as ${status}.`, type: 'success' });
            fetchAll(page);
        } catch {
            setToast({ message: 'Failed to update status.', type: 'error' });
        }
    };

    const handleCancel = async () => {
        if (!cancelTarget) return;
        try {
            await updateOrderStatus(cancelTarget.id, 'cancelled');
            setToast({ message: `Order #${cancelTarget.id} has been cancelled (refunded).`, type: 'success' });
            setCancelTarget(null);
            fetchAll(page);
        } catch {
            setToast({ message: 'Failed to cancel order.', type: 'error' });
            setCancelTarget(null);
        }
    };

    const handlePaymentChange = async (order, paymentMethod) => {
        try {
            await updateOrderPayment(order.id, paymentMethod, order.currency ?? 'USD');
            setToast({ message: `Order #${order.id} payment set to ${PAYMENT_LABEL[paymentMethod]}.`, type: 'success' });
            setPayingOrder(null);
            fetchAll(page);
        } catch {
            setToast({ message: 'Failed to update payment method.', type: 'error' });
        }
    };

    return (
        <div className="space-y-4">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="flex gap-3 items-center">
                <select
                    className="input w-40 text-sm"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                >
                    <option value="">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select
                    className="input w-44 text-sm"
                    value={paymentFilter}
                    onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
                >
                    <option value="">All Payments</option>
                    <option value="cash">Cash</option>
                    <option value="qr">QR</option>
                </select>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['#', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Date', 'Actions'].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No orders found.</td></tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-gray-400">#{order.id}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{order.customer_name}</td>
                                    <td className="px-4 py-3 text-gray-500">{order.items?.length ?? 0} item(s)</td>
                                    <td className="px-4 py-3 font-semibold text-primary-600">{formatCurrency(order.total)}</td>
                                    <td className="px-4 py-3"><Badge label={order.status} variant={STATUS_BADGE[order.status]} /></td>
                                    <td className="px-4 py-3">
                                        {order.status === 'paid' ? (
                                            payingOrder?.id === order.id ? (
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => handlePaymentChange(order, 'cash')}
                                                        className="text-xs bg-orange-50 text-orange-600 hover:bg-orange-100 px-2.5 py-1 rounded-lg font-medium"
                                                    >Cash</button>
                                                    <button
                                                        onClick={() => handlePaymentChange(order, 'qr')}
                                                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1 rounded-lg font-medium"
                                                    >QR</button>
                                                    <button
                                                        onClick={() => setPayingOrder(null)}
                                                        className="text-xs text-gray-400 hover:text-gray-600 px-1.5 py-1 rounded-lg"
                                                    >✕</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setPayingOrder(order)}
                                                    className="inline-flex items-center gap-1"
                                                    title="Click to change payment type"
                                                >
                                                    <Badge
                                                        label={PAYMENT_LABEL[order.payment_method] ?? order.payment_method ?? '—'}
                                                        variant={PAYMENT_BADGE[order.payment_method] ?? 'gray'}
                                                    />
                                                </button>
                                            )
                                        ) : (
                                            <span className="text-gray-300 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setDetail(order)}
                                                className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium"
                                            >
                                                View
                                            </button>
                                            {order.status === 'paid' && (
                                                <button
                                                    onClick={() => setCancelTarget(order)}
                                                    className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setDeleteTarget(order)}
                                                className="text-xs bg-gray-200 text-gray-500 hover:bg-gray-300 px-3 py-1.5 rounded-lg font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-xs py-1.5 disabled:opacity-40">Prev</button>
                            <span className="text-xs text-gray-500">{page} / {meta.last_page}</span>
                            <button disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)} className="btn-secondary text-xs py-1.5 disabled:opacity-40">Next</button>
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={`Order #${detail?.id}`}>
                {detail && <OrderDetail order={detail} />}
            </Modal>

            <ConfirmDialog
                isOpen={!!cancelTarget}
                title="Cancel Order (Refund)"
                message={`Are you sure you want to cancel Order #${cancelTarget?.id}? This marks it as refunded.`}
                onConfirm={handleCancel}
                onCancel={() => setCancelTarget(null)}
            />

            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Order"
                message={`Are you sure you want to delete Order #${deleteTarget?.id}? This cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
