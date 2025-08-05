<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckInController extends Controller
{
    /**
     * Handle check-in action.
     */
    public function store(Request $request)
    {
        $employee = Auth::user()->employee;
        
        if (!$employee) {
            return back()->withErrors(['error' => 'Employee record not found.']);
        }

        $today = today();
        
        // Check if already checked in today
        $existingAttendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', $today)
            ->first();
            
        if ($existingAttendance && $existingAttendance->check_in) {
            return back()->withErrors(['error' => 'You have already checked in today.']);
        }

        // Create or update attendance record
        $attendance = Attendance::updateOrCreate(
            [
                'employee_id' => $employee->id,
                'date' => $today,
            ],
            [
                'check_in' => now()->format('H:i:s'),
                'status' => now()->format('H:i') > '09:00' ? 'late' : 'present',
            ]
        );

        return back()->with('success', 'Check-in recorded successfully.');
    }
}