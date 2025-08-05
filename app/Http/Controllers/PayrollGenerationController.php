<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PayrollGenerationController extends Controller
{
    /**
     * Generate payroll for all employees for a given month.
     */
    public function store(Request $request)
    {
        // Only HRD/Admin can generate payrolls
        if (!Auth::user()->isHrdOrAdmin()) {
            abort(403);
        }

        $request->validate([
            'year' => 'required|integer|min:2020|max:2030',
            'month' => 'required|integer|min:1|max:12',
        ]);

        $year = $request->year;
        $month = $request->month;
        
        $employees = Employee::active()->get();
        $generated = 0;

        foreach ($employees as $employee) {
            // Skip if payroll already exists
            $exists = Payroll::where('employee_id', $employee->id)
                ->where('year', $year)
                ->where('month', $month)
                ->exists();
                
            if ($exists) {
                continue;
            }

            // Calculate overtime based on attendance
            $attendances = Attendance::where('employee_id', $employee->id)
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->get();
                
            $totalHours = $attendances->sum('total_hours');
            $workingDays = $attendances->count();
            $standardHours = $workingDays * 8; // Assuming 8 hours per day
            $overtimeHours = max(0, $totalHours - $standardHours);
            
            $overtimeRate = 25000; // Default overtime rate per hour
            $overtimePay = $overtimeHours * $overtimeRate;
            
            $grossSalary = $employee->basic_salary + $overtimePay;
            $deductions = $grossSalary * 0.05; // 5% tax deduction
            $netSalary = $grossSalary - $deductions;

            Payroll::create([
                'employee_id' => $employee->id,
                'year' => $year,
                'month' => $month,
                'basic_salary' => $employee->basic_salary,
                'allowances' => 0,
                'deductions' => $deductions,
                'overtime_hours' => $overtimeHours,
                'overtime_rate' => $overtimeRate,
                'overtime_pay' => $overtimePay,
                'gross_salary' => $grossSalary,
                'net_salary' => $netSalary,
                'status' => 'draft',
            ]);
            
            $generated++;
        }

        return back()->with('success', "Generated payroll for {$generated} employees.");
    }
}