
import React from 'react';
import { ServiceName } from '../types';
import { ChartBarIcon, ArrowTrendingUpIcon, SparklesIcon } from './icons/AllIcons';

interface AnalyticsPreviewWidgetProps {
    onNavigate: (service: ServiceName) => void;
}

const AnalyticsPreviewWidget: React.FC<AnalyticsPreviewWidgetProps> = ({ onNavigate }) => {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-soft border border-slate-200/80">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ChartBarIcon className="h-6 w-6 text-primary"/>
                        Analytics at a Glance
                    </h3>
                    <p className="text-sm text-slate-500 font-hindi">मुख्य एनालिटिक्स</p>
                </div>
                <button onClick={() => onNavigate('Analytics Dashboard')} className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">View Full Dashboard</button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mb-1"><SparklesIcon className="h-4 w-4"/>Most Used Tool</p>
                    <p className="text-lg font-bold text-slate-800">Online Exam</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mb-1"><ArrowTrendingUpIcon className="h-4 w-4"/>Performance Trend</p>
                    <p className="text-lg font-bold text-green-600">+5.2% this month</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPreviewWidget;
