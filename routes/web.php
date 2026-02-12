<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CompanyvisitorsController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserLogController;


// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

    // Route::get('/dashboard', function () {
    //     return Inertia::render('Dashboard');
    // })->middleware(['auth', 'verified'])->name('dashboard');

    // ******************************************************************
    //  Public Routes
    // ******************************************************************

    //-------------------------
    // Welcome Page
    //-------------------------

    Route::get('/', function () {
        return Inertia::render('AdminPages/Welcome');
    });

    //-------------------------
    // Dashboard Page
    //-------------------------

    Route::get('/dashboard', function () {
        return Inertia::render('AdminPages/Dashboard');
    });


    // Route::get('/loginpage', function () {
    //     return Inertia::render('OthersPage/LoginPage');
    // });

    // ******************************************************************
    //  Authenticated Routes Group
    // ******************************************************************

Route::middleware('auth')->group(function () {


    // ******************************************************************
    //  Admin Pages Routes
    // ******************************************************************

    //-------------------------
    // Employer Details Page
    //-------------------------

    Route::get('/employer-details', function () {
        return Inertia::render('AdminPages/EmployerDetails');
    });

    //-------------------------
    // Company Visitor Details Page
    //-------------------------

    Route::get('/company-visitor-details', function () {
        return Inertia::render('AdminPages/CompanyVisitors');
    });

    //-------------------------
    // Customer Details Page
    //-------------------------

    Route::get('/customer-details', function () {
        return Inertia::render('AdminPages/CustomerDetails');
    });

    //-------------------------
    // User Details Page
    //-------------------------

    Route::get('/fixed-job-details', function () {
        return Inertia::render('AdminPages/FixedJobs');
    });



    // ******************************************************************
    //  Controller Functions for Admin Pages and Reports
    // ******************************************************************

    // ----------------------------------------------------------------
    //  Company Visitors Controller Functions
    // ----------------------------------------------------------------

    Route::get('/ourvisitors', [CompanyvisitorsController::class, 'index'])->name('ourvisitors.index');
    Route::post('/ourvisitors', [CompanyvisitorsController::class, 'store'])->name('ourvisitors.store');
    Route::put('/ourvisitors/{id}', [CompanyvisitorsController::class, 'update'])->name('ourvisitors.update');
    Route::delete('/ourvisitors/{id}', [CompanyvisitorsController::class, 'destroy'])->name('ourvisitors.destroy');



    // ----------------------------------------------------------------
    //  Our Customers Controller Functions
    // --------------------------------------------------------------------

    Route::get('/ourcustomers', [CustomerController::class, 'index'])->name('ourcustomers.index');
    Route::post('/ourcustomers', [CustomerController::class, 'store'])->name('ourcustomers.store');
    Route::put('/ourcustomers/{id}', [CustomerController::class, 'update'])->name('ourcustomers.update');
    Route::delete('/ourcustomers/{id}', [CustomerController::class, 'destroy'])->name('ourcustomers.destroy');

    // --------------------------------------------------------------------
    //  Our Employers Controller Functions
    // --------------------------------------------------------------------

    Route::get('/ouremployers', [EmployerController::class, 'index'])->name('ouremployers.index');
    Route::post('/ouremployers', [EmployerController::class, 'store'])->name('ouremployers.store');
    Route::put('/ouremployers/{id}', [EmployerController::class, 'update'])->name('ouremployers.update');
    Route::delete('/ouremployers/{id}', [EmployerController::class, 'destroy'])->name('ouremployers.destroy');


    // --------------------------------------------------------------------
    // Our Customer Names Only Controller Function
    // --------------------------------------------------------------------

    Route::get('/ourcustomername', [CustomerController::class, 'indexname'])->name('ourcustomername.indexname');

    // --------------------------------------------------------------------
    // Our Employer Details (name and post only) Controller Function
    // --------------------------------------------------------------------

    Route::get('/ouremployersdetails', [EmployerController::class, 'employeeindex'])->name('ouremployersdetails.employeeindex');


});



Route::middleware(['auth', 'roles:Admin'])->group(function() {


    //-------------------------
    // User Management Page
    //-------------------------

    Route::get('/users', function () {
        return Inertia::render('AdminPages/UserManagement');
    });

    //-------------------------
    // Activity Logs Page
    //-------------------------

    
    Route::get('/user-logs', function () {
        return Inertia::render('AdminPages/ActivityLogs');
    });

    // ******************************************************************
    //  Report Pages Routes
    // ******************************************************************


    //-------------------------
    // Bank Income Report Page
    //-------------------------

    Route::get('/bank-income', function () {
        return Inertia::render('Report/BankIncome');
    });

    //-------------------------
    // Cash Reports Page
    //-------------------------


    Route::get('/cash-reports', function () {
        return Inertia::render('Report/CashReports');
    });

    //-------------------------
    // Phone Pay Reports Page
    //-------------------------


    Route::get('/income-reports', function () {
        return Inertia::render('Report/IncomeReports');
    });

    //-------------------------
    // Pending Reports Page
    //-------------------------


    Route::get('/pending-reports', function () {
        return Inertia::render('Report/PendingReports');
    });


    // ******************************************************************
    //  Controller Functions for User Management and Activity Logs
    // ******************************************************************


    // --------------------------------------------------------------------
    //  Our Users Controller Functions
    // --------------------------------------------------------------------

    Route::get('/ourusers', [UserController::class, 'index'])->name('ourusers.index');
    Route::post('/ourusers', [UserController::class, 'store'])->name('ourusers.store');
    Route::put('/ourusers/{id}', [UserController::class, 'update'])->name('ourusers.update');
    Route::delete('/ourusers/{id}', [UserController::class, 'destroy'])->name('ourusers.destroy');


    // --------------------------------------------------------------------
    //  Activity Logs Controller Functions
    // --------------------------------------------------------------------

    Route::get('/ourlogs', [UserLogController::class, 'index'])->name('ourlogs.index');

    //----------------------------------------------------------------
    // Add this route for paid visitors
    // ----------------------------------------------------------------

    Route::get('/company-visitors/paid', [CompanyvisitorsController::class, 'paidVisitors'])->name('ourvisitors.paid');

    //----------------------------------------------------------------
    // Add this route for pending visitors
    // ----------------------------------------------------------------

    Route::get('/company-visitors/pending', [CompanyvisitorsController::class, 'pendingVisitors'])->name('ourvisitors.pending');

    //----------------------------------------------------------------
    // Add this route for cash visitors
    // ----------------------------------------------------------------

    Route::get('/company-visitors/cash', [CompanyvisitorsController::class, 'cashVisitors'])->name('ourvisitors.cash');


    // ----------------------------------------------------------------
    // Add this route for phone pay visitors
    // ----------------------------------------------------------------

    Route::get('/company-visitors/phone-pay', [CompanyvisitorsController::class, 'phonePayVisitors'])->name('ourvisitors.phone-pay');
       
});

require __DIR__.'/auth.php';
