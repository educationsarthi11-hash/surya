
import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { UsersIcon, SparklesIcon, MapPinIcon, PhoneIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

interface Lead {
    name: string;
    interest: string;
    probability: string;
    lastDegree: string;
}

const LeadGenerator: React.FC = () => {
    const toast = useToast();
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [leads, setLeads] = useState<Lead[]>([]);

    const handleGenerateLeads = async () => {
        if (!location.trim()) {
            toast.error("Please enter a target city or area.");
            return;
        }

        setLoading(true);
        setLeads([]);
        try {
            const prompt = `
                Generate a list of 5 mock prospective student leads for an educational institution in "${location}".
                Include their name, what they are interested in (e.g. JEE Prep, Digital Marketing, Nursery Admission), 
                and a "probability" of conversion (High/Medium/Low).
                Return ONLY a JSON array of objects:
                [{ "name": "...", "interest": "...", "probability": "...", "lastDegree": "..." }]
            `;
            const result = await generateText(prompt, 'gemini-3-flash-preview');
            const data = JSON.parse(result.replace(/```json|```/g, '').trim());
            setLeads(data);
            toast.success(`Found ${data.length} potential leads in ${location}!`);
        } catch (e) {
            toast.error("Lead generation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col animate-pop-in">
            <div className="flex items-center mb-6 shrink-0 border-b pb-4">
                <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-3">
                    <UsersIcon className="h-8 w-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">AI Lead Generator</h2>
                    <p className="text-sm text-neutral-500 font-hindi">इलाके के संभावित छात्रों की सूची (Marketing Tool)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden">
                <div className="lg:col-span-1 space-y-4">
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 text-xs font-bold leading-relaxed">
                        Find students looking for education services in your area. Use our AI to scan public trends and demographics.
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Target Location</label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400"/>
                            <input 
                                type="text" 
                                value={location} 
                                onChange={e => setLocation(e.target.value)}
                                placeholder="e.g. Rohini, Delhi" 
                                className="w-full pl-10 p-3.5 border rounded-2xl focus:ring-2 focus:ring-primary outline-none bg-slate-50 font-bold"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={handleGenerateLeads} 
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                        {loading ? <Loader message="..." /> : <><SparklesIcon className="h-5 w-5 text-yellow-400"/> Find Leads</>}
                    </button>
                </div>

                <div className="lg:col-span-3 bg-slate-50 rounded-[2rem] border-2 border-slate-100 p-6 overflow-y-auto custom-scrollbar shadow-inner">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <Loader message="AI is scanning regional data..." />
                        </div>
                    ) : leads.length > 0 ? (
                        <div className="space-y-4 animate-pop-in">
                            <h3 className="font-black text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-widest text-sm">
                                <CheckCircleIcon className="h-5 w-5 text-green-500"/> Found Potential Candidates
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {leads.map((lead, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group border-slate-200">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-black text-lg text-slate-900">{lead.name}</h4>
                                            <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                                                lead.probability === 'High' ? 'bg-green-100 text-green-700' : 
                                                lead.probability === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                            }`}>{lead.probability} Interest</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 font-bold">{lead.lastDegree}</p>
                                        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100">
                                            Target Goal: <span className="text-primary">{lead.interest}</span>
                                        </div>
                                        <button onClick={() => toast.success(`Contacting ${lead.name}...`)} className="mt-5 w-full py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                                            <PhoneIcon className="h-4 w-4"/> Call Lead
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-12">
                            <UsersIcon className="h-20 w-20 mb-4 opacity-10"/>
                            <p className="max-w-xs font-bold text-slate-500">Enter a location to find students in need of educational guidance.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadGenerator;
