
import React, { useState, useMemo } from 'react';
import { Service, ServiceName, ServiceCategory } from '../types';
import {
    Squares2X2Icon,
    MagnifyingGlassIcon,
    XIcon,
    BoltIcon
} from './icons/AllIcons';
import { useLanguage } from '../contexts/LanguageContext';

interface ServicesPanelProps {
    services: Service[];
    onServiceSelect: (serviceName: ServiceName) => void;
    gridClassName?: string;
}

const getCategoryColor = (category: ServiceCategory) => {
    switch (category) {
        case ServiceCategory.LEARN_PRACTICE: return 'blue';
        case ServiceCategory.CAREER_DEVELOPMENT: return 'purple';
        case ServiceCategory.CREATIVE_STUDIO: return 'pink';
        case ServiceCategory.ADMINISTRATION: return 'slate';
        case ServiceCategory.CAMPUS_LIFE: return 'orange';
        case ServiceCategory.HEALTH_WELLNESS: return 'green';
        case ServiceCategory.GROWTH_EXPANSION: return 'indigo';
        default: return 'primary';
    }
};

const ServiceCard: React.FC<{ service: Service, onSelect: () => void }> = React.memo(({ service, onSelect }) => {
    const { language } = useLanguage();
    const isHindi = language === 'hi';
    const description = isHindi && service.hindiDescription ? service.hindiDescription : service.description;
    const category = service.category || ServiceCategory.ADMINISTRATION;
    const color = getCategoryColor(category);

    const iconBgClasses: {[key: string]: string} = {
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
        purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600',
        pink: 'bg-pink-50 text-pink-600 group-hover:bg-pink-600',
        slate: 'bg-slate-100 text-slate-600 group-hover:bg-slate-800',
        orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600',
        green: 'bg-green-50 text-green-600 group-hover:bg-green-600',
        indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600',
        primary: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600',
    };

    return (
        <button 
            onClick={onSelect}
            className={`group relative w-full text-left bg-white p-4 rounded-3xl shadow-sm hover:shadow-2xl border-2 border-slate-50 hover:border-primary/20 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1`}
        >
            <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl mb-4 transition-all duration-300 ${iconBgClasses[color]} group-hover:text-white shadow-sm`}>
                {React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6" })}
            </div>
            <h4 className={`text-base font-black text-slate-800 mb-2 leading-tight ${isHindi ? 'font-hindi' : ''} line-clamp-2 group-hover:text-primary transition-colors`}>
                {service.name}
            </h4>
            <p className={`text-xs text-slate-500 font-bold leading-relaxed line-clamp-3 ${isHindi ? 'font-hindi' : ''}`}>
                {description}
            </p>
        </button>
    );
});

const ServicesPanel: React.FC<ServicesPanelProps> = ({ services, onServiceSelect, gridClassName }) => {
    const { t } = useLanguage(); 
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredServices = useMemo(() => {
        if (!searchQuery.trim()) return services;
        const lowerQuery = searchQuery.toLowerCase();
        return services.filter(service => 
            service.name.toLowerCase().includes(lowerQuery) ||
            service.description.toLowerCase().includes(lowerQuery) ||
            (service.hindiDescription && service.hindiDescription.toLowerCase().includes(lowerQuery))
        );
    }, [services, searchQuery]);
    
    const groupedServices = useMemo(() => {
        return filteredServices.reduce((acc, service) => {
            const category = service.category || ServiceCategory.ADMINISTRATION;
            if (!acc[category]) acc[category] = [];
            acc[category].push(service);
            return acc;
        }, {} as Record<ServiceCategory, Service[]>);
    }, [filteredServices]);

    return (
        <div className="h-full w-full">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg">
                        <BoltIcon className="h-6 w-6 text-yellow-400 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">AI System Active</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{filteredServices.length} Advanced Modules Loaded</p>
                    </div>
                </div>
                
                <div className="relative w-full sm:w-80 group">
                    <input
                        type="text"
                        className="block w-full pl-12 pr-10 py-4 border-2 border-slate-200 rounded-2xl bg-white focus:ring-0 focus:border-primary text-sm font-bold transition-all shadow-sm outline-none"
                        placeholder={t("Search AI tools...", "टूल्स खोजें...")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-4 text-slate-400 hover:text-red-500"><XIcon className="h-5 w-5" /></button>}
                </div>
            </div>
            
            <div className="space-y-12 pb-20">
                {Object.values(ServiceCategory).map(category => {
                    const categoryServices = groupedServices[category];
                    if (!categoryServices || categoryServices.length === 0) return null;
                    return (
                        <div key={category} className="animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-6 ml-2">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">{category}</h3>
                            </div>
                            <div className={gridClassName || "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"}>
                                {categoryServices.map(service => (
                                    <ServiceCard key={service.name} service={service} onSelect={() => onServiceSelect(service.name)} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ServicesPanel;
