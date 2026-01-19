import React, { useState, useEffect } from 'react';
import { AttendanceRecord } from '../types';
import { attendanceService } from '../services/attendanceService';
import { UsersIcon } from './icons/AllIcons';

const AttendanceLog: React.FC = () => {
    const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
    const totalStudents = attendanceService.getTotalStudentCount();

    useEffect(() => {
        const updateList = () => setAttendanceList(attendanceService.getAttendanceList());
        updateList(); // Initial fetch
        const unsubscribe = attendanceService.subscribe(updateList);
        return () => unsubscribe();
    }, []);

    const attendancePercentage = totalStudents > 0 ? ((attendanceList.length / totalStudents) * 100).toFixed(1) : 0;

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-primary" />
                    <h2 className="ml-3 text-2xl font-bold text-neutral-900">Today's Attendance Log</h2>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-neutral-800">{attendanceList.length} / {totalStudents}</p>
                    <p className="text-sm text-neutral-500">{attendancePercentage}% Present</p>
                </div>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {attendanceList.length > 0 ? (
                    attendanceList.map((record) => (
                        <div key={record.studentId} className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <img src={record.imageSrc} alt={record.name} className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"/>
                            <div className="flex-grow">
                                <p className="font-bold text-neutral-800">{record.name}</p>
                                <p className="text-sm text-neutral-600 font-mono">{record.studentId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-green-700">Present</p>
                                <p className="text-xs text-neutral-500">{record.time}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-neutral-500 py-16">
                        <p>No students have been marked present yet today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceLog;
