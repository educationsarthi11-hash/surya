
import React, { Suspense, useMemo } from 'react';
import { UserRole, ServiceName, User } from '../types';
import ServicesPanel from './ServicesPanel';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import { ArrowLeftIcon, UsersIcon, BriefcaseIcon, DocumentTextIcon, CalculatorIcon, TableCellsIcon, BanknotesIcon } from './icons/AllIcons';
import Loader from './Loader';
import AiGlanceWidget from './AiGlanceWidget';
import QuickActionsWidget from './QuickActionsWidget';
import { useFilteredServices } from '../hooks/useFilteredServices';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-soft flex items-center space-x-4 transition-transform transform hover:-translate-y-1 border border-slate-100">
        <div className="bg-blue-50 rounded-full p-3 text-blue-600">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

interface ComputerCenterDashboardProps {
  user: User;
  activeService: ServiceName | 'overview';
  setActiveService: (service: ServiceName | 'overview') => void;
}

const ComputerCenterDashboard: React.FC<ComputerCenterDashboardProps> = ({ user, activeService, setActiveService }) => {
  const computerCenterServices = useFilteredServices(user.role);

  const quickActionServiceNames: ServiceName[] = useMemo(() => ['AI Code Lab', 'Skill Marketplace', 'Placement Forum', 'CV Generator'], []);

  if (activeService === 'overview') {
    return (
      <div className="space-y-8 animate-pop-in">
        {/* Computer Lab Header */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit.png')] opacity-10"></div>
             <div className="relative z-10 flex items-center gap-4">
                 <div className="p-4 bg-blue-600 rounded-2xl shadow-lg"><CalculatorIcon className="h-10 w-10 text-white"/></div>
                 <div>
                     <h2 className="text-3xl font-black uppercase tracking-tighter">Digital Skills Lab</h2>
                     <p className="text-blue-200 font-hindi text-lg">एक्सेल, टैली और कोडिंग ट्रेनिंग सेंटर</p>
                 </div>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
                <AiGlanceWidget user={user} />
                
                {/* Practical Labs Section */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="h-5 w-5 text-green-600"/> Practical Labs (प्रैक्टिकल लैब)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            onClick={() => setActiveService('AI Business Manager')} // Reusing Business Manager as Tally Simulator
                            className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl text-left hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <BanknotesIcon className="h-8 w-8 text-yellow-600"/>
                                <span className="font-black text-slate-800 text-lg">Tally / Accounting</span>
                            </div>
                            <p className="text-xs text-slate-600 font-hindi group-hover:text-slate-900">
                                असली बिल और वाउचर बनाना सीखें। AI मुनीम जी के साथ प्रैक्टिस करें।
                            </p>
                        </button>

                        <button 
                             onClick={() => setActiveService('Profit Calculator')} // Reusing Calculator logic for Excel feel
                             className="p-4 bg-green-50 border border-green-200 rounded-2xl text-left hover:shadow-md transition-all group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <TableCellsIcon className="h-8 w-8 text-green-600"/>
                                <span className="font-black text-slate-800 text-lg">Excel / Data</span>
                            </div>
                            <p className="text-xs text-slate-600 font-hindi group-hover:text-slate-900">
                                डेटा एंट्री, फॉर्मूला और चार्ट बनाना सीखें।
                            </p>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard title="Enrolled Students" value="120" icon={<UsersIcon className="h-6 w-6" />} />
                    <StatCard title="Courses Active" value="8" icon={<DocumentTextIcon className="h-6 w-6" />} />
                    <StatCard title="Placements" value="25" icon={<BriefcaseIcon className="h-6 w-6" />} />
                </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
                <QuickActionsWidget onActionClick={setActiveService} serviceNames={quickActionServiceNames} title="Advanced Tools" />
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-4">All Modules</h4>
                     <ServicesPanel services={computerCenterServices} onServiceSelect={setActiveService} gridClassName="grid grid-cols-2 gap-4"/>
                </div>
            </div>
        </div>
      </div>
    );
  }

  const ServiceComponent = SERVICE_COMPONENTS[activeService];
  const serviceInfo = computerCenterServices.find(s => s.name === activeService);
  
  return (
    <div className="animate-pop-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-50 rounded-xl px-2">
        {serviceInfo && (
            <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{serviceInfo.name}</h2>
                <p className="text-sm text-slate-500 font-hindi font-bold">{serviceInfo.hindiDescription || "Training Module Active"}</p>
            </div>
        )}
        <button 
          onClick={() => setActiveService('overview')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-100 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Lab
        </button>
      </div>
      
      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 min-h-[600px] overflow-hidden">
          {ServiceComponent && (
              <Suspense fallback={<div className="flex justify-center items-center h-full min-h-[300px]"><Loader message="Loading tool..." /></div>}>
                  <ServiceComponent user={user} setActiveService={setActiveService} />
              </Suspense>
          )}
      </div>
    </div>
  );
};

export default ComputerCenterDashboard;
