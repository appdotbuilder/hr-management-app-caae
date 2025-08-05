<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $checkIn = fake()->time('H:i', '09:30');
        $checkOut = fake()->time('H:i', '18:00');
        
        // Calculate total hours
        $checkInCarbon = \Carbon\Carbon::createFromFormat('H:i', $checkIn);
        $checkOutCarbon = \Carbon\Carbon::createFromFormat('H:i', $checkOut);
        $totalHours = $checkOutCarbon->diffInHours($checkInCarbon, true);

        return [
            'employee_id' => Employee::factory(),
            'date' => fake()->dateTimeThisMonth(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'total_hours' => $totalHours,
            'notes' => fake()->optional()->sentence(),
            'status' => fake()->randomElement(['present', 'late']),
        ];
    }
}