
import React, { useState, useRef } from 'react';
import SectionWrapper from './SectionWrapper';
import { ALL_SERVICES } from '../../config/servicesConfig';
import { ArrowRightIcon, ArrowDownTrayIcon, SparklesIcon } from '../icons/AllIcons';
import { useToast } from '../../hooks/useToast';
import { useLanguage } from '../../contexts/LanguageContext';

// Fixed: Declare global types for jspdf and html2canvas
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const servicesToHighlight: string[] = [
    'Smart Admissions',
    'AI Video Generator',
    'Placement Forum',
    'Test Paper Guru',
    'Online Exam',
    'Skill Marketplace',
];

const ProgramsSection: React.FC = () => {
    const featuredServices = ALL_SERVICES.filter(service => servicesToHighlight.includes(service.name));
    const [isGenerating, setIsGenerating] = useState(false);
    const catalogRef = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const { t, language } = useLanguage();
    const isHindi = language === 'hi';

    const handleDownloadCatalog = async () => {
        if (!catalogRef.current) return;
        setIsGenerating(true);
        toast.info(t("Generating your high-quality AI catalog...", "आपका हाई-क्वालिटी AI कैटलॉग तैयार हो रहा है..."));

        try {
            const { jsPDF } = window.jspdf;
            const canvas = await window.html2canvas(catalogRef.current, { 
                scale: 2, 
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save('Education_Sarthi_AI_Catalog.pdf');
            toast.success(t("Catalog downloaded! Check your downloads folder.", "कैटलॉग डाउनलोड हो गया!"));
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error(t("Failed to generate PDF. Check browser permissions.", "पीडीएफ बनाने में विफल।"));
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <SectionWrapper id="services" className="bg-white relative overflow-hidden pt-32 pb-20">
            {/* Subtle background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>

            <div className="text-center max-w-4xl mx-auto mb-20 relative z-10">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                    <SparklesIcon className="h-4 w-4"/> AI Ecosystem
                </div>
                <h2 className={`text-4xl sm:text-6xl font-black text-slate-950 mb-6 tracking-tight ${isHindi ? 'font-hindi' : ''}`}>{t('A Universe of AI Excellence', 'AI टूल्स का एक नया ब्रह्मांड')}</h2>
                <p className="text-2xl sm:text-3xl text-primary font-black font-hindi mb-8">
                    {t('Everything you need to succeed is right here.', 'सफलता के लिए जो कुछ भी चाहिए, वह सब यहाँ है।')}
                </p>
                
                <div className="flex justify-center">
                    <button 
                        onClick={handleDownloadCatalog} 
                        disabled={isGenerating}
                        className="group flex items-center gap-4 px-10 py-5 bg-primary text-white font-black rounded-3xl hover:bg-slate-900 transition-all shadow-2xl shadow-primary/30 hover:-translate-y-1 disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                {t('Processing...', 'तैयार हो रहा है...')}
                            </span>
                        ) : (
                            <>
                                <ArrowDownTrayIcon className="h-6 w-6 group-hover:animate-bounce" />
                                <span className={isHindi ? 'font-hindi' : ''}>{t('Download Full Service Catalog', 'पूरी सेवाओं का कैटलॉग डाउनलोड करें')}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 px-4">
                {featuredServices.map((service, index) => (
                    <div
                        key={service.name}
                        className="group bg-white p-10 rounded-[3rem] shadow-soft transition-all duration-500 hover:shadow-2xl hover:border-primary/20 border border-slate-50 flex flex-col relative overflow-hidden"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110 group-hover:bg-primary/10"></div>

                        <div className="flex-shrink-0 bg-slate-50 text-primary p-5 rounded-3xl w-fit mb-8 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 shadow-sm border border-slate-100">
                             {React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: "h-10 w-10" })}
                        </div>
                        
                        <div className="flex-grow">
                            <h3 className="font-black text-2xl text-slate-900 mb-3 group-hover:text-primary transition-colors">{service.name}</h3>
                            <p className={`text-base text-slate-500 leading-relaxed font-medium ${isHindi ? 'font-hindi' : ''}`}>
                                {isHindi && service.hindiDescription ? service.hindiDescription : service.description}
                            </p>
                        </div>
                        
                        <div className="mt-10 pt-6 border-t border-slate-50">
                            <a href="#register" className={`text-sm font-black text-slate-950 inline-flex items-center gap-2 group-hover:gap-4 transition-all ${isHindi ? 'font-hindi' : ''}`}>
                                {t('Explore Module', 'मोड्यूल देखें')} <ArrowRightIcon className="h-5 w-5 text-primary" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hidden Printable Catalog Container */}
            <div className="absolute left-[-9999px] top-0 w-[210mm] bg-white text-slate-800" ref={catalogRef}>
                <div className="p-16 space-y-10">
                    <div className="text-center border-b-4 border-primary pb-8">
                        <h1 className="text-5xl font-black text-slate-950 uppercase tracking-tighter">EDUCATION SARTHI</h1>
                        <p className="text-2xl text-primary font-black mt-4 font-hindi">सफलता की नई दिशा - Service Guide</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {ALL_SERVICES.map((service, i) => (
                            <div key={i} className="flex items-start gap-6 p-6 border-2 border-slate-100 rounded-[2rem] break-inside-avoid bg-slate-50/50">
                                <div className="p-4 bg-white rounded-2xl text-primary shrink-0 border border-slate-100 shadow-sm">
                                     {React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: "h-10 w-10" })}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">{service.name}</h3>
                                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary mb-3">
                                        {service.category || 'Core System'}
                                    </span>
                                    <p className="text-sm text-slate-600 font-hindi font-medium leading-relaxed">
                                         {isHindi && service.hindiDescription ? service.hindiDescription : service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center text-slate-400 text-xs pt-10 border-t-2 border-slate-100">
                        <p className="font-bold">Generated by Education Sarthi AI Intelligence • www.educationsarthi.com</p>
                        <p className="mt-2">&copy; {new Date().getFullYear()} Education Sarthi. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default ProgramsSection;
