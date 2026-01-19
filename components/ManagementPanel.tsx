
import React from 'react';
import { ServiceName } from '../types';
import { ALL_SERVICES } from '../config/servicesConfig';
import { ArrowRightIcon, AcademicCapIcon } from './icons/AllIcons';
import { useLanguage } from '../contexts/LanguageContext';

const OverviewCard: React.FC<{ serviceName: ServiceName; onClick: () => void; }> = ({ serviceName, onClick }) => {
    const { t } = useLanguage();
    const service = ALL_SERVICES.find(s => s.name === serviceName);
    if (!service) return null;

    return (
        <div className="bg-white p-4 rounded-xl shadow-soft flex flex-col h-full hover:shadow-lifted hover:-translate-y-1 transition-all border border-slate-100">
            <div className="flex items-center mb-2">
                <div className="text-primary bg-primary/10 p-2 rounded-lg">{service.icon}</div>
                <h4 className="ml-3 text-md font-bold text-neutral-800">{t(service.name, service.name)}</h4>
            </div>
            <p className="text-sm text-neutral-500 flex-grow leading-relaxed">{t(service.description, service.description)}</p>
            <button
                onClick={onClick}
                className="w-full mt-4 text-sm font-semibold text-primary hover:text-primary-dark flex items-center justify-center p-2.5 bg-primary/10 rounded-xl transition-colors"
            >
                {t('Go to Tool', 'प्रवेश करें')} <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
        </div>
    );
};

interface ManagementPanelProps {
    config: {
        panelTitle: string;
        sections: {
            title: string;
            services: ServiceName[];
        }[];
    };
    handleServiceSelect: (serviceName: ServiceName) => void;
}

const ManagementPanel: React.FC<ManagementPanelProps> = ({ config, handleServiceSelect }) => {
    const { t } = useLanguage();
    return (
        <div className="space-y-10 animate-pop-in">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="bg-slate-900 p-3 rounded-2xl text-primary shadow-lg"><AcademicCapIcon className="h-8 w-8" /></div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{t(config.panelTitle, config.panelTitle)}</h3>
            </div>
            <div className="grid grid-cols-1 gap-12">
                {config.sections.map(section => (
                    <div key={section.title}>
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                            <div className="h-1 w-8 bg-primary rounded-full"></div>
                            {t(section.title, section.title)}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {section.services.map(serviceName => (
                                <OverviewCard
                                    key={serviceName}
                                    serviceName={serviceName}
                                    onClick={() => handleServiceSelect(serviceName)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManagementPanel;
