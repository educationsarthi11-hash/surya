
import React from 'react';
import { ServiceName } from '../types';
import { UsersIcon, KeyIcon, ArrowRightIcon, CurrencyRupeeIcon } from './icons/AllIcons';

const OverviewCard: React.FC<{ title: ServiceName; description: string; icon: React.ReactNode; onClick: () => void; }> = ({ title, description, icon, onClick }) => (
    <div className="bg-white p-5 rounded-xl shadow-soft flex flex-col h-full hover:shadow-lifted hover:-translate-y-1 transition-all">
        <div className="flex items-center mb-2">
            <div className="text-primary bg-primary/10 p-2 rounded-lg">{icon}</div>
            <h4 className="ml-3 text-lg font-bold text-neutral-800">{title}</h4>
        </div>
        <p className="text-sm text-neutral-500 flex-grow">{description}</p>
        <button
            onClick={onClick}
            className="w-full mt-auto text-sm font-semibold text-primary hover:text-primary-dark flex items-center justify-center p-2 bg-primary/10 rounded-md transition-colors"
        >
            Go to Tool <ArrowRightIcon className="h-4 w-4 ml-1" />
        </button>
    </div>
);

interface FranchiseManagementPanelProps {
  handleServiceSelect: (serviceName: ServiceName) => void;
}

const FranchiseManagementPanel: React.FC<FranchiseManagementPanelProps> = ({ handleServiceSelect }) => {
  return (
    <section>
        <div className="flex items-center mb-4">
            <div className="bg-neutral-100 p-2 rounded-lg"><KeyIcon className="h-6 w-6 text-primary" /></div>
            <h3 className="ml-3 text-xl font-bold text-neutral-800">Franchise Operations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <OverviewCard
                title="Access Control Center"
                description="Create and manage login credentials for new and existing franchises (Schools, Colleges, etc.). To create a new franchise, add a user with the 'Admin' role."
                icon={<UsersIcon className="h-6 w-6" />}
                onClick={() => handleServiceSelect('Access Control Center')}
            />
             <OverviewCard
                title="Franchise Plans"
                description="View and manage pricing tiers and features for different franchise types."
                icon={<CurrencyRupeeIcon className="h-6 w-6" />}
                onClick={() => handleServiceSelect('Franchise Plans')}
            />
        </div>
    </section>
  );
};

export default FranchiseManagementPanel;
