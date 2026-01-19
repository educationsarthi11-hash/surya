
import { LocationType } from '../types';

// विस्तृत मैपिंग: भारत के राज्य और दुनिया के देश
export const stateBoardMapping: { [key: string]: string[] } = {
    "Delhi": ["CBSE", "ICSE", "NIOS", "DBSE (Delhi Board)", "GGSIPU Admission"],
    "Haryana": ["HBSE (BSEH)", "CBSE", "NIOS", "KUK Entrance", "MDU Admission"],
    "Uttar Pradesh": ["UPMSP (UP Board)", "CBSE", "ICSE", "AKTU Admission"],
    "Rajasthan": ["RBSE", "CBSE", "ICSE", "RU Admission"],
    "Maharashtra": ["MSBSHSE (SSC/HSC)", "ICSE", "CBSE", "MU Admission"],
    "Bihar": ["BSEB (Bihar Board)", "CBSE", "ICSE"],
    "Madhya Pradesh": ["MPBSE", "CBSE"],
    "Punjab": ["PSEB", "CBSE", "ICSE"],
    "West Bengal": ["WBBSE", "WBCHSE", "ICSE", "CBSE"],
    "Tamil Nadu": ["TN State Board", "Matriculation", "CBSE"],
    "Karnataka": ["KSEEB", "PUC Board", "CBSE", "ICSE"],
    "Odisha": ["CHSE (Odisha Board)", "CBSE", "ICSE"],
    "Kerala": ["KBPE (Kerala Board)", "CBSE", "ICSE"],
    "Gujarat": ["GSEB (Gujarat Board)", "CBSE", "ICSE"],
    "USA": ["American High School (K-12)", "IB Diploma", "Common Core", "SAT Prep"],
    "UK": ["GCSE", "A-Levels", "Cambridge International", "UCAS Application"],
    "International / Global": ["IB Diploma", "Cambridge IGCSE/A-Levels", "American AP", "Global IELTS/SAT"],
    "Other State": ["CBSE", "ICSE", "Regional State Board", "NIOS"]
};

export const getBoardsForType = (type: LocationType, location: string = "Haryana"): string[] => {
    // Default school boards for the state
    const schoolBoards = stateBoardMapping[location] || stateBoardMapping["Other State"];
    
    switch (type) {
        case LocationType.School:
            return schoolBoards;
            
        case LocationType.CoachingCenter:
            return [
                "UPSC (IAS/IPS)", "HTET / CTET (Teaching)", "HSSC / CET (Haryana)", 
                "JEE Mains", "JEE Advanced", "NEET-UG", "SSC CGL", "Banking (IBPS)", 
                "Defence (NDA/CDS)", "CLAT (Law)", "CA Foundation", "GATE", "CAT (MBA)"
            ];
            
        case LocationType.College:
            return [
                "University Semester Exams", "Internal Assessment", 
                "M.D.U Rohtak", "K.U.K Kurukshetra", "Delhi University", 
                "G.J.U Hisar", "IGNOU", "Technical University", "Private University"
            ];
            
        case LocationType.University:
            return [
                "Ph.D. Entrance", "UGC NET/JRF", "CSIR NET", "Post-Graduate Exams", 
                "Research Methodology", "Semester System (CBCS)", "Annual System"
            ];
            
        case LocationType.ITI:
        case LocationType.TechnicalInstitute:
            return [
                "NCVT (National Council)", "SCVT (State Council)", 
                "Apprenticeship Exam", "CITS / CTI Entrance", 
                "Polytechnic Diploma", "DGCA Exams"
            ];
            
        case LocationType.Corporate:
            return ["Corporate Training", "HR Compliance", "Soft Skills Assessment", "Technical Interview"];

        default:
            return ["General Education", "Skill Development", "CBSE", "State Board"];
    }
};

