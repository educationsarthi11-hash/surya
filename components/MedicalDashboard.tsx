import React, { Suspense, useMemo } from 'react';
import { UserRole, ServiceName, User } from '../types';
import ServicesPanel from './ServicesPanel';
import { SERVICE_COMPONENTS } from '../config/servicesConfig';
import { ArrowLeftIcon, UsersIcon, DocumentTextIcon, BookOpenIcon } from './icons/AllIcons';
import Loader from './Loader';
import AiGlanceWidget from './AiGlanceWidget';
import QuickActionsWidget from './QuickActionsWidget';
import { useFilteredServices } from '../hooks/useFilteredServices';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-xl shadow-soft flex items-center space-x-4 transition-transform transform hover:-translate-y-1">
        <div className="bg-primary/10 rounded-full p-3 text-primary">{icon}</div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const MedicalWelcomeWidget: React.FC<{ name: string }> = ({ name }) => (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold">Welcome, {name}!</h3>
        <p className="mt-1 opacity-90">Your dedicated portal for advanced medical studies. <br /><span className="font-hindi">उन्नत चिकित्सा अध्ययन के लिए आपका समर्पित पोर्टल।</span></p>
    </div>
);


interface MedicalDashboardProps {
  user: User;
  activeService: ServiceName | 'overview';
  setActiveService: (service: ServiceName | 'overview') => void;
}

const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ user, activeService, setActiveService }) => {
  const medicalServices = useFilteredServices(user.role);

  const quickActionServiceNames: ServiceName[] = useMemo(() => ['AI Medical Guru', 'Online Exam', 'Recruitment Prep Guru', 'CV Generator'], []);

  if (activeService === 'overview') {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-pop-in">
            <div className="lg:col-span-3 space-y-6">
                <AiGlanceWidget user={user} />
                <MedicalWelcomeWidget name={user.name.split(' ')[0]} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard title="Active Students" value="450" icon={<UsersIcon className="h-8 w-8" />} />
                    <StatCard title="Available Courses" value="5" icon={<BookOpenIcon className="h-8 w-8" />} />
                    <StatCard title="NEET Prep Resources" value="200+" icon={<DocumentTextIcon className="h-8 w-8" />} />
                </div>
                <QuickActionsWidget onActionClick={setActiveService} serviceNames={quickActionServiceNames} />
            </div>
            <div className="lg:col-span-2">
                <ServicesPanel services={medicalServices} onServiceSelect={setActiveService} />
            </div>
        </div>
    );
  }

  const ServiceComponent = SERVICE_COMPONENTS[activeService];
  const serviceInfo = medicalServices.find(s => s.name === activeService);
  
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
          aria-label="Back to Dashboard"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Dashboard
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

export default MedicalDashboard;