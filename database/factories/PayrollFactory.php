<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payroll>
 */
class PayrollFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $basicSalary = fake()->numberBetween(3000000, 15000000);
        $allowances = fake()->numberBetween(0, 1000000);
        $deductions = $basicSalary * 0.05; // 5% tax
        $overtimeHours = fake()->numberBetween(0, 20);
        $overtimeRate = 25000;
        $overtimePay = $overtimeHours * $overtimeRate;
        
        $grossSalary = $basicSalary + $allowances + $overtimePay;
        $netSalary = $grossSalary - $deductions;

        return [
            'employee_id' => Employee::factory(),
            'year' => fake()->year(),
            'month' => fake()->numberBetween(1, 12),
            'basic_salary' => $basicSalary,
            'allowances' => $allowances,
            'deductions' => $deductions,
            'overtime_hours' => $overtimeHours,
            'overtime_rate' => $overtimeRate,
            'overtime_pay' => $overtimePay,
            'gross_salary' => $grossSalary,
            'net_salary' => $netSalary,
            'status' => fake()->randomElement(['draft', 'processed', 'paid']),
            'processed_at' => fake()->optional()->dateTimeThisMonth(),
        ];
    }
}