// --- GLOBAL COUNTRY MASTER CATALOG ---
// This defines the specific course structure for every major country.
export const COUNTRY_MASTER_CATALOG: { [country: string]: { [type in LocationType]?: string[] } } = {
    // 1. INDIA (Indian System)
    "India": {
        [LocationType.School]: [
            'Play School', 'Nursery', 'LKG', 'UKG', 
            'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
            'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
            'Class 11 (Arts)', 'Class 11 (Commerce)', 'Class 11 (Science)',
            'Class 12 (Arts)', 'Class 12 (Commerce)', 'Class 12 (Science)'
        ],
        [LocationType.College]: ['B.A.', 'B.Sc.', 'B.Com', 'B.Tech', 'B.B.A', 'B.C.A', 'M.B.B.S', 'B.Ed', 'LLB'],
        [LocationType.University]: ['M.A.', 'M.Sc.', 'M.Com', 'M.Tech', 'M.B.A.', 'Ph.D.', 'M.Phil'],
        [LocationType.ITI]: ['Electrician', 'Fitter', 'Welder', 'COPA', 'Diesel Mechanic', 'Stenographer'],
    },

    // 2. USA & CANADA (North American System: K-12)
    "United States": {
        [LocationType.School]: [
            'Preschool', 'Pre-K', 'Kindergarten', 
            '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
            '6th Grade (Middle)', '7th Grade', '8th Grade',
            '9th Grade (Freshman)', '10th Grade (Sophomore)', '11th Grade (Junior)', '12th Grade (Senior)',
            'AP Courses', 'IB Diploma Program'
        ],
        [LocationType.College]: ['Associate Degree (2 Years)', 'Bachelor of Arts (BA)', 'Bachelor of Science (BS)', 'Pre-Med', 'Pre-Law'],
        [LocationType.University]: ['Master of Arts (MA)', 'Master of Science (MS)', 'MBA', 'Juris Doctor (JD)', 'MD (Medical)', 'PhD'],
    },
    "Canada": {
        [LocationType.School]: [
            'Junior Kindergarten', 'Senior Kindergarten', 
            'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
            'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
            'CEGEP (Quebec)'
        ],
        [LocationType.College]: ['Diploma Program', 'Advanced Diploma', 'Bachelor Degree'],
        [LocationType.University]: ['Master Degree', 'Doctoral Degree'],
    },

    // 3. UK, AUSTRALIA, NEW ZEALAND (British System: Years)
    "United Kingdom": {
        [LocationType.School]: [
            'Reception (EYFS)', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
            'Year 7', 'Year 8', 'Year 9', 'Year 10 (GCSE)', 'Year 11 (GCSE)',
            'Year 12 (Sixth Form / A-Level)', 'Year 13 (Sixth Form / A-Level)'
        ],
        [LocationType.College]: ['Foundation Degree', 'HNC/HND', 'Bachelor (Hons)'],
        [LocationType.University]: ['Masters (MA/MSc)', 'PhD / DPhil'],
    },
    "Australia": {
        [LocationType.School]: [
            'Prep / Kindy', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
            'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11 (VCE/HSC)', 'Year 12 (VCE/HSC)'
        ],
        [LocationType.College]: ['TAFE Certificate III', 'TAFE Certificate IV', 'Diploma'],
    },

    // 4. EUROPE (Germany, France)
    "Germany": {
        [LocationType.School]: [
            'Kindergarten', 'Grundschule (Grades 1-4)', 
            'Hauptschule (Grades 5-9)', 'Realschule (Grades 5-10)', 
            'Gymnasium (Grades 5-12/13 - Abitur)', 'Gesamtschule'
        ],
        [LocationType.TechnicalInstitute]: ['Ausbildung (Vocational Training)', 'Berufsschule'],
        [LocationType.University]: ['Bachelor', 'Master', 'Diplom', 'Promotion (PhD)'],
    },
    "France": {
        [LocationType.School]: [
            'Maternelle', 'CP', 'CE1', 'CE2', 'CM1', 'CM2', // Primaire
            '6ème', '5ème', '4ème', '3ème (Brevet)', // Collège
            'Seconde', 'Première', 'Terminale (Baccalauréat)' // Lycée
        ],
        [LocationType.University]: ['Licence (Bachelor)', 'Master', 'Doctorat'],
    },

    // 5. ASIA (Japan, China, Singapore)
    "Japan": {
        [LocationType.School]: [
            'Yochien (Kindergarten)', 
            'Sho-gakkou Grade 1', 'Sho-gakkou Grade 2', 'Sho-gakkou Grade 3', 'Sho-gakkou Grade 4', 'Sho-gakkou Grade 5', 'Sho-gakkou Grade 6',
            'Chu-gakkou (Jr High) Year 1', 'Chu-gakkou Year 2', 'Chu-gakkou Year 3',
            'Kou-kou (High School) Year 1', 'Kou-kou Year 2', 'Kou-kou Year 3'
        ],
        [LocationType.University]: ['Daigaku (Bachelor)', 'Daigaku-in (Graduate School)'],
    },
    "China": {
        [LocationType.School]: [
            'Primary Grade 1', 'Primary Grade 2', 'Primary Grade 3', 'Primary Grade 4', 'Primary Grade 5', 'Primary Grade 6',
            'Junior Middle Grade 7', 'Junior Middle Grade 8', 'Junior Middle Grade 9 (Zhongkao)',
            'Senior Middle Grade 10', 'Senior Middle Grade 11', 'Senior Middle Grade 12 (Gaokao)'
        ],
    },
    "Singapore": {
        [LocationType.School]: [
            'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6 (PSLE)',
            'Secondary 1', 'Secondary 2', 'Secondary 3', 'Secondary 4 (O-Levels)',
            'Junior College 1', 'Junior College 2 (A-Levels)'
        ],
    },

    // 6. MIDDLE EAST (UAE, Saudi Arabia)
    "United Arab Emirates": {
        [LocationType.School]: [
            'KG 1', 'KG 2', 
            'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
            'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10 (IGCSE/CBSE)',
            'Grade 11 (AS-Level/CBSE)', 'Grade 12 (A-Level/CBSE)'
        ],
    },

    // 7. SOUTH AMERICA (Brazil)
    "Brazil": {
        [LocationType.School]: [
            'Educação Infantil',
            'Ensino Fundamental 1-5', 'Ensino Fundamental 6-9',
            'Ensino Médio 1º Ano', 'Ensino Médio 2º Ano', 'Ensino Médio 3º Ano'
        ],
    },

    // 8. RUSSIA
    "Russia": {
        [LocationType.School]: [
            'Elementary (Grades 1-4)',
            'Middle (Grades 5-9)',
            'Senior (Grades 10-11 - EGE Exam)'
        ],
    },

    // DEFAULT INTERNATIONAL FALLBACK
    "International": {
        [LocationType.School]: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'IGCSE', 'IB MYP', 'IB DP'],
        [LocationType.College]: ['Undergraduate (UG)', 'Bachelor Degree'],
        [LocationType.University]: ['Postgraduate (PG)', 'Masters', 'Doctorate']
    }
};

