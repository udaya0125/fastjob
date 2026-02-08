<?php

namespace App\Http\Controllers;

use App\Models\UserLog;
use Illuminate\Http\Request;

class UserLogController extends Controller
{
    /**
     * Display a listing of the user logs.
     */
    public function index()
    {
        // Fetch all logs, latest first
        $logs = UserLog::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }
}