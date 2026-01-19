
import React from 'react';
import { ServiceName } from '../types';
import { ALL_SERVICES } from '../config/servicesConfig';

interface QuickActionsWidgetProps {
    onActionClick: (service: ServiceName) => void;
    serviceNames: ServiceName[];
    title?: string;
    hindiTitle?: string;
}

const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ onActionClick, serviceNames, title = 'Quick Actions', hindiTitle = 'त्वरित कार्रवाई' }) => {
    const servicesToShow = ALL_SERVICES.filter(s => serviceNames.includes(s.name));
    
    if (servicesToShow.length === 0) return null;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-soft">
            <h4 className="text-lg font-bold text-slate-800 mb-4 flex flex-wrap items-baseline gap-2">
                {title} 
                {hindiTitle && <span className="font-hindi text-slate-500 text-sm font-bold bg-slate-100 px-2 py-0.5 rounded-full ml-2">{hindiTitle}</span>}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {servicesToShow.map(service => (
                     <button
                        key={service.name}
                        onClick={() => onActionClick(service.name)}
                        className="group bg-slate-50 p-3 rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-slate-200"
                        aria-label={`Open ${service.name}`}
                     >
                        <div className="mx-auto w-fit bg-primary/10 text-primary rounded-lg p-2.5 transition-colors duration-300 group-hover:bg-primary group-hover:text-white mb-2">
                            {React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: "h-7 w-7" })}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight group-hover:text-primary">{service.name}</h4>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default React.memo(QuickActionsWidget);
