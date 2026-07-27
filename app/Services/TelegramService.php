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
        $lines[] = "🧑‍💼 <b>Cashier:</b> " . $e($order->cashier_name ?: 'N/A');
        $lines[] = "─────────────────────";

        foreach ($order->items as $item) {
            $productName = $item->product->name ?? 'Unknown';
            $addons      = $item->addons ?? [];

            $size        = $addons['size']          ?? null;
            $sugar       = $addons['sugar']         ?? null;
            $ice         = $addons['ice']           ?? null;
            $topping     = $addons['topping']       ?? null;
            $toppingLvl  = $addons['topping_level'] ?? null;

            $sizeLabel = $size ? " ({$e($size)})" : '';
            $qty       = $item->quantity > 1 ? " ×{$item->quantity}" : '';

            $lines[] = "🧋 <b>{$e($productName)}{$sizeLabel}{$qty}</b>";

            // ── Ice ──────────────────────────────────────────────────────────
            if ($ice) {
                $iceEmoji = match (strtolower($ice)) {
                    'no ice'     => '',
                    'less ice'   => '',
                    'more ice'   => '',
                    'warm'       => '',
                    'hot'        => '',
                    default      => '',   // Normal Ice
                };
                $lines[] = "   {$iceEmoji} <b>Ice:</b> {$e($ice)}";
            }

            // ── Sugar ─────────────────────────────────────────────────────────
            if ($sugar) {
                $sugarEmoji = match ($sugar) {
                    '0%'   => '',
                    '25%'  => '',
                    '50%'  => '',
                    '100%' => '',
                    '120%' => '',
                    default => '',
                };
                $lines[] = "   {$sugarEmoji} <b>Sugar:</b> {$e($sugar)}";
            }

            // ── Topping ───────────────────────────────────────────────────────
            if ($toppingLvl && strtolower($toppingLvl) === 'no topping') {
                $lines[] = "   🚫 <b>Topping:</b> No Topping";
            } elseif ($topping) {
                $lvlEmoji = match (strtolower($toppingLvl ?? 'normal')) {
                    'less'   => '➖',
                    'more'   => '➕',
                    default  => '',
                };
                $lvlLabel = $toppingLvl && strtolower($toppingLvl) !== 'normal'
                    ? " ({$e($toppingLvl)})"
                    : '';
                $lines[] = "    <b>Topping:</b> {$e($topping)}{$lvlLabel} {$lvlEmoji}";
            }
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
