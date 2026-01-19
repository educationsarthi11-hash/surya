import React from 'react';
import { UserRole, ServiceName, ServiceCategory, Service } from '../types';
import * as Icons from '../components/icons/AllIcons';

// --- Lazy Imports for Performance ---
const AITutor = React.lazy(() => import('../components/AITutor'));
const SmartLibrary = React.lazy(() => import('../components/SmartLibrary')); 
const AiVirtualLab = React.lazy(() => import('../components/AiVirtualLab'));
const AdmissionForm = React.lazy(() => import('../components/AdmissionForm'));
const PlacementForum = React.lazy(() => import('../components/PlacementForum'));
const StudentDatabase = React.lazy(() => import('../components/StudentDatabase'));
const FeeManagement = React.lazy(() => import('../components/FeeManagement'));
const AttendanceLog = React.lazy(() => import('../components/AttendanceLog'));
const FaceAttendance = React.lazy(() => import('../components/FaceAttendance'));
const QrAttendance = React.lazy(() => import('../components/QrAttendance'));
const AIHomeworkHub = React.lazy(() => import('../components/AIHomeworkHub'));
const AnalyticsDashboard = React.lazy(() => import('../components/AnalyticsDashboard'));
const ChangePassword = React.lazy(() => import('../components/ChangePassword'));
const FranchiseConfigurator = React.lazy(() => import('../components/FranchiseConfigurator'));
const DigitalNoticeBoard = React.lazy(() => import('../components/DigitalNoticeBoard'));
const SmartProxyManager = React.lazy(() => import('../components/SmartProxyManager'));
const AITeacherEvaluator = React.lazy(() => import('../components/AITeacherEvaluator'));
const RecruitmentPrepGuru = React.lazy(() => import('../components/RecruitmentPrepGuru'));
const MedicalGuru = React.lazy(() => import('../components/MedicalGuru'));
const ITIGuru = React.lazy(() => import('../components/ITIGuru'));
const AIAnatomyLab = React.lazy(() => import('../components/AIAnatomyLab'));
const AIMachineWorkshop = React.lazy(() => import('../components/AIMachineWorkshop'));
const Classroom = React.lazy(() => import('../components/Classroom'));
const EduReels = React.lazy(() => import('../components/EduReels'));
const AiAssistant = React.lazy(() => import('../components/AiAssistant'));
const AIAdGenerator = React.lazy(() => import('../components/AIAdGenerator'));
const CVGenerator = React.lazy(() => import('../components/CVGenerator'));
const OnlineExam = React.lazy(() => import('../components/OnlineExam'));
const ProgressMonitor = React.lazy(() => import('../components/ProgressMonitor'));
const SchoolStore = React.lazy(() => import('../components/SchoolStore')); 
const SmartCanteen = React.lazy(() => import('../components/SmartCanteen'));
const TestGuru = React.lazy(() => import('../components/TestGuru'));
const VideoGenerator = React.lazy(() => import('../components/VideoGenerator'));
const WorldMap = React.lazy(() => import('../components/WorldMap'));
const NearbySchoolFinder = React.lazy(() => import('../components/NearbySchoolFinder'));
const FranchisePlans = React.lazy(() => import('../components/FranchisePlans'));
const FranchiseSupport = React.lazy(() => import('../components/FranchiseSupport'));
const FeeNotification = React.lazy(() => import('../components/FeeNotification'));
const CertificateGenerator = React.lazy(() => import('../components/CertificateGenerator'));
const Leaderboard = React.lazy(() => import('../components/Leaderboard'));
const WellnessGuru = React.lazy(() => import('../components/WellnessGuru'));
const Interactive3DLab = React.lazy(() => import('../components/Interactive3DLab'));
const PersonalizedLearningPath = React.lazy(() => import('../components/PersonalizedLearningPath'));
const AutomatedTimetableGenerator = React.lazy(() => import('../components/AutomatedTimetableGenerator'));
const SkillMarketplace = React.lazy(() => import('../components/SkillMarketplace'));
const SportsHub = React.lazy(() => import('../components/SportsHub'));
const AIInterviewCoach = React.lazy(() => import('../components/AIInterviewCoach'));
const LegalGuidelines = React.lazy(() => import('../components/LegalGuidelines'));
const SocialMediaAdGenerator = React.lazy(() => import('../components/SocialMediaVideoGenerator'));
const SmartDesignStudio = React.lazy(() => import('../components/SmartDesignStudio'));
const AISarkariJobGuru = React.lazy(() => import('../components/AISarkariJobGuru'));
const NgoConnect = React.lazy(() => import('../components/NgoConnect'));
const AutoDialer = React.lazy(() => import('../components/AutoDialer'));
const AlumniConnect = React.lazy(() => import('../components/AlumniConnect'));
const AIDebateCoach = React.lazy(() => import('../components/AIDebateCoach'));
const CareerSimulator = React.lazy(() => import('../components/CareerSimulator'));
const AICodeLab = React.lazy(() => import('../components/AICodeLab'));
const DailyNews = React.lazy(() => import('../components/DailyNews'));
const AILanguageLab = React.lazy(() => import('../components/AILanguageLab'));
const SmartNoteMaker = React.lazy(() => import('../components/SmartNoteMaker'));
const VoiceMemo = React.lazy(() => import('../components/VoiceMemo'));
const AIFlashcards = React.lazy(() => import('../components/AIFlashcards'));
const LostAndFound = React.lazy(() => import('../components/LostAndFound'));
const VideoGuide = React.lazy(() => import('../components/VideoGuide'));
const ResultPortal = React.lazy(() => import('../components/ResultPortal'));
const VisitorManagement = React.lazy(() => import('../components/VisitorManagement'));
const CampusMessenger = React.lazy(() => import('../components/CampusMessenger'));
const InventoryManager = React.lazy(() => import('../components/InventoryManager'));
const SmartCampusCalendar = React.lazy(() => import('../components/SmartCalendar'));
const DigitalLocker = React.lazy(() => import('../components/DigitalLocker'));
const InfirmaryManagement = React.lazy(() => import('../components/InfirmaryManagement'));
const CampusVoting = React.lazy(() => import('../components/CampusVoting'));
const QuizArena = React.lazy(() => import('../components/QuizArena'));
const FocusZone = React.lazy(() => import('../components/FocusZone'));
const CampusRadio = React.lazy(() => import('../components/CampusRadio'));
const AIAstroGuru = React.lazy(() => import('../components/AIAstroGuru'));
const AIFinanceGuru = React.lazy(() => import('../components/AIFinanceGuru'));
const AICyberSmart = React.lazy(() => import('../components/AICyberSmart'));
const GrievancePortal = React.lazy(() => import('../components/GrievancePortal'));
const AIParentVoiceHub = React.lazy(() => import('../components/AIParentVoiceHub'));
const AIMakerLab = React.lazy(() => import('../components/AIMakerLab'));
const AlumniDonation = React.lazy(() => import('../components/AlumniDonation'));
const PsychometricTest = React.lazy(() => import('../components/PsychometricTest'));
const MessManagement = React.lazy(() => import('../components/MessManagement'));
const SmartDigitalDiary = React.lazy(() => import('../components/SmartDigitalDiary'));
const AIWebsiteBuilder = React.lazy(() => import('../components/AIWebsiteBuilder'));
const ProfitCalculator = React.lazy(() => import('../components/ProfitCalculator'));
const LeadGenerator = React.lazy(() => import('../components/LeadGenerator'));
const AIChemistryLab = React.lazy(() => import('../components/AIChemistryLab'));
const SpiritualWellnessHub = React.lazy(() => import('../components/SpiritualWellnessHub'));
const SmartTransport = React.lazy(() => import('../components/SmartTransport'));
const SmartHRManager = React.lazy(() => import('../components/SmartHR'));
const VedicMathLab = React.lazy(() => import('../components/VedicMathLab'));
const AIGallery = React.lazy(() => import('../components/AIGallery'));
const SyllabusTracker = React.lazy(() => import('../components/SyllabusTracker'));
const AIElectricLab = React.lazy(() => import('../components/AIElectricLab'));
const AIAgricultureLab = React.lazy(() => import('../components/AIAgricultureLab'));
const HandwritingCoach = React.lazy(() => import('../components/HandwritingCoach'));
const HostelManagement = React.lazy(() => import('../components/HostelManagement'));
const AISmartBoard = React.lazy(() => import('../components/SmartWhiteboard'));
const ParentConnect = React.lazy(() => import('../components/ParentPortal'));
const LessonPlanner = React.lazy(() => import('../components/CurriculumArchitect'));
const CareerPredictor = React.lazy(() => import('../components/CareerPredictor'));
const ParentCoach = React.lazy(() => import('../components/ParentCoach'));
const SolarStudyClock = React.lazy(() => import('../components/FocusZone'));
const SafetySOS = React.lazy(() => import('../components/SOSButton'));
const AIMasterSetup = React.lazy(() => import('../components/AIMasterSetup'));
const StabilityAnalyzer = React.lazy(() => import('../components/StabilityAnalyzer'));
const AntiFraudShield = React.lazy(() => import('../components/AntiFraudShield'));
const AuthorityDashboard777 = React.lazy(() => import('../components/AuthorityDashboard777'));
const ChiefTalentScientist = React.lazy(() => import('../components/ChiefTalentScientist'));
const EmployerPeaceOfMind = React.lazy(() => import('../components/EmployerPeaceOfMind'));
const MasterPitchDeck = React.lazy(() => import('../components/MasterPitchDeck'));
const SmartMatchingEngine = React.lazy(() => import('../components/SmartMatchingEngine'));
const CustomTrainingPlan = React.lazy(() => import('../components/CurriculumArchitect'));
const StudentIncubator = React.lazy(() => import('../components/StudentIncubator'));
const CorporateHiringPortal = React.lazy(() => import('../components/CorporateHiringPortal'));
const SmartBrandStudio = React.lazy(() => import('../components/CorporateDesignStudio'));
const DataImportWizard = React.lazy(() => import('../components/DataImportWizard'));
const AIGitaGuru = React.lazy(() => import('../components/AIGitaGuru'));
const AIBusinessManager = React.lazy(() => import('../components/AIBusinessManager')); 
const BookExchange = React.lazy(() => import('../components/BookExchange'));
const MeditationStudio = React.lazy(() => import('../components/MeditationStudio'));
const AIAyurvedaGuru = React.lazy(() => import('../components/AIAyurvedaGuru'));
const MetaverseLearning = React.lazy(() => import('../components/MetaverseLearning'));
const AIFashionStylist = React.lazy(() => import('../components/AIFashionStylist'));
const AIRoboticsLab = React.lazy(() => import('../components/AIRoboticsLab'));
const AISpaceStation = React.lazy(() => import('../components/AISpaceStation'));
const AIUniversalLab = React.lazy(() => import('../components/AIUniversalLab'));
const CreativeStudio = React.lazy(() => import('../components/CreativeStudio'));
const FutureCareerHub = React.lazy(() => import('../components/FutureCareerHub'));
const SmartAdminOffice = React.lazy(() => import('../components/SmartAdminOffice'));
const SmartPTM = React.lazy(() => import('../components/SmartPTM')); 
const AIProfitForecaster = React.lazy(() => import('../components/AIProfitForecaster'));
const SyncDashboard = React.lazy(() => import('../components/SyncDashboard'));
const TalentScout = React.lazy(() => import('../components/TalentScout'));
const KnowYourRights = React.lazy(() => import('../components/KnowYourRights'));

