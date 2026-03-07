<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $today       = now()->toDateString();
        $startOfWeek = now()->startOfWeek()->toDateString();
        $startOfMonth = now()->startOfMonth()->toDateString();

        $totalProducts   = Product::count();
        $totalCategories = \App\Models\Category::count();
        $totalOrders     = Order::where('status', 'paid')->count();
        $totalUsers      = User::count();

        $todayRevenue  = Order::whereDate('created_at', $today)
            ->where('status', 'paid')
            ->sum('total');

        $weekRevenue   = Order::whereDate('created_at', '>=', $startOfWeek)
            ->where('status', 'paid')
            ->sum('total');

        $monthRevenue  = Order::whereDate('created_at', '>=', $startOfMonth)
            ->where('status', 'paid')
            ->sum('total');

        $recentOrders  = Order::with(['items.product', 'user'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $topProducts = Product::withCount('orderItems')
            ->orderByDesc('order_items_count')
            ->limit(5)
            ->get();

        // Revenue chart — last 7 days
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $revenue = Order::whereDate('created_at', $date)
                ->where('status', 'paid')
                ->sum('total');
            $chartData[] = [
                'date'    => $date,
                'revenue' => $revenue,
            ];
        }

        return response()->json([
            'total_products'   => $totalProducts,
            'total_categories' => $totalCategories,
            'total_orders'     => $totalOrders,
            'total_users'      => $totalUsers,
            'today_revenue'    => $todayRevenue,
            'week_revenue'     => $weekRevenue,
            'month_revenue'    => $monthRevenue,
            'recent_orders'    => $recentOrders,
            'top_products'     => $topProducts,
            'chart_data'       => $chartData,
        ]);
    }

    public function chart(Request $request)
    {
        $period    = $request->query('period', 'week');
        $chartData = [];

        if ($period === 'day') {
            // Hourly breakdown for today (00:00 – 23:00)
            $today = now()->toDateString();
            for ($h = 0; $h < 24; $h++) {
                $start   = now()->startOfDay()->addHours($h);
                $end     = $start->copy()->addHour();
                $revenue = Order::where('status', 'paid')
                    ->whereBetween('created_at', [$start, $end])
                    ->sum('total');
                $chartData[] = [
                    'date'    => str_pad($h, 2, '0', STR_PAD_LEFT) . ':00',
                    'revenue' => $revenue,
                ];
            }
        } elseif ($period === 'month') {
            // Daily breakdown for the last 30 days
            for ($i = 29; $i >= 0; $i--) {
                $date    = now()->subDays($i)->toDateString();
                $revenue = Order::whereDate('created_at', $date)
                    ->where('status', 'paid')
                    ->sum('total');
                $chartData[] = [
                    'date'    => $date,
                    'revenue' => $revenue,
                ];
            }
        } else {
            // Default: weekly — last 7 days
            for ($i = 6; $i >= 0; $i--) {
                $date    = now()->subDays($i)->toDateString();
                $revenue = Order::whereDate('created_at', $date)
                    ->where('status', 'paid')
                    ->sum('total');
                $chartData[] = [
                    'date'    => $date,
                    'revenue' => $revenue,
                ];
            }
        }

        return response()->json([
            'chart_data' => $chartData,
            'period'     => $period,
        ]);
    }
}
