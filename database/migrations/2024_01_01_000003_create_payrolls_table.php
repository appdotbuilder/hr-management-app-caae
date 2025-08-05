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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->year('year');
            $table->tinyInteger('month');
            $table->decimal('basic_salary', 10, 2);
            $table->decimal('allowances', 10, 2)->default(0)->comment('Additional allowances');
            $table->decimal('deductions', 10, 2)->default(0)->comment('Tax, insurance, etc.');
            $table->decimal('overtime_hours', 4, 2)->default(0);
            $table->decimal('overtime_rate', 8, 2)->default(0);
            $table->decimal('overtime_pay', 10, 2)->default(0);
            $table->decimal('gross_salary', 10, 2)->comment('Total before deductions');
            $table->decimal('net_salary', 10, 2)->comment('Final salary after deductions');
            $table->enum('status', ['draft', 'processed', 'paid'])->default('draft');
            $table->date('processed_at')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index('employee_id');
            $table->index(['year', 'month']);
            $table->index(['employee_id', 'year', 'month']);
            $table->index('status');
            
            // Unique constraint to prevent duplicate payroll for same employee in same month
            $table->unique(['employee_id', 'year', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};