
import React from 'react';
import SectionWrapper from './SectionWrapper';
import { ShieldCheckIcon, UserCircleIcon, AcademicCapIcon, HeartIcon } from '../icons/AllIcons';

const GuidelineCard: React.FC<{ title: string; hindiTitle: string; description: string; icon: React.ReactNode; color: string }> = ({ title, hindiTitle, description, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-soft border border-slate-100 hover:shadow-lifted hover:-translate-y-1 transition-all duration-300">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${color} bg-opacity-10 text-white`}>
            <div className={`text-2xl ${color.replace('bg-', 'text-')}`}>{icon}</div>
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <h4 className="text-sm font-bold text-primary mb-2 font-hindi">{hindiTitle}</h4>
        <p className="text-sm text-slate-600 leading-relaxed">
            {description}
        </p>
    </div>
);

const GuidelinesSection: React.FC = () => {
    const guidelines = [
        {
            title: 'For Students: Integrity First',
            hindiTitle: 'छात्रों के लिए: ईमानदारी सर्वोपरि',
            description: 'Use AI tools (like Study Guru & Essay Writer) to understand concepts, not to bypass learning. Verify facts and always cite your sources.',
            icon: <AcademicCapIcon className="h-6 w-6" />,
            color: 'bg-blue-500'
        },
        {
            title: 'For Teachers: Guide & Mentor',
            hindiTitle: 'शिक्षकों के लिए: मार्गदर्शन और सलाह',
            description: 'Leverage AI to save time on admin tasks so you can focus on mentorship. Use data to identify struggling students early.',
            icon: <UserCircleIcon className="h-6 w-6" />,
            color: 'bg-green-500'
        },
        {
            title: 'Community: Respect & Safety',
            hindiTitle: 'समुदाय: सम्मान और सुरक्षा',
            description: 'Maintain a respectful tone in Live Classrooms and Forums. Bullying, hate speech, or inappropriate content leads to an instant ban.',
            icon: <HeartIcon className="h-6 w-6" />,
            color: 'bg-red-500'
        },
        {
            title: 'Data & Privacy',
            hindiTitle: 'डेटा और गोपनीयता',
            description: 'Your data is encrypted. We do not sell student data to third parties. Education Sarthi is compliant with Indian Digital Data Protection laws.',
            icon: <ShieldCheckIcon className="h-6 w-6" />,
            color: 'bg-purple-500'
        }
    ];

    return (
        <SectionWrapper id="guidelines" className="bg-slate-50">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    Code of Conduct
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Platform Guidelines</h2>
                <p className="mt-4 text-lg text-slate-600 font-hindi">
                    एक सुरक्षित और सफल सीखने के माहौल के लिए हमारे नियम।
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {guidelines.map((guide, index) => (
                    <GuidelineCard key={index} {...guide} />
                ))}
            </div>
        </SectionWrapper>
    );
};

export default GuidelinesSection;
