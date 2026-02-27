import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/format';

function yTickFormatter(v) {
    if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
    return `$${v}`;
}

export default function RevenueChart({ data }) {
    const maxRevenue = Math.max(0, ...data.map((d) => d.revenue ?? 0));
    const yMax       = Math.ceil(maxRevenue / 50) * 50 + 50;
    const yTicks     = Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50);
    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f97316" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickFormatter={(v) => new Date(v + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickFormatter={yTickFormatter}
                    width={48}
                    domain={[0, yMax]}
                    ticks={yTicks}
                />
                <Tooltip
                    formatter={(v) => [formatCurrency(v), 'Revenue']}
                    labelFormatter={(l) => new Date(l + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                />
                <Area
                    type="linear"
                    dataKey="revenue"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="url(#grad)"
                    dot={{ r: 3, fill: '#f97316', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
