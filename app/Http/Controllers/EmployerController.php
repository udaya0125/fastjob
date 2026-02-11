<?php

namespace App\Http\Controllers;

use App\Models\Employer;
use App\Models\UserLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployerController extends Controller
{
    /**
     * Display a listing of employers.
     */
    public function index()
    {
        $employers = Employer::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $employers,
        ]);
    }

    /**
     * Display a listing of employers with only name and post.
     */
    public function employeeindex()
    {
        $employers = Employer::select('id', 'name', 'post')
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'data' => $employers,
        ]);
    }

    /**
     * Store a newly created employer.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'post' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:100',
            'time' => 'required|string|max:100',
            'contact_number' => 'required|string|max:20',
            'experience' => 'nullable|string|max:100',
        ]);

        $employer = Employer::create($validated);

        $adminName = Auth::user()->name ?? 'System';

        // Log the creation action
        UserLog::create([
            'name' => $adminName,
            'ip_address' => $request->ip(),
            'title' => $adminName . ' created the employer ' . $employer->name,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Employer created successfully',
            'data' => $employer,
        ], 201);
    }

    /**
     * Update the specified employer.
     */
    public function update(Request $request, $id)
    {
        $employer = Employer::findOrFail($id);
        $oldName = $employer->name;
        $adminName = Auth::user()->name ?? 'System';

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'post' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|string|max:100',
            'time' => 'required|string|max:100',
            'contact_number' => 'required|string|max:20',
            'experience' => 'nullable|string|max:100',
        ]);

        $employer->update($validated);

        // Log the update action
        UserLog::create([
            'name' => $adminName,
            'ip_address' => $request->ip(),
            'title' => $adminName . ' updated the employer ' . $oldName,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Employer updated successfully',
            'data' => $employer,
        ]);
    }

    /**
     * Remove the specified employer.
     */
    public function destroy($id)
    {
        $employer = Employer::findOrFail($id);
        $employerName = $employer->name;
        $adminName = Auth::user()->name ?? 'System';

        $employer->delete();

        // Log the deletion action
        UserLog::create([
            'name' => $adminName,
            'ip_address' => request()->ip(),
            'title' => $adminName . ' deleted the employer ' . $employerName,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Employer deleted successfully',
        ]);
    }
}
