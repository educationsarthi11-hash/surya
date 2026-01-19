
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { ShieldCheckIcon, LockClosedIcon, ExclamationTriangleIcon, ChatBubbleIcon, CheckCircleIcon, XCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const AICyberSmart: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'drill' | 'password'>('drill');
    
    // Drill State
    const [drillScenario, setDrillScenario] = useState<{scenario: string, options: string[], correctOption: number, explanation: string} | null>(null);
    const [loadingDrill, setLoadingDrill] = useState(false);
    const [userChoice, setUserChoice] = useState<number | null>(null);

    // Password State
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordAnalysis, setPasswordAnalysis] = useState('');
    const [loadingPassword, setLoadingPassword] = useState(false);

    const startSafetyDrill = async () => {
        setLoadingDrill(true);
        setDrillScenario(null);
        setUserChoice(null);
        try {
            const prompt = `
                Generate a realistic cyber security scenario for an Indian student (e.g., WhatsApp lottery scam, Instagram fake profile, OTP fraud, or Cyberbullying).
                
                Return a JSON object with:
                1. "scenario": A short description of the situation.
                2. "options": An array of 3 possible actions the student can take.
                3. "correctOption": The index (0, 1, or 2) of the safe/correct action.
                4. "explanation": Why the correct action is safe and why others are dangerous.
                
                Language: Hinglish (Hindi + English mix).
            `;
            const response = await generateText(prompt, 'gemini-2.5-flash');
            const jsonStr = response.replace(/```json|```/g, '').trim();
            const data = JSON.parse(jsonStr);
            setDrillScenario(data);
        } catch (e) {
            toast.error("Could not start drill.");
        } finally {
            setLoadingDrill(false);
        }
    };

    const handleOptionSelect = (index: number) => {
        setUserChoice(index);
        if (drillScenario && index === drillScenario.correctOption) {
            toast.success("Safe Choice! (सुरक्षित विकल्प!)");
        } else {
            toast.error("Risky Choice! (खतरनाक विकल्प!)");
        }
    };

    const checkPasswordStrength = async () => {
        if (!passwordInput) return;
        setLoadingPassword(true);
        try {
            const prompt = `
                Analyze this password string: "${passwordInput}".
                DO NOT reveal the password in the output.
                
                Provide a safety report in Hindi/Hinglish HTML format:
                1. Strength Score (1-10).
                2. Why it is weak or strong (e.g. no special chars, common word).
                3. Time it would take for a hacker to crack it.
                
                Format as: <h3>Security Report</h3><p>...</p>
            `;
            const result = await generateText(prompt, 'gemini-2.5-flash');
            setPasswordAnalysis(result);
        } catch (e) {
            toast.error("Analysis failed.");
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col">
            <div className="flex items-center mb-6 shrink-0">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">AI Cyber Smart</h2>
                    <p className="text-sm text-neutral-500 font-hindi">डिजिटल सुरक्षा गुरु: स्कैम और फ्रॉड से बचें</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6 shrink-0 bg-slate-50 p-1 rounded-lg w-fit">
                <button 
                    onClick={() => setActiveTab('drill')} 
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'drill' ? 'bg-white shadow text-green-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Safety Drill (सुरक्षा अभ्यास)
                </button>
                <button 
                    onClick={() => setActiveTab('password')} 
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'password' ? 'bg-white shadow text-green-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Password Coach
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'drill' && (
                    <div className="space-y-6">
                        {!drillScenario && !loadingDrill && (
                            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                                <ExclamationTriangleIcon className="h-12 w-12 mx-auto text-orange-400 mb-2"/>
                                <h3 className="text-lg font-bold text-slate-700">Are you safe online?</h3>
                                <p className="text-sm text-slate-500 mb-4">Test your skills against AI-generated scams.</p>
                                <button onClick={startSafetyDrill} className="px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-700 transition-transform hover:scale-105">
                                    Start Simulation
                                </button>
                            </div>
                        )}

                        {loadingDrill && <div className="flex justify-center h-40 items-center"><Loader message="Generating a scam scenario..." /></div>}

                        {drillScenario && (
                            <div className="animate-pop-in max-w-2xl mx-auto">
                                <div className="bg-red-50 border border-red-100 p-6 rounded-xl mb-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><ChatBubbleIcon className="h-24 w-24"/></div>
                                    <span className="bg-red-200 text-red-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Incoming Alert</span>
                                    <h3 className="text-xl font-bold text-slate-900 mt-2 mb-4">Scenario:</h3>
                                    <p className="text-lg text-slate-700 font-medium leading-relaxed">{drillScenario.scenario}</p>
                                </div>

                                <h4 className="font-bold text-slate-700 mb-3">What will you do? (आप क्या करेंगे?)</h4>
                                <div className="space-y-3">
                                    {drillScenario.options.map((opt, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleOptionSelect(idx)}
                                            disabled={userChoice !== null}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                                                userChoice === idx 
                                                    ? (idx === drillScenario.correctOption ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800')
                                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                                            }`}
                                        >
                                            <span>{opt}</span>
                                            {userChoice === idx && (idx === drillScenario.correctOption ? <CheckCircleIcon className="h-6 w-6 text-green-600"/> : <XCircleIcon className="h-6 w-6 text-red-600"/>)}
                                        </button>
                                    ))}
                                </div>

                                {userChoice !== null && (
                                    <div className="mt-6 p-6 bg-slate-900 text-white rounded-xl shadow-lg animate-fade-in-up">
                                        <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                                            <ShieldCheckIcon className="h-5 w-5"/> Security Analysis
                                        </h4>
                                        <p>{drillScenario.explanation}</p>
                                        <button onClick={startSafetyDrill} className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-sm">Next Scenario</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="max-w-xl mx-auto space-y-6">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                                <LockClosedIcon className="h-5 w-5 text-primary"/> Password Strength Check
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">Enter a password to see how easily it can be hacked. (Note: We do not store this).</p>
                            
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={passwordInput} 
                                    onChange={e => setPasswordInput(e.target.value)} 
                                    placeholder="Enter test password..."
                                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                                />
                                <button onClick={checkPasswordStrength} disabled={loadingPassword} className="bg-primary text-white px-6 rounded-lg font-bold hover:bg-primary-dark disabled:opacity-50">
                                    {loadingPassword ? 'Checking...' : 'Check'}
                                </button>
                            </div>
                        </div>

                        {passwordAnalysis && (
                            <div className="bg-white p-6 rounded-xl border shadow-sm animate-pop-in">
                                <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{__html: passwordAnalysis}} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AICyberSmart;
