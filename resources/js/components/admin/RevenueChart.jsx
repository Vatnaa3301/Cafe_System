import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/format';

function yTickFormatter(v) {
    if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
    if (!Number.isInteger(v)) return `$${v.toFixed(2)}`;
    return `$${v}`;
}

/**
 * Pick a human-friendly Y-axis scale that actually shows small values.
 * Targets ~4-5 ticks with a "nice" step (1, 2, 2.5, 5, 10 × 10^n).
 */
function calcYAxis(maxRevenue) {
    if (maxRevenue <= 0) {
        return { yMax: 5, yTicks: [0, 1, 2, 3, 4, 5] };
    }
    const headroom = maxRevenue * 1.25;          // 25% breathing room
    const rawStep  = headroom / 4;               // aim for ~4 ticks
    const mag      = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const norm     = rawStep / mag;

    let niceNorm;
    if      (norm <= 1)   niceNorm = 1;
    else if (norm <= 2)   niceNorm = 2;
    else if (norm <= 2.5) niceNorm = 2.5;
    else if (norm <= 5)   niceNorm = 5;
    else                  niceNorm = 10;

    const step   = niceNorm * mag;
    const yMax   = Math.ceil(headroom / step) * step;
    const count  = Math.round(yMax / step);
    const yTicks = Array.from({ length: count + 1 }, (_, i) =>
        parseFloat((i * step).toPrecision(10)),
    );
    return { yMax, yTicks };
}

function xTickFormat(v, period) {
    if (period === 'day') {
        // v is 'HH:00', e.g. '14:00'
        const h = parseInt(v, 10);
        if (h === 0)  return '12 AM';
        if (h === 12) return '12 PM';
        return h < 12 ? `${h} AM` : `${h - 12} PM`;
    }
    return new Date(v + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function tooltipLabelFormat(v, period) {
    if (period === 'day') {
        const h = parseInt(v, 10);
        const suffix = h < 12 ? 'AM' : 'PM';
        const display = h === 0 ? 12 : h <= 12 ? h : h - 12;
        const next = h + 1;
        const nextSuffix = next < 12 ? 'AM' : 'PM';
        const nextDisplay = next === 0 ? 12 : next <= 12 ? next : next - 12;
        return `${display}:00 ${suffix} – ${nextDisplay}:00 ${nextSuffix}`;
    }
    return new Date(v + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function RevenueChart({ data, period = 'week' }) {
    const maxRevenue = Math.max(0, ...data.map((d) => d.revenue ?? 0));
    const { yMax, yTicks } = calcYAxis(maxRevenue);

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
                    tickFormatter={(v) => xTickFormat(v, period)}
                    interval={period === 'day' ? 2 : period === 'month' ? 4 : 0}
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
                    labelFormatter={(l) => tooltipLabelFormat(l, period)}
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
