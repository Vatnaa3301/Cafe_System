<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cashier;
use Illuminate\Http\Request;

class CashierController extends Controller
{
    /**
     * List all active cashiers (accessible by any authenticated user).
     */
    public function index()
    {
        return response()->json(
            Cashier::where('active', true)->orderBy('name')->get()
        );
    }

    /**
     * List all cashiers including inactive (admin only).
     */
    public function adminIndex()
    {
        return response()->json(
            Cashier::orderBy('name')->get()
        );
    }

    /**
     * Create a new cashier (admin only).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'   => 'required|string|max:100|unique:cashiers,name',
            'active' => 'boolean',
        ]);

        $cashier = Cashier::create([
            'name'   => $data['name'],
            'active' => $data['active'] ?? true,
        ]);

        return response()->json($cashier, 201);
    }

    /**
     * Update a cashier (admin only).
     */
    public function update(Request $request, Cashier $cashier)
    {
        $data = $request->validate([
            'name'   => 'sometimes|string|max:100|unique:cashiers,name,' . $cashier->id,
            'active' => 'sometimes|boolean',
        ]);

        $cashier->update($data);

        return response()->json($cashier);
    }

    /**
     * Delete a cashier (admin only).
     */
    public function destroy(Cashier $cashier)
    {
        $cashier->delete();

        return response()->json(['message' => 'Cashier deleted.']);
    }
}
