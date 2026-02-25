import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../api/orders';
import CartItem from './CartItem';
import PaymentMethodModal from './PaymentMethodModal';
import QRPaymentModal from './QRPaymentModal';
import PaymentSuccessAnimation from './PaymentSuccessAnimation';
import { formatCurrency } from '../../utils/format';
import Toast from '../common/Toast';
import styled from 'styled-components';

const PlaceOrderWrapper = styled.div`
  width: 100%;

  button {
    --bg: #e74c3c;
    --text-color: #fff;
    position: relative;
    width: 100%;
    border: none;
    background: var(--bg);
    color: var(--text-color);
    padding: 1em;
    font-weight: bold;
    text-transform: uppercase;
    transition: 0.2s;
    border-radius: 5px;
    opacity: 0.8;
    letter-spacing: 1px;
    box-shadow: #c0392b 0px 7px 2px, #000 0px 8px 5px;
    cursor: pointer;
    font-size: 15px;
  }

  button:hover:not(:disabled) {
    opacity: 1;
  }

  button:active:not(:disabled) {
    top: 4px;
    box-shadow: #c0392b 0px 3px 2px, #000 0px 3px 5px;
  }

  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ORDER_TYPES = ['Pick up', 'Delivery'];

export default function Cart() {
    const {
        items, customerName, setCustomerName,
        discount, setDiscount, voucherCode, setVoucherCode,
        subtotal, tax, total, clearCart,
        activeCashier,
    } = useCart();

    const [loading, setLoading]             = useState(false);
    const [toast, setToast]                 = useState(null);
    const [orderType, setOrderType]         = useState('Pick up');
    const [receipt, setReceipt]             = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [qrCurrency, setQrCurrency]       = useState(null); // non-null = QR modal visible
    const [successAnimCurrency, setSuccessAnimCurrency] = useState(null); // non-null = play success anim

    const handleCheckoutWithMethod = async (paymentMethod = 'cash', currency = 'USD') => {
        setShowPaymentModal(false);
        setQrCurrency(null);
        setLoading(true);
        try {
            // Snapshot items before clearing cart
            const orderItems    = items.map((i) => ({ ...i }));
            const orderSubtotal = subtotal;
            const orderDiscount = discount;
            const orderTax      = tax;
            const orderTotal    = total;

            const order = await createOrder({
                customer_name   : customerName,
                cashier_name    : activeCashier || undefined,
                items           : items.map((i) => ({ product_id: i.id, quantity: i.quantity, addons: i.customization ?? {} })),
                voucher_code    : voucherCode || undefined,
                discount        : discount || 0,
                payment_method  : paymentMethod,
                currency        : currency,
                order_type      : orderType,
            });

            setReceipt({
                id           : order.id,
                customer_name: customerName,
                cashier_name : activeCashier,
                orderType,
                items        : orderItems,
                subtotal     : orderSubtotal,
                discount     : orderDiscount,
                tax          : orderTax,
                total        : orderTotal,
                voucher_code : voucherCode || null,
                payment_method: paymentMethod,
                currency,
                created_at   : new Date().toLocaleString(),
            });
            clearCart();
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Checkout failed.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F1F1F1] rounded-l-3xl shadow-xl w-80 min-w-[320px] overflow-hidden">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Payment Method Modal */}
            {showPaymentModal && (
                <PaymentMethodModal
                    total={total}
                    onCash={() => handleCheckoutWithMethod('cash', 'USD')}
                    onQR={(currency) => {
                        setShowPaymentModal(false);
                        setQrCurrency(currency);
                    }}
                    onClose={() => setShowPaymentModal(false)}
                />
            )}

            {/* QR Payment Modal */}
            {qrCurrency && (
                <QRPaymentModal
                    amount={total}
                    currency={qrCurrency}
                    onSuccess={() => {
                        // Hand off to success animation; animation calls checkout on complete
                        const confirmedCurrency = qrCurrency;
                        setQrCurrency(null);
                        setSuccessAnimCurrency(confirmedCurrency);
                    }}
                    onClose={() => {
                        setQrCurrency(null);
                        setShowPaymentModal(true);
                    }}
                />
            )}

            {/* Payment success animation → then receipt */}
            {successAnimCurrency && (
                <PaymentSuccessAnimation
                    onComplete={() => {
                        const cur = successAnimCurrency;
                        setSuccessAnimCurrency(null);
                        handleCheckoutWithMethod('qr', cur);
                    }}
                />
            )}

            {/* Receipt modal */}
            {receipt && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    style={{ animation: 'receipt-fade-in 0.45s cubic-bezier(.22,1,.36,1) both' }}
                >
                    <style>{`
                        @keyframes receipt-fade-in {
                            from { opacity: 0; transform: scale(0.93) translateY(24px); }
                            to   { opacity: 1; transform: scale(1)    translateY(0); }
                        }
                    `}</style>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

                        {/* ── Success hero ── */}
                        <div className="pt-8 pb-4 px-6 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="h-9 w-9 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Payment Success!</h2>
                            <p className="text-sm text-gray-400 mt-1">Your payment has been successfully done.</p>
                        </div>

                        {/* ── Detail card ── */}
                        <div className="mx-4 mb-4 rounded-2xl bg-gray-50 overflow-hidden">

                            {/* Amount */}
                            <div className="px-4 py-3 flex justify-between items-center">
                                <span className="text-sm text-gray-500">Amount</span>
                                <span className="font-bold text-gray-900 text-[15px]">{formatCurrency(receipt.total)}</span>
                            </div>

                            {/* Payment status */}
                            <div className="px-4 pb-3 flex justify-between items-center">
                                <span className="text-sm text-gray-500">Payment Status</span>
                                <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                                    Success
                                </span>
                            </div>

                            {/* Dashed separator */}
                            <div className="border-t border-dashed border-gray-300 mx-4" />

                            {/* Info rows */}
                            <div className="px-4 py-3 space-y-2.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Ref Number</span>
                                    <span className="font-semibold text-gray-800">{String(receipt.id).padStart(12, '0')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Merchant Name</span>
                                    <span className="font-semibold text-gray-800">Vat&apos; Milktea</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Payment Method</span>
                                    <span className="font-semibold text-gray-800">
                                        {receipt.payment_method === 'qr' ? `Bakong QR (${receipt.currency})` : 'Cash'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Payment Time</span>
                                    <span className="font-semibold text-gray-800">{receipt.created_at}</span>
                                </div>
                                {receipt.cashier_name && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Cashier</span>
                                        <span className="font-semibold text-gray-800">{receipt.cashier_name}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Customer</span>
                                    <span className="font-semibold text-gray-800">{receipt.customer_name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Order Type</span>
                                    <span className="font-semibold text-gray-800">{receipt.orderType}</span>
                                </div>
                            </div>

                            {/* Dashed separator */}
                            <div className="border-t border-dashed border-gray-300 mx-4" />

                            {/* Items */}
                            <div className="px-4 py-2.5 space-y-1.5 max-h-28 overflow-y-auto">
                                {receipt.items.map((item) => (
                                    <div key={item.cartKey} className="flex justify-between text-xs">
                                        <span className="text-gray-500">
                                            {item.name}
                                            {item.customization?.size ? ` (${item.customization.size})` : ''}
                                            {' × '}{item.quantity}
                                        </span>
                                        <span className="font-semibold text-gray-700">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Dashed separator */}
                            <div className="border-t border-dashed border-gray-300 mx-4" />

                            {/* Subtotals */}
                            <div className="px-4 py-2.5 space-y-1.5 text-xs">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(receipt.subtotal)}</span>
                                </div>
                                {receipt.discount > 0 && (
                                    <div className="flex justify-between text-green-500">
                                        <span>Discount</span>
                                        <span>-{formatCurrency(receipt.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax (10%)</span>
                                    <span>{formatCurrency(receipt.tax)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm text-gray-800 pt-0.5">
                                    <span>Total</span>
                                    <span>{formatCurrency(receipt.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Action buttons ── */}
                        <div className="px-4 pb-6 space-y-2.5">
                            <button
                                onClick={() => {
                                    const win = window.open('', '_blank', 'width=400,height=600');
                                    win.document.write(`
                                        <html><head><title>Receipt #${receipt.id}</title>
                                        <style>
                                            body { font-family: sans-serif; padding: 24px; color: #1a1a1a; max-width: 360px; margin: 0 auto; }
                                            h2 { text-align:center; margin-bottom:4px; }
                                            p.sub { text-align:center; color:#888; font-size:13px; margin-bottom:20px; }
                                            .row { display:flex; justify-content:space-between; font-size:13px; margin-bottom:8px; }
                                            .label { color:#888; }
                                            .value { font-weight:600; }
                                            hr { border:none; border-top:1px dashed #ccc; margin:12px 0; }
                                            .total-row { display:flex; justify-content:space-between; font-weight:700; font-size:15px; margin-top:8px; }
                                            .badge { background:#dcfce7; color:#16a34a; border-radius:999px; padding:2px 10px; font-size:12px; font-weight:600; }
                                        </style></head><body>
                                        <h2>✅ Payment Success!</h2>
                                        <p class="sub">Vat' Milktea — Receipt</p>
                                        <div class="row"><span class="label">Amount</span><span class="value">${formatCurrency(receipt.total)}</span></div>
                                        <div class="row"><span class="label">Payment Status</span><span class="badge">Success</span></div>
                                        <hr/>
                                        <div class="row"><span class="label">Ref Number</span><span class="value">${String(receipt.id).padStart(12,'0')}</span></div>
                                        <div class="row"><span class="label">Merchant Name</span><span class="value">Vat' Milktea</span></div>
                                        <div class="row"><span class="label">Payment Method</span><span class="value">${receipt.payment_method === 'qr' ? `Bakong QR (${receipt.currency})` : 'Cash'}</span></div>
                                        <div class="row"><span class="label">Payment Time</span><span class="value">${receipt.created_at}</span></div>
                                        ${receipt.cashier_name ? `<div class="row"><span class="label">Cashier</span><span class="value">${receipt.cashier_name}</span></div>` : ''}
                                        <div class="row"><span class="label">Customer</span><span class="value">${receipt.customer_name}</span></div>
                                        <div class="row"><span class="label">Order Type</span><span class="value">${receipt.orderType}</span></div>
                                        <hr/>
                                        ${receipt.items.map(i => `<div class="row"><span class="label">${i.name}${i.customization?.size ? ` (${i.customization.size})` : ''} × ${i.quantity}</span><span class="value">${formatCurrency(i.price * i.quantity)}</span></div>`).join('')}
                                        <hr/>
                                        <div class="row"><span class="label">Subtotal</span><span>${formatCurrency(receipt.subtotal)}</span></div>
                                        ${receipt.discount > 0 ? `<div class="row"><span class="label">Discount</span><span>-${formatCurrency(receipt.discount)}</span></div>` : ''}
                                        <div class="row"><span class="label">Tax (10%)</span><span>${formatCurrency(receipt.tax)}</span></div>
                                        <div class="total-row"><span>Total</span><span>${formatCurrency(receipt.total)}</span></div>
                                        <script>window.onload=()=>{window.print();}<\/script>
                                        </body></html>
                                    `);
                                    win.document.close();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-800 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Get PDF Receipt
                            </button>
                            <button
                                onClick={() => setReceipt(null)}
                                className="w-full py-3 rounded-2xl bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="px-6 pt-6 pb-3">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Cart</h2>
                    {items.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {/* Order type tabs */}
                <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
                    {ORDER_TYPES.map((t) => (
                        <button
                            key={t}
                            onClick={() => setOrderType(t)}
                            className={`flex-1 text-xs font-semibold py-1.5 rounded-xl transition-all duration-200 ${
                                orderType === t
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Customer Name */}
            <div className="px-6 pb-3">
                <input
                    className="w-full rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 placeholder-[#777777] text-[#1A1A1A]"
                    placeholder="Customer name…"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-300">
                        <svg className="h-10 w-10 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                        <p className="text-sm">Cart is empty</p>
                    </div>
                ) : (
                    items.map((item) => <CartItem key={item.cartKey} item={item} />)
                )}
            </div>

            {/* Voucher / Discount */}
            <div className="px-6 pt-3">
                <div className="flex gap-2 justify-center">
                    <input
                        className="flex-1 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 placeholder-[#777777] text-[#1A1A1A] text-center"
                        placeholder="Voucher code…"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <input
                        className="w-24 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 placeholder-[#777777] text-[#1A1A1A] text-center"
                        type="number"
                        placeholder="Disc. $"
                        min="0"
                        value={discount || ''}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Summary */}
            <div className="px-6 py-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                    <span>Items</span>
                    <span className="text-gray-700">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                        <span>Discounts</span>
                        <span>-{formatCurrency(discount)}</span>
                    </div>
                )}
                <div className="flex justify-between text-gray-400">
                    <span>Tax 10%</span>
                    <span className="text-gray-700">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#1A1A1A] text-base pt-2 border-t border-[#EAEAEA]">
                    <span>Total</span>
                    <span className="text-primary-500">{formatCurrency(total)}</span>
                </div>
            </div>

            {/* Checkout Button */}
            <div className="px-6 pb-6">
                <PlaceOrderWrapper>
                    <button
                        onClick={() => {
                            if (!customerName.trim()) {
                                setToast({ message: 'Please enter the customer name.', type: 'warning' });
                                return;
                            }
                            if (items.length === 0) {
                                setToast({ message: 'Cart is empty.', type: 'warning' });
                                return;
                            }
                            setShowPaymentModal(true);
                        }}
                        disabled={loading || items.length === 0}
                    >
                        {loading ? 'Processing…' : 'Place an order'}
                    </button>
                </PlaceOrderWrapper>
            </div>
        </div>
    );
}
