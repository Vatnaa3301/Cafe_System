import React, { useState } from 'react';
import { usdToKhr, formatKHR } from '../../utils/format';

/**
 * Modern bottom-sheet payment method selection modal for normal checkout.
 *
 * Props:
 *   total     {number}   - order total in USD
 *   onConfirm {Function(method, currency)} - called to process normal checkout
 *   onClose   {Function}
 */
export default function PaymentMethodModal({ total, onConfirm, onClose }) {
    const [selectedMethod, setSelectedMethod] = useState('cash');
    const [currency, setCurrency] = useState('USD');

    const displayTotal = currency === 'USD'
        ? `$${Number(total).toFixed(2)}`
        : formatKHR(usdToKhr(total));

    const handleProceed = () => {
        if (selectedMethod) {
            onConfirm(selectedMethod, currency);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white w-full sm:max-w-sm sm:mx-4 sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl"
                style={{ animation: 'pmm-up 0.35s cubic-bezier(.22,1,.36,1) both' }}
            >
                <style>{`
                    @keyframes pmm-up {
                        from { transform: translateY(60px); opacity: 0; }
                        to   { transform: translateY(0);    opacity: 1; }
                    }
                `}</style>

                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>

                {/* Title + amount */}
                <div className="px-6 pt-2 pb-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Checkout</p>
                    <p className="text-4xl font-black text-gray-900 tracking-tight">{displayTotal}</p>
                    <p className="text-sm text-gray-400 mt-1">Select payment method to complete order</p>
                </div>

                {/* Payment options */}
                <div className="px-4 space-y-3 pb-2">

                    {/* Cash */}
                    <button
                        onClick={() => setSelectedMethod('cash')}
                        className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 border-2 transition-all duration-200 ${
                            selectedMethod === 'cash'
                                ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                                : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            selectedMethod === 'cash' ? 'bg-emerald-500' : 'bg-gray-200'
                        }`}>
                            <svg className={`h-6 w-6 ${ selectedMethod === 'cash' ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="text-left flex-1">
                            <p className={`font-bold text-[15px] ${ selectedMethod === 'cash' ? 'text-emerald-700' : 'text-gray-800'}`}>Cash Payment</p>
                            <p className="text-xs text-gray-400 mt-0.5">Physical cash transaction</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            selectedMethod === 'cash' ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                        }`}>
                            {selectedMethod === 'cash' && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {/* Standard / Digital Payment */}
                    <button
                        onClick={() => setSelectedMethod('card')}
                        className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 border-2 transition-all duration-200 ${
                            selectedMethod === 'card'
                                ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                                : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                            selectedMethod === 'card' ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                            <svg className={`h-6 w-6 ${ selectedMethod === 'card' ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="text-left flex-1">
                            <p className={`font-bold text-[15px] ${ selectedMethod === 'card' ? 'text-blue-700' : 'text-gray-800'}`}>Card / Digital Payment</p>
                            <p className="text-xs text-gray-400 mt-0.5">Credit/Debit Card or Transfer</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            selectedMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                            {selectedMethod === 'card' && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {/* Currency selector */}
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 mt-2">
                        <p className="text-xs text-gray-400 text-center mb-2 font-medium">Select Currency</p>
                        <div className="grid grid-cols-2 gap-2">
                            {['USD', 'KHR'].map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c)}
                                    className={`py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                                        currency === c
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                                    }`}
                                >
                                    {c === 'USD' ? '$ USD' : '៛ KHR'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-4 pb-6 pt-3 space-y-2">
                    <button
                        onClick={handleProceed}
                        className="w-full py-3.5 rounded-2xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 transition-all duration-200"
                    >
                        ✓ Confirm Checkout
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-2xl text-sm font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

