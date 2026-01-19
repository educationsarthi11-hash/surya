
import React, { useState, useEffect } from 'react';
import { User, ServiceName, HomeworkAssignment } from '../../types';
import { homeworkService } from '../../services/homeworkService';
import { CalendarDaysIcon, PencilSquareIcon, ArrowRightIcon } from '../icons/AllIcons';

interface TodaysAgendaWidgetProps {
    user: User;
    onNavigate: (service: ServiceName) => void;
}

const TodaysAgendaWidget: React.FC<TodaysAgendaWidgetProps> = ({ user, onNavigate }) => {
    const [todaysHomework, setTodaysHomework] = useState<HomeworkAssignment[]>([]);

    useEffect(() => {
        const allAssignments = homeworkService.getAssignmentsForStudent(user.id);
        const today = new Date().toISOString().split('T')[0];
        
        // Let's find homework due *soon* instead of just today to make the demo more robust.
        const soonAssignments = allAssignments
            .filter(({ assignment, submission }) => {
                if (submission) return false; // Filter out submitted homework
                const dueDate = new Date(assignment.dueDate);
                const now = new Date();
                now.setHours(0,0,0,0);
                const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return diffDays >= 0 && diffDays <= 2; // Due today, tomorrow, or the day after
            })
            .map(item => item.assignment)
            .slice(0, 2); // Show max 2
            
        setTodaysHomework(soonAssignments);
    }, [user.id]);

    const upcomingExams = [
        { subject: 'Science', date: 'In 3 Days', topic: 'Chapter 5 Test' },
        { subject: 'Mathematics', date: 'In 5 Days', topic: 'Final Term Exam' }
    ];

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-soft">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <CalendarDaysIcon className="h-6 w-6 text-primary"/>
                Today's Agenda (आज का एजेंडा)
            </h3>

            <div className="space-y-4">
                {todaysHomework.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm text-slate-600 mb-2">Homework Due Soon</h4>
                        <div className="space-y-3">
                            {todaysHomework.map(hw => (
                                <div key={hw.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{hw.title}</p>
                                        <p className="text-xs text-slate-500">{hw.subject} - Due: {new Date(hw.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={() => onNavigate('AI Homework Hub')} className="text-primary hover:underline text-xs font-semibold flex items-center">
                                        View <ArrowRightIcon className="h-4 w-4 ml-1"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {upcomingExams.length > 0 && (
                     <div>
                        <h4 className="font-semibold text-sm text-slate-600 mb-2">Upcoming Exams</h4>
                         <div className="space-y-3">
                            {upcomingExams.map(exam => (
                                <div key={exam.subject} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{exam.subject}: {exam.topic}</p>
                                        <p className="text-xs text-slate-500">Scheduled: {exam.date}</p>
                                    </div>
                                    <button onClick={() => onNavigate('Online Exam')} className="text-primary hover:underline text-xs font-semibold flex items-center">
                                        Prepare <ArrowRightIcon className="h-4 w-4 ml-1"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(todaysHomework.length === 0 && upcomingExams.length === 0) && (
                     <p className="text-sm text-center text-slate-500 py-4">No deadlines or exams coming up. Great job staying on top of your work!</p>
                )}
            </div>
        </div>
    );
};

export default TodaysAgendaWidget;
