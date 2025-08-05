import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Employees',
        href: '/employees',
    },
];

interface EmployeeRecord {
    id: number;
    employee_id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    hire_date: string;
    basic_salary: number;
    status: string;
}

interface PaginationLink {
    url?: string;
    label: string;
    active: boolean;
}

interface EmployeeProps {
    employees: {
        data: EmployeeRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    [key: string]: unknown;
}

export default function EmployeeIndex({ employees }: EmployeeProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employee Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">👥 Employee Management</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage employee records and information
                        </p>
                    </div>
                    <Link href={route('employees.create')}>
                        <Button>➕ Add Employee</Button>
                    </Link>
                </div>

                {/* Employee Table */}
                <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-sm font-semibold">Employee ID</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Name</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Email</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Department</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Position</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Basic Salary</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Status</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {employees.data.length > 0 ? (
                                    employees.data.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {employee.employee_id}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div>
                                                    <div className="font-medium">{employee.name}</div>
                                                    <div className="text-gray-500 dark:text-gray-400">
                                                        Hired: {new Date(employee.hire_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {employee.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {employee.department}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {employee.position}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {formatCurrency(employee.basic_salary)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    employee.status === 'active' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                    {employee.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={route('employees.show', employee.id)}
                                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={route('employees.edit', employee.id)}
                                                        className="text-green-600 hover:text-green-700 dark:text-green-400"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No employees found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {employees.last_page > 1 && (
                        <div className="border-t px-6 py-3 dark:border-gray-600">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Page {employees.current_page} of {employees.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {employees.links.map((link, index) => (
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