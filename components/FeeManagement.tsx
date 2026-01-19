
import React, { useState, useEffect } from 'react';
import { CurrencyRupeeIcon, ChartBarIcon, ArrowDownTrayIcon, BellIcon, PlusIcon, DocumentTextIcon, UserCircleIcon, ExclamationTriangleIcon, CheckCircleIcon, PrinterIcon } from './icons/AllIcons';
import { feeService } from '../services/feeService';
import { studentService } from '../services/studentService';
import { useToast } from '../hooks/useToast';
import { FeeRecord, FeeStatus, StudentData, User, UserRole } from '../types';
import PaymentCheckout from './PaymentCheckout';

interface FeeManagementProps {
    user: User;
}

const FeeManagement: React.FC<FeeManagementProps> = ({ user }) => {
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalDue: 0, totalOverdue: 0 });
    const [feeSummaries, setFeeSummaries] = useState<any[]>([]);
    
    // Payment UI State
    const [activePaymentFee, setActivePaymentFee] = useState<FeeRecord | null>(null);

    const isStudentOrParent = user.role === UserRole.Student || user.role === UserRole.Parent;

    useEffect(() => {
        const updateData = () => {
            if (isStudentOrParent) {
                // Find matching student by name or hardcoded ID for demo
                const targetId = user.id.startsWith('STU') || user.id.startsWith('PAR') ? 'ESS-STU-001' : user.id; 
                setFeeRecords(feeService.getFeeRecordsForStudent(targetId));
                setSelectedStudentId(targetId);
            } else {
                setFeeSummaries(feeService.getFeeSummaryForAllStudents());
                setStats(feeService.getOverallStats());
                if (selectedStudentId) {
                    setFeeRecords(feeService.getFeeRecordsForStudent(selectedStudentId));
                }
            }
        };

        updateData();
        const unsubscribe = feeService.subscribe(updateData);
        return unsubscribe;
    }, [user, isStudentOrParent, selectedStudentId]);

    const handleRecordPaymentManual = (recordId: string, amount: number) => {
        feeService.processOnlinePayment(recordId, amount, "MANUAL_ENTRY");
        toast.success("Payment recorded by admin.");
    };

    const renderAdminView = () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* Left: Student List */}
            <div className="lg:col-span-4 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col h-full">
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Search student..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold focus:border-primary outline-none text-sm"
                    />
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {feeSummaries.filter(s => s.studentName.toLowerCase().includes(searchTerm.toLowerCase())).map(summary => (
                        <div 
                            key={summary.studentId}
                            onClick={() => setSelectedStudentId(summary.studentId)}
                            className={`p-5 rounded-3xl cursor-pointer border-2 transition-all ${selectedStudentId === summary.studentId ? 'bg-white border-primary shadow-lg scale-[1.02]' : 'bg-white border-transparent hover:border-slate-200 opacity-80'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-black text-slate-800 uppercase tracking-tight">{summary.studentName}</p>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${summary.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {summary.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{summary.className}</p>
                                <p className="text-sm font-black text-slate-900">₹{summary.totalDue.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col h-full">
                {selectedStudentId ? (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">Student Account Ledger</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Viewing records for {selectedStudentId}</p>
                            </div>
                            {/* Added missing PrinterIcon */}
                            <button className="p-3 bg-slate-100 rounded-2xl text-slate-600 hover:bg-primary hover:text-white transition-all"><PrinterIcon className="h-6 w-6"/></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {feeRecords.map(record => (
                                <div key={record.id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:border-primary/20">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-black text-slate-800 text-lg leading-tight">{record.description}</h4>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Due: {new Date(record.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-900 leading-none">₹{record.amount.toLocaleString()}</p>
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-2 inline-block ${record.status === 'Paid' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Paid: <span className="text-green-600 font-black">₹{record.paidAmount.toLocaleString()}</span></p>
                                        {record.status !== 'Paid' && (
                                            <button 
                                                onClick={() => handleRecordPaymentManual(record.id, record.amount - record.paidAmount)}
                                                className="px-6 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-primary transition-all shadow-md"
                                            >
                                                MANUAL MARK PAID
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                        <UserCircleIcon className="h-32 w-32 text-slate-200 mb-6"/>
                        <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Select a student profile</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-slate-50 p-2 sm:p-6 rounded-[3.5rem] shadow-soft h-full flex flex-col min-h-[800px] border border-slate-200 animate-pop-in">
            {/* Payment Modal */}
            {activePaymentFee && (
                <PaymentCheckout 
                    fee={activePaymentFee} 
                    studentName={isStudentOrParent ? user.name : "Student"} 
                    onClose={() => setActivePaymentFee(null)}
                />
            )}

            <div className="flex items-center justify-between mb-8 px-6 shrink-0 mt-4">
                <div className="flex items-center gap-5">
                    <div className="bg-primary p-4 rounded-3xl text-white shadow-xl shadow-primary/20 rotate-3">
                        <CurrencyRupeeIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">FEE CONSOLE</h2>
                        <p className="text-sm font-hindi font-bold text-slate-400 uppercase tracking-[0.3em]">शुल्क और भुगतान प्रबंधन</p>
                    </div>
                </div>
                {!isStudentOrParent && (
                    <div className="flex gap-4">
                         <div className="px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
                             <span className="text-xl font-black text-green-600">₹{stats.totalRevenue.toLocaleString()}</span>
                         </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-hidden px-4">
                {isStudentOrParent ? (
                    <div className="max-w-4xl mx-auto space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
                        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden mb-10">
                             <div className="absolute top-0 right-0 p-20 bg-primary/10 rounded-full blur-[80px]"></div>
                             <h3 className="text-2xl font-black mb-1">Fee Payment Status</h3>
                             <p className="text-indigo-200 font-hindi font-bold">अपना शुल्क सुरक्षित तरीके से ऑनलाइन जमा करें</p>
                             
                             <div className="mt-8 grid grid-cols-2 gap-4">
                                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                     <p className="text-[10px] font-black text-slate-400 uppercase">Outstanding</p>
                                     <p className="text-2xl font-black">₹{feeRecords.reduce((sum, f) => sum + (f.amount - f.paidAmount), 0).toLocaleString()}</p>
                                 </div>
                                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                     <p className="text-[10px] font-black text-slate-400 uppercase">Paid Year-to-Date</p>
                                     <p className="text-2xl font-black text-green-400">₹{feeRecords.reduce((sum, f) => sum + f.paidAmount, 0).toLocaleString()}</p>
                                 </div>
                             </div>
                        </div>

                        {feeRecords.map(record => (
                            <div key={record.id} className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6 group hover:shadow-xl transition-all hover:border-primary/20">
                                <div className="flex items-center gap-6">
                                    <div className={`p-5 rounded-2xl ${record.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600 animate-pulse'}`}>
                                        <CurrencyRupeeIcon className="h-8 w-8"/>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900">{record.description.split('(')[0]}</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Due: {new Date(record.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-center sm:text-right">
                                    <p className="text-3xl font-black text-slate-900">₹{record.amount.toLocaleString()}</p>
                                    {record.status === 'Paid' ? (
                                        <button className="mt-4 px-8 py-2 bg-green-500 text-white text-xs font-black rounded-full flex items-center gap-2 shadow-lg cursor-default">
                                            <CheckCircleIcon className="h-4 w-4"/> PAID & SETTLED
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => setActivePaymentFee(record)}
                                            className="mt-4 px-10 py-3 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/30 hover:bg-slate-900 transition-all transform hover:scale-105"
                                        >
                                            PAY ONLINE
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {feeRecords.length === 0 && <div className="text-center py-20 text-slate-400 font-hindi font-black uppercase opacity-20">कोई पेंडिंग फीस नहीं है</div>}
                    </div>
                ) : renderAdminView()}
            </div>
        </div>
    );
};

export default FeeManagement;
