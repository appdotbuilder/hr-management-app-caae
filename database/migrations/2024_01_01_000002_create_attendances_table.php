<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('check_in')->nullable();
            $table->time('check_out')->nullable();
            $table->decimal('total_hours', 4, 2)->nullable()->comment('Total working hours for the day');
            $table->text('notes')->nullable();
            $table->enum('status', ['present', 'absent', 'late', 'half_day'])->default('present');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('date');
            $table->index('employee_id');
            $table->index(['employee_id', 'date']);
            $table->index(['date', 'status']);
            
            // Unique constraint to prevent duplicate attendance for same employee on same date
            $table->unique(['employee_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};