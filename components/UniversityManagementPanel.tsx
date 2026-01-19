
import React from 'react';
import { ServiceName } from '../types';
import ManagementPanel from './ManagementPanel';
import AffiliationWidget from './frachise_dashboard/AffiliationWidget';
import { GlobeAltIcon, SparklesIcon } from './icons/AllIcons';

interface Props {
  setActiveService: (service: ServiceName | 'overview') => void;
}

const UniversityManagementPanel: React.FC<Props> = ({ setActiveService }) => {
  const config = {
    panelTitle: "University HQ Console",
    sections: [
      {
        title: "PhD & PG Programs (शोध और पोस्ट-ग्रेजुएशन)",
        services: ['AI Study Guru', 'Online Exam', 'AI Certificate Generator', 'Digital Locker', 'Smart Library'] as ServiceName[]
      },
      {
        title: "Growth & Affiliations (संबद्धता और विस्तार)",
        services: ['Franchise Configurator', 'Franchise Support', 'Franchise Plans', 'World Expansion Planner', 'Analytics Dashboard'] as ServiceName[]
      },
      {
        title: "Campus Hub (कैंपस प्रशासन)",
        services: ['Placement Reporting', 'Grievance Portal', 'Alumni Donation', 'Access Control Center', 'Campus Radio'] as ServiceName[]
      }
    ]
  };

  return (
    <div className="space-y-12 animate-pop-in">
        <div className="bg-indigo-900 p-8 rounded-[3rem] text-white flex justify-between items-center relative overflow-hidden shadow-2xl border-4 border-indigo-500/30">
            <div className="absolute top-0 right-0 p-20 bg-primary/20 rounded-full blur-[80px]"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <GlobeAltIcon className="h-10 w-10 text-primary"/>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic">Research Center</h3>
                </div>
                <p className="text-indigo-200 font-hindi text-lg">Ph.D. थीसिस ट्रैकिंग और रीयल-टाइम डेटा विश्लेषण डेस्क</p>
            </div>
            <button className="relative z-10 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <SparklesIcon className="h-4 w-4"/> AI Insights
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
                <ManagementPanel config={config} handleServiceSelect={setActiveService} />
            </div>
            <div className="lg:col-span-4">
                <AffiliationWidget />
                
                <div className="mt-8 bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl border-4 border-slate-800">
                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">VC Briefing</h4>
                    <p className="text-sm font-hindi text-slate-400 leading-relaxed italic">
                        "अगले महीने होने वाले रिसर्च सेमिनार के लिए 12 नए कॉलेजों ने आवेदन किया है। AI ने 8 पोर्टफोलियो वेरिफाई कर लिए हैं।"
                    </p>
                    <button className="mt-6 w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-slate-950 transition-all">Download VC Report</button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default UniversityManagementPanel;
