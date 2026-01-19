
import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, Project, ProjectApplication, ProjectStatus, StudentServiceOffering } from '../types';
import { skillMarketplaceService } from '../services/skillMarketplaceService';
import { generateProjectDescription, generateStudentServicePortfolio } from '../services/geminiService';
import { useToast } from '../hooks/useToast';
import { BuildingStorefrontIcon, SparklesIcon, PlusIcon } from './icons/AllIcons';
import Loader from './Loader';

interface SkillMarketplaceProps {
    user: User;
}

const allSkills = ['Graphic Design', 'Logo Design', 'Content Writing', 'Research', 'SEO Basics', 'Python', 'Data Manipulation', 'Web Development', 'Video Editing'];

const ProjectCard: React.FC<{ project: Project; onApply: () => void; hasApplied: boolean; isStudent: boolean }> = ({ project, onApply, hasApplied, isStudent }) => (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-primary">{project.title}</h4>
                <p className="text-sm font-semibold text-neutral-700">by {project.postedBy}</p>
            </div>
            <span className="text-lg font-bold text-green-600">₹{project.budget.toLocaleString()}</span>
        </div>
        <p className="text-sm text-neutral-600 mt-2">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
            {project.skills.map(skill => (
                <span key={skill} className="px-2 py-1 text-xs bg-neutral-200 text-neutral-700 rounded-full">{skill}</span>
            ))}
        </div>
        {isStudent && (
            <div className="mt-4 text-right">
                <button
                    onClick={onApply}
                    disabled={hasApplied}
                    className="px-4 py-1.5 text-sm font-semibold rounded-full disabled:bg-green-100 disabled:text-green-700 bg-primary text-white hover:bg-primary-dark"
                >
                    {hasApplied ? 'Applied' : 'Apply Now'}
                </button>
            </div>
        )}
    </div>
);

