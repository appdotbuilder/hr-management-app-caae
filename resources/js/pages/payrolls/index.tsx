import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Payroll',
        href: '/payrolls',
    },
];

interface PayrollRecord {
    id: number;
    year: number;
    month: number;
    basic_salary: number;
    allowances: number;
    deductions: number;
    overtime_pay: number;
    net_salary: number;
    status: string;
    employee?: {
        name: string;
    };
}

interface Employee {
    id: number;
    name: string;
}

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface PayrollProps {
    payrolls: {
        data: PayrollRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    employees?: Employee[];
    filters: {
        year?: string;
        month?: string;
        employee_id?: string;
    };
    [key: string]: unknown;
}

export default function PayrollIndex({ payrolls, employees, filters }: PayrollProps) {
    const { auth } = usePage<SharedData>().props;
    const isHrdOrAdmin = auth.user?.role === 'hrd' || auth.user?.role === 'admin';

    const handleGeneratePayroll = () => {
        const year = prompt('Enter year (e.g., 2024):');
        const month = prompt('Enter month (1-12):');
        
        if (year && month) {
            router.post(route('payrolls.generate'), {
                year: parseInt(year),
                month: parseInt(month)
            }, {
                preserveState: true,
                preserveScroll: true
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payroll Records" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">💰 Payroll Records</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isHrdOrAdmin ? 'Manage employee payroll records' : 'View your salary history'}
                        </p>
                    </div>
                    {isHrdOrAdmin && (
                        <div className="flex gap-2">
                            <Button onClick={handleGeneratePayroll} variant="outline">
                                🔄 Generate Payroll
                            </Button>
                            <Link href={route('payrolls.create')}>
                                <Button>➕ Add Payroll</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="rounded-lg border bg-white p-4 dark:bg-gray-800 dark:border-gray-700">
                    <form method="GET" className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                            <select
                                name="year"
                                defaultValue={filters.year}
                                className="mt-1 block rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700"
                            >
                                <option value="">All Years</option>
                                {[2024, 2023, 2022].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
                            <select
                                name="month"
                                defaultValue={filters.month}
                                className="mt-1 block rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700"
                            >
                                <option value="">All Months</option>
                                {monthNames.map((month, index) => (
                                    <option key={index + 1} value={index + 1}>{month}</option>
                                ))}
                            </select>
                        </div>
                        {isHrdOrAdmin && employees && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Employee</label>
                                <select
                                    name="employee_id"
                                    defaultValue={filters.employee_id}
                                    className="mt-1 block rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700"
                                >
                                    <option value="">All Employees</option>
                                    {employees.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="flex items-end">
                            <Button type="submit" variant="outline">🔍 Filter</Button>
                        </div>
                    </form>
                </div>

                {/* Payroll Table */}
                <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-sm font-semibold">Period</th>
                                    {isHrdOrAdmin && <th className="px-6 py-3 text-sm font-semibold">Employee</th>}
                                    <th className="px-6 py-3 text-sm font-semibold">Basic Salary</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Allowances</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Deductions</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Overtime</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Net Salary</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Status</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {payrolls.data.length > 0 ? (
                                    payrolls.data.map((payroll) => (
                                        <tr key={payroll.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {monthNames[payroll.month - 1]} {payroll.year}
                                            </td>
                                            {isHrdOrAdmin && (
                                                <td className="px-6 py-4 text-sm">
                                                    {payroll.employee?.name}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 text-sm">
                                                {formatCurrency(payroll.basic_salary)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {formatCurrency(payroll.allowances)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {formatCurrency(payroll.deductions)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {formatCurrency(payroll.overtime_pay)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold">
                                                {formatCurrency(payroll.net_salary)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    payroll.status === 'paid' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : payroll.status === 'processed'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                                                }`}>
                                                    {payroll.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route('payrolls.show', payroll.id)}
                                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                                    >
                                                        View
                                                    </Link>
                                                    {isHrdOrAdmin && (
                                                        <Link
                                                            href={route('payrolls.edit', payroll.id)}
                                                            className="text-green-600 hover:text-green-700 dark:text-green-400"
                                                        >
                                                            Edit
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isHrdOrAdmin ? 9 : 8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No payroll records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {payrolls.last_page > 1 && (
                        <div className="border-t px-6 py-3 dark:border-gray-600">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Page {payrolls.current_page} of {payrolls.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {payrolls.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded text-sm ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}