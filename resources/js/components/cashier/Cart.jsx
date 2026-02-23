import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/orders';
import CartItem from './CartItem';
import { formatCurrency } from '../../utils/format';
import Toast from '../common/Toast';

export default function Cart() {
    const {
        items, customerName, setCustomerName,
        discount, setDiscount, voucherCode, setVoucherCode,
        subtotal, tax, total, clearCart,
    } = useCart();

    const [loading, setLoading]       = useState(false);
    const [toast, setToast]           = useState(null);
    const [lastOrder, setLastOrder]   = useState(null);

    const handleCheckout = async () => {
        if (!customerName.trim()) {
            setToast({ message: 'Please enter the customer name.', type: 'warning' });
            return;
        }
        if (items.length === 0) {
            setToast({ message: 'Cart is empty.', type: 'warning' });
            return;
        }

        setLoading(true);
        try {
            const order = await createOrder({
                customer_name : customerName,
                items         : items.map((i) => ({ product_id: i.id, quantity: i.quantity, addons: i.customization ?? {} })),
                voucher_code  : voucherCode || undefined,
                discount      : discount || 0,
            });
            setLastOrder(order);
            clearCart();
            setToast({ message: `Order #${order.id} placed successfully!`, type: 'success' });
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Checkout failed.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-100 w-80 min-w-[320px]">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-800">Order Bills</h2>
            </div>

            {/* Customer Name */}
            <div className="px-5 py-3 border-b border-gray-100">
                <input
                    className="input text-sm"
                    placeholder="Customer name…"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-300">
                        <svg className="h-10 w-10 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        <p className="text-sm">Cart is empty</p>
                    </div>
                ) : (
                    items.map((item) => <CartItem key={item.cartKey} item={item} />)
                )}
            </div>

            {/* Voucher */}
            <div className="px-5 py-3 border-t border-gray-100">
                <div className="flex gap-2">
                    <input
                        className="input text-sm flex-1"
                        placeholder="Voucher code…"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <input
                        className="input text-sm w-24"
                        type="number"
                        placeholder="Discount"
                        min="0"
                        value={discount || ''}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Summary */}
            <div className="px-5 py-3 border-t border-gray-100 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                    </div>
                )}
                <div className="flex justify-between text-gray-500">
                    <span>Tax 10%</span>
                    <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-100 pt-2 mt-1">
                    <span>Total</span>
                    <span className="text-primary-600">{formatCurrency(total)}</span>
                </div>
            </div>

            {/* Checkout Button */}
            <div className="px-5 pb-5">
                <button
                    onClick={handleCheckout}
                    disabled={loading || items.length === 0}
                    className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                    {loading ? 'Processing…' : 'Proceed Payment'}
                </button>
            </div>
        </div>
    );
}
