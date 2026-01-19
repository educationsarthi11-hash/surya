import { Project, ProjectApplication, ProjectStatus, User, StudentServiceOffering } from '../types';
import { generateProjectDescription } from './geminiService';

// --- MOCK DATA ---
const mockProjects: Project[] = [
    {
        id: 'PROJ-001',
        title: 'Design a Logo for School Science Fair',
        description: 'We need a creative and modern logo for our upcoming annual science fair. The logo should be vibrant and represent innovation and science. The final deliverable should be a high-resolution vector file.',
        skills: ['Graphic Design', 'Logo Design', 'Adobe Illustrator'],
        budget: 1500,
        status: ProjectStatus.Open,
        postedBy: 'ESS-ADM-001',
        postedDate: '2024-07-30',
    },
    {
        id: 'PROJ-002',
        title: 'Write a Blog Post about "The Future of AI in Education"',
        description: 'Research and write an engaging 800-word blog post on the impact of AI in modern education. The tone should be informative and optimistic. Must be original content.',
        skills: ['Content Writing', 'Research', 'SEO Basics'],
        budget: 2000,
        status: ProjectStatus.Open,
        postedBy: 'ESS-CMP-001',
        postedDate: '2024-07-28',
    },
    {
        id: 'PROJ-003',
        title: 'Develop a Simple Python Script for Data Sorting',
        description: 'Create a Python script that reads a CSV file, sorts the data based on a specific column, and writes the output to a new CSV file. The script should be well-commented.',
        skills: ['Python', 'Data Manipulation'],
        budget: 2500,
        status: ProjectStatus.InProgress,
        postedBy: 'ESS-CMP-001',
        postedDate: '2024-07-25',
    }
];

const mockApplications: ProjectApplication[] = [
    { projectId: 'PROJ-003', studentId: 'ESS-STU-004', studentName: 'Sneha Verma', applicationDate: '2024-07-26', status: 'Accepted' },
];

const mockStudentServiceOfferings: StudentServiceOffering[] = [
    {
        id: 'SSO-001',
        studentId: 'ESS-STU-004',
        studentName: 'Sneha Verma',
        serviceTitle: 'Custom Logo Design for Startups',
        description: 'I can create modern and minimalist logos for your new project or startup. Quick turnaround and high-quality vector files provided.',
        skills: ['Logo Design', 'Graphic Design', 'Adobe Illustrator'],
        rate: '₹800 per logo',
        postedDate: '2024-08-01',
        aiGeneratedPortfolioHtml: `
            <h3>🎨 Professional Logo Design Services</h3>
            <p>Bring your brand to life with a unique and memorable logo. As a passionate design student, I specialize in creating clean, modern, and impactful logos for startups, student projects, and small businesses.</p>
            <h4>What you get:</h4>
            <ul>
                <li>2 initial logo concepts to choose from.</li>
                <li>Up to 3 revisions on your chosen concept.</li>
                <li>High-resolution files in JPG, PNG, and vector (SVG) formats.</li>
            </ul>
            <p>Let's create a visual identity you'll be proud of!</p>
        `,
    }
];

// --- SERVICE STATE ---
let projects: Project[] = [...mockProjects];
let applications: ProjectApplication[] = [...mockApplications];
let serviceOfferings: StudentServiceOffering[] = [...mockStudentServiceOfferings];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
    listeners.forEach(listener => listener());
};

// --- SERVICE EXPORT ---
export const skillMarketplaceService = {
    getProjects: (): Project[] => {
        return projects.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    },

    getProjectById: (id: string): Project | undefined => {
        return projects.find(p => p.id === id);
    },

    postProject: (project: Omit<Project, 'id' | 'postedDate' | 'status'>): void => {
        const newProject: Project = {
            ...project,
            id: `PROJ-${Date.now()}`,
            postedDate: new Date().toISOString(),
            status: ProjectStatus.Open,
        };
        projects = [newProject, ...projects];
        notifyListeners();
    },

    applyForProject: (projectId: string, user: User): void => {
        if (applications.some(app => app.projectId === projectId && app.studentId === user.id)) {
            return; // Already applied
        }
        const newApplication: ProjectApplication = {
            projectId,
            studentId: user.id,
            studentName: user.name,
            applicationDate: new Date().toISOString(),
            status: 'Pending',
        };
        applications.push(newApplication);
        notifyListeners();
    },

    getApplicationsForProject: (projectId: string): ProjectApplication[] => {
        return applications.filter(app => app.projectId === projectId);
    },

    getProjectsAppliedByStudent: (studentId: string): ProjectApplication[] => {
        return applications.filter(app => app.studentId === studentId);
    },

    // --- NEW STUDENT INCUBATOR METHODS ---
    getServiceOfferings: (): StudentServiceOffering[] => {
        return serviceOfferings.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    },

    getOfferingsByStudent: (studentId: string): StudentServiceOffering[] => {
        return serviceOfferings.filter(offer => offer.studentId === studentId);
    },

    postServiceOffering: (offering: Omit<StudentServiceOffering, 'id' | 'postedDate'>): void => {
        const newOffering: StudentServiceOffering = {
            ...offering,
            id: `SSO-${Date.now()}`,
            postedDate: new Date().toISOString(),
        };
        serviceOfferings = [newOffering, ...serviceOfferings];
        notifyListeners();
    },
    
    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};