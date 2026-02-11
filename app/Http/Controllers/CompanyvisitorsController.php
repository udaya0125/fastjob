<?php

namespace App\Http\Controllers;

use App\Models\Companyvisitors;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyvisitorsController extends Controller
{
    public function index()
    {
        $visitors = Companyvisitors::latest()->get();

        return response()->json($visitors);
    }

    // Add this new method for paid visitors only
    public function paidVisitors()
    {
        $paidVisitors = Companyvisitors::where('payment_status', 'Paid')
            ->where('status', 'Confirm') // Optional: if you only want confirmed paid visitors
            ->latest()
            ->get();

        return response()->json($paidVisitors);
    }

    // Add this new method for pending visitors only
    public function pendingVisitors()
    {
        $pendingVisitors = Companyvisitors::where('payment_status', 'Pending')
            ->where('status', 'Confirm') // Optional: if you only want confirmed pending visitors
            ->latest()
            ->get();

        return response()->json($pendingVisitors);
    }

    // Add this new method for cash payments only
    public function cashVisitors()
    {
        $cashVisitors = Companyvisitors::where('payment_method', 'Cash')
            ->where('payment_status', 'Paid') // Optional: Only show paid cash transactions
            ->where('status', 'Confirm')
            ->latest()
            ->get();

        return response()->json($cashVisitors);
    }

    // Add this new method for phone pay payments
    public function phonePayVisitors()
    {
        // Search for variations of phone pay payment methods
        $phonePayVisitors = Companyvisitors::where(function ($query) {
            $query->where('payment_method', 'Phone Pay')
                ->orWhere('payment_method', 'PhonePay')
                ->orWhere('payment_method', 'Phone Pay')
                ->orWhere('payment_method', 'UPI')
                ->orWhere('payment_method', 'Mobile Payment')
                ->orWhere('payment_method', 'like', '%Phone%')
                ->orWhere('payment_method', 'like', '%UPI%');
        })
        ->where('payment_status', 'Paid')
        ->where('status', 'Confirm')
        ->latest()
        ->get();

        return response()->json($phonePayVisitors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string|max:255',
            'customer_number' => 'required|string|max:50',
            'companyname' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'status' => 'required|string|max:50',
            // Other fields are optional for initial creation
            'salary' => 'nullable|numeric',
            'income_type' => 'nullable|string|max:100',
            'percent' => 'nullable|numeric',
            'income' => 'nullable|numeric',
            'payment_status' => 'nullable|string|max:50',
            'payment_method' => 'nullable|string|max:50',
            'citizenship' => 'nullable|string|max:100',
        ]);

        $visitor = Companyvisitors::create($validated);

        $adminName = Auth::user()->name ?? 'System';

        // Log the creation action
        UserLog::create([
            'name' => $adminName,
            'ip_address' => $request->ip(),
            'title' => $adminName . ' created the company visitor ' . $visitor->name,
        ]);

        return response()->json([
            'message' => 'Company visitor created successfully',
            'data' => $visitor,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $visitor = Companyvisitors::findOrFail($id);
        $oldName = $visitor->name;
        $adminName = Auth::user()->name ?? 'System';

        $validated = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string|max:255',
            'customer_number' => 'required|string|max:50',
            'companyname' => 'required|string|max:255',
            'position' => 'nullable|string|max:255',
            'status' => 'required|string|max:50',
            'salary' => 'nullable|numeric',
            'income_type' => 'nullable|string|max:100',
            'percent' => 'nullable|numeric',
            'income' => 'nullable|numeric',
            'payment_status' => 'nullable|string|max:50',
            'payment_method' => 'nullable|string|max:50',
            'citizenship' => 'nullable|string|max:100',
        ]);

        $visitor->update($validated);

        // Log the update action
        UserLog::create([
            'name' => $adminName,
            'ip_address' => $request->ip(),
            'title' => $adminName . ' updated the company visitor ' . $oldName,
        ]);

        return response()->json([
            'message' => 'Company visitor updated successfully',
            'data' => $visitor,
        ]);
    }

    public function destroy($id)
    {
        $visitor = Companyvisitors::findOrFail($id);
        $visitorName = $visitor->name;
        $adminName = Auth::user()->name ?? 'System';

        $visitor->delete();

        // Log the deletion action
        UserLog::create([
            'name' => $adminName,
            'ip_address' => request()->ip(),
            'title' => $adminName . ' deleted the company visitor ' . $visitorName,
        ]);

        return response()->json([
            'message' => 'Company visitor deleted successfully',
        ]);
    }
}
