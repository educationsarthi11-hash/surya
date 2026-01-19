
import React from 'react';
import { ServiceName } from '../../types';
import { ALL_SERVICES } from '../../config/servicesConfig';
import { ArrowRightIcon } from '../icons/AllIcons';

interface JumpBackInWidgetProps {
    onNavigate: (service: ServiceName) => void;
}

const mockRecentActivities: { serviceName: ServiceName; lastUsed: string; progress: number }[] = [
    { serviceName: 'Online Exam', lastUsed: 'Yesterday', progress: 50 },
    { serviceName: 'AI Video Generator', lastUsed: '3 days ago', progress: 100 },
    { serviceName: 'Smart Library', lastUsed: '5 days ago', progress: 20 },
];

const JumpBackInWidget: React.FC<JumpBackInWidgetProps> = ({ onNavigate }) => {
    const recentServices = mockRecentActivities.map(activity => {
        const serviceInfo = ALL_SERVICES.find(s => s.name === activity.serviceName);
        return { ...activity, ...serviceInfo };
    }).filter(item => item.name); // Filter out any services that might not be found

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-soft">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Jump Back In (वहीं से शुरू करें)</h3>
            <div className="space-y-3">
                {recentServices.map((service) => (
                    <button 
                        key={service.serviceName}
                        onClick={() => onNavigate(service.serviceName)}
                        className="w-full text-left p-3 bg-slate-50 border border-slate-200 rounded-lg group hover:bg-primary/10 hover:border-primary/50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 text-primary p-2 rounded-md">
                                {service.icon ? React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6" }) : null}
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-sm text-slate-800">{service.name}</p>
                                <p className="text-xs text-slate-500">Last used: {service.lastUsed}</p>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${service.progress}%` }}></div>
                                </div>
                            </div>
                             <ArrowRightIcon className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default JumpBackInWidget;
