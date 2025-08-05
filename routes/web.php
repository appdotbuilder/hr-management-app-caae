<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\CheckInController;
use App\Http\Controllers\CheckOutController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PayrollGenerationController;
use App\Http\Controllers\HrdController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        $data = [];
        
        if ($user->role === 'employee' && $user->employee) {
            // Employee dashboard data
            $todayAttendance = \App\Models\Attendance::where('employee_id', $user->employee->id)
                ->whereDate('date', today())
                ->first();
                
            $data['todayAttendance'] = $todayAttendance;
            $data['canCheckIn'] = !$todayAttendance || !$todayAttendance->check_in;
            $data['canCheckOut'] = $todayAttendance && $todayAttendance->check_in && !$todayAttendance->check_out;
            
            // Recent attendance for employee
            $data['recentAttendances'] = \App\Models\Attendance::where('employee_id', $user->employee->id)
                ->latest('date')
                ->take(5)
                ->get();
                
            // Recent payrolls for employee
            $data['recentPayrolls'] = \App\Models\Payroll::where('employee_id', $user->employee->id)
                ->latest('year')
                ->latest('month')
                ->take(5)
                ->get();
        } else {
            // HRD/Admin dashboard data
            $data['recentAttendances'] = \App\Models\Attendance::with('employee')
                ->latest('date')
                ->take(5)
                ->get();
                
            $data['recentPayrolls'] = \App\Models\Payroll::with('employee')
                ->latest('year')
                ->latest('month')
                ->take(5)
                ->get();
        }
        
        return Inertia::render('dashboard', $data);
    })->name('dashboard');

    // HRD Dashboard
    Route::get('hrd', [HrdController::class, 'index'])->name('hrd.dashboard');

    // Employee Management (HRD/Admin only)
    Route::resource('employees', EmployeeController::class);

    // Attendance Management
    Route::resource('attendances', AttendanceController::class);
    Route::post('check-in', [CheckInController::class, 'store'])->name('attendance.check-in');
    Route::post('check-out', [CheckOutController::class, 'store'])->name('attendance.check-out');

    // Payroll Management
    Route::resource('payrolls', PayrollController::class);
    Route::post('payroll-generation', [PayrollGenerationController::class, 'store'])->name('payrolls.generate');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
