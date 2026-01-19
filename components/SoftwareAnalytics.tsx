

import React from 'react';
import { ChartBarIcon } from './icons/AllIcons';

const featureUsageData = [
    { name: 'AI Chat', usage: 90, color: 'bg-primary' },
    { name: 'Video Generator', usage: 65, color: 'bg-accent' },
    { name: 'CV Generator', usage: 45, color: 'bg-sky-500' },
    { name: 'Progress Reports', usage: 75, color: 'bg-warning' }
];

const userRoleData = [
    { name: 'Students', usage: 85, color: 'bg-success' },
    { name: 'Teachers', usage: 70, color: 'bg-primary' },
    { name: 'Parents', usage: 55, color: 'bg-warning' },
    { name: 'Admins', usage: 95, color: 'bg-danger' }
];

const AnalyticsChart: React.FC<{ title: string, data: { name: string; usage: number; color: string }[] }> = ({ title, data }) => (
    <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-3">{title}</h3>
        <div className="space-y-3">
            {data.map(item => (
                <div key={item.name}>
                    <div className="flex justify-between text-sm mb-1">
                        <span id={`label-${item.name.replace(/\s/g, '')}`} className="font-medium text-neutral-700">{item.name}</span>
                        <span className="text-neutral-500">{item.usage}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2.5">
                        <div
                          className={`${item.color} h-2.5 rounded-full`}
                          style={{ width: `${item.usage}%` }}
                          role="progressbar"
                          aria-valuenow={item.usage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-labelledby={`label-${item.name.replace(/\s/g, '')}`}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SoftwareAnalytics: React.FC = () => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg h-full">
            <div className="flex items-center mb-6">
                <ChartBarIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Software Analytics</h2>
            </div>
            <div className="space-y-8">
                <AnalyticsChart title="AI Feature Usage" data={featureUsageData} />
                <AnalyticsChart title="Activity by User Role" data={userRoleData} />
            </div>
        </div>
    );
};

export default SoftwareAnalytics;