<?php

namespace App\Http\Controllers;

use App\Models\Employer;
use Illuminate\Http\Request;

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
        $employer->delete();

        return response()->json([
            'status' => true,
            'message' => 'Employer deleted successfully',
        ]);
    }
}
