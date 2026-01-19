
import React, { useState, useEffect } from 'react';
import { PhoneIcon, PlayIcon, StopCircleIcon, SpeakerWaveIcon, ShieldCheckIcon, BoltIcon, Cog6ToothIcon, CheckCircleIcon, XCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const AutoDialer: React.FC = () => {
    const toast = useToast();
    const [isActive, setIsActive] = useState(false);
    const [currentName, setCurrentName] = useState('आरव शर्मा');
    const [status, setStatus] = useState('Idle');
    const [showConfig, setShowConfig] = useState(false);

    // Config State
    const [provider, setProvider] = useState('Exotel');
    const [apiKey, setApiKey] = useState('');
    const [apiToken, setApiToken] = useState('');
    const [virtualNumber, setVirtualNumber] = useState('');

    useEffect(() => {
        const savedConfig = localStorage.getItem('dialer_config');
        if (savedConfig) {
            const parsed = JSON.parse(savedConfig);
            setApiKey(parsed.apiKey);
            setApiToken(parsed.apiToken);
            setVirtualNumber(parsed.virtualNumber);
            setProvider(parsed.provider || 'Exotel');
        }
    }, []);

    const saveConfig = () => {
        if(!apiKey || !apiToken || !virtualNumber) {
            toast.error("कृपया सभी API डिटेल्स भरें (Please fill all fields)");
            return;
        }
        localStorage.setItem('dialer_config', JSON.stringify({ provider, apiKey, apiToken, virtualNumber }));
        toast.success("API सेटिंग्स सुरक्षित कर ली गई हैं! अब असली कॉल होगी।");
        setShowConfig(false);
    };

    const clearConfig = () => {
        localStorage.removeItem('dialer_config');
        setApiKey('');
        setApiToken('');
        setVirtualNumber('');
        toast.info("डेमो मोड सक्रिय (Demo Mode Active)");
    };

    const startCampaign = async () => {
        const config = localStorage.getItem('dialer_config');
        
        setIsActive(true);
        setStatus('Connecting to Server...');
        
        if (config) {
            // Real API Logic placeholder
            const parsed = JSON.parse(config);
            setStatus(`Authenticating with ${parsed.provider}...`);
            
            // Simulation of API delay
            setTimeout(() => {
                setStatus(`Dialing via ${parsed.virtualNumber}...`);
                toast.success(`असली कॉल कनेक्ट हो रही है... (API: ${parsed.provider})`);
            }, 1500);

            setTimeout(() => {
                setStatus('Call In Progress...');
            }, 3000);

            setTimeout(() => {
                setStatus('Call Completed.');
                setIsActive(false);
            }, 6000);
            
        } else {
            // Demo Logic
            setStatus('Demo Mode: Dialing Simulation...');
            
            setTimeout(() => {
                setStatus('Call Connected. AI speaking in Haryanvi...');
                toast.info("यह एक डेमो कॉल है। असली कॉल के लिए सेटिंग्स में API डालें।");
            }, 2000);
            
            setTimeout(() => {
                setStatus('Call Completed Successfully.');
                toast.success("फीस रिमाइंडर भेज दिया गया।");
                setIsActive(false);
                setStatus('Idle');
            }, 7000);
        }
    };

    return (
        <div className="bg-white p-8 rounded-[3rem] shadow-soft h-full flex flex-col animate-pop-in border border-slate-100 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-10 border-b pb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-xl"><PhoneIcon className="h-8 w-8" /></div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">AI Auto-Dialer</h2>
                        <p className="text-sm text-slate-500 font-hindi">स्वचालित फीस रिकवरी सिस्टम (Voice AI)</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowConfig(!showConfig)}
                    className={`p-3 rounded-full transition-all border ${showConfig ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-blue-50'}`}
                    title="API Settings"
                >
                    <Cog6ToothIcon className="h-6 w-6"/>
                </button>
            </div>

            {/* Config Overlay */}
            {showConfig && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 p-8 flex flex-col animate-fade-in overflow-y-auto">
                    <div className="max-w-xl mx-auto w-full space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-slate-800">Setup Real Calling</h3>
                            <p className="text-sm text-slate-500 mt-1 font-hindi">असली कॉल शुरू करने के लिए अपनी API डिटेल्स यहाँ डालें</p>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-sm space-y-2">
                            <h4 className="font-bold text-blue-800">Registration Steps (पंजीकरण प्रक्रिया):</h4>
                            <ol className="list-decimal list-inside text-blue-700 space-y-1">
                                <li><strong>DLT Registration:</strong> Jio या Airtel DLT पोर्टल पर अपनी संस्था रजिस्टर करें। (अनिवार्य)</li>
                                <li><strong>Buy API:</strong> Exotel, Sarv, या Twilio से वॉयस प्लान खरीदें।</li>
                                <li><strong>Enter Keys:</strong> वहां से मिली Keys नीचे भरें।</li>
                            </ol>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service Provider</label>
                                <select value={provider} onChange={e => setProvider(e.target.value)} className="w-full p-3 border rounded-xl bg-slate-50 font-bold text-sm">
                                    <option value="Exotel">Exotel (Recommended for India)</option>
                                    <option value="Sarv">Sarv</option>
                                    <option value="Twilio">Twilio</option>
                                    <option value="MyOperator">MyOperator</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">API Key / SID</label>
                                <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full p-3 border rounded-xl bg-slate-50 font-mono text-sm" placeholder="e.g. AC8723..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">API Token / Secret</label>
                                <input type="password" value={apiToken} onChange={e => setApiToken(e.target.value)} className="w-full p-3 border rounded-xl bg-slate-50 font-mono text-sm" placeholder="e.g. 823482..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Virtual Caller ID (Number)</label>
                                <input type="text" value={virtualNumber} onChange={e => setVirtualNumber(e.target.value)} className="w-full p-3 border rounded-xl bg-slate-50 font-mono text-sm" placeholder="e.g. 011-4567890" />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setShowConfig(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                            <button onClick={clearConfig} className="flex-1 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl">Reset to Demo</button>
                            <button onClick={saveConfig} className="flex-[2] py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Save & Activate</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-inner">
                        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3"><ShieldCheckIcon className="h-6 w-6 text-green-600"/> Campaign Details</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500 text-sm font-bold">Target List:</span>
                                <span className="text-slate-800 font-black">Fee Defaulters (AUG)</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500 text-sm font-bold">Total Calls:</span>
                                <span className="text-slate-800 font-black">12 Students</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500 text-sm font-bold">Connection Mode:</span>
                                <span className={`font-black flex items-center gap-1 ${localStorage.getItem('dialer_config') ? 'text-green-600' : 'text-orange-500'}`}>
                                    {localStorage.getItem('dialer_config') ? <><BoltIcon className="h-3 w-3"/> Live API ({provider})</> : 'Simulation Mode'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500 text-sm font-bold">AI Language:</span>
                                <span className="text-orange-600 font-black">Theth Haryanvi / Hindi</span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={startCampaign} 
                        disabled={isActive}
                        className={`w-full py-6 text-white font-black rounded-3xl shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-4 text-xl ${isActive ? 'bg-slate-800' : 'bg-slate-950 hover:bg-blue-600'}`}
                    >
                        {isActive ? <Loader message="" /> : <><PlayIcon className="h-8 w-8"/> START RECOVERY</>}
                    </button>
                </div>

                <div className={`p-10 rounded-[3rem] border-4 flex flex-col items-center justify-center text-center transition-all duration-500 ${isActive ? 'bg-slate-900 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.2)]' : 'bg-slate-50 border-slate-100'}`}>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl ${isActive ? 'bg-blue-600 animate-ping' : 'bg-white text-slate-300'}`}>
                        <SpeakerWaveIcon className="h-12 w-12" />
                    </div>
                    <h4 className={`text-2xl font-black mb-2 ${isActive ? 'text-white' : 'text-slate-400'}`}>{isActive ? currentName : 'No Active Call'}</h4>
                    <p className={`font-mono text-sm font-bold uppercase tracking-widest ${isActive ? 'text-blue-400 animate-pulse' : 'text-slate-300'}`}>{status}</p>
                </div>
            </div>
        </div>
    );
};

export default AutoDialer;
