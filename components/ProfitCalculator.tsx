
import React, { useState, useMemo } from 'react';
import { CalculatorIcon, CurrencyRupeeIcon, ChartBarIcon, ArrowTrendingUpIcon, SparklesIcon, BuildingOfficeIcon } from './icons/AllIcons';

const ProfitCalculator: React.FC = () => {
    const [studentCount, setStudentCount] = useState(500); // Default to Medium scale
    const [avgFee, setAvgFee] = useState(2000); // Realistic avg fee
    const [staffCount, setStaffCount] = useState(5); 

    const calculations = useMemo(() => {
        // Core Revenue
        const monthlyFeeRevenue = studentCount * avgFee;
        
        // Additional Revenue Streams (Books, Uniforms, Admission Fees - approx 20% of fee revenue)
        const additionalRevenue = monthlyFeeRevenue * 0.20;
        
        const totalMonthlyRevenue = monthlyFeeRevenue + additionalRevenue;
        const totalYearlyRevenue = totalMonthlyRevenue * 12;

        // Expenses
        const staffSalary = staffCount * 18000; // Avg staff salary
        const aiLicenseCost = 5000; // Minimal AI cost
        const rentAndUtilities = 25000 + (studentCount * 50); // Variable cost
        
        const totalMonthlyExpenses = staffSalary + aiLicenseCost + rentAndUtilities;
        
        // Profit
        const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyExpenses;
        const yearlyNetProfit = monthlyNetProfit * 12;
        const profitMargin = (monthlyNetProfit / totalMonthlyRevenue) * 100;

        return { 
            monthlyRevenue: totalMonthlyRevenue, 
            yearlyRevenue: totalYearlyRevenue,
            totalExpenses: totalMonthlyExpenses, 
            netProfit: monthlyNetProfit, 
            yearlyProfit: yearlyNetProfit,
            profitMargin 
        };
    }, [studentCount, avgFee, staffCount]);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-soft h-full flex flex-col animate-pop-in">
            <div className="flex items-center gap-3 mb-8 border-b pb-6">
                <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                    <CalculatorIcon className="h-8 w-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Business Profit Projector</h2>
                    <p className="text-sm text-slate-500 font-hindi">देखें आप साल का कितना कमा सकते हैं</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <BuildingOfficeIcon className="h-5 w-5 text-primary"/> अपना डेटा भरें (Input Data)
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">कुल छात्र (Students)</label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="50" max="2000" step="10" value={studentCount} onChange={e => setStudentCount(Number(e.target.value))} className="flex-1 accent-primary" />
                                    <span className="w-20 text-center font-black text-primary bg-primary/10 py-1 rounded-lg">{studentCount}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">मासिक फीस (Avg Fee ₹)</label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="500" max="10000" step="100" value={avgFee} onChange={e => setAvgFee(Number(e.target.value))} className="flex-1 accent-green-600" />
                                    <span className="w-20 text-center font-black text-green-600 bg-green-50 py-1 rounded-lg">₹{avgFee}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">स्टाफ की संख्या (Staff Needed)</label>
                                <div className="flex items-center gap-4">
                                    <input type="range" min="1" max="50" step="1" value={staffCount} onChange={e => setStaffCount(Number(e.target.value))} className="flex-1 accent-orange-500" />
                                    <span className="w-20 text-center font-black text-orange-500 bg-orange-50 py-1 rounded-lg">{staffCount}</span>
                                </div>
                                <p className="text-[10px] text-green-600 font-bold mt-2 uppercase tracking-tighter flex items-center gap-1">
                                    <SparklesIcon className="h-3 w-3"/> AI की वजह से स्टाफ खर्चा 60% कम है।
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
                        <div className="bg-white p-2 rounded-xl shadow-sm h-fit"><ArrowTrendingUpIcon className="h-6 w-6 text-indigo-600"/></div>
                        <div>
                             <p className="text-sm font-hindi text-indigo-900 leading-relaxed font-bold">
                                "अतिरिक्त आय (Additional Income):"
                            </p>
                            <p className="text-xs text-indigo-700 mt-1">
                                यह कैलकुलेटर किताबों, यूनिफॉर्म और एडमिशन चार्ज से होने वाली 20% अतिरिक्त आय को भी जोड़ रहा है।
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Annual Turnover Card - The Big Number */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-b-8 border-primary">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000"></div>
                         <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2">Estimated Annual Turnover</p>
                         <h3 className="text-5xl lg:text-6xl font-black tracking-tighter">
                            ₹{(calculations.yearlyRevenue / 10000000).toFixed(2)} Cr
                            <span className="text-2xl text-slate-500 ml-2 font-medium">/yr</span>
                         </h3>
                         <p className="text-sm text-slate-400 mt-2 font-hindi">कुल सालाना कारोबार (Turnover)</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Net Profit</p>
                             <p className="text-3xl font-black text-green-600">₹{(calculations.netProfit / 100000).toFixed(2)} Lakh</p>
                        </div>
                         <div className="bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Yearly Net Profit</p>
                             <p className="text-3xl font-black text-indigo-600">₹{(calculations.yearlyProfit / 100000).toFixed(2)} Lakh</p>
                        </div>
                    </div>

                    <div className="p-6 bg-green-50 border border-green-200 rounded-3xl flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <ChartBarIcon className="h-8 w-8 text-green-600"/>
                             <div>
                                 <span className="text-sm font-bold text-green-800 block">Profit Margin</span>
                                 <span className="text-xs text-green-600 font-hindi">शुद्ध लाभ प्रतिशत</span>
                             </div>
                         </div>
                         <span className="text-4xl font-black text-green-700">{calculations.profitMargin.toFixed(1)}%</span>
                    </div>
                    
                    <button onClick={() => window.print()} className="w-full py-4 text-xs font-black text-slate-400 hover:text-primary uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">
                        Download Business Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfitCalculator;
