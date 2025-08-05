<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRequest;
use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Attendance::with('employee');
        
        // Filter by employee if user is not HRD/Admin
        if (Auth::user()->isEmployee()) {
            $employee = Auth::user()->employee;
            if ($employee) {
                $query->where('employee_id', $employee->id);
            }
        }

        // Filter by date range if provided
        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        
        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        // Filter by employee for HRD/Admin
        if ($request->filled('employee_id') && Auth::user()->isHrdOrAdmin()) {
            $query->where('employee_id', $request->employee_id);
        }

        $attendances = $query->latest('date')->paginate(10);
        
        // Get employees list for HRD/Admin filter
        $employees = Auth::user()->isHrdOrAdmin() ? Employee::active()->get() : null;

        return Inertia::render('attendances/index', [
            'attendances' => $attendances,
            'employees' => $employees,
            'filters' => $request->only(['date_from', 'date_to', 'employee_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Only HRD/Admin can manually create attendance
        if (!Auth::user()->isHrdOrAdmin()) {
            abort(403);
        }

        $employees = Employee::active()->get();
        
        return Inertia::render('attendances/create', [
            'employees' => $employees
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $validated = $request->validated();
        
        // Calculate total hours if both check_in and check_out are provided
        if (isset($validated['check_in']) && isset($validated['check_out'])) {
            $checkIn = Carbon::parse($validated['check_in']);
            $checkOut = Carbon::parse($validated['check_out']);
            $validated['total_hours'] = $checkOut->diffInHours($checkIn, true);
        }

        $attendance = Attendance::create($validated);

        return redirect()->route('attendances.show', $attendance)
            ->with('success', 'Attendance recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        $attendance->load('employee');
        
        // Check permission for employees
        if (Auth::user()->isEmployee() && $attendance->employee->user_id !== Auth::id()) {
            abort(403);
        }
        
        return Inertia::render('attendances/show', [
            'attendance' => $attendance
        ]);
    }


}