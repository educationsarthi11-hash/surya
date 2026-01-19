import React, { useState } from 'react';
import { User, Scholarship } from '../types';
import { useToast } from '../hooks/useToast';
import { HeartIcon, SparklesIcon, XCircleIcon, CalendarDaysIcon } from './icons/AllIcons';
import { generateNgoApplicationEssay } from '../services/geminiService';
import Loader from './Loader';
import { useClassroom } from '../contexts/ClassroomContext';

// Mock Data
const mockScholarships: Scholarship[] = [
    {
        id: 'SCH-001',
        ngoName: 'Bright Future Foundation',
        title: 'Merit Scholarship for Class 10 Toppers',
        description: 'A scholarship for students who have scored above 90% in their Class 9 final exams.',
        eligibility: 'Class 10 students with 90%+ in Class 9.',
        amount: '₹25,000 per year',
        deadline: '2024-09-30',
    },
    {
        id: 'SCH-002',
        ngoName: 'Uplift India Initiative',
        title: 'Financial Aid for Higher Secondary Education',
        description: 'Support for students from low-income families to continue their education in Class 11 and 12.',
        eligibility: 'Class 11/12, Family income < ₹2,50,000 per annum.',
        amount: 'Full Tuition Fee Waiver',
        deadline: '2024-10-15',
    },
    {
        id: 'SCH-003',
        ngoName: 'Science for All Trust',
        title: 'Young Innovator Fellowship',
        description: 'A fellowship for students with a keen interest in science and a project idea.',
        eligibility: 'Class 9-12 students with a science project proposal.',
        amount: '₹15,000 project grant',
        deadline: '2024-11-01',
    }
];

const ScholarshipCard: React.FC<{ scholarship: Scholarship; onApply: (scholarship: Scholarship) => void }> = ({ scholarship, onApply }) => (
    <div className="bg-white p-5 rounded-xl shadow-soft border border-neutral-200/80 flex flex-col h-full">
        <div className="flex-grow">
            <p className="text-sm font-semibold text-primary">{scholarship.ngoName}</p>
            <h4 className="text-lg font-bold text-neutral-800 mt-1">{scholarship.title}</h4>
            <p className="text-sm text-neutral-600 mt-2">{scholarship.description}</p>
            <div className="mt-4 text-xs space-y-2">
                <p><strong>Eligibility:</strong> {scholarship.eligibility}</p>
                <p><strong>Benefit:</strong> <span className="font-bold text-green-600">{scholarship.amount}</span></p>
            </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-200">
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4"/> Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</p>
            <button
                onClick={() => onApply(scholarship)}
                className="px-4 py-1.5 text-sm font-semibold rounded-full bg-secondary text-white hover:bg-secondary-dark transition-colors"
            >
                Apply Now
            </button>
        </div>
    </div>
);

const NgoConnect: React.FC<{ user: User }> = ({ user }) => {
    const toast = useToast();
    const { selectedClass } = useClassroom();
    const [scholarships] = useState<Scholarship[]>(mockScholarships);
    const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
    const [statement, setStatement] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleApplyClick = (scholarship: Scholarship) => {
        setSelectedScholarship(scholarship);
        setStatement('');
    };

    const handleGenerateEssay = async () => {
        if (!selectedScholarship) return;
        setIsGenerating(true);
        try {
            const essay = await generateNgoApplicationEssay(selectedScholarship, user);
            setStatement(essay);
            toast.success("AI has drafted your statement of purpose!");
        } catch (error) {
            toast.error("AI could not generate the essay. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmitApplication = () => {
        if (!statement.trim()) {
            toast.error("Please write a statement of purpose before submitting.");
            return;
        }
        // Simulate submission
        console.log({
            studentId: user.id,
            scholarshipId: selectedScholarship?.id,
            statement,
        });
        toast.success(`Your application for "${selectedScholarship?.title}" has been submitted!`);
        setSelectedScholarship(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-6">
                <HeartIcon className="h-8 w-8 text-danger"/>
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">NGO Connect</h2>
                    <p className="text-sm text-neutral-500 font-hindi">छात्रवृत्ति और शैक्षिक सहायता के अवसर</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map(scholarship => (
                    <ScholarshipCard key={scholarship.id} scholarship={scholarship} onApply={handleApplyClick} />
                ))}
            </div>

            {selectedScholarship && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedScholarship(null)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-pop-in" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">Apply for: {selectedScholarship.title}</h3>
                                <p className="text-sm text-neutral-500">by {selectedScholarship.ngoName}</p>
                            </div>
                            <button onClick={() => setSelectedScholarship(null)} aria-label="Close modal">
                                <XCircleIcon className="h-6 w-6 text-neutral-500 hover:text-neutral-800"/>
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 text-sm bg-neutral-50 p-3 rounded-md">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Class:</strong> {selectedClass}</p>
                            </div>
                             <div>
                                <label htmlFor="statement" className="block text-sm font-medium text-neutral-700">Statement of Purpose (Why you need this scholarship)</label>
                                <textarea
                                    id="statement"
                                    value={statement}
                                    onChange={(e) => setStatement(e.target.value)}
                                    rows={8}
                                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 focus:ring-primary focus:border-primary"
                                    placeholder="Explain your situation and why this scholarship would be helpful for your education..."
                                />
                                <button
                                    onClick={handleGenerateEssay}
                                    disabled={isGenerating}
                                    className="mt-2 text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                                >
                                    <SparklesIcon className="h-4 w-4"/>
                                    {isGenerating ? 'Generating...' : 'Get AI Help to Write'}
                                </button>
                                {isGenerating && <div className="mt-2"><Loader message="AI is writing your draft..." /></div>}
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2">
                            <button onClick={() => setSelectedScholarship(null)} className="px-4 py-2 bg-neutral-200 rounded-md text-sm">Cancel</button>
                            <button onClick={handleSubmitApplication} className="px-4 py-2 bg-primary text-white rounded-md text-sm">Submit Application</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NgoConnect;