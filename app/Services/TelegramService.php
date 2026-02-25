<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    public static function notifyNewOrder(Order $order): void
    {
        $botToken = config('services.telegram.bot_token');
        $chatId   = config('services.telegram.chat_id');

        if (empty($botToken) || empty($chatId)) {
            Log::warning('TelegramService: bot_token or chat_id is not configured.');
            return;
        }

        $e = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        $orderNo = '#' . str_pad($order->id, 12, '0', STR_PAD_LEFT);

        $lines = [];
        $lines[] = "🆕 <b>New Order Received!</b>";
        $lines[] = "";
        $lines[] = "📋 <b>Order No:</b> <code>{$orderNo}</code>";
        $lines[] = "👤 <b>Customer:</b> " . $e($order->customer_name ?: 'Walk-in');
        $lines[] = "─────────────────────";

        foreach ($order->items as $item) {
            $productName = $item->product->name ?? 'Unknown';
            $addons      = $item->addons ?? [];

            $topping     = !empty($addons['topping']) ? $addons['topping'] : 'No Topping';
            $ice         = !empty($addons['ice'])     ? $addons['ice']     : 'Normal Ice';
            $size        = !empty($addons['size'])    ? $addons['size']    : null;

            $sizeLabel   = $size ? " ({$e($size)})" : '';
            $qty         = $item->quantity > 1 ? " x{$item->quantity}" : '';

            $lines[] = "🍹 <b>{$e($productName)}{$sizeLabel}{$qty}</b>";
            $lines[] = "   └ {$e($topping)} | {$e($ice)}";
        }

        $lines[] = "─────────────────────";

        $orderType     = $order->order_type ?? 'Pick up';
        $paymentMethod = strtolower($order->payment_method ?? 'cash') === 'qr'
            ? 'Bakong QR (' . strtoupper($order->currency ?? 'USD') . ')'
            : 'Cash';

        $lines[] = "🚚 <b>Order Type:</b> {$e($orderType)}";
        $lines[] = "💳 <b>Payment:</b> {$e($paymentMethod)}";

        $message = implode("\n", $lines);

        Log::info('TelegramService: Attempting to send message to chat_id=' . $chatId);

        try {
            $response = Http::timeout(15)->withoutVerifying()->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id'    => $chatId,
                'text'       => $message,
                'parse_mode' => 'HTML',
            ]);
            Log::info('TelegramService: Response status=' . $response->status() . ' body=' . $response->body());
        } catch (\Throwable $e2) {
            Log::error('TelegramService: Failed to send message. ' . $e2->getMessage());
        }
    }
}