const ServiceOfferingCard: React.FC<{ offering: StudentServiceOffering }> = ({ offering }) => (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h4 className="font-bold text-primary">{offering.serviceTitle}</h4>
        <p className="text-sm font-semibold text-neutral-700">by {offering.studentName}</p>
        <div className="mt-2 prose prose-sm max-w-none text-neutral-600" dangerouslySetInnerHTML={{ __html: offering.aiGeneratedPortfolioHtml }} />
        <div className="mt-3 flex flex-wrap gap-2">
            {offering.skills.map(skill => (
                <span key={skill} className="px-2 py-1 text-xs bg-neutral-200 text-neutral-700 rounded-full">{skill}</span>
            ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-green-600">{offering.rate}</span>
            <button className="px-4 py-1.5 text-sm font-semibold rounded-full bg-secondary text-white hover:bg-secondary-dark">
                Contact Student
            </button>
        </div>
    </div>
);


const SkillMarketplace: React.FC<SkillMarketplaceProps> = ({ user }) => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'projects' | 'incubator' | 'my-dashboard' | 'post-project' | 'recruiter-dashboard'>('projects');
    
    // Data states
    const [projects, setProjects] = useState<Project[]>([]);
    const [applications, setApplications] = useState<ProjectApplication[]>([]);
    const [serviceOfferings, setServiceOfferings] = useState<StudentServiceOffering[]>([]);
    const [filterSkills, setFilterSkills] = useState<string[]>([]);
    
    // Form state for posting a COMPANY project
    const [projectTitle, setProjectTitle] = useState('');
    const [projectSkills, setProjectSkills] = useState<string[]>([]);
    const [projectBudget, setProjectBudget] = useState<number>(1000);
    const [projectDescription, setProjectDescription] = useState('');
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    // Form state for student posting a SERVICE
    const [serviceTitle, setServiceTitle] = useState('');
    const [serviceDesc, setServiceDesc] = useState('');
    const [serviceSkills, setServiceSkills] = useState<string[]>([]);
    const [serviceRate, setServiceRate] = useState('');
    const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false);
    const [aiPortfolio, setAiPortfolio] = useState('');
    const [aiBusinessPlan, setAiBusinessPlan] = useState('');

    useEffect(() => {
        const updateState = () => {
            setProjects(skillMarketplaceService.getProjects());
            setServiceOfferings(skillMarketplaceService.getServiceOfferings());
            if (user.role === UserRole.Student) {
                setApplications(skillMarketplaceService.getProjectsAppliedByStudent(user.id));
            }
        };
        updateState();
        const unsubscribe = skillMarketplaceService.subscribe(updateState);
        return unsubscribe;
    }, [user.id, user.role]);

    const handleGenerateDesc = async () => {
        if (!projectTitle.trim() || projectSkills.length === 0) {
            toast.error("Please provide a Title and select at least one Skill to generate a description.");
            return;
        }
        setIsGeneratingDesc(true);
        try {
            const desc = await generateProjectDescription(projectTitle, projectSkills.join(', '));
            setProjectDescription(desc);
        } catch (error) { toast.error("AI failed to generate a description."); }
        finally { setIsGeneratingDesc(false); }
    };
    
    const handlePostProject = (e: React.FormEvent) => {
        e.preventDefault();
        skillMarketplaceService.postProject({ title: projectTitle, skills: projectSkills, budget: projectBudget, description: projectDescription, postedBy: user.name });
        toast.success("Project posted successfully!");
        setProjectTitle(''); setProjectSkills([]); setProjectBudget(1000); setProjectDescription('');
        setActiveTab('recruiter-dashboard');
    };
    
    const handleGeneratePortfolio = async () => {
        if (!serviceTitle.trim() || !serviceDesc.trim() || serviceSkills.length === 0) {
            toast.error("Please provide a title, description, and at least one skill.");
            return;
        }
        setIsGeneratingPortfolio(true);
        try {
            const { portfolioHtml, businessPlanHtml } = await generateStudentServicePortfolio(serviceTitle, serviceDesc, serviceSkills);
            setAiPortfolio(portfolioHtml);
            setAiBusinessPlan(businessPlanHtml);
            toast.success("AI has generated your portfolio and business plan!");
        } catch (e) { toast.error("AI failed to generate content."); }
        finally { setIsGeneratingPortfolio(false); }
    };

    const handlePostService = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiPortfolio) {
            toast.error("Please generate a portfolio with AI before posting.");
            return;
        }
        skillMarketplaceService.postServiceOffering({
            studentId: user.id,
            studentName: user.name,
            serviceTitle,
            description: serviceDesc,
            skills: serviceSkills,
            rate: serviceRate,
            aiGeneratedPortfolioHtml: aiPortfolio,
        });
        toast.success("Your service has been posted to the incubator!");
        setServiceTitle(''); setServiceDesc(''); setServiceSkills([]); setServiceRate(''); setAiPortfolio(''); setAiBusinessPlan('');
        setActiveTab('my-dashboard');
    };

    const handleApply = (projectId: string) => {
        skillMarketplaceService.applyForProject(projectId, user);
        toast.success("You've successfully applied for the project!");
    };
    
    const filteredProjects = useMemo(() => {
        if (filterSkills.length === 0) return projects;
        return projects.filter(p => filterSkills.every(skill => p.skills.includes(skill)));
    }, [projects, filterSkills]);
    
    const canPostProject = [UserRole.Admin, UserRole.Company, UserRole.Teacher].includes(user.role);

    const renderTabs = () => (
        <div className="border-b mb-6 shrink-0">
            <nav className="-mb-px flex space-x-6 overflow-x-auto custom-scrollbar">
                <button onClick={() => setActiveTab('projects')} className={`py-2 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'projects' ? 'border-primary text-primary' : 'border-transparent text-neutral-500'}`}>Browse Projects</button>
                <button onClick={() => setActiveTab('incubator')} className={`py-2 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'incubator' ? 'border-primary text-primary' : 'border-transparent text-neutral-500'}`}>Student Incubator</button>
                {user.role === UserRole.Student && (
                    <button onClick={() => setActiveTab('my-dashboard')} className={`py-2 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'my-dashboard' ? 'border-primary text-primary' : 'border-transparent text-neutral-500'}`}>My Dashboard</button>
                )}
                 {canPostProject && (
                    <>
                        <button onClick={() => setActiveTab('post-project')} className={`py-2 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'post-project' ? 'border-primary text-primary' : 'border-transparent text-neutral-500'}`}>Post a Project</button>
                        <button onClick={() => setActiveTab('recruiter-dashboard')} className={`py-2 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'recruiter-dashboard' ? 'border-primary text-primary' : 'border-transparent text-neutral-500'}`}>My Projects</button>
                    </>
                )}
            </nav>
        </div>
    );
    
    const renderContent = () => {
        switch(activeTab) {
            case 'projects':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full overflow-hidden">
                        <div className="lg:col-span-1 overflow-y-auto"><h4 className="font-bold mb-3">Filter by Skills</h4> {/* Filter UI here */}</div>
                        <div className="lg:col-span-3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            {filteredProjects.map(p => (
                                <ProjectCard key={p.id} project={p} onApply={() => handleApply(p.id)} hasApplied={applications.some(app => app.projectId === p.id)} isStudent={user.role === UserRole.Student} />
                            ))}
                        </div>
                    </div>
                );
            case 'incubator':
                return (
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar h-full">
                        {serviceOfferings.map(offering => <ServiceOfferingCard key={offering.id} offering={offering} />)}
                    </div>
                );
            case 'my-dashboard': // Student only
                const myApplications = skillMarketplaceService.getProjectsAppliedByStudent(user.id);
                const myOfferings = skillMarketplaceService.getOfferingsByStudent(user.id);
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2 h-full custom-scrollbar">
                        <div className="md:col-span-2">
                             <form onSubmit={handlePostService} className="p-4 border-2 border-dashed rounded-lg space-y-4">
                                <h3 className="text-xl font-bold">Offer a New Service (अपनी सेवा प्रदान करें)</h3>
                                <input value={serviceTitle} onChange={e => setServiceTitle(e.target.value)} placeholder="Service Title (e.g., Logo Design)" className="w-full p-2 border rounded" />
                                <textarea value={serviceDesc} onChange={e => setServiceDesc(e.target.value)} placeholder="Describe your service in a few sentences." className="w-full p-2 border rounded" rows={3}/>
                                 <div className="flex flex-wrap gap-2">{allSkills.map(skill => ( <button type="button" key={skill} onClick={() => setServiceSkills(prev => serviceSkills.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])} className={`px-3 py-1 text-sm rounded-full border ${serviceSkills.includes(skill) ? 'bg-primary text-white' : 'bg-white'}`}>{skill}</button> ))}</div>
                                <input value={serviceRate} onChange={e => setServiceRate(e.target.value)} placeholder="Your Rate (e.g., ₹500 per logo)" className="w-full p-2 border rounded" />
                                <button type="button" onClick={handleGeneratePortfolio} disabled={isGeneratingPortfolio} className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"><SparklesIcon className="h-4 w-4"/> {isGeneratingPortfolio ? 'Generating...' : 'Generate Portfolio & Plan with AI'}</button>
                                {aiPortfolio && (
                                    <div className="space-y-4 animate-pop-in">
                                        <div><h4 className="font-bold">AI Generated Portfolio:</h4><div className="p-2 border rounded bg-white prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: aiPortfolio }} /></div>
                                        <div><h4 className="font-bold">Your Business Plan (For your reference):</h4><details><summary className="cursor-pointer text-sm">View Plan</summary><div className="p-2 border rounded bg-white prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: aiBusinessPlan }} /></details></div>
                                    </div>
                                )}
                                <button type="submit" className="flex items-center justify-center py-2 px-4 bg-primary text-white font-semibold rounded-md"><PlusIcon className="h-5 w-5 mr-2"/>Post My Service</button>
                            </form>
                        </div>
                        <div>
                             <h3 className="text-lg font-bold">My Service Offerings</h3>
                             <div className="space-y-2 mt-2">{myOfferings.map(o => <ServiceOfferingCard key={o.id} offering={o} />)}</div>
                        </div>
                        <div>
                             <h3 className="text-lg font-bold">My Project Applications</h3>
                             <div className="space-y-2 mt-2">{myApplications.map(app => { const p = skillMarketplaceService.getProjectById(app.projectId); return p ? <div key={app.projectId} className="p-2 border rounded"><strong>{p.title}</strong> - {app.status}</div> : null; })}</div>
                        </div>
                    </div>
                );
            case 'post-project': // Recruiter only
                 return (
                    <div className="overflow-y-auto pr-2 h-full custom-scrollbar">
                        <form onSubmit={handlePostProject} className="max-w-2xl mx-auto p-4 border rounded-lg bg-neutral-50 space-y-4">
                            <h3 className="text-xl font-bold">Post a New Project</h3>
                            <div><label className="block text-sm font-medium">Project Title</label><input type="text" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="mt-1 w-full p-2 border rounded-md" required/></div>
                            <div><label className="block text-sm font-medium">Required Skills</label><div className="mt-2 flex flex-wrap gap-2">{allSkills.map(skill => ( <button type="button" key={skill} onClick={() => setProjectSkills(prev => projectSkills.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])} className={`px-3 py-1 text-sm rounded-full border ${projectSkills.includes(skill) ? 'bg-primary text-white' : 'bg-white'}`}>{skill}</button> ))}</div></div>
                            <div><label className="block text-sm font-medium">Project Description</label><textarea value={projectDescription} onChange={e => setProjectDescription(e.target.value)} rows={4} className="mt-1 w-full p-2 border rounded-md" required /><button type="button" onClick={handleGenerateDesc} disabled={isGeneratingDesc} className="mt-1 text-sm font-semibold text-primary hover:underline flex items-center gap-1"><SparklesIcon className="h-4 w-4"/> {isGeneratingDesc ? 'Generating...' : 'Generate with AI'}</button></div>
                            <div><label className="block text-sm font-medium">Budget (₹)</label><input type="number" value={projectBudget} onChange={e => setProjectBudget(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md" min="0" step="100" required/></div>
                            <button type="submit" className="flex items-center justify-center py-2 px-4 bg-primary text-white font-semibold rounded-md"><PlusIcon className="h-5 w-5 mr-2"/>Post Project</button>
                        </form>
                    </div>
                );
            case 'recruiter-dashboard': // Recruiter only
                const myProjects = projects.filter(p => p.postedBy === user.name);
                return (
                    <div className="overflow-y-auto pr-2 h-full custom-scrollbar">
                        <h3 className="text-xl font-bold mb-4">My Posted Projects</h3>
                        <div className="space-y-4">{myProjects.map(project => { const apps = skillMarketplaceService.getApplicationsForProject(project.id); return ( <details key={project.id} className="p-4 border rounded-lg bg-white shadow-sm"><summary className="font-bold cursor-pointer">{project.title} ({apps.length} Applicants)</summary><div className="mt-4 border-t pt-3">{apps.length > 0 ? apps.map(app => (<div key={app.studentId} className="flex justify-between p-2 border-b"><span>{app.studentName}</span><span className="text-sm">{new Date(app.applicationDate).toLocaleDateString()}</span></div>)) : <p>No applicants.</p>}</div></details> )})}</div>
                    </div>
                );
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col overflow-hidden">
            <div className="flex items-center mb-6 shrink-0">
                <BuildingStorefrontIcon className="h-8 w-8 text-primary"/>
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Skill Marketplace & Incubator</h2>
            </div>
            {renderTabs()}
            <div className="flex-1 overflow-hidden flex flex-col">
                {renderContent()}
            </div>
        </div>
    );
};

export default SkillMarketplace;
