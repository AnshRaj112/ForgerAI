<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\OrderNode;
use App\Models\ProductNode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class CommerceController extends Controller
{
    public function productsIndex(): JsonResponse
    {
        $items = ProductNode::query()
            ->orderBy('updated_at', 'desc')
            ->limit(100)
            ->get();

        return response()->json(['ok' => true, 'products' => $items]);
    }

    public function productsStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'sku' => 'required|string|max:64',
            'title' => 'required|string|max:500',
            'description' => 'nullable|string',
            'price_cents' => 'required|integer|min:0',
            'currency' => 'nullable|string|size:3',
            'inventory' => 'nullable|integer|min:0',
            'attributes' => 'nullable|array',
            'status' => 'nullable|string|in:draft,active,archived',
        ]);

        $data['currency'] = strtoupper($data['currency'] ?? 'USD');
        $data['inventory'] = $data['inventory'] ?? 0;
        $data['status'] = $data['status'] ?? 'draft';

        $product = ProductNode::query()->create($data);

        Redis::incr('forge:commerce:products:created');

        return response()->json(['ok' => true, 'product' => $product], 201);
    }

    public function productsShow(string $id): JsonResponse
    {
        if (! preg_match('/^[a-f\d]{24}$/i', $id)) {
            return response()->json(['ok' => false, 'error' => 'invalid id'], 400);
        }

        $product = ProductNode::query()->find($id);
        if (! $product) {
            return response()->json(['ok' => false, 'error' => 'not found'], 404);
        }

        return response()->json(['ok' => true, 'product' => $product]);
    }

    public function ordersIndex(): JsonResponse
    {
        $items = OrderNode::query()
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json(['ok' => true, 'orders' => $items]);
    }

    public function ordersStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'currency' => 'nullable|string|size:3',
            'line_items' => 'required|array|min:1',
            'line_items.*.sku' => 'required|string',
            'line_items.*.quantity' => 'required|integer|min:1',
            'line_items.*.price_cents' => 'required|integer|min:0',
            'customer_email' => 'nullable|email',
        ]);

        $currency = strtoupper($data['currency'] ?? 'USD');
        $total = 0;
        foreach ($data['line_items'] as $line) {
            $total += $line['price_cents'] * $line['quantity'];
        }

        $order = OrderNode::query()->create([
            'reference' => 'ord-'.Str::upper(Str::random(10)),
            'status' => 'pending',
            'currency' => $currency,
            'total_cents' => $total,
            'line_items' => $data['line_items'],
            'customer_email' => $data['customer_email'] ?? null,
        ]);

        Redis::incr('forge:commerce:orders:created');

        return response()->json(['ok' => true, 'order' => $order], 201);
    }
}
