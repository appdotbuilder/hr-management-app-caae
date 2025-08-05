<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Payroll
 *
 * @property int $id
 * @property int $employee_id
 * @property int $year
 * @property int $month
 * @property float $basic_salary
 * @property float $allowances
 * @property float $deductions
 * @property float $overtime_hours
 * @property float $overtime_rate
 * @property float $overtime_pay
 * @property float $gross_salary
 * @property float $net_salary
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $processed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Employee $employee
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll query()
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereAllowances($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereBasicSalary($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereDeductions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereGrossSalary($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereNetSalary($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereOvertimeHours($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereOvertimePay($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereOvertimeRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereProcessedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Payroll whereYear($value)
 * @method static \Database\Factories\PayrollFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Payroll extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'year',
        'month',
        'basic_salary',
        'allowances',
        'deductions',
        'overtime_hours',
        'overtime_rate',
        'overtime_pay',
        'gross_salary',
        'net_salary',
        'status',
        'processed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'basic_salary' => 'decimal:2',
        'allowances' => 'decimal:2',
        'deductions' => 'decimal:2',
        'overtime_hours' => 'decimal:2',
        'overtime_rate' => 'decimal:2',
        'overtime_pay' => 'decimal:2',
        'gross_salary' => 'decimal:2',
        'net_salary' => 'decimal:2',
        'processed_at' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the employee that owns the payroll.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}