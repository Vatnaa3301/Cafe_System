import React, { useEffect, useState, useCallback } from 'react';
import { getDashboardStats } from '../../api/dashboard';
import StatCard from '../common/StatCard';
import LoadingSpinner from '../common/LoadingSpinner';
import RevenueChart from './RevenueChart';
import { formatCurrency } from '../../utils/format';

const REFRESH_INTERVAL_MS = 30_000;

export default function Dashboard() {
    const [stats, setStats]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const load = useCallback((silent = false) => {
        if (silent) setRefreshing(true);
        else setLoading(true);

        getDashboardStats()
            .then((data) => {
                setStats(data);
                setLastUpdated(new Date());
            })
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    }, []);

    // initial load
    useEffect(() => { load(); }, [load]);

    // auto-refresh every 30 s
    useEffect(() => {
        const id = setInterval(() => load(true), REFRESH_INTERVAL_MS);
        return () => clearInterval(id);
    }, [load]);

    if (loading) return <LoadingSpinner />;
    if (!stats)  return <p className="text-gray-500">Failed to load stats.</p>;

    const statCards = [
        {
            title: "Today's Revenue",
            value: formatCurrency(stats.today_revenue),
            color: 'orange',
            sub: 'Paid orders today',
            icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
        },
        {
            title: 'Monthly Revenue',
            value: formatCurrency(stats.month_revenue),
            color: 'green',
            sub: 'This month',
            icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
        },
        {
            title: 'Total Orders',
            value: stats.total_orders,
            color: 'blue',
            sub: 'All time',
            icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
        },
        {
            title: 'Total Products',
            value: stats.total_products,
            color: 'purple',
            sub: `${stats.total_categories} categories`,
            icon: <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {statCards.map((c) => (
                    <StatCard key={c.title} {...c} />
                ))}
            </div>

        {/* Revenue Chart */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-700">Revenue — Last 7 Days</h2>
                    <div className="flex items-center gap-3">
                        {lastUpdated && (
                            <span className="text-xs text-gray-400">
                                Updated {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            onClick={() => load(true)}
                            disabled={refreshing}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 flex items-center gap-1.5"
                        >
                            <svg className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {refreshing ? 'Refreshing…' : 'Refresh'}
                        </button>
                    </div>
                </div>
                <RevenueChart data={stats.chart_data} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Orders */}
                <div className="card p-5">
                    <h2 className="text-base font-semibold text-gray-700 mb-4">Recent Orders</h2>
                    {stats.recent_orders.length === 0 ? (
                        <p className="text-gray-400 text-sm">No orders yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recent_orders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">#{order.id} — {order.customer_name}</p>
                                        <p className="text-xs text-gray-400">{order.items.length} item(s) · {new Date(order.created_at).toLocaleTimeString()}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-primary-600">{formatCurrency(order.total)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Products */}
                <div className="card p-5">
                    <h2 className="text-base font-semibold text-gray-700 mb-4">Top Products</h2>
                    {stats.top_products.length === 0 ? (
                        <p className="text-gray-400 text-sm">No data yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.top_products.map((product, idx) => (
                                <div key={product.id} className="flex items-center gap-3">
                                    <span className="h-6 w-6 rounded-full bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{product.name}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{product.order_items_count} sold</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
