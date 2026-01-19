
import React from 'react';
import { EduSarthiLogo, EnvelopeIcon, MapPinIcon, PhoneIcon, WhatsAppIcon, GlobeAltIcon, SparklesIcon } from '../icons/AllIcons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-950 text-white pt-24 pb-12 relative overflow-hidden border-t-4 border-white/5">
            <div className="absolute bottom-0 right-0 p-24 bg-primary/5 rounded-full blur-[100px] -mr-40 -mb-40"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
                    
                    {/* Brand Column */}
                    <div className="space-y-8 col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-xl shadow-white/5">
                                <EduSarthiLogo className="h-10 w-10"/>
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic">SURYA <span className="text-primary not-italic">SARTHI</span></span>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed font-hindi font-medium border-l-4 border-white/10 pl-4">
                            हम किताबी शिक्षा को आधुनिक हुनर में बदलने के लिए प्रतिबद्ध हैं। सूर्या एजुकेशन सार्थी - मंगमत का गौरव।
                        </p>
                        <div className="flex gap-4 pt-2">
                             <a href="https://wa.me/919817776765" className="p-3 bg-white/5 rounded-2xl hover:bg-green-500 transition-all text-white shadow-lg border border-white/10 hover:border-transparent group">
                                <WhatsAppIcon className="h-6 w-6 group-hover:scale-110 transition-transform"/>
                             </a>
                             <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-primary transition-all text-white shadow-lg border border-white/10 hover:border-transparent group">
                                <GlobeAltIcon className="h-6 w-6 group-hover:scale-110 transition-transform"/>
                             </a>
                        </div>
                    </div>

                    {/* Tech Hub Links */}
                    <div>
                        <h4 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px] opacity-40">AI Ecosystem</h4>
                        <ul className="space-y-4">
                            <li><a href="#features" className="text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:translate-x-2 duration-300"><SparklesIcon className="h-3 w-3"/> Smart Labs</a></li>
                            <li><a href="#services" className="text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:translate-x-2 duration-300"><SparklesIcon className="h-3 w-3"/> Global Bazaar</a></li>
                            <li><a href="#pricing" className="text-slate-400 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:translate-x-2 duration-300"><SparklesIcon className="h-3 w-3"/> Free Tier</a></li>
                        </ul>
                    </div>

                    {/* Regional Support Links */}
                    <div>
                        <h4 className="font-black text-white mb-8 uppercase tracking-[0.3em] text-[10px] opacity-40">Local Access</h4>
                        <ul className="space-y-6 text-sm font-bold text-slate-400">
                            <li className="flex items-start gap-4 group">
                                <MapPinIcon className="h-5 w-5 text-primary shrink-0 group-hover:text-white transition-colors"/>
                                <span className="font-hindi leading-tight group-hover:text-white transition-colors">ऋषि नगर, रोहतक, हरियाणा <br/><span className="text-[10px] text-slate-500 uppercase tracking-wider">Headquarters</span></span>
                            </li>
                            <li className="flex items-start gap-4 group">
                                <PhoneIcon className="h-5 w-5 text-primary shrink-0 group-hover:text-white transition-colors"/>
                                <a href="tel:919817776765" className="hover:text-white transition-colors group-hover:underline">+91 98177 76765</a>
                            </li>
                        </ul>
                    </div>

                    {/* Fast Contact Card */}
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                        <h4 className="font-black text-primary mb-4 uppercase text-[10px] tracking-widest">Need Help?</h4>
                        <p className="text-xs text-slate-400 font-hindi leading-relaxed mb-6 font-medium">क्या आपको एडमिशन या फ्रेंचाइजी में मदद चाहिए? हमारे एक्सपर्ट से बात करें।</p>
                        <a href="tel:919817776765" className="block w-full py-4 bg-primary text-slate-950 font-black rounded-2xl shadow-xl hover:bg-white transition-all uppercase tracking-widest text-[10px] text-center active:scale-95">Speak to Sarthi</a>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-400 transition-colors">
                        &copy; 2024 Surya Education Sarthi • Mangmat Students
                    </p>
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All AI Nodes Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
