
import React, { useState, useEffect } from 'react';
import { TruckIcon, MapPinIcon, BellIcon, ExclamationTriangleIcon, PhoneIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const SmartTransport: React.FC = () => {
    const toast = useToast();
    const [sosActive, setSosActive] = useState(false);
    const [busStatus, setBusStatus] = useState('Moving');
    const [eta, setEta] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setEta(prev => Math.max(1, prev - 1));
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const triggerSOS = () => {
        if(window.confirm("क्या आप इमरजेंसी अलर्ट भेजना चाहते हैं? (Trigger SOS?)")) {
            setSosActive(true);
            toast.error("SOS SENT! School and Parents notified with your live location.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-3">
                        <TruckIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Bus Tracking & SOS</h2>
                        <p className="text-sm text-slate-500 font-hindi">लाइव बस लोकेशन और सुरक्षा</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> Live Tracking
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                <div className="lg:col-span-2 bg-slate-100 rounded-2xl overflow-hidden relative border-4 border-white shadow-inner min-h-[300px]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                         <div className="relative">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl shadow-glow animate-bounce">🚌</div>
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded text-[10px] font-bold shadow">Route #12: Home</div>
                         </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Bus Details</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div><p className="text-xs text-slate-500">ETA to Home</p><p className="text-2xl font-black text-slate-800">{eta} Mins</p></div>
                                <div className="text-right"><p className="text-xs text-slate-500">Status</p><p className="text-sm font-bold text-blue-600">{busStatus}</p></div>
                            </div>
                            <div className="pt-4 border-t flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden"><img src="https://i.pravatar.cc/150?u=driver" alt="Driver"/></div>
                                <div><p className="text-sm font-bold">Ramesh Singh</p><p className="text-[10px] text-slate-500">+91 98765 4XXXX</p></div>
                                <a href="tel:919876543210" className="ml-auto p-2 bg-white rounded-full shadow-sm text-primary"><PhoneIcon className="h-5 w-5"/></a>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={triggerSOS}
                        className={`w-full py-6 rounded-2xl font-black text-2xl shadow-xl transition-all active:scale-95 flex flex-col items-center gap-2 ${sosActive ? 'bg-red-800 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
                    >
                        <ExclamationTriangleIcon className="h-10 w-10 animate-pulse"/>
                        {sosActive ? "ALERTS SENT!" : "EMERGENCY SOS"}
                    </button>
                    <p className="text-[10px] text-center text-red-500 font-bold uppercase tracking-tighter">केवल आपातकालीन स्थिति में दबाएं</p>
                </div>
            </div>
        </div>
    );
};

export default SmartTransport;
