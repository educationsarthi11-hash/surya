import React from 'react';
import { BuildingOfficeIcon, UsersIcon, AcademicCapIcon, CurrencyRupeeIcon } from './icons/AllIcons';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = React.memo(({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-soft flex items-center space-x-4 transition-transform transform hover:-translate-y-1">
        <div className="bg-primary/10 rounded-full p-3 text-primary">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    </div>
));


const DataOverview: React.FC = () => {
    const stats = [
        { title: 'Total Schools', value: '1', icon: <BuildingOfficeIcon className="h-8 w-8" /> },
        { title: 'Total Students', value: '1,250', icon: <AcademicCapIcon className="h-8 w-8" /> },
        { title: 'Total Staff', value: '85', icon: <UsersIcon className="h-8 w-8" /> },
        { title: 'Annual Revenue', value: '₹1.5 Cr', icon: <CurrencyRupeeIcon className="h-8 w-8" /> }
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Company Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
            </div>
        </div>
    );
};

export default DataOverview;