<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\ContentNode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class ContentController extends Controller
{
    public function index(): JsonResponse
    {
        $items = ContentNode::query()
            ->orderBy('updated_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'ok' => true,
            'items' => $items,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:500',
            'slug' => 'nullable|string|max:200',
            'body' => 'nullable|string',
            'meta' => 'nullable|array',
            'status' => 'nullable|string|in:draft,published,archived',
            'locale' => 'nullable|string|max:16',
            'node_type' => 'nullable|string|max:64',
        ]);

        $slug = $data['slug'] ?? Str::slug($data['title']);
        $data['slug'] = $slug;
        $data['status'] = $data['status'] ?? 'draft';
        $data['node_type'] = $data['node_type'] ?? 'article';

        $node = ContentNode::query()->create($data);

        Redis::incr('forge:cms:content:created');

        return response()->json([
            'ok' => true,
            'content' => $node,
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        if (! preg_match('/^[a-f\d]{24}$/i', $id)) {
            return response()->json(['ok' => false, 'error' => 'invalid id'], 400);
        }

        $node = ContentNode::query()->find($id);
        if (! $node) {
            return response()->json(['ok' => false, 'error' => 'not found'], 404);
        }

        return response()->json(['ok' => true, 'content' => $node]);
    }

    /**
     * Legacy endpoint used by the ForgeAI web client.
     */
    public function publish(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:500',
            'body' => 'nullable|string',
        ]);

        $node = ContentNode::query()->create([
            'title' => $data['title'],
            'slug' => Str::slug($data['title']).'-'.Str::random(6),
            'body' => $data['body'] ?? '',
            'status' => 'published',
            'node_type' => 'published-block',
            'published_at' => now(),
        ]);

        Redis::incr('forge:cms:publish');

        return response()->json([
            'ok' => true,
            'contentId' => (string) $node->getKey(),
            'title' => $node->title,
        ]);
    }
}
