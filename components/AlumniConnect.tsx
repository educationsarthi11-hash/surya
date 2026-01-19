


import React, { useState } from 'react';
import { User } from '../types';
import { UsersIcon, BriefcaseIcon, CalendarDaysIcon, ChatBubbleIcon, StarIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

interface Alumni {
    id: string;
    name: string;
    role: string;
    company: string;
    batch: string;
    image: string;
}

const mockAlumni: Alumni[] = [
    { id: '1', name: 'Vikram Singh', role: 'Senior Engineer', company: 'Google', batch: '2018', image: 'https://i.pravatar.cc/150?u=vikram' },
    { id: '2', name: 'Aditi Sharma', role: 'Product Manager', company: 'Microsoft', batch: '2019', image: 'https://i.pravatar.cc/150?u=aditi' },
    { id: '3', name: 'Rahul Verma', role: 'Founder', company: 'EdTech Startup', batch: '2017', image: 'https://i.pravatar.cc/150?u=rahul' },
];

const AlumniConnect: React.FC<{ user: User }> = ({ user }) => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'network' | 'stories' | 'events'>('network');

    const handleConnect = (alumni: Alumni) => {
        toast.success(`Request sent to connect with ${alumni.name}!`);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft min-h-[600px]">
            <div className="flex items-center mb-6">
                <UsersIcon className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Alumni Connect</h2>
            </div>
            
            <div className="border-b mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('network')} className={`py-3 border-b-2 font-medium ${activeTab === 'network' ? 'border-primary text-primary' : 'border-transparent text-neutral-500'}`}>Find Mentors</button>
                    <button onClick={() => setActiveTab('stories')} className={`py-3 border-b-2 font-medium ${activeTab === 'stories' ? 'border-primary text-primary' : 'border-transparent text-neutral-500'}`}>Success Stories</button>
                    <button onClick={() => setActiveTab('events')} className={`py-3 border-b-2 font-medium ${activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-neutral-500'}`}>Events</button>
                </nav>
            </div>

            {activeTab === 'network' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockAlumni.map(alum => (
                        <div key={alum.id} className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center hover:shadow-lg transition-all">
                            <img src={alum.image} alt={alum.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-sm" />
                            <h3 className="text-lg font-bold text-slate-800">{alum.name}</h3>
                            <p className="text-sm text-primary font-medium">{alum.role} @ {alum.company}</p>
                            <p className="text-xs text-slate-500 mt-1">Class of {alum.batch}</p>
                            <button 
                                onClick={() => handleConnect(alum)}
                                className="mt-4 w-full py-2 bg-white border border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
                            >
                                Connect
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'stories' && (
                <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg">
                        <div className="flex items-start gap-4">
                            <StarIcon className="h-12 w-12 text-yellow-300 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold">From Classroom to CEO</h3>
                                <p className="mt-2 opacity-90">"Education Sarthi gave me the foundation I needed to build my own company. The mentors here are world-class."</p>
                                <p className="mt-4 font-bold text-sm">- Rahul Verma, Batch 2017</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'events' && (
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                <CalendarDaysIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Annual Alumni Meet 2024</h4>
                                <p className="text-sm text-slate-500">Dec 15 • Main Campus Auditorium</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">Register</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlumniConnect;