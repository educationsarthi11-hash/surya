
import React, { useState } from 'react';
// Fix: Replaced CurrencyDollarIcon with BanknotesIcon as it was not exported from AllIcons
import { AcademicCapIcon, SparklesIcon, BriefcaseIcon, KeyIcon, UsersIcon, GlobeAltIcon, BuildingLibraryIcon, BanknotesIcon, ChatBubbleIcon, VideoCameraIcon, PencilSquareIcon, UserPlusIcon, MapPinIcon } from './icons/AllIcons';

const FeatureCard: React.FC<{icon: React.ReactNode; title: string; children: React.ReactNode}> = ({ icon, title, children }) => (
    <div className="bg-white p-4 rounded-lg shadow-soft border border-neutral-200">
        <div className="flex items-center mb-2">
            <div className="text-primary">{icon}</div>
            <h4 className="ml-2 font-bold text-md text-neutral-800">{title}</h4>
        </div>
        <div className="text-sm text-neutral-600 space-y-1">{children}</div>
    </div>
);

const Section: React.FC<{id: string, title: string; icon: React.ReactNode; children: React.ReactNode}> = ({ title, icon, children }) => (
     <div className="mb-8">
        <div className="flex items-center mb-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">{icon}</div>
            <h3 className="ml-4 text-xl font-bold text-neutral-900">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b last:border-b-0 border-neutral-200">
            <button
                className="w-full text-left py-3 px-4 flex justify-between items-center hover:bg-neutral-100/50 focus:outline-none focus:bg-neutral-100"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-neutral-700">{title}</span>
                <svg className={`h-5 w-5 transform transition-transform text-neutral-500 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 bg-neutral-50 border-t border-neutral-200">
                    {children}
                </div>
            )}
        </div>
    );
};

const EducationSarthiBlueprint: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neutral-900">
                    Education Sarthi: <span className="font-hindi">सफलता की नई दिशा</span> (Final Mega-Blueprint)
                </h2>
                 <p className="mt-2 text-md text-neutral-600 max-w-4xl mx-auto">
                    <span className="font-bold">Tagline:</span> <span className="font-hindi">सफलता की नई दिशा</span> (New Direction of Success)
                </p>
                <p className="mt-2 text-md text-neutral-600 max-w-4xl mx-auto font-hindi">
                    यह एक भविष्य-उन्मुख (Future-Forward) प्लेटफॉर्म है जो स्कूल से लेकर करियर तक हर स्तर की शिक्षा, प्रतियोगी परीक्षा, कौशल विकास, AI-आधारित सीख, 3D सिमुलेशन, वॉयस कमांड, ब्लॉकचेन सर्टिफिकेट, NGO-CSR एकीकरण, और माइक्रो-फ्रेंचाइजी सिस्टम को एक ही स्थान पर जोड़कर शिक्षा, तकनीक और रोज़गार को एक ही ब्रह्मांड में समाहित करता है।
                </p>
            </div>
            
            <div className="space-y-10">
                {/* Section I */}
                <Section id="content-library" title="I. 📚 कंटेंट और AI लाइब्रेरी: सब कुछ यहाँ है!" icon={<BuildingLibraryIcon className="h-7 w-7" />}>
                    <FeatureCard title="बुक लाइब्रेरी (विस्तारित)" icon={<AcademicCapIcon className="h-5 w-5" />}>
                        <p className="text-xs mb-4">Our platform provides a comprehensive digital library covering the entire Indian academic spectrum. Students can select their board, class, and subject to access AI-powered learning tools, generate study materials, and take practice tests.</p>
                        <div className="text-xs border border-neutral-200 rounded-md bg-white">
                            <CollapsibleSection title="Primary School (Classes 1–5)" defaultOpen={true}>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>Hindi – Rimjhim 1 to 5 (NCERT) / <span className="font-hindi">हिंदी – रिमझिम भाग 1 से 5</span></li>
                                    <li>English – Marigold 1 to 5 / <span className="font-hindi">अंग्रेज़ी – मेरीगोल्ड</span></li>
                                    <li>Mathematics – Math Magic (Primary & Middle) / <span className="font-hindi">गणित – मैथ मैजिक</span></li>
                                    <li>Environmental Studies – Looking Around / <span className="font-hindi">पर्यावरण अध्ययन – आस-पास की दुनिया</span></li>
                                    <li>Moral Education – Moral Stories & Naitik Shiksha / <span className="font-hindi">नैतिक शिक्षा व कहानियाँ</span></li>
                                    <li>Computer – Introduction to Computers / <span className="font-hindi">कंप्यूटर – परिचय और प्रयोग</span></li>
                                </ul>
                            </CollapsibleSection>
                            <CollapsibleSection title="Middle & Secondary School (Classes 6–10)">
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>Hindi (Vasant, Durva, Bal Ramkatha, Kritika, Kshitij, Sparsh, Sanchayan) / <span className="font-hindi">हिंदी – वसंत, दूर्वा, बाल रामकथा, कृतिका, क्षितिज, स्पर्श, संचयन</span></li>
                                    <li>English (Honeysuckle, Beehive, Footprints Without Feet) / <span className="font-hindi">अंग्रेज़ी – हनीसकल, बिहाइव, फुटप्रिंट्स विदआउट फीट</span></li>
                                    <li>Science (NCERT Textbooks) / <span className="font-hindi">विज्ञान – एनसीईआरटी पाठ्यपुस्तक</span></li>
                                    <li>Mathematics (NCERT 6–10) / <span className="font-hindi">गणित – एनसीईआरटी कक्षा 6–10</span></li>
                                    <li>Social Science – History, Geography, Civics, Economics / <span className="font-hindi">सामाजिक विज्ञान – इतिहास, भूगोल, नागरिक शास्त्र, अर्थशास्त्र</span></li>
                                    <li>Sanskrit – Ruchira 1 to 3 / <span className="font-hindi">संस्कृत – रुचिरा 1 से 3</span></li>
                                    <li>Computer Science – Basic IT & Coding / <span className="font-hindi">कंप्यूटर – मूल आईटी एवं कोडिंग</span></li>
                                    <li>Moral Education – Sanatan Value System / <span className="font-hindi">नैतिक शिक्षा – सनातन मूल्य प्रणाली</span></li>
                                </ul>
                            </CollapsibleSection>
                             <CollapsibleSection title="Senior Secondary School (Classes 11–12)">
                                <div className="space-y-3">
                                    <div>
                                        <h5 className="font-bold">Science Stream</h5>
                                        <ul className="list-disc list-inside space-y-1 pl-4">
                                            <li>Physics – <span className="font-hindi">भौतिक विज्ञान (NCERT Part 1 & 2)</span></li>
                                            <li>Chemistry – <span className="font-hindi">रसायन विज्ञान (NCERT Part 1 & 2)</span></li>
                                            <li>Biology – <span className="font-hindi">जीव विज्ञान (NCERT Part 1 & 2)</span></li>
                                            <li>Mathematics – <span className="font-hindi">गणित (NCERT Part 1 & 2)</span></li>
                                            <li>English Core – <span className="font-hindi">अंग्रेज़ी कोर</span></li>
                                            <li>Computer Science / Physical Education – <span className="font-hindi">कंप्यूटर विज्ञान / शारीरिक शिक्षा</span></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-bold">Commerce Stream</h5>
                                        <ul className="list-disc list-inside space-y-1 pl-4">
                                            <li>Accountancy – <span className="font-hindi">लेखा शास्त्र (Part 1 & 2)</span></li>
                                            <li>Business Studies – <span className="font-hindi">व्यवसाय अध्ययन</span></li>
                                            <li>Economics – <span className="font-hindi">अर्थशास्त्र (Micro & Macro)</span></li>
                                            <li>Mathematics – <span className="font-hindi">गणित</span></li>
                                            <li>English Core – <span className="font-hindi">अंग्रेज़ी कोर</span></li>
                                        </ul>
                                    </div>
                                     <div>
                                        <h5 className="font-bold">Arts Stream</h5>
                                        <ul className="list-disc list-inside space-y-1 pl-4">
                                            <li>History – <span className="font-hindi">इतिहास (Themes in India & World History)</span></li>
                                            <li>Political Science – <span className="font-hindi">राजनीति विज्ञान</span></li>
                                            <li>Geography – <span className="font-hindi">भूगोल</span></li>
                                            <li>Sociology / Psychology – <span className="font-hindi">समाजशास्त्र / मनोविज्ञान</span></li>
                                            <li>Economics – <span className="font-hindi">अर्थशास्त्र</span></li>
                                            <li>Hindi / English Core – <span className="font-hindi">हिंदी / अंग्रेज़ी कोर</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </CollapsibleSection>
                            <CollapsibleSection title="Competitive & Technical Exams">
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>JEE / NEET (Medical) – NCERT + HC Verma / RD Sharma / MTG</li>
                                    <li>UPSC / SSC / Banking – NCERT + Lucent GK + Sanatan Ethics Module</li>
                                    <li>ITI / Polytechnic – State Technical Series (Electrician, Fitter, COPA, etc.)</li>
                                    <li>Medical / Nursing – NTA & NCERT-based syllabus</li>
                                </ul>
                            </CollapsibleSection>
                        </div>
                    </FeatureCard>
                    <FeatureCard title="AI कंटेंट इंजन (ज्ञान का निर्माण)" icon={<SparklesIcon className="h-5 w-5" />}>
                        <p><strong>Textbook to 3D:</strong> किसी भी पाठ को सीधे 3D मॉडल या सिमुलेशन में बदलना।</p>
                        <p><strong>Language Alchemy:</strong> कंटेंट को 12 भारतीय भाषाओं में अनुवाद।</p>
                        <p><strong>साहित्यिक AI:</strong> PhD छात्रों के लिए रिसर्च पेपर, साहित्य समीक्षा और प्लेगियारिज्म चेक।</p>
                    </FeatureCard>
                </Section>
                
                {/* Section II */}
                <Section id="ai-teacher-studio" title="II. 👨‍🏫 AI Live Teacher Studio: वास्तविक समय का शिक्षण" icon={<ChatBubbleIcon className="h-7 w-7" />}>
                    <FeatureCard title="वॉयस कमांड इंटीग्रेशन" icon={<SparklesIcon className="h-5 w-5" />}>
                        <p>छात्र बोलकर निर्देश दे सकते हैं: “यह किताब खोलो, यह पैराग्राफ समझाओ।”</p>
                    </FeatureCard>
                    <FeatureCard title="भावनात्मक AI (Mood-Based Learning)" icon={<SparklesIcon className="h-5 w-5" />}>
                        <p>छात्र के मूड के अनुसार कंटेंट को कहानी या गेम में बदलना।</p>
                    </FeatureCard>
                     <FeatureCard title="स्थान-आधारित सीखना (Location-Based Learning)" icon={<MapPinIcon className="h-5 w-5" />}>
                        <p>छात्र लाइव क्लास के दौरान प्रासंगिक उदाहरणों के लिए अपना स्थान (जैसे शहर) साझा कर सकते हैं।</p>
                    </FeatureCard>
                    <FeatureCard title="ऑगमेंटेड लर्निंग (AR/VR)" icon={<VideoCameraIcon className="h-5 w-5" />}>
                        <p>किताब पर कैमरे से AI द्वारा बनाए गए 3D डायग्राम और एनिमेशन देखना।</p>
                    </FeatureCard>
                </Section>

                {/* Section III */}
                <Section id="career-ecosystem" title="III. 💰 करियर, जॉब और फंडिंग इकोसिस्टम" icon={<BanknotesIcon className="h-7 w-7" />}>
                    <FeatureCard title="करियर सार्थी और भर्ती" icon={<BriefcaseIcon className="h-5 w-5" />}>
                        <p><strong>वन-क्लिक फॉर्म फिलर:</strong> सभी सरकारी व निजी जॉब फॉर्म ऑटो-फिल होंगे।</p>
                        <p><strong>AI करियर काउंसलर:</strong> कौशल और बाजार की मांग के अनुसार श्रेष्ठ करियर सुझाव।</p>
                        <p><strong>जॉब पोर्टल इंटीग्रेशन:</strong> छात्रों को सीधे Employers से जोड़ने वाला पोर्टल।</p>
                    </FeatureCard>
                     <FeatureCard title="NGO और सामाजिक एकीकरण" icon={<UsersIcon className="h-5 w-5" />}>
                        <p><strong>NGO पार्टनर डैशबोर्ड:</strong> वंचित छात्रों के लिए फ्री/रियायती एक्सेस और प्रगति ट्रैकिंग।</p>
                        <p><strong>CSR फंडिंग कनेक्शन:</strong> कंपनियों के CSR फंड को स्कूल/NGO से जोड़ना।</p>
                    </FeatureCard>
                </Section>
                
                 {/* Section IV */}
                <Section id="institution-management" title="IV. 🛡️ संस्थान प्रबंधन और सुरक्षा" icon={<KeyIcon className="h-7 w-7" />}>
                     <FeatureCard title="स्मार्ट एडमिशन और ऑनबोर्डिंग" icon={<UserPlusIcon className="h-5 w-5" />}>
                        <p><strong>AI Document Parser:</strong> कोई भी ID (आधार, पुरानी मार्कशीट) अपलोड करते ही एडमिशन फॉर्म अपने आप भर जाएगा।</p>
                        <p><strong>Instant ID Card Generation:</strong> एडमिशन सफल होने पर तुरंत एक डिजिटल और प्रिंट करने योग्य छात्र ID कार्ड बन जाएगा।</p>
                    </FeatureCard>
                    <FeatureCard title="ब्लॉकचेन और सुरक्षा" icon={<KeyIcon className="h-5 w-5" />}>
                        <p><strong>ब्लॉकचेन सर्टिफिकेट:</strong> जालसाजी रोकने के लिए ब्लॉकचेन पर मार्कशीट और सर्टिफिकेट।</p>
                        <p><strong>डेटा प्रोटेक्शन:</strong> आर्मी-ग्रेड एन्क्रिप्शन और भारतीय गोपनीयता मानकों का पालन।</p>
                    </FeatureCard>
                     <FeatureCard title="मूल्यांकन और प्रिंटिंग" icon={<PencilSquareIcon className="h-5 w-5" />}>
                        <p><strong>अनुकूलन योग्य टेस्ट:</strong> पेज साइज़ (A4, Legal, Custom), फॉन्ट, लोगो, वॉटरमार्क सब कस्टमाइज़ करने की सुविधा।</p>
                        <p><strong>डायग्नोस्टिक AI:</strong> छात्र की गलती का कारण बताने वाला Smart Analysis।</p>
                    </FeatureCard>
                     <FeatureCard title="फ्रेंचाइजी और ERP" icon={<GlobeAltIcon className="h-5 w-5" />}>
                        <p><strong>माइक्रो-फ्रेंचाइजी सिस्टम:</strong> छोटे सेंटर और ट्यूटर को भी जुड़ने और पढ़ाने की सुविधा।</p>
                    </FeatureCard>
                </Section>
            </div>
        </div>
    );
};

export default EducationSarthiBlueprint;
