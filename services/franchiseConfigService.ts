
import { LocationType, ServiceName } from '../types';

// V10 forces a total sync for the new Labs
const LOCAL_STORAGE_KEY = 'franchiseServiceConfig_v10_ESS';

export const ALL_SYSTEM_SERVICES: ServiceName[] = [
  'AI Tutor', 'AI Study Guru', 'AI Virtual Lab', 'Smart Admissions',
  'Smart Transport', 'Spiritual Wellness',
  'EduReels', 'Smart Admissions', 'AI Staff Assistant', 'AI Ad Generator',
  'CV Generator', 'Online Exam', 'Progress Monitor', 'Campus Kart',
  'Smart Canteen', 'Test Paper Guru', 'Access Control Center', 'AI Video Generator',
  'World Expansion Planner', 'Recruitment Prep Guru', 'Nearby School Finder',
  'Franchise Plans', 'Fee Management', 'Franchise Support', 'Face Attendance', 'Attendance Log',
  'Fee Notification', 'AI Certificate Generator', 'Placement Forum', 'Placement Reporting',
  'Job Database', 'Student Database', 'AI Medical Guru', 'AI ITI Guru', 'Leaderboard',
  'AI Wellness Guru', 'Interactive 3D Lab', 'Personalized Learning Path', 'AI Proctor for Exams',
  'Automated Timetable Generator', 'Skill Marketplace', 'Sports & Games Hub', 'Classroom Management',
  'AI Interview Coach', 'AI Homework Hub', 'Change Password', 'Franchise Configurator',
  'Know Your Rights', 'Analytics Dashboard', 'Social Media Ad Generator', 'Smart Design Studio',
  'AI Sarkari Job Guru', 'NGO Connect', 'Auto-Dialer', 'Alumni Connect', 'AI Debate Coach',
  'Career Simulator', 'AI Code Lab', 'Daily Knowledge Shorts', 'AI Language Lab', 'Smart Note Maker',
  'AI Flashcards', 'Smart HR Manager', 'Lost and Found', 'Video Guide', 'Smart Library',
  'Exam Result Portal', 'Visitor Management', 'Campus Messenger', 'Inventory Manager',
  'Smart Campus Calendar', 'Digital Locker', 'Infirmary', 'Campus Voting', 'Quiz Arena',
  'Focus Zone', 'Campus Radio', 'AI Astro Guru', 'AI Finance Guru', 'AI Cyber Smart',
  'Digital Notice Board', 'Smart Proxy Manager', 'Grievance Portal', 'Alumni Donation',
  'Psychometric Test', 'Mess Management', 'Smart Digital Diary', 'AI Teacher Evaluator',
  'Classroom', 'overview', 'Talent Scout', 'AI Website Builder', 'Profit Calculator', 'Lead Generator',
  'AI Chemistry Lab', 'AI Machine Workshop', 'AI Anatomy Lab', 'Vedic Math Lab', 'Corporate Hiring Panel',
  'Smart Brand Studio'
];

let config: { [key in LocationType]?: ServiceName[] } = {};
let listeners: (() => void)[] = [];

const initializeConfig = () => {
    try {
        // Reset everything to enable ALL new labs for all institution types
        (Object.values(LocationType) as LocationType[]).forEach(type => {
            config[type] = [...ALL_SYSTEM_SERVICES];
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
        console.error("Config Init Failed", e);
    }
};

initializeConfig();

export const franchiseConfigService = {
    getEnabledServices: (type: LocationType): ServiceName[] => {
        return ALL_SYSTEM_SERVICES;
    },
    setEnabledServices: (type: LocationType, enabledServices: ServiceName[]): void => {
        config[type] = enabledServices;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
        listeners.forEach(l => l());
    },
    subscribe: (listener: () => void): (() => void) => {
        listeners.push(listener);
        return () => { listeners = listeners.filter(l => l !== listener); };
    },
};
