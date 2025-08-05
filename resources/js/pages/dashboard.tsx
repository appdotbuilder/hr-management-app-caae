import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface TodayAttendance {
    check_in?: string;
    check_out?: string;
    total_hours?: number;
    status?: string;
}

interface RecentAttendance {
    id: number;
    date: string;
    check_in?: string;
    check_out?: string;
    status: string;
    employee?: {
        name: string;
    };
}

interface RecentPayroll {
    id: number;
    year: number;
    month: number;
    net_salary: number;
    status: string;
    employee?: {
        name: string;
    };
}

interface DashboardProps {
    todayAttendance?: TodayAttendance;
    canCheckIn?: boolean;
    canCheckOut?: boolean;
    recentAttendances?: RecentAttendance[];
    recentPayrolls?: RecentPayroll[];
    [key: string]: unknown;
}

export default function Dashboard({ 
    todayAttendance, 
    canCheckIn = false, 
    canCheckOut = false,
    recentAttendances = [],
    recentPayrolls = []
}: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    
    const handleCheckIn = () => {
        router.post(route('attendance.check-in'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleCheckOut = () => {
        router.post(route('attendance.check-out'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const isHrdOrAdmin = user?.role === 'hrd' || user?.role === 'admin';
    const isEmployee = user?.role === 'employee';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Welcome Header */}
                <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <h1 className="text-2xl font-bold">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="mt-2 text-blue-100">
                        {isHrdOrAdmin && "Manage your team's attendance and payroll from here."}
                        {isEmployee && "Track your attendance and view your payroll information."}
                    </p>
                </div>

                {/* Employee Quick Actions */}
                {isEmployee && (
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-4">📅 Today's Attendance</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {todayAttendance?.check_in && (
                                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                    <div className="text-sm text-green-600 dark:text-green-400">Check-in Time</div>
                                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                                        {todayAttendance.check_in}
                                    </div>
                                </div>
                            )}
                            
                            {todayAttendance?.check_out && (
                                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <div className="text-sm text-blue-600 dark:text-blue-400">Check-out Time</div>
                                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                        {todayAttendance.check_out}
                                    </div>
                                </div>
                            )}
                            
                            {todayAttendance?.total_hours && (
                                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                                    <div className="text-sm text-purple-600 dark:text-purple-400">Total Hours</div>
                                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                        {todayAttendance.total_hours}h
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            {canCheckIn && (
                                <Button onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700">
                                    ✅ Check In
                                </Button>
                            )}
                            {canCheckOut && (
                                <Button onClick={handleCheckOut} className="bg-blue-600 hover:bg-blue-700">
                                    🚪 Check Out
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Access Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link href={route('attendances.index')} className="group">
                        <div className="relative rounded-xl border bg-white p-6 shadow-sm transition-shadow group-hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Attendance</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {isHrdOrAdmin ? 'Manage attendance records' : 'View your attendance'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href={route('payrolls.index')} className="group">
                        <div className="relative rounded-xl border bg-white p-6 shadow-sm transition-shadow group-hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Payroll</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {isHrdOrAdmin ? 'Process payroll' : 'View salary slips'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {isHrdOrAdmin && (
                        <Link href={route('employees.index')} className="group">
                            <div className="relative rounded-xl border bg-white p-6 shadow-sm transition-shadow group-hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/20">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Employees</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Manage employee records
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Attendance */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">📊 Recent Attendance</h2>
                            <Link 
                                href={route('attendances.index')} 
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                                View all →
                            </Link>
                        </div>
                        
                        {recentAttendances.length > 0 ? (
                            <div className="space-y-3">
                                {recentAttendances.slice(0, 5).map((attendance, index) => (
                                    <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                        <div>
                                            <div className="font-medium">
                                                {isHrdOrAdmin ? attendance.employee?.name : attendance.date}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {attendance.check_in || 'No check-in'}
                                                {attendance.check_out && ` - ${attendance.check_out}`}
                                            </div>
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-full ${
                                            attendance.status === 'present' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                                            attendance.status === 'late' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                        }`}>
                                            {attendance.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No recent attendance records</p>
                        )}
                    </div>

                    {/* Recent Payrolls */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">💵 Recent Payrolls</h2>
                            <Link 
                                href={route('payrolls.index')} 
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                                View all →
                            </Link>
                        </div>
                        
                        {recentPayrolls.length > 0 ? (
                            <div className="space-y-3">
                                {recentPayrolls.slice(0, 5).map((payroll, index) => (
                                    <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                        <div>
                                            <div className="font-medium">
                                                {isHrdOrAdmin ? payroll.employee?.name : `${payroll.month}/${payroll.year}`}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Rp {payroll.net_salary?.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-full ${
                                            payroll.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                                            payroll.status === 'processed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                            'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                                        }`}>
                                            {payroll.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No recent payroll records</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}