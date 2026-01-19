
import React from 'react';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '../icons/AllIcons';
import { useToast } from '../../hooks/useToast';
import SectionWrapper from './SectionWrapper';
import { useLanguage } from '../../contexts/LanguageContext';

const ContactSection: React.FC = () => {
    const toast = useToast();
    const { t, language } = useLanguage();
    const isHindi = language === 'hi';
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        toast.success(t('Thank you! Your message has been received.', 'धन्यवाद! आपका संदेश प्राप्त हो गया है।'));
        form.reset();
    };
    
    return (
        <SectionWrapper id="contact" className="bg-gradient-radial-at-top">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className={`text-3xl sm:text-4xl font-bold text-slate-900 ${isHindi ? 'font-hindi' : ''}`}>{t('Get in Touch', 'संपर्क करें')}</h2>
                <p className={`mt-4 text-base sm:text-lg text-slate-600 ${isHindi ? 'font-hindi' : ''}`}>{t("Have questions or want to learn more about our franchise opportunities? We'd love to hear from you.", "क्या आपके पास कोई प्रश्न है या आप हमारे फ्रैंचाइज़ी अवसरों के बारे में अधिक जानना चाहते हैं? हमें आपसे सुनना अच्छा लगेगा।")}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8">
                    <div className="flex items-start gap-4"><MapPinIcon aria-hidden="true" className="h-8 w-8 text-primary flex-shrink-0 mt-1" /><div><h4 className={`font-semibold ${isHindi ? 'font-hindi' : ''}`}>{t('Our Address', 'हमारा पता')}</h4><p className="text-slate-600">Mangmat Campus, Haryana, India</p></div></div>
                    <div className="flex items-start gap-4"><PhoneIcon aria-hidden="true" className="h-8 w-8 text-primary flex-shrink-0 mt-1" /><div><h4 className={`font-semibold ${isHindi ? 'font-hindi' : ''}`}>{t('Call Us', 'कॉल करें')}</h4><a href="tel:919817776765" className="text-slate-600 hover:text-primary transition-colors">+91 98177 76765</a></div></div>
                    <div className="flex items-start gap-4"><EnvelopeIcon aria-hidden="true" className="h-8 w-8 text-primary flex-shrink-0 mt-1" /><div><h4 className={`font-semibold ${isHindi ? 'font-hindi' : ''}`}>{t('Email Us', 'ईमेल करें')}</h4><a href="mailto:contact@educationsarthi.com" className="text-slate-600 hover:text-primary underline">contact@educationsarthi.com</a></div></div>
                </div>
                <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-soft border border-slate-200/80">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div><label htmlFor="name" className="sr-only">Full Name</label><input type="text" name="name" id="name" placeholder={t("Full Name", "पूरा नाम")} className={`block w-full rounded-md border-slate-300 shadow-sm p-3 focus:ring-2 focus:ring-primary ${isHindi ? 'font-hindi' : ''}`} required /></div>
                            <div><label htmlFor="email" className="sr-only">Email Address</label><input type="email" name="email" id="email" placeholder={t("Email Address", "ईमेल पता")} className={`block w-full rounded-md border-slate-300 shadow-sm p-3 focus:ring-2 focus:ring-primary ${isHindi ? 'font-hindi' : ''}`} required /></div>
                        </div>
                        <div>
                            <label htmlFor="subject" className="sr-only">Subject</label>
                            <input type="text" name="subject" id="subject" placeholder={t("Subject", "विषय")} className={`block w-full rounded-md border-slate-300 shadow-sm p-3 focus:ring-2 focus:ring-primary ${isHindi ? 'font-hindi' : ''}`} required />
                        </div>
                        <div>
                            <label htmlFor="message" className="sr-only">Message</label>
                            <textarea name="message" id="message" rows={4} placeholder={t("Your Message", "आपका संदेश")} className={`block w-full rounded-md border-slate-300 shadow-sm p-3 focus:ring-2 focus:ring-primary ${isHindi ? 'font-hindi' : ''}`} required></textarea>
                        </div>
                        <div>
                            <button type="submit" className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors ${isHindi ? 'font-hindi' : ''}`}>
                                {t('Send Message', 'संदेश भेजें')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default ContactSection;
