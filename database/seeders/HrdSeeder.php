<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class HrdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create HRD Admin user
        $hrdUser = User::create([
            'name' => 'HRD Admin',
            'email' => 'hrd@example.com',
            'password' => Hash::make('password'),
            'role' => 'hrd',
        ]);

        // Create some employees with users
        $employees = [];
        for ($i = 1; $i <= 10; $i++) {
            $user = User::create([
                'name' => "Employee {$i}",
                'email' => "employee{$i}@example.com",
                'password' => Hash::make('password'),
                'role' => 'employee',
            ]);

            $employee = Employee::create([
                'user_id' => $user->id,
                'employee_id' => 'EMP' . str_pad((string)$i, 4, '0', STR_PAD_LEFT),
                'name' => $user->name,
                'email' => $user->email,
                'phone' => fake()->phoneNumber(),
                'department' => fake()->randomElement(['IT', 'HR', 'Finance', 'Marketing', 'Operations']),
                'position' => fake()->jobTitle(),
                'hire_date' => fake()->dateTimeThisYear(),
                'basic_salary' => fake()->numberBetween(3000000, 15000000),
                'status' => 'active',
            ]);

            $employees[] = $employee;
        }

        // Create attendance records for current month
        foreach ($employees as $employee) {
            for ($day = 1; $day <= 20; $day++) {
                $date = now()->startOfMonth()->addDays($day - 1);
                
                // Skip weekends
                if ($date->isWeekend()) {
                    continue;
                }

                $checkIn = fake()->time('H:i', '09:30');
                $checkOut = fake()->time('H:i', '18:00');
                
                $checkInCarbon = \Carbon\Carbon::createFromFormat('H:i', $checkIn);
                $checkOutCarbon = \Carbon\Carbon::createFromFormat('H:i', $checkOut);
                $totalHours = $checkOutCarbon->diffInHours($checkInCarbon, true);

                Attendance::create([
                    'employee_id' => $employee->id,
                    'date' => $date,
                    'check_in' => $checkIn,
                    'check_out' => $checkOut,
                    'total_hours' => $totalHours,
                    'status' => $checkIn > '09:00' ? 'late' : 'present',
                ]);
            }
        }

        // Create payroll records for previous months
        foreach ($employees as $employee) {
            for ($month = 1; $month <= 3; $month++) {
                $basicSalary = $employee->basic_salary;
                $allowances = fake()->numberBetween(0, 1000000);
                $deductions = $basicSalary * 0.05;
                $overtimeHours = fake()->numberBetween(0, 20);
                $overtimeRate = 25000;
                $overtimePay = $overtimeHours * $overtimeRate;
                
                $grossSalary = $basicSalary + $allowances + $overtimePay;
                $netSalary = $grossSalary - $deductions;

                Payroll::create([
                    'employee_id' => $employee->id,
                    'year' => now()->year,
                    'month' => $month,
                    'basic_salary' => $basicSalary,
                    'allowances' => $allowances,
                    'deductions' => $deductions,
                    'overtime_hours' => $overtimeHours,
                    'overtime_rate' => $overtimeRate,
                    'overtime_pay' => $overtimePay,
                    'gross_salary' => $grossSalary,
                    'net_salary' => $netSalary,
                    'status' => fake()->randomElement(['processed', 'paid']),
                    'processed_at' => fake()->dateTimeThisMonth(),
                ]);
            }
        }
    }
}