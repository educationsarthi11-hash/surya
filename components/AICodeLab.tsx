
import React, { useState, useEffect } from 'react';
import { generateText } from '../services/geminiService';
import { CodeBracketIcon, SparklesIcon, PlayIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

const AICodeLab: React.FC = () => {
    const toast = useToast();
    const [code, setCode] = useState(`<html>
  <head>
    <style>
      body { font-family: sans-serif; text-align: center; padding: 50px; background: #f0f9ff; }
      h1 { color: #0284c7; }
      button { padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 5px; cursor: pointer; }
      button:hover { background: #0284c7; }
    </style>
  </head>
  <body>
    <h1>Hello, Education Sarthi!</h1>
    <p>Welcome to AI Code Lab.</p>
    <button onclick="alert('You clicked me!')">Click Me</button>
  </body>
</html>`);
    const [output, setOutput] = useState('');
    const [aiFeedback, setAiFeedback] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor'); // For mobile toggle

    // Auto-run on load
    useEffect(() => {
        handleRun();
    }, []);

    const handleRun = () => {
        setOutput(code);
        if (window.innerWidth < 1024) setActiveTab('preview'); // Auto switch on mobile
    };

    const handleFixWithAI = async () => {
        setIsAnalyzing(true);
        setAiFeedback('');
        try {
            const prompt = `
                You are an expert coding tutor for students. Review the following HTML/CSS/JS code.
                
                Code:
                ${code}

                Task:
                1. If there are errors, explain them simply.
                2. If the code is fine, suggest a cool improvement or feature to add.
                3. Provide the corrected or improved code snippet.
                
                Format your response as clean HTML (use <h3> for titles, <p> for explanation, <pre><code> for code blocks).
            `;
            const feedback = await generateText(prompt);
            setAiFeedback(feedback);
             if (window.innerWidth < 1024) setActiveTab('preview'); // Auto switch to see feedback
        } catch (e) {
            toast.error("AI could not analyze the code.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-soft h-full flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 shrink-0">
                <div className="flex items-center">
                    <CodeBracketIcon className="h-8 w-8 text-primary" />
                    <div className="ml-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">AI Code Lab</h2>
                        <p className="text-xs sm:text-sm text-neutral-500 font-hindi">कोड लिखें, रन करें और AI से सीखें</p>
                    </div>
                </div>
                
                {/* Mobile Tabs */}
                <div className="flex lg:hidden bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                    <button onClick={() => setActiveTab('editor')} className={`flex-1 py-1.5 px-3 text-sm font-bold rounded-md ${activeTab === 'editor' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}>Editor</button>
                    <button onClick={() => setActiveTab('preview')} className={`flex-1 py-1.5 px-3 text-sm font-bold rounded-md ${activeTab === 'preview' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}>Result</button>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={handleFixWithAI} disabled={isAnalyzing} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-xs sm:text-sm font-bold transition-colors">
                        <SparklesIcon className="h-4 w-4"/> {isAnalyzing ? '...' : 'AI Fix'}
                    </button>
                    <button onClick={handleRun} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs sm:text-sm font-bold transition-colors shadow-md">
                        <PlayIcon className="h-4 w-4"/> Run
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-4 overflow-hidden relative">
                {/* Editor */}
                <div className={`flex flex-col h-full border rounded-lg overflow-hidden bg-slate-900 ${activeTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono flex justify-between shrink-0">
                        <span>index.html</span>
                        <span>HTML/CSS/JS</span>
                    </div>
                    <textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 w-full h-full bg-slate-900 text-green-400 font-mono p-4 text-sm focus:outline-none resize-none leading-relaxed custom-scrollbar"
                        spellCheck={false}
                    />
                </div>

                {/* Preview & Feedback */}
                <div className={`flex flex-col h-full gap-4 overflow-hidden ${activeTab === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="flex-1 bg-white border rounded-lg overflow-hidden shadow-inner relative min-h-[50%]">
                        <div className="absolute top-0 left-0 bg-neutral-100 px-2 py-1 text-[10px] text-neutral-500 border-b border-r rounded-br z-10">Preview</div>
                        <iframe 
                            srcDoc={output} 
                            title="output" 
                            sandbox="allow-scripts" 
                            className="w-full h-full border-none"
                        />
                    </div>
                    
                    {/* AI Feedback Panel */}
                    <div className="h-1/3 bg-neutral-50 border rounded-lg p-4 overflow-y-auto shadow-inner custom-scrollbar">
                        <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2 sticky top-0 bg-neutral-50">
                            <SparklesIcon className="h-4 w-4"/> AI Coach Feedback
                        </h4>
                        {isAnalyzing ? (
                            <Loader message="AI is checking your code..." />
                        ) : aiFeedback ? (
                            <div className="prose prose-sm max-w-none text-neutral-700" dangerouslySetInnerHTML={{__html: aiFeedback}} />
                        ) : (
                            <p className="text-xs text-neutral-500 italic">Click "AI Fix" to get instant feedback on your code.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AICodeLab;
