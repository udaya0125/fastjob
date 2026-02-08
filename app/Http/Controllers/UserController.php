<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index()
    {
        return response()->json(
            User::latest()->get()
        );
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'password_confirmation' => 'required|same:password',
            'roles'    => 'nullable|string|in:admin,user',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')
                ->store('users', 'public');
        }

        $validated['password'] = Hash::make($validated['password']);
        
        // Remove password_confirmation from validated data
        unset($validated['password_confirmation']);

        $user = User::create($validated);

        return response()->json([
            'message' => 'User created successfully',
            'user'    => $user,
        ], 201);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, $id)
    {
        // Find the user first
        $user = User::findOrFail($id);
        
        // Validation rules
        $rules = [
            'name'     => 'required|string|max:255',
            'email'    => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'roles'    => 'nullable|string|in:admin,user',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ];
        
        // Only add password validation if password is provided
        if ($request->has('password') && !empty($request->password)) {
            $rules['password'] = 'min:6';
            $rules['password_confirmation'] = 'required|same:password';
        } else {
            $rules['password'] = 'nullable';
            $rules['password_confirmation'] = 'nullable';
        }
        
        $validated = $request->validate($rules);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($user->image && Storage::disk('public')->exists($user->image)) {
                Storage::disk('public')->delete($user->image);
            }

            $validated['image'] = $request->file('image')
                ->store('users', 'public');
        }

        // Handle password update only if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        
        // Remove password_confirmation from validated data (not needed for DB)
        unset($validated['password_confirmation']);

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user'    => $user,
        ]);
    }

    /**
     * Remove the specified user
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->image && Storage::disk('public')->exists($user->image)) {
            Storage::disk('public')->delete($user->image);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}