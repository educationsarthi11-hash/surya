import React from 'react';
import SectionWrapper from './SectionWrapper';
import { useLanguage } from '../../contexts/LanguageContext';
import { AcademicCapIcon, UserGroupIcon, VideoCameraIcon, BriefcaseIcon, SparklesIcon, GlobeAltIcon, BookOpenIcon } from '../icons/AllIcons';

const ServiceCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; color: string }> = ({ title, desc, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 group">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${color} text-white shadow-lg transform group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
);

const ServicesSection: React.FC = () => {
    const { t, language } = useLanguage();
    const isHindi = language === 'hi';

    const services = [
        {
            title: t('Smart Admissions', 'स्मार्ट प्रवेश'),
            desc: t('AI-powered admission forms that autofill details from documents.', 'दस्तावेजों से विवरण ऑटोफिल करने वाले एआई-संचालित प्रवेश फॉर्म।'),
            icon: <UserGroupIcon className="h-7 w-7" />,
            color: 'bg-blue-500'
        },
        {
            title: t('AI Tutor', 'AI ट्यूटर'),
            desc: t('Scan books and solve doubts instantly with personalized AI guidance.', 'किताबों को स्कैन करें और व्यक्तिगत AI मार्गदर्शन के साथ तुरंत संदेह दूर करें।'),
            icon: <BookOpenIcon className="h-7 w-7" />,
            color: 'bg-purple-500'
        },
        {
            title: t('Placement Cell', 'प्लेसमेंट सेल'),
            desc: t('Connect students directly with top hiring companies.', 'छात्रों को सीधे शीर्ष भर्ती कंपनियों से जोड़ें।'),
            icon: <BriefcaseIcon className="h-7 w-7" />,
            color: 'bg-green-500'
        },
        {
            title: t('Global Expansion', 'वैश्विक विस्तार'),
            desc: t('Tools to manage multi-city franchises easily.', 'बहु-शहर फ्रेंचाइजी को आसानी से प्रबंधित करने के उपकरण।'),
            icon: <GlobeAltIcon className="h-7 w-7" />,
            color: 'bg-orange-500'
        },
        {
            title: t('Exam Portal', 'परीक्षा पोर्टल'),
            desc: t('Secure online exams with AI proctoring.', 'AI निगरानी के साथ सुरक्षित ऑनलाइन परीक्षा।'),
            icon: <AcademicCapIcon className="h-7 w-7" />,
            color: 'bg-indigo-500'
        }
    ];

    return (
        <SectionWrapper id="services-grid" className="bg-slate-50">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-primary font-bold tracking-wider text-xs uppercase bg-primary/10 px-3 py-1 rounded-full">{t('Our Ecosystem', 'हमारा इकोसिस्टम')}</span>
                <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 mt-4 ${isHindi ? 'font-hindi' : ''}`}>
                    {t('Tools for Every Need', 'हर जरूरत के लिए उपकरण')}
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                    {t('A complete suite of applications to manage your educational institution.', 'आपके शैक्षणिक संस्थान के प्रबंधन के लिए अनुप्रयोगों का एक पूरा सूट।')}
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((s, i) => (
                    <ServiceCard key={i} {...s} />
                ))}
            </div>
        </SectionWrapper>
    );
};

export default ServicesSection;
