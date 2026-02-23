import React from 'react';
import { formatCurrency } from '../../utils/format';

export default function ProductCard({ product, onCustomize }) {
    const sizes = product.sizes; // e.g. {S: 3.99, M: 4.99, L: 5.99} or null
    const prices = sizes ? Object.values(sizes) : null;
    const minPrice = prices ? Math.min(...prices) : product.price;
    const maxPrice = prices ? Math.max(...prices) : null;

    return (
        <div
            onClick={() => product.is_available && onCustomize(product)}
            className={`card overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 group ${
                !product.is_available ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
            <div className="h-36 bg-gray-100 overflow-hidden">
                {product.image ? (
                    <img
                        src={`/storage/${product.image}`}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">{product.name}</p>
                {maxPrice ? (
                    <p className="text-primary-500 font-bold text-sm mt-1">
                        {formatCurrency(minPrice)} – {formatCurrency(maxPrice)}
                    </p>
                ) : (
                    <p className="text-primary-500 font-bold text-sm mt-1">{formatCurrency(product.price)}</p>
                )}
                {sizes && (
                    <div className="flex gap-1 mt-1">
                        {Object.keys(sizes).map((s) => (
                            <span key={s} className="text-[10px] bg-orange-50 text-orange-500 border border-orange-100 rounded-full px-1.5 py-0.5 font-semibold">{s}</span>
                        ))}
                    </div>
                )}
                {!product.is_available && (
                    <p className="text-xs text-red-400 mt-0.5">Unavailable</p>
                )}
            </div>
        </div>
    );
}
