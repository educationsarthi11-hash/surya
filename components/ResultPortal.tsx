
import React, { useState } from 'react';
import { GlobeAltIcon, ArrowRightIcon, SparklesIcon, DocumentTextIcon, UploadIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';
import { analyzeImageAndGetJson } from '../services/geminiService';
import { Type } from '@google/genai';

interface ResultLink {
    id: string;
    name: string;
    url: string;
    category: 'Board' | 'University' | 'Entrance' | 'Other';
}

const resultLinks: ResultLink[] = [
    { id: 'cbse', name: 'CBSE Board Results (Class 10 & 12)', url: 'https://results.cbse.nic.in/', category: 'Board' },
    { id: 'cisce', name: 'CISCE Results (ICSE & ISC)', url: 'https://results.cisce.org/', category: 'Board' },
    { id: 'nios', name: 'NIOS Results (Open School)', url: 'https://results.nios.ac.in/', category: 'Board' },
    { id: 'up-board', name: 'UP Board (UPMSP) Results', url: 'https://upresults.nic.in/', category: 'Board' },
    { id: 'rajasthan-board', name: 'Rajasthan Board (RBSE) Results', url: 'https://rajeduboard.rajasthan.gov.in/', category: 'Board' },
    { id: 'haryana-board', name: 'Haryana Board (HBSE) Results', url: 'https://bseh.org.in/all-results', category: 'Board' },
    { id: 'jee-main', name: 'JEE Main Results', url: 'https://jeemain.nta.nic.in/', category: 'Entrance' },
    { id: 'neet', name: 'NEET (UG) Results', url: 'https://neet.nta.nic.in/', category: 'Entrance' },
    { id: 'upsc', name: 'UPSC Results', url: 'https://upsc.gov.in/', category: 'Entrance' },
];

const ResultPortal: React.FC = () => {
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ summary: string; careerTip: string } | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const categories = ['All', 'Board', 'University', 'Entrance'];

    const filteredLinks = resultLinks.filter(link => {
        const matchesSearch = link.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || link.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setAnalysisResult(null);
        }
    };

    const handleAnalyzeResult = async () => {
        if (!selectedFile) return;
        setIsAnalyzing(true);
        try {
            const prompt = `Analyze this marksheet image. Extract the student name (if visible) and overall percentage/grade. Then, act as a career counselor and provide:
            1. A brief summary of the performance ("summary").
            2. One specific, actionable career tip or next step based on the subjects and marks visible ("careerTip").
            Return the result as JSON.`;

            const result = await analyzeImageAndGetJson(prompt, selectedFile, {
                type: Type.OBJECT,
                properties: {
                    summary: { type: Type.STRING },
                    careerTip: { type: Type.STRING }
                },
                required: ["summary", "careerTip"]
            });
            setAnalysisResult(result);
            toast.success("Marksheet analyzed successfully!");
        } catch (error) {
            toast.error("Could not analyze marksheet.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col overflow-hidden">
            <div className="flex items-center mb-6 shrink-0">
                <GlobeAltIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Exam Result Portal</h2>
                    <p className="text-sm text-neutral-500 font-hindi">सभी बोर्ड और यूनिवर्सिटी परिणाम (All India Results)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
                <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
                    <div className="mb-4 space-y-4 shrink-0">
                        <input 
                            type="text" 
                            placeholder="Search Board or Exam..." 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full p-3 border rounded-lg shadow-sm"
                        />
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-white' : 'bg-slate-100'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {filteredLinks.map(link => (
                            <div key={link.id} className="p-4 border rounded-xl hover:shadow-md bg-white flex justify-between items-center group">
                                <div>
                                    <h4 className="font-bold text-slate-800">{link.name}</h4>
                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded mt-1 inline-block">{link.category}</span>
                                </div>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all">Check Result ➡</a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col h-full overflow-hidden">
                    <div className="text-center mb-6 shrink-0">
                        <SparklesIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h3 className="text-lg font-bold">AI Result Analyzer</h3>
                        <p className="text-xs text-slate-500 mt-1">Upload your marksheet for AI career insights.</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                        {!analysisResult ? (
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-white transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                    <UploadIcon className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-600">{selectedFile ? selectedFile.name : "Click to Upload Screenshot"}</p>
                                </div>
                                <button onClick={handleAnalyzeResult} disabled={!selectedFile || isAnalyzing} className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg disabled:opacity-50">
                                    {isAnalyzing ? <Loader message="..." /> : "Analyze My Result"}
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-100 animate-pop-in">
                                <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2"><DocumentTextIcon className="h-5 w-5"/> Performance Summary</h4>
                                <p className="text-sm text-slate-700 mb-4">{analysisResult.summary}</p>
                                <h4 className="font-bold text-purple-700 mb-2 flex items-center gap-2"><SparklesIcon className="h-5 w-5"/> Career Tip</h4>
                                <p className="text-sm text-slate-700 bg-purple-50 p-3 rounded-md">{analysisResult.careerTip}</p>
                                <button onClick={() => { setSelectedFile(null); setAnalysisResult(null); }} className="w-full mt-6 text-sm text-slate-500 underline">Analyze Another</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPortal;
