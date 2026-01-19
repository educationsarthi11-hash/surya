
import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, StarIcon, TrophyIcon, UserCircleIcon, BriefcaseIcon, PhoneIcon, CheckCircleIcon } from './icons/AllIcons';
import { studentService } from '../services/studentService';
import { gamificationService } from '../services/gamificationService';
import { useToast } from '../hooks/useToast';

const skillsList = ['Python', 'Graphic Design', 'Data Analysis', 'Web Development', 'Public Speaking', 'Mathematics', 'English'];

interface StudentProfileExtended {
    id: string;
    name: string;
    class: string;
    skills: string[];
    levelName: string;
    points: number;
    badges: string[];
    contact: string;
}

const TalentScout: React.FC = () => {
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('All');
    const [contactedStudents, setContactedStudents] = useState<string[]>([]);

    // Merge Student Data with Gamification Data to simulate a rich profile
    const candidates: StudentProfileExtended[] = useMemo(() => {
        const students = studentService.getStudents();
        return students.map(student => {
            const stats = gamificationService.getUserStats(student.id) || { points: 0, levelName: 'Beginner' };
            const badges = gamificationService.getEarnedBadges(student.id).map(b => b.name);
            
            // Mock skills based on student data or random assignment for demo
            let skills = [];
            if (student.className.includes('Science')) skills = ['Mathematics', 'Physics', 'Problem Solving'];
            else if (student.className.includes('Commerce')) skills = ['Accounting', 'Data Analysis', 'Management'];
            else skills = ['English', 'Creative Writing', 'Public Speaking'];
            
            // Add some random extra skills
            if (Math.random() > 0.5) skills.push('Python');
            if (Math.random() > 0.5) skills.push('Graphic Design');

            return {
                id: student.id,
                name: student.name,
                class: student.className,
                skills: skills,
                levelName: stats.levelName as string,
                points: stats.points as number,
                badges: badges,
                contact: student.email
            };
        }).sort((a, b) => b.points - a.points); // Sort by highest XP first
    }, []);

    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSkill = selectedSkill === 'All' || c.skills.includes(selectedSkill);
        return matchesSearch && matchesSkill;
    });

    const handleContact = (studentId: string) => {
        setContactedStudents(prev => [...prev, studentId]);
        toast.success("Interest sent to candidate! They will be notified.");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col">
            <div className="flex items-center mb-6 shrink-0">
                <TrophyIcon className="h-8 w-8 text-yellow-500" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Talent Scout</h2>
                    <p className="text-sm text-neutral-500 font-hindi">प्रतिभा खोज: शीर्ष छात्रों को सीधे हायर करें</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="relative flex-grow">
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search candidates by name..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                </div>
                <div className="flex-shrink-0">
                    <select 
                        value={selectedSkill} 
                        onChange={e => setSelectedSkill(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        <option value="All">All Skills</option>
                        {skillsList.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCandidates.map(candidate => (
                        <div key={candidate.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-2 border-white shadow-sm">
                                    <UserCircleIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{candidate.name}</h3>
                                    <p className="text-xs text-slate-500">{candidate.class}</p>
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full mt-1">
                                        <StarIcon className="h-3 w-3 fill-current"/> {candidate.levelName} ({candidate.points} XP)
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Top Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skills.slice(0, 4).map(skill => (
                                        <span key={skill} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md border border-slate-200">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                                {contactedStudents.includes(candidate.id) ? (
                                    <button disabled className="flex-1 py-2 bg-green-50 text-green-700 font-bold rounded-lg text-sm flex items-center justify-center gap-2 cursor-default">
                                        <CheckCircleIcon className="h-4 w-4"/> Interested
                                    </button>
                                ) : (
                                    <button onClick={() => handleContact(candidate.id)} className="flex-1 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors text-sm flex items-center justify-center gap-2">
                                        <BriefcaseIcon className="h-4 w-4"/> Offer / Contact
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredCandidates.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-400">
                            <p>No candidates found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TalentScout;
