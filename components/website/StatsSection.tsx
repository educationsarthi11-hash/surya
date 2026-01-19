
import React, { useState, useEffect, useRef } from 'react';
import { AcademicCapIcon, BookOpenIcon, GlobeAltIcon, UsersIcon } from '../icons/AllIcons';
import SectionWrapper from './SectionWrapper';
import { useLanguage } from '../../contexts/LanguageContext';

const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                let start = 0;
                const startTime = performance.now();
                const animate = (currentTime: number) => {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    start = Math.floor(easeOut * end);
                    setCount(start);
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
                observer.unobserve(element);
            }
        }, { threshold: 0.5 });
        observer.observe(element);
        return () => {
            if(element) observer.unobserve(element);
        };
    }, [end, duration]);

    return { count, ref };
};

interface StatCardProps {
    icon: React.ReactNode;
    end: number;
    label: string;
    suffix?: string;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, end, label, suffix = '', color }) => {
    const { count, ref } = useCountUp(end);
    return (
        <div className="text-center p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `h-8 w-8 ${color.replace('bg-', 'text-')}` })}
            </div>
            <p className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">
                <span ref={ref}>{count.toLocaleString()}</span>{suffix}+
            </p>
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest font-hindi">{label}</p>
        </div>
    );
};

const StatsSection: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <SectionWrapper id="stats" className="relative !py-0 -mt-20 z-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                <StatCard icon={<BookOpenIcon />} end={150} label={t("stat_courses", "AI पाठ्यक्रम")} color="bg-blue-500" />
                <StatCard icon={<UsersIcon />} end={12500} label={t("stat_students", "छात्र")} color="bg-orange-500" />
                <StatCard icon={<AcademicCapIcon />} end={850} label={t("stat_schools", "स्कूल")} color="bg-purple-500" />
                <StatCard icon={<GlobeAltIcon />} end={12} label={t("stat_countries", "देश")} color="bg-green-500" />
            </div>
        </SectionWrapper>
    );
};

export default StatsSection;
