
import React from 'react';
import { ServiceName, UserRole } from '../types';
import ManagementPanel from './ManagementPanel';
import { BriefcaseIcon, CurrencyRupeeIcon, GlobeAltIcon, ShieldCheckIcon, PlusIcon, SparklesIcon, ChartBarIcon, ArrowTrendingUpIcon, SignalIcon, UsersIcon, BoltIcon, ArrowRightIcon } from './icons/AllIcons';

interface Props {
  setActiveService: (service: ServiceName | 'overview') => void;
}

const MangmatCompanyHQ: React.FC<Props> = ({ setActiveService }) => {
  const config = {
    panelTitle: "MANGMAT EXECUTIVE COMMAND",
    sections: [
      {
        title: "Growth Forecasting (व्यापार भविष्य)",
        services: ['AI Profit Forecaster', 'Profit Calculator', 'Lead Generator', 'Analytics Dashboard'] as ServiceName[]
      },
      {
        title: "Enterprise Expansion (ग्रुप विस्तार)",
        services: ['Franchise Configurator', 'World Expansion Planner', 'Franchise Plans', 'Data Import Wizard'] as ServiceName[]
      },
      {
        title: "Financial Governance (वित्तीय नियंत्रण)",
        // Added 'AI Business Manager' here
        services: ['AI Business Manager', 'Fee Management', 'Fee Notification', 'Auto-Dialer', 'Smart HR Manager'] as ServiceName[]
      },
      {
        title: "Platform & Security (सिस्टम सुरक्षा)",
        services: ['Access Control Center', 'AI Master Setup', 'Sync Center', 'Anti-Fraud Shield'] as ServiceName[]
      }
    ]
  };

  return (
      <div className="space-y-12 animate-pop-in pb-20">
          {/* Executive Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                  { label: 'Group Valuation', value: '₹120.5 Cr', icon: <CurrencyRupeeIcon />, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Active Mangmat Hubs', value: '184 Units', icon: <GlobeAltIcon />, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'System Uptime', value: '99.98%', icon: <SignalIcon />, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Global Students', value: '1.2 Lacs', icon: <UsersIcon />, color: 'text-purple-600', bg: 'bg-purple-50' }
              ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all min-h-[200px] overflow-hidden relative`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-40 rounded-bl-full transition-transform group-hover:scale-125"></div>
                      <div className={`p-4 bg-white rounded-2xl shadow-inner w-fit mb-4 text-slate-800 group-hover:${stat.color} transition-all`}>{stat.icon}</div>
                      <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                          <p className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">{stat.value}</p>
                      </div>
                  </div>
              ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-12">
                  {/* Highlighting the main turnover predictor for Manoj ji */}
                  <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 p-12 rounded-[5rem] text-white shadow-[0_40px_100px_-15px_rgba(79,70,229,0.4)] relative overflow-hidden border-4 border-indigo-400/20 group">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                      <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000"></div>
                      
                      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                          <div className="w-24 h-24 bg-primary text-slate-950 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-slow">
                              <ChartBarIcon className="h-12 w-12" />
                          </div>
                          <div className="flex-1 text-center md:text-left">
                              <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter italic leading-none mb-3">Revenue <br/> <span className="text-primary not-italic">Forecaster.</span></h3>
                              <p className="text-xl font-hindi text-slate-400">मंगमत ग्रुप के 1-साल के मुनाफे का एआई अनुमान</p>
                          </div>
                          <button 
                            onClick={() => setActiveService('AI Profit Forecaster')}
                            className="px-12 py-6 bg-white text-indigo-900 font-black rounded-3xl shadow-2xl hover:bg-primary hover:text-slate-950 transition-all transform active:scale-95 text-lg uppercase tracking-widest flex items-center gap-4 group/btn"
                          >
                              START ANALYSIS <ArrowRightIcon className="h-6 w-6 group-hover/btn:translate-x-2 transition-transform" />
                          </button>
                      </div>
                  </div>

                  <ManagementPanel config={config} handleServiceSelect={setActiveService} />
              </div>
              
              <div className="lg:col-span-4 space-y-8">
                  {/* Live Network Feed */}
                  <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-slate-800">
                      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform duration-700"><ArrowTrendingUpIcon className="h-40 w-40"/></div>
                      <div className="relative z-10">
                          <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Mangmat Network AI</h4>
                          <div className="space-y-6">
                              <div className="border-l-2 border-primary pl-4">
                                  <p className="text-xs text-slate-500 uppercase font-black">Just Now</p>
                                  <p className="text-sm font-hindi leading-relaxed text-slate-200">मंगमत रोहतक शाखा में 100 नए एडमिशन दर्ज हुए।</p>
                              </div>
                              <div className="border-l-2 border-slate-700 pl-4">
                                  <p className="text-xs text-slate-500 uppercase font-black">10 Mins Ago</p>
                                  <p className="text-sm font-hindi leading-relaxed text-slate-200">मंगमत टेक्निकल आईटीआई - जयपुर का लाइसेंस रिन्यू हुआ।</p>
                              </div>
                              <div className="border-l-2 border-slate-700 pl-4">
                                  <p className="text-xs text-slate-500 uppercase font-black">1 Hour Ago</p>
                                  <p className="text-sm font-hindi leading-relaxed text-slate-200">AI उस्ताद ने 5000 छात्रों के डाउट सॉल्व किए।</p>
                              </div>
                          </div>
                          <button className="mt-10 w-full py-4 bg-white text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-xl">VIEW FULL AUDIT LOG</button>
                      </div>
                  </div>

                  {/* HQ Operational Status */}
                  <div className="bg-white p-8 rounded-[3.5rem] border-2 border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-4 mb-6">HQ Operations Status</h4>
                      <div className="space-y-5">
                          {[
                              { label: 'Mangmat Cloud Bridge', status: 'Online', color: 'bg-green-500' },
                              { label: 'Executive AI Suite', status: 'Optimal', color: 'bg-blue-500' },
                              { label: 'Payment API Gateway', status: 'Secure', color: 'bg-green-500' },
                              { label: 'Franchise Support VPN', status: 'Active', color: 'bg-indigo-500' }
                          ].map(op => (
                              <div key={op.label} className="flex justify-between items-center">
                                  <span className="text-xs font-bold text-slate-600">{op.label}</span>
                                  <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${op.color} animate-pulse`}></div>
                                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{op.status}</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
          
          {/* Global Launch Pad */}
          <div className="bg-slate-950 p-12 rounded-[5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl relative overflow-hidden group border-4 border-white/5">
               <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-[150px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000"></div>
               <div className="relative z-10 space-y-6 text-center md:text-left">
                   <div className="flex items-center justify-center md:justify-start gap-4">
                        <SparklesIcon className="h-10 w-10 text-primary animate-pulse" />
                        <h3 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none">NEW <br/> <span className="text-primary not-italic">HUB LAUNCH</span></h3>
                   </div>
                   <p className="text-slate-400 font-hindi text-2xl max-w-2xl leading-relaxed italic">"मंगमत के नए गौरवशाली अध्याय की शुरुआत यहाँ से करें।"</p>
               </div>
               <button 
                onClick={() => setActiveService('Franchise Configurator')}
                className="relative z-10 px-24 py-12 bg-primary text-slate-950 font-black rounded-[4rem] shadow-[0_30px_70px_-15px_rgba(245,158,11,0.5)] hover:bg-white hover:scale-105 transition-all flex flex-col items-center gap-4 text-3xl active:scale-95 group/btn"
               >
                   <span className="uppercase tracking-tighter italic">ACTIVATE HUB</span>
                   <PlusIcon className="h-12 w-12 group-hover/btn:rotate-90 transition-transform duration-500" />
               </button>
          </div>
      </div>
  );
};

export default MangmatCompanyHQ;
