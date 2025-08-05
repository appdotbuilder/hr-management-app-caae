<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HrdController extends Controller
{
    /**
     * Display the HRD dashboard.
     */
    public function index()
    {
        $totalEmployees = Employee::active()->count();
        $todayAttendance = Attendance::whereDate('date', today())->count();
        $pendingPayrolls = Payroll::where('status', 'draft')->count();
        
        // Recent attendance records
        $recentAttendance = Attendance::with('employee')
            ->whereDate('date', today())
            ->latest()
            ->take(5)
            ->get();

        // Monthly attendance summary
        $monthlyAttendance = Attendance::selectRaw('
                COUNT(*) as total_records,
                SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present_count,
                SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent_count,
                SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late_count
            ')
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->first();

        return Inertia::render('hrd/dashboard', [
            'stats' => [
                'totalEmployees' => $totalEmployees,
                'todayAttendance' => $todayAttendance,
                'pendingPayrolls' => $pendingPayrolls,
            ],
            'recentAttendance' => $recentAttendance,
            'monthlyAttendance' => $monthlyAttendance,
        ]);
    }
}