
import React from 'react';
import { User, ServiceName } from '../../types';
import { gamificationService } from '../../services/gamificationService';
// Fix: Removed CurrencyDollarIcon from imports as it was not exported from AllIcons
import { FireIcon, StarIcon, TrophyIcon, RocketLaunchIcon, ShoppingCartIcon, PlusIcon, SunIcon } from '../icons/AllIcons';

interface GamificationWidgetProps {
    user: User;
    onNavigate: (service: ServiceName) => void;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({ user, onNavigate }) => {
    const stats = gamificationService.getUserStats(user.id);
    const badges = gamificationService.getEarnedBadges(user.id);
    const recentBadges = badges.slice(-4); 

    if (!stats) return null;

    return (
        <div className="bg-white p-8 rounded-[4rem] shadow-2xl border-4 border-slate-50 space-y-8 relative overflow-hidden group">
            {/* Surya Background Glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-60 group-hover:scale-150 transition-transform duration-1000"></div>

            {/* Profile & XP Header */}
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center border-4 border-white shadow-xl rotate-3">
                         <SunIcon className="h-8 w-8 text-primary animate-spin-slow" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Rank Status</p>
                        <h4 className="font-black text-2xl text-slate-900 tracking-tighter">{stats.levelName}</h4>
                    </div>
                </div>
                <div className="bg-amber-50 px-5 py-2.5 rounded-2xl border border-amber-100 flex flex-col items-center">
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Sarthi Coins</span>
                    <span className="text-xl font-black text-primary">1,250</span>
                </div>
            </div>

            {/* Premium Progress Bar */}
            <div className="relative z-10 space-y-3">
                <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Level Progress</span>
                    <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">Lvl {stats.level} • {stats.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden p-1.5 shadow-inner border border-slate-200">
                    <div className="bg-gradient-to-r from-primary via-orange-500 to-red-500 h-full rounded-full transition-all duration-[2000ms] ease-out relative group/bar" 
                         style={{ width: `${stats.progress}%` }}>
                         <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>

            {/* Badges Carousel Style */}
            <div className="relative z-10">
                <h4 className="font-black text-[10px] text-slate-400 mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
                    <TrophyIcon className="h-4 w-4 text-primary"/> Achievement Badges
                </h4>
                <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                    {badges.map(badge => (
                        <div key={badge.id} className="flex-shrink-0 group/badge relative">
                            <div className="w-16 h-16 p-4 bg-slate-50 border-2 border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 group-hover/badge:border-primary group-hover/badge:bg-primary/5 group-hover/badge:text-primary transition-all duration-300 shadow-sm">
                                {React.cloneElement(badge.icon as React.ReactElement<any>, { className: "w-full h-full" })}
                            </div>
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 bg-slate-900 text-white text-[8px] p-2 rounded-lg opacity-0 group-hover/badge:opacity-100 transition-opacity z-20 text-center pointer-events-none shadow-xl border border-white/10">
                                {badge.name}: {badge.description}
                            </div>
                        </div>
                    ))}
                    <button onClick={() => onNavigate('Leaderboard')} className="flex-shrink-0 w-16 h-16 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-primary hover:text-primary transition-all bg-white hover:bg-primary/5">
                        <PlusIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 relative z-10 pt-4 border-t border-slate-50">
                 {/* Fix: Replaced CurrencyDollarIcon with ShoppingCartIcon which is already imported */}
                 <button onClick={() => onNavigate('Campus Kart')} className="w-full py-5 bg-slate-950 text-white font-black text-xs rounded-3xl shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95">
                    <ShoppingCartIcon className="h-5 w-5 text-primary"/> Rewards Shop
                </button>
                <button onClick={() => onNavigate('Leaderboard')} className="w-full py-5 bg-white border-2 border-slate-200 text-slate-600 font-black text-xs rounded-3xl hover:bg-slate-50 hover:border-slate-300 transition-all uppercase tracking-widest">
                    Global Rank
                </button>
            </div>

            <style>{`
                @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
                .animate-spin-slow { animation: spin 12s linear infinite; }
            `}</style>
        </div>
    );
}

export default GamificationWidget;
