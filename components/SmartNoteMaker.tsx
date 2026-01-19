
import React, { useState, useEffect } from 'react';
import { generateText } from '../services/geminiService';
import { MicrophoneIcon, DocumentTextIcon, SparklesIcon, ArrowDownTrayIcon, StopCircleIcon } from './icons/AllIcons';
import { useSpeech } from '../hooks/useSpeech';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';

// Fixed: Declare global types
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const SmartNoteMaker: React.FC = () => {
    const toast = useToast();
    const [rawText, setRawText] = useState('');
    const [notes, setNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    const { isListening, speechInput, setSpeechInput, toggleListening } = useSpeech({ enableSpeechRecognition: true });

    // Append speech input to raw text continuously
    useEffect(() => {
        if (speechInput) {
            setRawText(prev => prev + ' ' + speechInput);
            setSpeechInput(''); // Clear buffer
        }
    }, [speechInput, setSpeechInput]);

    const generateNotes = async () => {
        if (!rawText.trim()) {
            toast.error("Please record or type some text first.");
            return;
        }
        setIsGenerating(true);
        try {
            const prompt = `
                Act as an expert study assistant. Convert the following raw dictation/text into highly organized, professional study notes.
                
                Raw Text:
                "${rawText}"
                
                Format the output as clean HTML:
                1. Use clear <h3> Headings for main topics.
                2. Use <ul><li> bullet points for details.
                3. Bold key terms.
                4. Add a "Summary" section at the end.
                
                Do not include <html> or <body> tags.
            `;
            const result = await generateText(prompt, 'gemini-2.5-flash');
            setNotes(result);
            toast.success("Notes generated successfully!");
        } catch (e) {
            toast.error("Failed to generate notes.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPdf = () => {
        if (!notes || isGenerating) return;
        const element = document.getElementById('printable-notes');
        if (!element) return;
        
        setIsGenerating(true); // Reusing state to disable button
        toast.info("Preparing Notes PDF...");

        const clone = element.cloneNode(true) as HTMLElement;
        const A4_WIDTH_PX = 794; 
        const A4_HEIGHT_PX = 1123;
        const PAGE_PADDING = 40; 
        const CONTENT_HEIGHT = A4_HEIGHT_PX - (PAGE_PADDING * 2);

        clone.style.width = `${A4_WIDTH_PX}px`;
        clone.style.minHeight = `${A4_HEIGHT_PX}px`;
        clone.style.padding = `${PAGE_PADDING}px`;
        clone.style.position = 'fixed';
        clone.style.top = '-10000px';
        clone.style.left = '-10000px';
        clone.style.height = 'auto';
        clone.style.overflow = 'visible';
        clone.style.backgroundColor = 'white';
        clone.style.color = 'black';

        document.body.appendChild(clone);

        const elements = Array.from(clone.querySelectorAll('h3, p, ul, li, div'));
        let currentHeight = 0;
        
        elements.forEach((el: any) => {
             // Basic block logic
            const style = window.getComputedStyle(el);
            const marginTop = parseInt(style.marginTop) || 0;
            const marginBottom = parseInt(style.marginBottom) || 0;
            const elHeight = el.offsetHeight + marginTop + marginBottom;

            if (currentHeight + elHeight > CONTENT_HEIGHT) {
                if (elHeight < CONTENT_HEIGHT) {
                    const spaceLeft = CONTENT_HEIGHT - currentHeight;
                    const spacer = document.createElement('div');
                    spacer.style.height = `${spaceLeft + 20}px`;
                    spacer.style.display = 'block';
                    el.parentNode?.insertBefore(spacer, el);
                    currentHeight = elHeight;
                } else {
                     currentHeight += elHeight;
                }
            } else {
                currentHeight += elHeight;
            }
            if (currentHeight >= CONTENT_HEIGHT) {
                 currentHeight = currentHeight % CONTENT_HEIGHT;
            }
        });

        const { jsPDF } = window.jspdf;
        
        setTimeout(() => {
            window.html2canvas(clone, { 
                scale: 2,
                useCORS: true,
                width: A4_WIDTH_PX,
                windowWidth: A4_WIDTH_PX
            }).then((canvas: any) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgProps = pdf.getImageProperties(imgData);
                const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                    heightLeft -= pdfHeight;
                }
                
                pdf.save('smart-notes.pdf');
                document.body.removeChild(clone);
                setIsGenerating(false);
                toast.success("PDF Downloaded");
            }).catch((e: any) => {
                console.error(e);
                if (document.body.contains(clone)) document.body.removeChild(clone);
                setIsGenerating(false);
                toast.error("Failed to create PDF");
            });
        }, 500);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col">
            <div className="flex items-center mb-6 shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Smart Note Maker</h2>
                    <p className="text-sm text-neutral-500 font-hindi">बोलकर नोट्स बनाएं (Voice-to-Notes)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
                {/* Input Section */}
                <div className="flex flex-col h-full gap-4">
                    <div className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl p-4 relative">
                        <textarea 
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            placeholder="Start speaking or type here..."
                            className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-neutral-700 text-sm custom-scrollbar"
                        />
                        {isListening && (
                            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold animate-pulse">
                                <div className="w-2 h-2 bg-red-600 rounded-full"></div> Recording...
                            </div>
                        )}
                    </div>
                    
                    <div className="flex gap-3 shrink-0">
                        <button 
                            onClick={toggleListening}
                            className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${isListening ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-neutral-800 hover:bg-neutral-900 text-white'}`}
                        >
                            {isListening ? <><StopCircleIcon className="h-5 w-5"/> Stop</> : <><MicrophoneIcon className="h-5 w-5"/> Start Recording</>}
                        </button>
                        <button 
                            onClick={generateNotes}
                            disabled={isGenerating || !rawText.trim()}
                            className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SparklesIcon className="h-5 w-5"/> {isGenerating ? 'Creating...' : 'Create Notes'}
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                <div className="flex flex-col h-full bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-3 border-b bg-neutral-50 flex justify-between items-center shrink-0">
                        <h3 className="font-bold text-neutral-700 text-sm">Formatted Notes</h3>
                        <button onClick={handleDownloadPdf} disabled={!notes} className="text-primary hover:text-primary-dark disabled:opacity-50">
                            <ArrowDownTrayIcon className="h-5 w-5"/>
                        </button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {isGenerating && !notes ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <Loader message="Organizing your thoughts..." />
                            </div>
                        ) : notes ? (
                            <div id="printable-notes" className="prose prose-sm max-w-none text-neutral-800" dangerouslySetInnerHTML={{__html: notes}} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-center p-4">
                                <DocumentTextIcon className="h-12 w-12 mb-2 opacity-20"/>
                                <p className="text-sm">Generated notes will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartNoteMaker;
