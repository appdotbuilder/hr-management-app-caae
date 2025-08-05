import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="HRD Management System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-gray-900 lg:justify-center lg:p-8 dark:from-gray-900 dark:to-gray-800 dark:text-white">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-6xl flex-col lg:flex-row items-center gap-12">
                        {/* Hero Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="mb-6">
                                <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    👥 HRD Management System
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300">
                                    Complete solution for attendance tracking and payroll management
                                </p>
                            </div>

                            {/* Key Features */}
                            <div className="mb-8 grid gap-4 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                                        <span className="text-xl">📅</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Smart Attendance Tracking</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Check-in/out with automatic overtime calculation</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                        <span className="text-xl">💰</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Automated Payroll Processing</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Generate salary slips with deductions & overtime</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                                        <span className="text-xl">📊</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Comprehensive Reports</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly attendance & payroll analytics</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                                        <span className="text-xl">👤</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Employee Management</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Complete employee database with role-based access</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Go to Dashboard →
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
                                        >
                                            Get Started
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-8 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Visual Mockup */}
                        <div className="flex-1 max-w-md">
                            <div className="rounded-xl bg-white shadow-2xl dark:bg-gray-800">
                                {/* Mock Dashboard Header */}
                                <div className="rounded-t-xl bg-blue-600 p-4">
                                    <h3 className="font-semibold text-white">HRD Dashboard</h3>
                                </div>
                                
                                {/* Mock Stats Cards */}
                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                                            <div className="text-2xl font-bold text-green-600">45</div>
                                            <div className="text-xs text-green-600">Active Employees</div>
                                        </div>
                                        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                            <div className="text-2xl font-bold text-blue-600">38</div>
                                            <div className="text-xs text-blue-600">Present Today</div>
                                        </div>
                                    </div>
                                    
                                    {/* Mock Attendance List */}
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Check-ins</div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between rounded bg-gray-50 p-2 text-xs dark:bg-gray-700">
                                                <span>John Doe</span>
                                                <span className="text-green-600">08:45</span>
                                            </div>
                                            <div className="flex items-center justify-between rounded bg-gray-50 p-2 text-xs dark:bg-gray-700">
                                                <span>Jane Smith</span>
                                                <span className="text-green-600">08:52</span>
                                            </div>
                                            <div className="flex items-center justify-between rounded bg-gray-50 p-2 text-xs dark:bg-gray-700">
                                                <span>Mike Johnson</span>
                                                <span className="text-orange-600">09:15</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                
                <footer className="mt-12 text-sm text-gray-500 dark:text-gray-400">
                    Built with ❤️ by{" "}
                    <a 
                        href="https://app.build" 
                        target="_blank" 
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                        app.build
                    </a>
                </footer>
            </div>
        </>
    );
}