// पूर्ण कोर्स कैटलॉग - भारत के सभी कोर्स (Ph.D, Medical, Engineering, Arts, etc.)
// This acts as the default fallback
export const courseCatalog: { [key in LocationType]?: string[] } = COUNTRY_MASTER_CATALOG["India"];

// Helper function to get courses based on selected country
export const getLocalizedCourseList = (country: string, type: LocationType): string[] => {
    // 1. Direct Match (Exact name)
    if (COUNTRY_MASTER_CATALOG[country] && COUNTRY_MASTER_CATALOG[country][type]) {
        return COUNTRY_MASTER_CATALOG[country][type]!;
    }
    
    // 2. Partial/Alias Match (e.g. "UAE" -> "United Arab Emirates", "UK" -> "United Kingdom")
    const countryKey = Object.keys(COUNTRY_MASTER_CATALOG).find(c => 
        country.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(country.toLowerCase())
    );
    
    if (countryKey && COUNTRY_MASTER_CATALOG[countryKey][type]) {
        return COUNTRY_MASTER_CATALOG[countryKey][type]!;
    }

    // 3. Region Fallbacks based on string detection
    if (country === 'Bharat') return COUNTRY_MASTER_CATALOG["India"][type]!;
    if (country.includes('Emirates') || country.includes('Dubai')) return COUNTRY_MASTER_CATALOG["United Arab Emirates"][type]!;
    if (country.includes('America') || country.includes('USA')) return COUNTRY_MASTER_CATALOG["United States"][type]!;

    // 4. Global Fallback
    return COUNTRY_MASTER_CATALOG["International"][type] || COUNTRY_MASTER_CATALOG["India"][type] || [];
};

