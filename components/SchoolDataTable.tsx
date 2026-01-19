
import React from 'react';
import { BuildingOfficeIcon } from './icons/AllIcons';

const schoolsData = [
    { name: 'Education Sarthi School - Main Campus', students: 1250, teachers: 70, revenue: '₹1.5 Cr' }
    // Add more schools here in the future
];

const SchoolDataTable: React.FC = () => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg h-full">
            <div className="flex items-center mb-6">
                <BuildingOfficeIcon className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">School Data</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">School Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Students</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Teachers</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {schoolsData.map((school) => (
                            <tr key={school.name}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{school.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{school.students.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{school.teachers}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{school.revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchoolDataTable;