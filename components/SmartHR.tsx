
import React, { useState } from 'react';
import { BanknotesIcon, UsersIcon, ClipboardDocumentCheckIcon, PlusIcon, XCircleIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

interface StaffMember {
    id: string;
    name: string;
    role: 'Teacher' | 'Admin' | 'Driver' | 'Support';
    salary: number;
    attendance: number; // Percentage
    status: 'Active' | 'On Leave';
}

const mockStaff: StaffMember[] = [
    { id: 'EMP001', name: 'Mr. David Chen', role: 'Teacher', salary: 45000, attendance: 95, status: 'Active' },
    { id: 'EMP002', name: 'Ms. Sarah Jones', role: 'Admin', salary: 35000, attendance: 98, status: 'Active' },
    { id: 'EMP003', name: 'Ramesh Singh', role: 'Driver', salary: 18000, attendance: 90, status: 'On Leave' },
    { id: 'EMP004', name: 'Priya Gupta', role: 'Teacher', salary: 42000, attendance: 92, status: 'Active' },
];

const SmartHR: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'staff' | 'payroll' | 'leaves'>('staff');
    const [staffList, setStaffList] = useState<StaffMember[]>(mockStaff);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

    // Payroll State
    const [generatedSlips, setGeneratedSlips] = useState<string[]>([]);

    const handleGeneratePayroll = () => {
        toast.info("Calculating salaries based on attendance...");
        setTimeout(() => {
            const slips = staffList.map(staff => staff.id);
            setGeneratedSlips(slips);
            toast.success(`Payroll generated for ${slips.length} employees!`);
        }, 1500);
    };

    const calculateNetSalary = (staff: StaffMember) => {
        let deduction = 0;
        if (staff.attendance < 90) {
            const diff = 90 - staff.attendance;
            deduction = (staff.salary * diff) / 100;
        }
        return Math.floor(staff.salary - deduction);
    };

    const renderStaffList = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Attendance</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                    {staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-neutral-900">{staff.name}</div>
                                <div className="text-xs text-neutral-500">{staff.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{staff.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${staff.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {staff.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                <div className="flex items-center">
                                    <span className="mr-2">{staff.attendance}%</span>
                                    <div className="w-16 bg-neutral-200 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${staff.attendance > 90 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${staff.attendance}%` }}></div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-primary hover:text-primary-dark">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderPayroll = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div>
                    <h4 className="font-bold text-blue-800">Current Month Payroll</h4>
                    <p className="text-xs text-blue-600">Ready for processing based on attendance records.</p>
                </div>
                <button 
                    onClick={handleGeneratePayroll}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 flex items-center gap-2"
                >
                    <BanknotesIcon className="h-5 w-5"/> Generate All Slips
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffList.map(staff => {
                    const netSalary = calculateNetSalary(staff);
                    const isGenerated = generatedSlips.includes(staff.id);
                    return (
                        <div key={staff.id} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-bold text-neutral-800">{staff.name}</p>
                                <p className="text-xs text-neutral-500">{staff.role} | Base: ₹{staff.salary.toLocaleString()}</p>
                                <p className="text-sm font-semibold text-green-600 mt-1">Net Payable: ₹{netSalary.toLocaleString()}</p>
                            </div>
                            {isGenerated ? (
                                <button className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 cursor-default">
                                    <CheckCircleIcon className="h-4 w-4"/> Paid
                                </button>
                            ) : (
                                <button className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-semibold rounded hover:bg-neutral-200">
                                    View Slip
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderLeaves = () => (
        <div className="text-center py-10 text-neutral-500">
            <ClipboardDocumentCheckIcon className="h-12 w-12 mx-auto text-neutral-300 mb-3"/>
            <p>No pending leave requests.</p>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-6">
                <UsersIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Smart HR Manager</h2>
                    <p className="text-sm text-neutral-500 font-hindi">कर्मचारी और वेतन प्रबंधन (Staff & Payroll)</p>
                </div>
            </div>

            <div className="border-b mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('staff')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'staff' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
                        Staff List
                    </button>
                    <button onClick={() => setActiveTab('payroll')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'payroll' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
                        Payroll Automation
                    </button>
                    <button onClick={() => setActiveTab('leaves')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'leaves' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
                        Leave Requests
                    </button>
                </nav>
            </div>

            <div className="animate-pop-in">
                {activeTab === 'staff' && renderStaffList()}
                {activeTab === 'payroll' && renderPayroll()}
                {activeTab === 'leaves' && renderLeaves()}
            </div>
        </div>
    );
};

export default SmartHR;