export const allLevels = Object.values(courseCatalog).flat();

export const getDefaultClassesForType = (type: LocationType): string[] => {
    return courseCatalog[type] || ['General Academic Path'];
};

// AUTO BOOK MAPPING DATA (NEW)
export const subjectBookMapping: { [className: string]: { [subject: string]: string } } = {
    'Class 5': {
        'Hindi': 'Rimjhim (रिमझिम)',
        'English': 'Marigold (मैरीगोल्ड)',
        'Mathematics': 'Math Magic (गणित का जादू)',
        'EVS': 'Looking Around (आस-पास)'
    },
    'Class 4': {
        'Hindi': 'Rimjhim (रिमझिम)',
        'English': 'Marigold',
        'Mathematics': 'Math Magic',
        'EVS': 'Looking Around'
    },
     'Class 3': {
        'Hindi': 'Rimjhim',
        'English': 'Marigold',
        'Mathematics': 'Math Magic',
        'EVS': 'Looking Around'
    },
    'Class 6': {
        'Hindi': 'Vasant (वसंत)',
        'English': 'Honeysuckle',
        'Mathematics': 'Mathematics (NCERT)',
        'Science': 'Science (NCERT)',
        'Social Science': 'Our Pasts (History)'
    },
    'Class 10': {
        'Hindi': 'Kshitij / Kritika',
        'English': 'First Flight / Footprints',
        'Mathematics': 'Mathematics (NCERT)',
        'Science': 'Science (NCERT)',
        'Social Science': 'India and Contemporary World'
    }
};

export const bookData: { [className: string]: { [board: string]: { [company: string]: string[] } } } = {
    'Class 10': {
        'CBSE': { 'NCERT': ['Science', 'Mathematics', 'English', 'History'] }
    },
    'HTET - Level 2 (TGT)': {
        'HTET': { 'Standard': ['Child Development (CDP)', 'Hindi', 'English', 'Haryana GK', 'Subject Specific'] }
    }
};

export const bookChapterMap: { [bookName: string]: string[] } = {
    "NCERT Science": ["Ch 1: Chemical Reactions", "Ch 2: Acids, Bases", "Ch 3: Metals", "Ch 4: Life Processes"],
    "Child Development (CDP)": ["Growth & Development", "Learning Theories", "Inclusive Education"]
};

