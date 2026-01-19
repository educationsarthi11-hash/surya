
import React from 'react';
import { ChartBarIcon, SparklesIcon, ArrowTrendingUpIcon, CurrencyRupeeIcon, UsersIcon, ServerIcon, BoltIcon } from './icons/AllIcons';

// --- Reusable Components defined inside for simplicity ---

const Stat: React.FC<{ title: string; value: string; change?: string; icon: React.ReactNode; changeColor?: string; subtext?: string }> = ({ title, value, change, icon, changeColor, subtext }) => (
    <div className="bg-white p-5 rounded-xl shadow-soft border border-slate-100 hover:shadow-lg transition-all">
        <div className="flex items-center mb-2 justify-between">
            <div className="p-3 bg-slate-50 rounded-full">{icon}</div>
            {change && <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 ${changeColor}`}>{change}</span>}
        </div>
        <p className="text-3xl font-black text-slate-900">{value}</p>
        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{title}</p>
        {subtext && <p className="text-[10px] text-slate-400 mt-2 font-medium">{subtext}</p>}
    </div>
);

const BarChart: React.FC<{ data: { label: string; value: number; color: string }[]; title: string; unit?: string }> = ({ data, title, unit = '' }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="bg-white p-6 rounded-xl shadow-soft border border-slate-100 h-full">
            <h4 className="font-bold text-lg text-slate-800 mb-4">{title}</h4>
            <div className="space-y-4">
                {data.map(item => (
                    <div key={item.label} className="grid grid-cols-8 gap-4 items-center">
                        <span className="col-span-2 text-xs font-bold text-slate-500 uppercase truncate">{item.label}</span>
                        <div className="col-span-5 flex items-center">
                            <div className="w-full bg-slate-100 rounded-full h-3 relative overflow-hidden">
                                <div
                                    className={`${item.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                />
                            </div>
                        </div>
                        <span className="col-span-1 text-xs font-black text-right text-slate-700">{unit}{item.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Component ---
const AnalyticsDashboard: React.FC = () => {
    
    // Mock Data simulating the "Profit Safety" logic
    // Scenario: 1000 students paying ₹25 each = ₹25,000 Revenue
    // AI Cost: High usage but optimized by Cache
    const economicsData = {
        revenue: 25000,
        rawApiCost: 4500, // Cost if no cache was used
        actualApiCost: 350, // Real cost after Caching (Huge savings!)
        serverCost: 1200,
    };

    const profit = economicsData.revenue - (economicsData.actualApiCost + economicsData.serverCost);
    const savings = economicsData.rawApiCost - economicsData.actualApiCost;

    const toolUsageData = [
      { label: 'Test Paper Guru', value: 820, color: 'bg-indigo-500' },
      { label: 'Video Generator', value: 120, color: 'bg-pink-500' }, // Low usage due to limits
      { label: 'Online Exam', value: 450, color: 'bg-amber-400' },
      { label: 'AI Tutor (Cached)', value: 2500, color: 'bg-green-500' }, // High volume, low cost
    ];

    const revenueData = [
        { label: 'Jan', value: 12000, color: 'bg-green-400' },
        { label: 'Feb', value: 15000, color: 'bg-green-400' },
        { label: 'Mar', value: 18000, color: 'bg-green-400' },
        { label: 'Apr', value: 22000, color: 'bg-green-400' },
        { label: 'May', value: 25000, color: 'bg-green-500' }, // Growing
    ];

    return (
        <div className="space-y-8 animate-pop-in pb-20">
            <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Admin Control Center</h2>
                <p className="mt-1 text-sm text-slate-500 font-hindi font-bold">बिज़नेस मुनाफे और AI खर्च का लाइव रिपोर्ट</p>
            </div>

            {/* Profit & Health Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Stat 
                    title="Total Revenue" 
                    value={`₹${economicsData.revenue.toLocaleString()}`} 
                    change="+12%" 
                    icon={<CurrencyRupeeIcon className="h-6 w-6 text-green-600"/>} 
                    changeColor="text-green-600"
                    subtext="From ₹25 & ₹99 Plans"
                />
                <Stat 
                    title="AI API Cost (Real)" 
                    value={`₹${economicsData.actualApiCost}`} 
                    change="Low" 
                    icon={<BoltIcon className="h-6 w-6 text-orange-500"/>} 
                    changeColor="text-green-600"
                    subtext="Optimized by Smart Cache"
                />
                 <Stat 
                    title="Money Saved" 
                    value={`₹${savings.toLocaleString()}`} 
                    change="Saved by AI" 
                    icon={<ServerIcon className="h-6 w-6 text-blue-500"/>} 
                    changeColor="text-blue-600"
                    subtext="Using Caching Technology"
                />
                <Stat 
                    title="Net Profit" 
                    value={`₹${profit.toLocaleString()}`} 
                    change="Healthy" 
                    icon={<ArrowTrendingUpIcon className="h-6 w-6 text-emerald-500"/>} 
                    changeColor="text-emerald-600"
                    subtext="Margin: ~93%"
                />
            </div>

            {/* AI Economic Visualizer */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border-4 border-slate-800">
                 <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                 
                 <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                     <div className="flex-1 space-y-6">
                         <div>
                             <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                 <SparklesIcon className="h-6 w-6 text-primary"/> AI Unit Economics
                             </h3>
                             <p className="text-slate-400 font-hindi mt-2 text-sm">
                                 देखें कि कैसे 'स्मार्ट कैशिंग' और 'लिमिट्स' आपके ₹25 वाले प्लान को भी मुनाफे में रखते हैं।
                             </p>
                         </div>

                         <div className="space-y-4">
                             <div>
                                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                                     <span className="text-slate-400">Projected Cost (Without Tech)</span>
                                     <span className="text-red-400">₹{economicsData.rawApiCost}</span>
                                 </div>
                                 <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                     <div className="bg-red-500 h-full w-full opacity-30"></div>
                                 </div>
                             </div>
                             
                             <div>
                                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                                     <span className="text-slate-400">Actual Cost (With Sarthi Tech)</span>
                                     <span className="text-green-400">₹{economicsData.actualApiCost}</span>
                                 </div>
                                 <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                     <div className="bg-green-500 h-full" style={{width: '8%'}}></div>
                                 </div>
                             </div>
                         </div>
                     </div>

                     <div className="bg-white/10 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md w-full md:w-auto min-w-[200px] text-center">
                         <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Safety Lock</p>
                         <p className="text-4xl font-black text-white">ACTIVE</p>
                         <p className="text-[10px] text-slate-300 mt-2 font-hindi">अगर खर्च बढ़ता है, तो AI ऑटोमैटिक लिमिट लगा देगा।</p>
                     </div>
                 </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BarChart data={toolUsageData} title="Most Used AI Tools (Queries)" />
                <BarChart data={revenueData} title="Monthly Revenue Growth" unit="₹"/>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
