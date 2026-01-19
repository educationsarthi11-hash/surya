
import React, { Suspense, useMemo } from 'react';
import { UserRole, ServiceName, User } from '../types';
import ServicesPanel from './ServicesPanel';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import { ArrowLeftIcon, GlobeAltIcon, UsersIcon, BuildingLibraryIcon, DocumentTextIcon, ChartBarIcon, SparklesIcon, BuildingOfficeIcon, BanknotesIcon } from './icons/AllIcons';
import Loader from './Loader';
import AiGlanceWidget from './AiGlanceWidget';
import QuickActionsWidget from './QuickActionsWidget';
import { useFilteredServices } from '../hooks/useFilteredServices';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-white p-5 rounded-xl shadow-soft flex items-center space-x-4 transition-transform transform hover:-translate-y-1 border-l-4 ${color}`}>
        <div className={`rounded-full p-3 ${color.replace('border-', 'text-').replace('500', '600')} bg-opacity-10 bg-slate-100`}>{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

interface UniversityDashboardProps {
  user: User;
  activeService: ServiceName | 'overview';
  setActiveService: (service: ServiceName | 'overview') => void;
}

const UniversityDashboard: React.FC<UniversityDashboardProps> = ({ user, activeService, setActiveService }) => {
  const universityServices = useFilteredServices(user.role);

  // Specialized quick actions for University Admin (Vice Chancellor/Registrar)
  // These should map to existing services but logically grouped for a VC
  const quickActionServiceNames: ServiceName[] = useMemo(() => [
      'Analytics Dashboard', // For oversight of all colleges
      'Franchise Support',   // Managing affiliated colleges tickets/issues
      'Placement Reporting', // Central placement cell stats
      'Access Control Center' // Managing Deans/HODs
  ], []);

  if (activeService === 'overview') {
    return (
        <div className="space-y-8 animate-pop-in">
            {/* University Specific Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-white/10 p-2 rounded-lg"><GlobeAltIcon className="h-8 w-8 text-blue-300"/></div>
                            <h2 className="text-4xl font-black tracking-tight">University HQ</h2>
                        </div>
                        <p className="text-blue-200 font-hindi text-xl">विश्वविद्यालय प्रबंधन और अनुसंधान पोर्टल</p>
                        <div className="flex items-center gap-2 mt-2">
                             <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Vice-Chancellor Console</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                         <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold flex items-center gap-2 backdrop-blur-md transition-all border border-white/5">
                            <BuildingOfficeIcon className="h-5 w-5 text-yellow-400"/> Affiliation Requests <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 shadow-sm">3</span>
                         </button>
                         <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/50 transition-all transform hover:-translate-y-0.5">
                            <SparklesIcon className="h-5 w-5"/> AI Research Insights
                         </button>
                    </div>
                </div>
            </div>

            {/* High Level Stats (VC Perspective) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Enrollment" value="42,500+" icon={<UsersIcon className="h-8 w-8" />} color="border-blue-500" />
                <StatCard title="Affiliated Colleges" value="38" icon={<BuildingLibraryIcon className="h-8 w-8" />} color="border-purple-500" />
                <StatCard title="Research Papers" value="1,850" icon={<DocumentTextIcon className="h-8 w-8" />} color="border-green-500" />
                <StatCard title="Research Grants" value="₹12.4 Cr" icon={<BanknotesIcon className="h-8 w-8" />} color="border-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <AiGlanceWidget user={user} />
                    
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">University Administration Modules</h3>
                        <ServicesPanel 
                            services={universityServices} 
                            onServiceSelect={setActiveService} 
                            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        />
                    </div>
                </div>
                
                <div className="space-y-6">
                    <QuickActionsWidget 
                        title="VC Toolkit" 
                        hindiTitle="कुलपति उपकरण"
                        onActionClick={setActiveService} 
                        serviceNames={quickActionServiceNames} 
                    />
                    
                    {/* Affiliation Monitor Widget */}
                    <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <BuildingLibraryIcon className="h-5 w-5 text-purple-600"/> College Affiliations
                        </h4>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                                <div>
                                    <p className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">Sunrise Institute of Tech</p>
                                    <p className="text-xs text-slate-500">Applied: 2 days ago</p>
                                </div>
                                <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">Pending Review</span>
                            </div>
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                                <div>
                                    <p className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">City Law College</p>
                                    <p className="text-xs text-slate-500">Applied: 5 days ago</p>
                                </div>
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">Inspection Scheduled</span>
                            </div>
                             <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                                <div>
                                    <p className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">Global Management Inst.</p>
                                    <p className="text-xs text-slate-500">Renewed: Yesterday</p>
                                </div>
                                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">Active</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                            View All Affiliates
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  const ServiceComponent = SERVICE_COMPONENTS[activeService];
  const serviceInfo = universityServices.find(s => s.name === activeService);
  
  return (
    <div className="animate-pop-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        {serviceInfo && (
            <div>
                <h2 className="text-2xl font-bold text-slate-900">{serviceInfo.name}</h2>
                <p className="text-md text-slate-500 font-hindi">{serviceInfo.hindiDescription}</p>
            </div>
        )}
        <button 
          onClick={() => setActiveService('overview')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-100 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Admin Panel
        </button>
      </div>
      
      {ServiceComponent && (
          <Suspense fallback={<div className="flex justify-center items-center h-full min-h-[300px]"><Loader message="Loading tool..." /></div>}>
              <ServiceComponent user={user} setActiveService={setActiveService} />
          </Suspense>
      )}
    </div>
  );
};

export default UniversityDashboard;
