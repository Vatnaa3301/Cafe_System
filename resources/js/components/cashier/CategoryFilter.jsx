import React from 'react';

export default function CategoryFilter({ categories, active, onChange }) {
    const all = [{ id: '', name: 'All', icon: '🍽' }, ...categories];

    return (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {all.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onChange(cat.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                        active === cat.id
                            ? 'bg-primary-500 text-white shadow-sm shadow-primary-200'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
                    }`}
                >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                </button>
            ))}
        </div>
    );
}
