<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        $adminName = Auth::user()->name ?? 'System';

        // Log the creation action
        UserLog::create([
            'name' => $adminName,
            'ip_address' => $request->ip(),
            'title' => $adminName . ' created the customer ' . $customer->name,
        ]);

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
        $oldName = $customer->name;
        $adminName = Auth::user()->name ?? 'System';

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

        // Log the update action
        UserLog::create([
            'name' => $adminName,
            'ip_address' => $request->ip(),
            'title' => $adminName . ' updated the customer ' . $oldName,
        ]);

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
        $customerName = $customer->name;
        $adminName = Auth::user()->name ?? 'System';

        $customer->delete();

        // Log the deletion action
        UserLog::create([
            'name' => $adminName,
            'ip_address' => request()->ip(),
            'title' => $adminName . ' deleted the customer ' . $customerName,
        ]);

        return response()->json([
            'message' => 'Customer deleted successfully',
        ]);
    }
}
