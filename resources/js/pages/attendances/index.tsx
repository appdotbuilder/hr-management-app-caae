import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Attendance',
        href: '/attendances',
    },
];

interface AttendanceRecord {
    id: number;
    date: string;
    check_in?: string;
    check_out?: string;
    total_hours?: number;
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

interface AttendanceProps {
    attendances: {
        data: AttendanceRecord[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    employees?: Employee[];
    filters: {
        date_from?: string;
        date_to?: string;
        employee_id?: string;
    };
    [key: string]: unknown;
}

export default function AttendanceIndex({ attendances, employees, filters }: AttendanceProps) {
    const { auth } = usePage<SharedData>().props;
    const isHrdOrAdmin = auth.user?.role === 'hrd' || auth.user?.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Records" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">📅 Attendance Records</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isHrdOrAdmin ? 'Manage employee attendance records' : 'View your attendance history'}
                        </p>
                    </div>
                    {isHrdOrAdmin && (
                        <Link href={route('attendances.create')}>
                            <Button>➕ Add Attendance</Button>
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="rounded-lg border bg-white p-4 dark:bg-gray-800 dark:border-gray-700">
                    <form method="GET" className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Date</label>
                            <input
                                type="date"
                                name="date_from"
                                defaultValue={filters.date_from}
                                className="mt-1 block rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Date</label>
                            <input
                                type="date"
                                name="date_to"
                                defaultValue={filters.date_to}
                                className="mt-1 block rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700"
                            />
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

                {/* Attendance Table */}
                <div className="rounded-lg border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-sm font-semibold">Date</th>
                                    {isHrdOrAdmin && <th className="px-6 py-3 text-sm font-semibold">Employee</th>}
                                    <th className="px-6 py-3 text-sm font-semibold">Check In</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Check Out</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Total Hours</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Status</th>
                                    <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((attendance) => (
                                        <tr key={attendance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 text-sm">
                                                {new Date(attendance.date).toLocaleDateString()}
                                            </td>
                                            {isHrdOrAdmin && (
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    {attendance.employee?.name}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 text-sm">
                                                {attendance.check_in || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {attendance.check_out || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {attendance.total_hours ? `${attendance.total_hours}h` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    attendance.status === 'present' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : attendance.status === 'late'
                                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                }`}>
                                                    {attendance.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Link
                                                    href={route('attendances.show', attendance.id)}
                                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isHrdOrAdmin ? 7 : 6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No attendance records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {attendances.last_page > 1 && (
                        <div className="border-t px-6 py-3 dark:border-gray-600">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Page {attendances.current_page} of {attendances.last_page}
                                </div>
                                <div className="flex gap-2">
                                    {attendances.links.map((link, index) => (
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