// FULLY UPDATED SUBJECT LIST FOR ALL CLASSES (Including University, PhD, etc.)
export const getSubjectsForClass = (className: string) => {
    // 0. PhD & Research
    if (className.startsWith('Ph.D') || className.startsWith('M.Phil') || className.includes('Doctoral')) {
        return [
            { name: 'Research Methodology', hindi: 'अनुसंधान पद्धति', icon: 'BookOpenIcon' },
            { name: 'Subject Specialization', hindi: 'मुख्य विषय (Specialization)', icon: 'AcademicCapIcon' },
            { name: 'Thesis Writing', hindi: 'थीसिस लेखन', icon: 'PencilSquareIcon' },
            { name: 'Data Analysis', hindi: 'डेटा विश्लेषण', icon: 'ChartBarIcon' },
            { name: 'Research Ethics', hindi: 'अनुसंधान नैतिकता', icon: 'ScaleIcon' },
            { name: 'Publication Guide', hindi: 'प्रकाशन गाइड', icon: 'DocumentTextIcon' }
        ];
    }

    // 0. University - Engineering & Tech (B.Tech, BCA, MCA, M.Tech)
    if (className.includes('B.Tech') || className.includes('B.E.') || className.includes('B.C.A.') || className.includes('M.C.A.') || className.includes('M.Tech') || className.includes('Polytechnic')) {
        return [
            { name: 'Core Subject', hindi: 'मुख्य विषय (Core)', icon: 'CpuChipIcon' },
            { name: 'Programming', hindi: 'प्रोग्रामिंग (Coding)', icon: 'CodeBracketIcon' },
            { name: 'Mathematics', hindi: 'इंजीनियरिंग गणित', icon: 'CalculatorIcon' },
            { name: 'Electronics', hindi: 'इलेक्ट्रॉनिक्स', icon: 'BoltIcon' },
            { name: 'Lab Work', hindi: 'प्रैक्टिकल / लैब', icon: 'BeakerIcon' },
            { name: 'Project Work', hindi: 'प्रोजेक्ट वर्क', icon: 'BriefcaseIcon' }
        ];
    }

    // 0. University - Medical (MBBS, BDS, Pharma, Nursing)
    if (className.includes('M.B.B.S') || className.includes('B.D.S') || className.includes('Pharma') || className.includes('Nursing') || className.includes('Ayurveda') || className.includes('Homeopathy')) {
        return [
            { name: 'Anatomy', hindi: 'शारीरिक रचना (Anatomy)', icon: 'UserCircleIcon' },
            { name: 'Physiology', hindi: 'शरीर क्रिया विज्ञान', icon: 'HeartIcon' },
            { name: 'Biochemistry', hindi: 'बायोकेमिस्ट्री', icon: 'BeakerIcon' },
            { name: 'Pharmacology', hindi: 'दवा विज्ञान', icon: 'BeakerIcon' },
            { name: 'Pathology', hindi: 'रोग विज्ञान', icon: 'BugAntIcon' },
            { name: 'Practical', hindi: 'प्रैक्टिकल', icon: 'ClipboardDocumentCheckIcon' }
        ];
    }

    // Default School Subjects (Class 1-12)
    return [
        { name: 'Mathematics', hindi: 'गणित', icon: 'CalculatorIcon' },
        { name: 'Science', hindi: 'विज्ञान', icon: 'BeakerIcon' },
        { name: 'English', hindi: 'अंग्रेजी', icon: 'BookOpenIcon' },
        { name: 'Hindi', hindi: 'हिन्दी', icon: 'BookOpenIcon' },
        { name: 'Social Science', hindi: 'सामाजिक विज्ञान', icon: 'GlobeAltIcon' },
        { name: 'Sanskrit', hindi: 'संस्कृत', icon: 'BookOpenIcon' },
        { name: 'Computer Science', hindi: 'कंप्यूटर', icon: 'CpuChipIcon' },
        { name: 'General Knowledge', hindi: 'सामान्य ज्ञान', icon: 'SparklesIcon' }
    ];
};

export const boardsAndExamsList = [
    "UPSC Civil Services",
    "SSC CGL",
    "IBPS PO",
    "SBI PO",
    "RRB NTPC",
    "JEE Mains",
    "NEET UG",
    "CAT",
    "CLAT",
    "GATE",
    "NDA",
    "CDS"
];

export const standardBookSets: { [key: string]: string[] } = {
    "School-CBSE-Class-10": ["NCERT Mathematics", "NCERT Science", "India and the Contemporary World II", "Democratic Politics II"],
    "School-HBSE (BSEH)-Class-10": ["NCERT Ganit", "NCERT Vigyan", "Bharat Aur Samkalin Vishwa"],
    "default": ["Standard Curriculum Textbooks"]
};
