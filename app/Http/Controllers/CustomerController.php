<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers
     */
    public function index()
    {
        $customers = Customer::latest()->get();

        return response()->json($customers);
    }

    /**
     * Display a listing of customer names only
     */
    public function indexname()
    {
        $customers = Customer::select('id', 'name')
            ->latest()
            ->get();

        return response()->json($customers);
    }

    /**
     * Store a newly created customer
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'reference_by' => 'nullable|string|max:255',
            'permanent_address' => 'nullable|string',
            'temporary_address' => 'nullable|string',
            'contact_number' => 'required|string|max:20',
            'experience' => 'nullable|string',
            'interested_in' => 'nullable|string',
        ]);

        $customer = Customer::create($validated);

        return response()->json([
            'message' => 'Customer created successfully',
            'data' => $customer,
        ], 201);
    }

    /**
     * Update the specified customer
     */
    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'reference_by' => 'nullable|string|max:255',
            'permanent_address' => 'nullable|string',
            'temporary_address' => 'nullable|string',
            'contact_number' => 'required|string|max:20',
            'experience' => 'nullable|string',
            'interested_in' => 'nullable|string',
        ]);

        $customer->update($validated);

        return response()->json([
            'message' => 'Customer updated successfully',
            'data' => $customer,
        ]);
    }

    /**
     * Remove the specified customer
     */
    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully',
        ]);
    }
}
