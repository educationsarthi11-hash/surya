
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { BanknotesIcon, SparklesIcon, ChartBarIcon, CalculatorIcon, TrophyIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const AIFinanceGuru: React.FC = () => {
    const toast = useToast();
    const [goal, setGoal] = useState('');
    const [cost, setCost] = useState('');
    const [pocketMoney, setPocketMoney] = useState('');
    const [plan, setPlan] = useState('');
    const [loading, setLoading] = useState(false);
    const [savedAmount, setSavedAmount] = useState(500); // Mock starting balance

    const [dailyTip, setDailyTip] = useState('');
    const [loadingTip, setLoadingTip] = useState(false);

    const handleGeneratePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal || !cost || !pocketMoney) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const prompt = `
                Act as a friendly financial advisor for a student in India.
                The student wants to buy: "${goal}" which costs ₹${cost}.
                They get pocket money/allowance of: ₹${pocketMoney} per month.
                
                Create a realistic, encouraging savings plan.
                1. Calculate how many months it will take.
                2. Suggest how much to save vs spend each month.
                3. Give 2 smart tips to earn extra money as a student (e.g. teaching, art, crafts) or save more.
                
                Format the response in clean HTML (use <h3>, <ul>, <p>, <strong>). Keep it simple and motivating.
            `;
            const response = await generateText(prompt, 'gemini-2.5-flash');
            setPlan(response);
            toast.success("Savings plan generated!");
        } catch (error) {
            toast.error("Could not generate plan.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddMoney = () => {
        const amount = prompt("Enter amount to add to Gullak (Piggy Bank):");
        if (amount && !isNaN(Number(amount))) {
            setSavedAmount(prev => prev + Number(amount));
            toast.success(`₹${amount} added to your Gullak! Great job!`);
        }
    };

    const handleGenerateDailyTip = async () => {
        setLoadingTip(true);
        try {
            const prompt = `Generate a short, fun, and educational financial tip for a school student (Class 5-10). Topic ideas: Compound Interest, Needs vs Wants, Budgeting, Earning Skills. Keep it under 50 words. Language: Hinglish (Hindi + English mix).`;
            const response = await generateText(prompt, 'gemini-2.5-flash');
            setDailyTip(response);
        } catch (e) {
            toast.error("Could not get daily tip.");
        } finally {
            setLoadingTip(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col">
            <div className="flex items-center mb-6 shrink-0">
                <BanknotesIcon className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">AI Finance Guru (Gullak)</h2>
                    <p className="text-sm text-neutral-500 font-hindi">वित्तीय साक्षरता और कमाई के तरीके (Financial Literacy)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
                {/* Left: Input & Status */}
                <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* Gullak Status */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20"><TrophyIcon className="h-24 w-24"/></div>
                        <p className="text-green-100 text-sm font-bold uppercase tracking-wider mb-1">My Savings (Gullak)</p>
                        <h3 className="text-4xl font-black mb-4">₹{savedAmount.toLocaleString()}</h3>
                        <button 
                            onClick={handleAddMoney}
                            className="bg-white text-green-700 px-6 py-2 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto"
                        >
                            <PlusIcon className="h-4 w-4"/> Add Money
                        </button>
                    </div>
                    
                    {/* Daily Wisdom */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                        <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                             <SparklesIcon className="h-4 w-4"/> Daily Money Wisdom (10 Mins)
                        </h4>
                        <p className="text-sm text-amber-900 mb-3 min-h-[40px]">
                            {dailyTip || "Click the button to learn a new financial superpower today!"}
                        </p>
                        <button 
                            onClick={handleGenerateDailyTip} 
                            disabled={loadingTip}
                            className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1 rounded font-bold transition-colors"
                        >
                            {loadingTip ? "Loading..." : "Get Today's Lesson"}
                        </button>
                    </div>

                    <form onSubmit={handleGeneratePlan} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <CalculatorIcon className="h-5 w-5 text-primary"/> Create a Goal
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">I want to buy...</label>
                            <input 
                                type="text" 
                                value={goal} 
                                onChange={e => setGoal(e.target.value)} 
                                placeholder="e.g. New Bicycle, Cricket Bat" 
                                className="w-full p-2 border rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cost (₹)</label>
                            <input 
                                type="number" 
                                value={cost} 
                                onChange={e => setCost(e.target.value)} 
                                placeholder="e.g. 5000" 
                                className="w-full p-2 border rounded-lg text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Pocket Money (₹)</label>
                            <input 
                                type="number" 
                                value={pocketMoney} 
                                onChange={e => setPocketMoney(e.target.value)} 
                                placeholder="e.g. 500" 
                                className="w-full p-2 border rounded-lg text-sm"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader message="..." /> : <><SparklesIcon className="h-5 w-5"/> Plan My Savings</>}
                        </button>
                    </form>
                </div>

                {/* Right: AI Plan Output */}
                <div className="lg:col-span-2 bg-slate-50 rounded-xl border border-slate-200 p-6 overflow-y-auto custom-scrollbar flex flex-col">
                    {plan ? (
                        <div className="animate-pop-in">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                                <div className="bg-primary/10 p-2 rounded-full text-primary"><ChartBarIcon className="h-6 w-6"/></div>
                                <h3 className="text-xl font-bold text-slate-800">Your Savings Roadmap</h3>
                            </div>
                            <div className="prose prose-sm max-w-none text-slate-700 bg-white p-6 rounded-lg border border-slate-100 shadow-sm" dangerouslySetInnerHTML={{ __html: plan }} />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center">
                            <BanknotesIcon className="h-16 w-16 mb-4 opacity-20"/>
                            <h3 className="text-lg font-semibold text-slate-500">No active plan</h3>
                            <p className="text-sm max-w-xs mt-2">Enter your goal details on the left to get a customized AI savings & earning strategy.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Internal Helper Icon
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export default AIFinanceGuru;