// Service List Configuration
export const ALL_SERVICES: Service[] = [
    { name: 'AI Parent Voice Hub', description: 'Hear your child’s report in your own language.', hindiDescription: 'बच्चे की प्रगति रिपोर्ट अपनी भाषा में सुनें।', icon: React.createElement(Icons.HeartIcon), roles: [UserRole.Parent], category: ServiceCategory.ADMINISTRATION },
    { name: 'AI Maker Lab', description: 'Learn to build anything step by step.', hindiDescription: 'निर्माण शाला: कुछ भी बनाना सीखें।', icon: React.createElement(Icons.WrenchScrewdriverIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Anti-Fraud Shield', description: 'AI Guardian protecting students from scams.', hindiDescription: 'सुरक्षा कवच: धोखाधड़ी से सुरक्षा।', icon: React.createElement(Icons.ShieldCheckIcon), roles: [UserRole.Admin, UserRole.Director, UserRole.Company], category: ServiceCategory.ADMINISTRATION },
    { name: 'Know Your Rights', description: 'Legal awareness for students.', hindiDescription: 'कानूनी सार्थी: सुरक्षा और अधिकार जानें।', icon: React.createElement(Icons.ScaleIcon), roles: [UserRole.Student, UserRole.Parent], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'Daily Knowledge Shorts', description: 'Daily facts and news.', hindiDescription: 'रोज का ज्ञान: 5 नई रोचक बातें।', icon: React.createElement(Icons.GlobeAltIcon), roles: [UserRole.Student], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Lost and Found', description: 'Report lost items.', hindiDescription: 'खोया-पाया विभाग।', icon: React.createElement(Icons.TagIcon), roles: [UserRole.Student, UserRole.Admin, UserRole.Teacher], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'AI Language Lab', description: 'Speak English confidently.', hindiDescription: 'इंग्लिश स्पीकिंग और ग्रामर लैब।', icon: React.createElement(Icons.ChatBubbleIcon), roles: [UserRole.Student], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'AI Flashcards', description: 'Quick revision tool.', hindiDescription: 'रिवीजन के लिए स्मार्ट कार्ड्स।', icon: React.createElement(Icons.RectangleStackIcon), roles: [UserRole.Student], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Smart PTM Scheduler', description: 'Book appointments with teachers.', hindiDescription: 'टीचर से मिलने का समय (PTM) बुक करें।', icon: React.createElement(Icons.UserGroupIcon), roles: [UserRole.Parent, UserRole.Teacher, UserRole.Admin], category: ServiceCategory.ADMINISTRATION },
    { name: 'AI Tutor', description: 'Personalized AI learning assistant.', icon: React.createElement(Icons.AcademicCapIcon), roles: [UserRole.Student], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'AI Universal Lab', description: 'One-stop hub for all Science, Space, and Tech Labs.', hindiDescription: 'सभी प्रयोगशालाओं का एक केंद्र (Space, Robot, Bio, Agri).', icon: React.createElement(Icons.BeakerIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Creative Studio', description: 'Design, Video, and Ad Making Tools.', hindiDescription: 'वीडियो, पोस्टर और विज्ञापन बनाने का स्टूडियो।', icon: React.createElement(Icons.PaintBrushIcon), roles: [UserRole.Student, UserRole.Teacher, UserRole.Admin], category: ServiceCategory.CREATIVE_STUDIO },
    { name: 'Future Career Hub', description: 'Job Prep, CVs, and Interviews.', hindiDescription: 'करियर, नौकरी और इंटरव्यू की तैयारी।', icon: React.createElement(Icons.BriefcaseIcon), roles: [UserRole.Student, UserRole.JobSeeker, UserRole.College], category: ServiceCategory.CAREER_DEVELOPMENT },
    { name: 'Smart Admin Office', description: 'Fees, Staff, and Operations.', hindiDescription: 'फीस, स्टाफ और स्कूल प्रबंधन।', icon: React.createElement(Icons.BuildingOfficeIcon), roles: [UserRole.Admin, UserRole.School, UserRole.Director], category: ServiceCategory.ADMINISTRATION },
    { name: 'AI Fashion Stylist', description: 'Personalized Outfit Recommendations based on your photo.', hindiDescription: 'आपकी फोटो के आधार पर कपड़ों के सुझाव।', icon: React.createElement(Icons.SparklesIcon), roles: [UserRole.Student, UserRole.Teacher, UserRole.Parent], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'AI Study Guru', description: 'Advanced AI research and study companion.', icon: React.createElement(Icons.BookOpenIcon), roles: [UserRole.Student], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Metaverse Learning', description: 'Experience education in a 3D Virtual World.', hindiDescription: 'शिक्षा की 3D आभासी दुनिया (Metaverse).', icon: React.createElement(Icons.CubeIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Book Exchange', description: 'Buy, Sell or Donate old books within the campus.', hindiDescription: 'पुरानी किताबें बेचें या मुफ्त पाएं।', icon: React.createElement(Icons.BookOpenIcon), roles: [UserRole.Student, UserRole.Parent], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'Smart Admissions', description: 'Automated admission system.', icon: React.createElement(Icons.UserPlusIcon), roles: [UserRole.Admin, UserRole.School], category: ServiceCategory.ADMINISTRATION },
    { name: 'Student Database', description: 'Manage student records.', icon: React.createElement(Icons.UsersIcon), roles: [UserRole.Admin, UserRole.School], category: ServiceCategory.ADMINISTRATION },
    { name: 'Attendance Log', description: 'View daily attendance.', icon: React.createElement(Icons.ClipboardDocumentCheckIcon), roles: [UserRole.Teacher, UserRole.Admin], category: ServiceCategory.ADMINISTRATION },
    { name: 'Face Attendance', description: 'Mark attendance via face scan.', icon: React.createElement(Icons.CameraIcon), roles: [UserRole.Teacher, UserRole.School, UserRole.Parent], category: ServiceCategory.ADMINISTRATION },
    { name: 'QR Attendance', description: 'Scan ID card for attendance.', icon: React.createElement(Icons.QrCodeIcon), roles: [UserRole.Teacher, UserRole.School], category: ServiceCategory.ADMINISTRATION },
    { name: 'AI Homework Hub', description: 'Assign, submit and grade homework.', icon: React.createElement(Icons.ClipboardIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Analytics Dashboard', description: 'View institutional insights.', icon: React.createElement(Icons.ChartBarIcon), roles: [UserRole.Admin, UserRole.Director], category: ServiceCategory.EXECUTIVE },
    { name: 'Change Password', description: 'Update your login password.', icon: React.createElement(Icons.KeyIcon), roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student], category: ServiceCategory.ADMINISTRATION },
    { name: 'Franchise Configurator', description: 'Set up institution branding.', icon: React.createElement(Icons.Cog6ToothIcon), roles: [UserRole.Director, UserRole.Admin], category: ServiceCategory.GROWTH_EXPANSION },
    { name: 'Digital Notice Board', description: 'Post updates and circulars.', icon: React.createElement(Icons.BellIcon), roles: [UserRole.Admin, UserRole.Teacher], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'Smart Proxy Manager', description: 'Manage teacher substitutions.', icon: React.createElement(Icons.UserGroupIcon), roles: [UserRole.Admin, UserRole.School], category: ServiceCategory.ADMINISTRATION },
    { name: 'AI Teacher Evaluator', description: 'Analyze teacher performance.', icon: React.createElement(Icons.TrophyIcon), roles: [UserRole.Admin, UserRole.School], category: ServiceCategory.ADMINISTRATION },
    { name: 'Classroom', description: 'Live AI Teaching Session.', icon: React.createElement(Icons.PresentationChartBarIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'AI Ad Generator', description: 'Generate marketing ads.', icon: React.createElement(Icons.MegaphoneIcon), roles: [UserRole.Admin, UserRole.School, UserRole.Director], category: ServiceCategory.GROWTH_EXPANSION },
    { name: 'CV Generator', description: 'Build professional resumes.', icon: React.createElement(Icons.DocumentTextIcon), roles: [UserRole.Student, UserRole.JobSeeker, UserRole.College], category: ServiceCategory.CAREER_DEVELOPMENT },
    { name: 'Online Exam', description: 'Take or create online tests.', icon: React.createElement(Icons.PencilSquareIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Progress Monitor', description: 'Track academic growth.', icon: React.createElement(Icons.ArrowTrendingUpIcon), roles: [UserRole.Student, UserRole.Parent], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Campus Kart', description: 'Buy uniform and books.', icon: React.createElement(Icons.ShoppingCartIcon), roles: [UserRole.Student, UserRole.Parent], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'Smart Canteen', description: 'Pre-order food.', icon: React.createElement(Icons.CakeIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'Test Paper Guru', description: 'Generate printable exams.', icon: React.createElement(Icons.PrinterIcon), roles: [UserRole.Teacher, UserRole.School], category: ServiceCategory.ADMINISTRATION },
    { name: 'Access Control Center', description: 'Manage user logins.', icon: React.createElement(Icons.KeyIcon), roles: [UserRole.Admin, UserRole.Director], category: ServiceCategory.ADMINISTRATION },
    { name: 'AI Video Generator', description: 'Create educational videos.', icon: React.createElement(Icons.VideoCameraIcon), roles: [UserRole.Teacher, UserRole.School], category: ServiceCategory.CREATIVE_STUDIO },
    { name: 'Nearby School Finder', description: 'Find institutes near you.', icon: React.createElement(Icons.MapPinIcon), roles: [UserRole.Admin, UserRole.Parent], category: ServiceCategory.GROWTH_EXPANSION },
    { name: 'Franchise Support', description: 'Technical help desk.', icon: React.createElement(Icons.ExclamationTriangleIcon), roles: [UserRole.School, UserRole.Admin], category: ServiceCategory.ADMINISTRATION },
    { name: 'AI Certificate Generator', description: 'Create and verify certificates.', icon: React.createElement(Icons.AcademicCapIcon), roles: [UserRole.Admin, UserRole.School], category: ServiceCategory.ADMINISTRATION },
    { name: 'Placement Reporting', description: 'Track student placements.', icon: React.createElement(Icons.ChartBarIcon), roles: [UserRole.College, UserRole.University], category: ServiceCategory.CAREER_DEVELOPMENT },
    { name: 'Leaderboard', description: 'View top performers.', icon: React.createElement(Icons.TrophyIcon), roles: [UserRole.Student], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'AI Wellness Guru', description: 'Mental health support.', icon: React.createElement(Icons.HeartIcon), roles: [UserRole.Student], category: ServiceCategory.HEALTH_WELLNESS },
    { name: 'Personalized Learning Path', description: 'Custom study roadmap.', icon: React.createElement(Icons.MapIcon), roles: [UserRole.Student], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Skill Marketplace', description: 'Freelance projects.', icon: React.createElement(Icons.BoltIcon), roles: [UserRole.Student, UserRole.Company], category: ServiceCategory.CAREER_DEVELOPMENT },
    { name: 'Sports & Games Hub', description: 'Sports management.', icon: React.createElement(Icons.TrophyIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'AI Interview Coach', description: 'Practice interviews.', icon: React.createElement(Icons.MicrophoneIcon), roles: [UserRole.Student, UserRole.JobSeeker], category: ServiceCategory.CAREER_DEVELOPMENT },
    { name: 'Social Media Ad Generator', description: 'Create social media ads.', icon: React.createElement(Icons.MegaphoneIcon), roles: [UserRole.Admin, UserRole.School], category: ServiceCategory.GROWTH_EXPANSION },
    { name: 'AI Sarkari Job Guru', description: 'Government job finder.', icon: React.createElement(Icons.BriefcaseIcon), roles: [UserRole.Student, UserRole.JobSeeker], category: ServiceCategory.CAREER_DEVELOPMENT },
    { name: 'NGO Connect', description: 'Scholarships and aid.', icon: React.createElement(Icons.HeartIcon), roles: [UserRole.Student, UserRole.Admin], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'Auto-Dialer', description: 'Automated calling system.', icon: React.createElement(Icons.PhoneIcon), roles: [UserRole.Admin, UserRole.School], category: ServiceCategory.ADMINISTRATION },
    { name: 'Alumni Connect', description: 'Network with alumni.', icon: React.createElement(Icons.UsersIcon), roles: [UserRole.Student, UserRole.College], category: ServiceCategory.CAREER_DEVELOPMENT },
    { name: 'AI Code Lab', description: 'Learn programming.', icon: React.createElement(Icons.CodeBracketIcon), roles: [UserRole.Student], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Smart Note Maker', description: 'Voice to notes.', icon: React.createElement(Icons.DocumentTextIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Smart Campus Calendar', description: 'Event calendar.', icon: React.createElement(Icons.CalendarDaysIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'Grievance Portal', description: 'Report issues.', icon: React.createElement(Icons.ScaleIcon), roles: [UserRole.Student, UserRole.Parent], category: ServiceCategory.ADMINISTRATION },
    { name: 'Psychometric Test', description: 'Career personality test.', icon: React.createElement(Icons.BrainIcon), roles: [UserRole.Student], category: ServiceCategory.CAREER_DEVELOPMENT },
    { name: 'Smart Digital Diary', description: 'Parent-Teacher notes.', icon: React.createElement(Icons.BookOpenIcon), roles: [UserRole.Teacher, UserRole.Parent], category: ServiceCategory.ADMINISTRATION },
    { name: 'AI Website Builder', description: 'Create institution website.', icon: React.createElement(Icons.GlobeAltIcon), roles: [UserRole.Director, UserRole.Admin], category: ServiceCategory.GROWTH_EXPANSION },
    { name: 'Profit Calculator', description: 'Estimate earnings.', icon: React.createElement(Icons.CalculatorIcon), roles: [UserRole.Director, UserRole.Admin], category: ServiceCategory.EXECUTIVE },
    { name: 'Lead Generator', description: 'Find potential students.', icon: React.createElement(Icons.UsersIcon), roles: [UserRole.Admin, UserRole.Director], category: ServiceCategory.GROWTH_EXPANSION },
    { name: 'Spiritual Wellness', description: 'Gita wisdom.', icon: React.createElement(Icons.HeartIcon), roles: [UserRole.Student, UserRole.Parent], category: ServiceCategory.HEALTH_WELLNESS },
    { name: 'Smart Transport', description: 'Bus tracking & SOS.', icon: React.createElement(Icons.TruckIcon), roles: [UserRole.Student, UserRole.Parent], category: ServiceCategory.ADMINISTRATION },
    { name: 'Smart HR Manager', description: 'Staff & Payroll.', icon: React.createElement(Icons.UsersIcon), roles: [UserRole.Admin, UserRole.Director], category: ServiceCategory.ADMINISTRATION },
    { name: 'Syllabus Tracker', description: 'Track course progress.', icon: React.createElement(Icons.ChartBarIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.LEARN_PRACTICE },
    { name: 'Career Predictor', description: 'AI Career Forecast.', icon: React.createElement(Icons.ChartBarIcon), roles: [UserRole.Student], category: ServiceCategory.CAREER_DEVELOPMENT },
    { name: 'Safety SOS', description: 'Emergency alert.', icon: React.createElement(Icons.ExclamationTriangleIcon), roles: [UserRole.Student, UserRole.Parent], category: ServiceCategory.CAMPUS_LIFE },
    { name: 'Sync Center', description: 'Cloud Backup', icon: React.createElement(Icons.SignalIcon), roles: [UserRole.Admin, UserRole.Director], category: ServiceCategory.ADMINISTRATION },
    { name: 'overview', description: 'Dashboard Home', icon: React.createElement(Icons.Squares2X2Icon), roles: [], category: ServiceCategory.ADMINISTRATION },
    { name: 'Smart Library', description: 'Digital Library & AI Reader.', hindiDescription: 'डिजिटल लाइब्रेरी और एआई रीडर।', icon: React.createElement(Icons.BookOpenIcon), roles: [UserRole.Student, UserRole.Teacher], category: ServiceCategory.LEARN_PRACTICE }
];

export const SERVICE_COMPONENTS: { [key in ServiceName]: React.LazyExoticComponent<React.ComponentType<any>> } = {
    'AI Tutor': AITutor,
    'AI Study Guru': SmartLibrary,
    'AI Virtual Lab': AiVirtualLab,
    'Smart Admissions': AdmissionForm,
    'Placement Forum': PlacementForum,
    'Student Database': StudentDatabase,
    'Fee Management': FeeManagement,
    'Attendance Log': AttendanceLog,
    'Face Attendance': FaceAttendance,
    'QR Attendance': QrAttendance,
    'AI Homework Hub': AIHomeworkHub,
    'Analytics Dashboard': AnalyticsDashboard,
    'Change Password': ChangePassword,
    'Franchise Configurator': FranchiseConfigurator,
    'Digital Notice Board': DigitalNoticeBoard,
    'Smart Proxy Manager': SmartProxyManager,
    'AI Teacher Evaluator': AITeacherEvaluator,
    'Recruitment Prep Guru': RecruitmentPrepGuru,
    'AI Medical Guru': MedicalGuru,
    'AI ITI Guru': ITIGuru,
    'AI Anatomy Lab': AIAnatomyLab,
    'AI Machine Workshop': AIMachineWorkshop,
    'Classroom': Classroom,
    'EduReels': EduReels,
    'AI Ad Generator': AIAdGenerator,
    'CV Generator': CVGenerator,
    'Online Exam': OnlineExam,
    'Progress Monitor': ProgressMonitor,
    'Campus Kart': SchoolStore,
    'Smart Canteen': SmartCanteen,
    'Test Paper Guru': TestGuru,
    'Access Control Center': React.lazy(() => import('../components/UserManagement')),
    'AI Video Generator': VideoGenerator,
    'Franchise Support': FranchiseSupport,
    'AI Certificate Generator': CertificateGenerator,
    'Placement Reporting': React.lazy(() => import('../components/AnalyticsDashboard')),
    'Leaderboard': Leaderboard,
    'AI Wellness Guru': WellnessGuru,
    'Interactive 3D Lab': Interactive3DLab,
    'Personalized Learning Path': PersonalizedLearningPath,
    'Automated Timetable Generator': AutomatedTimetableGenerator,
    'Skill Marketplace': SkillMarketplace,
    'Sports & Games Hub': SportsHub,
    'AI Interview Coach': AIInterviewCoach,
    'Know Your Rights': KnowYourRights,
    'Social Media Ad Generator': SocialMediaAdGenerator,
    'Smart Design Studio': SmartDesignStudio,
    'AI Sarkari Job Guru': AISarkariJobGuru,
    'NGO Connect': NgoConnect,
    'Auto-Dialer': AutoDialer,
    'Alumni Connect': AlumniConnect,
    'Career Simulator': CareerSimulator,
    'AI Code Lab': AICodeLab,
    'Daily Knowledge Shorts': DailyNews,
    'Smart Note Maker': SmartNoteMaker,
    'AI Flashcards': AIFlashcards,
    'Lost and Found': LostAndFound,
    'Video Guide': VideoGuide,
    'Exam Result Portal': ResultPortal,
    'Visitor Management': VisitorManagement,
    'Campus Messenger': CampusMessenger,
    'Inventory Manager': InventoryManager,
    'Smart Campus Calendar': SmartCampusCalendar,
    'Digital Locker': DigitalLocker,
    'Infirmary': InfirmaryManagement,
    'Campus Voting': CampusVoting,
    'Quiz Arena': QuizArena,
    'Focus Zone': FocusZone,
    'Campus Radio': CampusRadio,
    'AI Astro Guru': AIAstroGuru,
    'AI Finance Guru': AIFinanceGuru,
    'AI Cyber Smart': AICyberSmart,
    'Grievance Portal': GrievancePortal,
    'Psychometric Test': PsychometricTest,
    'Mess Management': MessManagement,
    'Smart Digital Diary': SmartDigitalDiary,
    'AI Website Builder': AIWebsiteBuilder,
    'Profit Calculator': ProfitCalculator,
    'Lead Generator': LeadGenerator,
    'AI Chemistry Lab': AIChemistryLab,
    'Spiritual Wellness': SpiritualWellnessHub,
    'Smart Transport': SmartTransport,
    'Smart HR Manager': SmartHRManager,
    'Vedic Math Lab': VedicMathLab,
    'AI Gallery': AIGallery,
    'Syllabus Tracker': SyllabusTracker,
    'AIElectricLab': AIElectricLab,
    'AIAgricultureLab': AIAgricultureLab,
    'Handwriting Coach': HandwritingCoach,
    'Hostel Management': HostelManagement,
    'AI Smart Board': AISmartBoard,
    'Parent Connect': ParentConnect,
    'Lesson Planner': LessonPlanner,
    'Career Predictor': CareerPredictor,
    'Parent Coach': ParentCoach,
    'Solar Study Clock': SolarStudyClock,
    'Safety SOS': SafetySOS,
    'AI Master Setup': AIMasterSetup,
    'Stability Analyzer': StabilityAnalyzer,
    'Anti-Fraud Shield': AntiFraudShield,
    '777 Authority Dashboard': AuthorityDashboard777,
    'Chief Talent Scientist': ChiefTalentScientist,
    'Employer Peace of Mind': EmployerPeaceOfMind,
    'Master Pitch Deck': MasterPitchDeck,
    'Smart Matching Engine': SmartMatchingEngine,
    'Custom Training Plan': CustomTrainingPlan,
    'Student Incubator': StudentIncubator,
    'Corporate Hiring Portal': CorporateHiringPortal,
    'Smart Brand Studio': SmartBrandStudio,
    'Data Import Wizard': DataImportWizard,
    'AI Gita Guru': AIGitaGuru,
    'AI Business Manager': AIBusinessManager, 
    'Book Exchange': BookExchange,
    'Meditation Studio': MeditationStudio,
    'AI Ayurveda Guru': AIAyurvedaGuru,
    'Metaverse Learning': MetaverseLearning,
    'AI Fashion Stylist': AIFashionStylist,
    'AIRoboticsLab': AIRoboticsLab,
    'AISpaceStation': AISpaceStation,
    'AI Universal Lab': AIUniversalLab,
    'Creative Studio': CreativeStudio,
    'Future Career Hub': FutureCareerHub,
    'Smart Admin Office': SmartAdminOffice,
    'Smart Library': SmartLibrary,
    'AI Parent Voice Hub': AIParentVoiceHub,
    'AI Maker Lab': AIMakerLab
};