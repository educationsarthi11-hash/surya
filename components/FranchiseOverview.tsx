
import React, { useState } from 'react';
import { Franchise } from '../types';
import { franchiseService } from '../services/franchiseService';
import { BuildingOfficeIcon, UsersIcon, CurrencyRupeeIcon, ArrowRightIcon, SparklesIcon, ChartBarIcon, MagnifyingGlassIcon } from './icons/AllIcons';
import { predictFranchiseGrowth } from '../services/geminiService';
import { useToast } from '../hooks/useToast';

interface FranchiseOverviewProps {
  onManage: (franchise: Franchise) => void;
}

const FranchiseCard: React.FC<{ franchise: Franchise, onManage: () => void }> = ({ franchise, onManage }) => {
    const [isPredicting, setIsPredicting] = useState(false);
    const [prediction, setPrediction] = useState<{forecast: string, recommendedAction: string} | null>(null);
    const toast = useToast();

    const handleGetGrowth = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPredicting(true);
        try {
            const result = await predictFranchiseGrowth(franchise.name, franchise.type, franchise.studentCount);
            setPrediction(result);
            toast.success("AI Growth Insight Ready!");
        } catch (error) {
            toast.error("Prediction failed.");
        } finally {
            setIsPredicting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
            
            <div className="flex items-start gap-4 relative z-10">
                <div className="text-primary bg-primary/10 p-4 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                    <BuildingOfficeIcon className="h-7 w-7" />
                </div>
                <div>
                    <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none mb-2">{franchise.name}</h4>
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{franchise.type}</span>
                </div>
            </div>

            <div className="flex-grow mt-8 space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Students</p>
                        <p className="text-xl font-black text-slate-800">{franchise.studentCount.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Annual Rev</p>
                        <p className="text-xl font-black text-green-600">₹{(franchise.revenue/1000000).toFixed(1)}M</p>
                    </div>
                </div>

                {prediction && (
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl animate-pop-in">
                        <div className="flex items-center gap-2 mb-2">
                            <SparklesIcon className="h-4 w-4 text-indigo-500" />
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">AI Forecast</p>
                        </div>
                        <p className="text-xs font-bold text-indigo-900 leading-relaxed mb-2">{prediction.forecast}</p>
                        <div className="bg-white/60 p-2 rounded-lg text-[11px] font-hindi font-medium text-indigo-700">
                             💡 {prediction.recommendedAction}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3 relative z-10">
                <button
                    onClick={onManage}
                    className="flex-1 py-3 px-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95"
                >
                    MANAGE HUB
                </button>
                {!prediction && (
                    <button 
                        onClick={handleGetGrowth}
                        disabled={isPredicting}
                        className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all disabled:opacity-50"
                        title="AI Growth Prediction"
                    >
                        {isPredicting ? <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full"></div> : <ChartBarIcon className="h-5 w-5" />}
                    </button>
                )}
            </div>
        </div>
    );
};

const FranchiseOverview: React.FC<FranchiseOverviewProps> = ({ onManage }) => {
    const [franchises] = useState<Franchise[]>(franchiseService.getFranchises());
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFranchises = franchises.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-pop-in space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic leading-none mb-3">Franchise Central</h2>
                    <p className="text-xl text-slate-500 font-hindi font-medium">
                        नेटवर्क के सभी संस्थानों की निगरानी और एआई एनालिटिक्स।
                    </p>
                </div>
                
                <div className="w-full md:w-96 relative group">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or type..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {filteredFranchises.map(franchise => (
                    <FranchiseCard 
                        key={franchise.id} 
                        franchise={franchise} 
                        onManage={() => onManage(franchise)}
                    />
                ))}
                
                <button 
                    onClick={() => onManage({ id: 'NEW', name: 'Register New', type: 'School', studentCount: 0, revenue: 0 } as any)}
                    className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-slate-300 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group"
                >
                    <div className="p-6 bg-white rounded-full shadow-lg mb-4 group-hover:scale-110 transition-transform">
                        <BuildingOfficeIcon className="h-12 w-12" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-sm">Register New Hub</span>
                </button>
            </div>
        </div>
    );
};

export default FranchiseOverview;
