<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckOutController extends Controller
{
    /**
     * Handle check-out action.
     */
    public function store(Request $request)
    {
        $employee = Auth::user()->employee;
        
        if (!$employee) {
            return back()->withErrors(['error' => 'Employee record not found.']);
        }

        $today = today();
        
        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', $today)
            ->first();
            
        if (!$attendance || !$attendance->check_in) {
            return back()->withErrors(['error' => 'Please check in first.']);
        }
        
        if ($attendance->check_out) {
            return back()->withErrors(['error' => 'You have already checked out today.']);
        }

        // Update check-out time and calculate total hours
        $checkOut = now()->format('H:i:s');
        $checkIn = Carbon::parse($attendance->check_in);
        $checkOutTime = Carbon::parse($checkOut);
        $totalHours = $checkOutTime->diffInHours($checkIn, true);

        $attendance->update([
            'check_out' => $checkOut,
            'total_hours' => $totalHours,
        ]);

        return back()->with('success', 'Check-out recorded successfully.');
    }
}