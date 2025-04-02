import React from 'react';
import { MagicUi } from '@21st-dev/magic-mcp';

const BillingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Billing & Invoices
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Manage your billing information, view invoices, and update your payment methods.
                </p>

                <div className="space-y-6">
                    {/* Payment Method Section */}
                    <section className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                            Payment Method
                        </h2>
                        <div className="flex items-center justify-between">
                            <div className="text-gray-700 dark:text-gray-300">
                                <p>Visa ending in 1234</p>
                                <p>Expires 06/27</p>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                                Update Payment
                            </button>
                        </div>
                    </section>
                    
                    {/* Billing History Section */}
                    <section className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                            Billing History
                        </h2>
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-700 dark:text-gray-200">
                                        Date
                                    </th>
                                    <th className="px-5 py-3 border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-700 dark:text-gray-200">
                                        Invoice
                                    </th>
                                    <th className="px-5 py-3 border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-700 dark:text-gray-200">
                                        Amount
                                    </th>
                                    <th className="px-5 py-3 border-b border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-700 dark:text-gray-200">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        March 10, 2025
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        #INV-001
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        $29.99
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-green-600">
                                        Paid
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        February 10, 2025
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        #INV-000
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        $29.99
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-red-600">
                                        Failed
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    
                    {/* Subscription Plan Section */}
                    <section className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                            Subscription Plan
                        </h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700 dark:text-gray-300">Pro Plan</p>
                                <p className="text-gray-500 dark:text-gray-400">$29.99 per month</p>
                            </div>
                            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                                Upgrade Plan
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
