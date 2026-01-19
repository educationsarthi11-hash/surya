
import React, { useState } from 'react';
import { NoticeItem, UserRole } from '../types';
import { BellIcon, CalendarDaysIcon, MegaphoneIcon, ExclamationTriangleIcon, PlusIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

// Mock Data
const initialNotices: NoticeItem[] = [
    {
        id: 'n1',
        title: 'School Closed Tomorrow',
        date: new Date().toISOString().split('T')[0],
        type: 'Urgent',
        content: 'Due to heavy rainfall alert, the school will remain closed tomorrow. Online classes will follow the regular schedule.',
        postedBy: 'Principal'
    },
    {
        id: 'n2',
        title: 'Annual Sports Day Registration',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        type: 'Event',
        content: 'Registration for Sports Day is now open. Please visit the Sports Hub to register your name.',
        postedBy: 'Sports Dept'
    },
    {
        id: 'n3',
        title: 'Fee Payment Deadline Extended',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        type: 'General',
        content: 'The last date for quarterly fee submission has been extended by 5 days.',
        postedBy: 'Accounts'
    }
];

const DigitalNoticeBoard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newType, setNewType] = useState<'Urgent' | 'Event' | 'General'>('General');
    const toast = useToast();

    const canAdd = [UserRole.Admin, UserRole.Teacher, UserRole.College, UserRole.School].includes(userRole);

    const handleAddNotice = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !newContent) return;

        const notice: NoticeItem = {
            id: `n-${Date.now()}`,
            title: newTitle,
            content: newContent,
            type: newType,
            date: new Date().toISOString().split('T')[0],
            postedBy: 'Admin'
        };

        setNotices([notice, ...notices]);
        toast.success("Notice posted successfully!");
        setIsAdding(false);
        setNewTitle('');
        setNewContent('');
    };

    const getIcon = (type: string) => {
        switch(type) {
            case 'Urgent': return <ExclamationTriangleIcon className="h-5 w-5 text-white"/>;
            case 'Event': return <CalendarDaysIcon className="h-5 w-5 text-white"/>;
            default: return <MegaphoneIcon className="h-5 w-5 text-white"/>;
        }
    };

    const getColor = (type: string) => {
        switch(type) {
            case 'Urgent': return 'bg-red-500 border-red-200 shadow-red-100';
            case 'Event': return 'bg-purple-500 border-purple-200 shadow-purple-100';
            default: return 'bg-blue-500 border-blue-200 shadow-blue-100';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-slate-100 h-full flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <BellIcon className="h-5 w-5 text-yellow-400 animate-pulse-slow"/>
                    <h3 className="font-bold text-lg">Digital Notice Board</h3>
                </div>
                {canAdd && (
                    <button 
                        onClick={() => setIsAdding(!isAdding)} 
                        className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors"
                        title="Add Notice"
                    >
                        <PlusIcon className="h-5 w-5"/>
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="p-4 bg-slate-50 border-b border-slate-200 animate-fade-in-up">
                    <form onSubmit={handleAddNotice} className="space-y-3">
                        <input 
                            type="text" 
                            placeholder="Notice Title" 
                            className="w-full p-2 border rounded-lg text-sm"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            required
                        />
                        <textarea 
                            placeholder="Details..." 
                            className="w-full p-2 border rounded-lg text-sm" 
                            rows={2}
                            value={newContent}
                            onChange={e => setNewContent(e.target.value)}
                            required
                        />
                        <div className="flex justify-between items-center">
                            <select 
                                value={newType} 
                                onChange={e => setNewType(e.target.value as any)}
                                className="p-1.5 border rounded-lg text-sm bg-white"
                            >
                                <option value="General">General</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Event">Event</option>
                            </select>
                            <button type="submit" className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800">
                                Post
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px] custom-scrollbar bg-slate-50/50">
                {notices.map(notice => (
                    <div key={notice.id} className="relative bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className={`absolute left-0 top-4 w-1 h-8 rounded-r-full ${notice.type === 'Urgent' ? 'bg-red-500' : notice.type === 'Event' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                        <div className="flex justify-between items-start mb-2 pl-2">
                            <div className="flex items-center gap-2">
                                <span className={`p-1.5 rounded-md ${getColor(notice.type)}`}>
                                    {getIcon(notice.type)}
                                </span>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{notice.title}</h4>
                                    <span className="text-[10px] text-slate-400">{notice.postedBy} • {notice.date}</span>
                                </div>
                            </div>
                            {notice.type === 'Urgent' && <span className="text-[9px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse">Urgent</span>}
                        </div>
                        <p className="text-xs text-slate-600 pl-2 leading-relaxed">{notice.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DigitalNoticeBoard;
