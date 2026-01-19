
import React, { useState } from 'react';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

interface Event {
    id: string;
    title: string;
    date: string;
    type: 'Exam' | 'Holiday' | 'Event' | 'Deadline';
    color: string;
}

const mockEvents: Event[] = [
    { id: '1', title: 'Mid-Term Exams Start', date: '2024-09-15', type: 'Exam', color: 'bg-red-100 text-red-800 border-red-200' },
    { id: '2', title: 'Gandhi Jayanti', date: '2024-10-02', type: 'Holiday', color: 'bg-green-100 text-green-800 border-green-200' },
    { id: '3', title: 'Science Fair', date: '2024-09-25', type: 'Event', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: '4', title: 'Fee Submission Deadline', date: '2024-09-10', type: 'Deadline', color: 'bg-amber-100 text-amber-800 border-amber-200' },
];

const SmartCalendar: React.FC = () => {
    const toast = useToast();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
        setCurrentDate(newDate);
        setSelectedDate(null);
    };

    const handleAddEvent = () => {
        if (!selectedDate) {
            toast.error("Select a date first.");
            return;
        }
        const title = prompt("Enter Event Title:");
        if (title) {
            const newEvent: Event = {
                id: Date.now().toString(),
                title,
                date: selectedDate,
                type: 'Event',
                color: 'bg-blue-100 text-blue-800 border-blue-200'
            };
            setEvents([...events, newEvent]);
            toast.success("Event added to calendar.");
        }
    };

    const renderCalendarGrid = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50/50 border border-slate-100"></div>);
        }

        // Days
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            const isSelected = selectedDate === dateStr;

            days.push(
                <div 
                    key={d} 
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-24 border p-1 relative cursor-pointer transition-colors overflow-hidden ${isSelected ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-white border-slate-100 hover:bg-slate-50'} ${isToday ? 'bg-orange-50' : ''}`}
                >
                    <span className={`text-xs font-bold p-1 rounded-full w-6 h-6 flex items-center justify-center ${isToday ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>
                        {d}
                    </span>
                    <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-24px)] no-scrollbar">
                        {dayEvents.map(ev => (
                            <div key={ev.id} className={`text-[10px] px-1.5 py-0.5 rounded border truncate ${ev.color}`} title={ev.title}>
                                {ev.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="h-8 w-8 text-primary" />
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">Smart Campus Calendar</h2>
                        <p className="text-sm text-neutral-500 font-hindi">अकादमिक कैलेंडर और इवेंट्स</p>
                    </div>
                </div>
                <button 
                    onClick={handleAddEvent}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark shadow-md transition-transform hover:scale-105"
                >
                    <PlusIcon className="h-5 w-5" /> Add Event
                </button>
            </div>

            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-lg border">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-full shadow-sm"><ChevronLeftIcon className="h-5 w-5 text-slate-600"/></button>
                <h3 className="text-xl font-bold text-slate-800">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-full shadow-sm"><ChevronRightIcon className="h-5 w-5 text-slate-600"/></button>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 border rounded-xl overflow-hidden shadow-inner">
                <div className="grid grid-cols-7 bg-slate-100 border-b">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 h-full bg-slate-200 gap-px">
                    {renderCalendarGrid()}
                </div>
            </div>

            {/* Upcoming List */}
            <div className="mt-6">
                <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-green-600"/> Upcoming Events</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {events.sort((a,b) => a.date.localeCompare(b.date)).slice(0, 4).map(ev => (
                        <div key={ev.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white shadow-sm">
                            <div className={`w-1 h-full rounded-full ${ev.color.split(' ')[0].replace('bg-', 'bg-')}`}></div>
                            <div>
                                <p className="font-bold text-sm truncate">{ev.title}</p>
                                <p className="text-xs text-slate-500">{ev.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SmartCalendar;
