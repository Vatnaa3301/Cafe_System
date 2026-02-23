import React from 'react';

export default function StatCard({ title, value, icon, color = 'orange', sub }) {
    const colors = {
        orange: 'bg-orange-50 text-orange-500',
        blue:   'bg-blue-50 text-blue-500',
        green:  'bg-green-50 text-green-500',
        purple: 'bg-purple-50 text-purple-500',
    };

    return (
        <div className="card p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}
