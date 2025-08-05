<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePayrollRequest;
use App\Http\Requests\UpdatePayrollRequest;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Payroll::with('employee');
        
        // Filter by employee if user is not HRD/Admin
        if (Auth::user()->isEmployee()) {
            $employee = Auth::user()->employee;
            if ($employee) {
                $query->where('employee_id', $employee->id);
            }
        }

        // Filter by year and month if provided
        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }
        
        if ($request->filled('month')) {
            $query->where('month', $request->month);
        }

        // Filter by employee for HRD/Admin
        if ($request->filled('employee_id') && Auth::user()->isHrdOrAdmin()) {
            $query->where('employee_id', $request->employee_id);
        }

        $payrolls = $query->latest('year')->latest('month')->paginate(10);
        
        // Get employees list for HRD/Admin filter
        $employees = Auth::user()->isHrdOrAdmin() ? Employee::active()->get() : null;

        return Inertia::render('payrolls/index', [
            'payrolls' => $payrolls,
            'employees' => $employees,
            'filters' => $request->only(['year', 'month', 'employee_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Only HRD/Admin can create payrolls
        if (!Auth::user()->isHrdOrAdmin()) {
            abort(403);
        }

        $employees = Employee::active()->get();
        
        return Inertia::render('payrolls/create', [
            'employees' => $employees
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePayrollRequest $request)
    {
        $validated = $request->validated();
        
        // Calculate payroll amounts
        $basicSalary = $validated['basic_salary'];
        $allowances = $validated['allowances'] ?? 0;
        $deductions = $validated['deductions'] ?? 0;
        $overtimeHours = $validated['overtime_hours'] ?? 0;
        $overtimeRate = $validated['overtime_rate'] ?? 0;
        $overtimePay = $overtimeHours * $overtimeRate;
        
        $grossSalary = $basicSalary + $allowances + $overtimePay;
        $netSalary = $grossSalary - $deductions;

        $payroll = Payroll::create([
            'employee_id' => $validated['employee_id'],
            'year' => $validated['year'],
            'month' => $validated['month'],
            'basic_salary' => $basicSalary,
            'allowances' => $allowances,
            'deductions' => $deductions,
            'overtime_hours' => $overtimeHours,
            'overtime_rate' => $overtimeRate,
            'overtime_pay' => $overtimePay,
            'gross_salary' => $grossSalary,
            'net_salary' => $netSalary,
            'status' => 'draft',
        ]);

        return redirect()->route('payrolls.show', $payroll)
            ->with('success', 'Payroll created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Payroll $payroll)
    {
        $payroll->load('employee');
        
        // Check permission for employees
        if (Auth::user()->isEmployee() && $payroll->employee->user_id !== Auth::id()) {
            abort(403);
        }
        
        return Inertia::render('payrolls/show', [
            'payroll' => $payroll
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payroll $payroll)
    {
        // Only HRD/Admin can edit payrolls
        if (!Auth::user()->isHrdOrAdmin()) {
            abort(403);
        }

        $payroll->load('employee');
        $employees = Employee::active()->get();
        
        return Inertia::render('payrolls/edit', [
            'payroll' => $payroll,
            'employees' => $employees
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePayrollRequest $request, Payroll $payroll)
    {
        $validated = $request->validated();
        
        // Calculate payroll amounts
        $basicSalary = $validated['basic_salary'];
        $allowances = $validated['allowances'] ?? 0;
        $deductions = $validated['deductions'] ?? 0;
        $overtimeHours = $validated['overtime_hours'] ?? 0;
        $overtimeRate = $validated['overtime_rate'] ?? 0;
        $overtimePay = $overtimeHours * $overtimeRate;
        
        $grossSalary = $basicSalary + $allowances + $overtimePay;
        $netSalary = $grossSalary - $deductions;

        $payroll->update([
            'basic_salary' => $basicSalary,
            'allowances' => $allowances,
            'deductions' => $deductions,
            'overtime_hours' => $overtimeHours,
            'overtime_rate' => $overtimeRate,
            'overtime_pay' => $overtimePay,
            'gross_salary' => $grossSalary,
            'net_salary' => $netSalary,
            'status' => $validated['status'],
            'processed_at' => $validated['status'] === 'processed' ? now() : null,
        ]);

        return redirect()->route('payrolls.show', $payroll)
            ->with('success', 'Payroll updated successfully.');
    }


}