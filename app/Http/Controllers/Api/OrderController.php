<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['items.product', 'user'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string|max:255',
            'cashier_name'  => 'nullable|string|max:100',
            'items'         => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.addons'     => 'nullable|array',
            'voucher_code'      => 'nullable|string',
            'discount'          => 'nullable|numeric|min:0',
            'notes'             => 'nullable|string',
            'payment_method'    => 'nullable|in:cash,qr',
            'currency'          => 'nullable|in:USD,KHR',
            'order_type'        => 'nullable|string|max:50',
        ]);

        DB::beginTransaction();

        try {
            $subtotal = 0;
            $itemsData = [];

            foreach ($data['items'] as $item) {
                $product = \App\Models\Product::findOrFail($item['product_id']);
                $addons  = $item['addons'] ?? [];

                // Resolve unit price: base price, optionally overridden by size
                $unitPrice = $product->price;
                $size = $addons['size'] ?? null;
                if ($size && is_array($product->sizes) && isset($product->sizes[$size])) {
                    $unitPrice = (float) $product->sizes[$size];
                }

                // Add topping extra price if applicable
                $selectedTopping = $addons['topping'] ?? null;
                if ($selectedTopping && is_array($product->toppings)) {
                    $toppingItem = collect($product->toppings)->firstWhere('name', $selectedTopping);
                    if ($toppingItem) {
                        $unitPrice += (float) ($toppingItem['extra_price'] ?? 0);
                    }
                }

                $itemTotal  = $unitPrice * $item['quantity'];
                $subtotal  += $itemTotal;
                $itemsData[] = [
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal'   => $itemTotal,
                    'addons'     => $addons ?: null,
                ];
            }

            $discount = $data['discount'] ?? 0;
            $tax      = ($subtotal - $discount) * 0.10;
            $total    = $subtotal - $discount + $tax;

            $order = Order::create([
                'user_id'       => $request->user()->id,
                'customer_name' => $data['customer_name'],
                'cashier_name'  => $data['cashier_name'] ?? null,
                'subtotal'      => $subtotal,
                'tax'           => $tax,
                'total'         => $total,
                'voucher_code'  => $data['voucher_code'] ?? null,
                'discount'      => $discount,
                'status'          => 'paid',
                'notes'           => $data['notes'] ?? null,
                'payment_method'  => $data['payment_method'] ?? 'cash',
                'currency'        => $data['currency'] ?? 'USD',
                'order_type'      => $data['order_type'] ?? 'Pick up',
            ]);

            foreach ($itemsData as $itemData) {
                $order->items()->create($itemData);
            }

            DB::commit();

            // Notify via Telegram (silent — never breaks the order)
            try {
                TelegramService::notifyNewOrder($order->load('items.product'));
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('Telegram notify failed: ' . $e->getMessage());
            }

            return response()->json($order->load(['items.product', 'user']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order failed: ' . $e->getMessage()], 500);
        }
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['items.product', 'user']));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,paid,cancelled',
        ]);

        $order->update($data);

        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $order->items()->delete();
        $order->delete();

        return response()->json(['message' => 'Order deleted.']);
    }
}
