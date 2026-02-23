import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/format';

export default function CartItem({ item }) {
    const { updateQuantity, removeItem } = useCart();
    const c = item.customization ?? {};

    return (
        <div className="py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.image ? (
                        <img src={`/storage/${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-300">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/></svg>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-primary-500 font-semibold">{formatCurrency(item.price)}</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        className="h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold transition-colors"
                    >
                        −
                    </button>
                    <span className="text-sm font-bold text-gray-800 w-5 text-center">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        className="h-6 w-6 rounded-full bg-primary-100 hover:bg-primary-200 text-primary-600 flex items-center justify-center text-sm font-bold transition-colors"
                    >
                        +
                    </button>
                </div>

                {/* Item total */}
                <div className="text-right flex-shrink-0 w-20">
                    <p className="text-sm font-bold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                    <button
                        onClick={() => removeItem(item.cartKey)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>

            {/* Customization badges */}
            {(c.size || c.sugar || c.ice || c.topping) && (
                <div className="flex flex-wrap gap-1 mt-1.5 pl-[52px]">
                    {c.size && (
                        <span className="text-[10px] bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-2 py-0.5 font-semibold">
                            Size {c.size}
                        </span>
                    )}
                    {c.sugar && (
                        <span className="text-[10px] bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full px-2 py-0.5">
                            🍬 {c.sugar}
                        </span>
                    )}
                    {c.ice && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2 py-0.5">
                            🧊 {c.ice}
                        </span>
                    )}
                    {c.topping && (
                        <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 rounded-full px-2 py-0.5">
                            ✨ {c.topping} · {c.topping_level}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
