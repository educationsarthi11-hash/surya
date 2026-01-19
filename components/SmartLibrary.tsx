
import React, { useState, useMemo, useRef, useEffect } from 'react';
// Fix: Removed non-existent ArrowUpIcon from imports to resolve build error
import { BookOpenIcon, MagnifyingGlassIcon, CheckCircleIcon, ClockIcon, SparklesIcon, ArrowRightIcon, XIcon, EyeIcon, ChevronLeftIcon, ChevronRightIcon, SpeakerWaveIcon, StopCircleIcon, DocumentTextIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { generateText } from '../services/geminiService';
import Loader from './Loader';
import { useSpeech } from '../hooks/useSpeech';

interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    status: 'Available' | 'Issued' | 'Reserved';
    cover: string;
    dueDate?: string;
}

const mockBooks: Book[] = [
    { id: 'BK001', title: 'Concepts of Physics', author: 'H.C. Verma', category: 'Science', status: 'Available', cover: 'https://m.media-amazon.com/images/I/71K7QeP1c0L._AC_UF1000,1000_QL80_.jpg' },
    { id: 'BK002', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'Biography', status: 'Issued', dueDate: '2024-08-25', cover: 'https://m.media-amazon.com/images/I/71t4GuxLCuL._AC_UF1000,1000_QL80_.jpg' },
    { id: 'BK004', title: 'Mathematics Class 10', author: 'R.D. Sharma', category: 'Academic', status: 'Available', cover: 'https://m.media-amazon.com/images/I/51+M8b-sEQL._AC_UF1000,1000_QL80_.jpg' },
    { id: 'BK007', title: 'Godan (गोदान)', author: 'Munshi Premchand', category: 'Hindi Literature', status: 'Available', cover: 'https://m.media-amazon.com/images/I/81-F0H2d27L.jpg' },
    { id: 'BK008', title: 'Indian Polity', author: 'M. Laxmikanth', category: 'Competitive Exams', status: 'Available', cover: 'https://m.media-amazon.com/images/I/81E1Qk0m8-L.jpg' },
    { id: 'BK003', title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', status: 'Available', cover: 'https://m.media-amazon.com/images/I/51Z0nLAfLmL.jpg' },
    { id: 'BK016', title: 'Panchatantra', author: 'Vishnu Sharma', category: 'Kids & Fiction', status: 'Available', cover: 'https://m.media-amazon.com/images/I/71xN+T9X0DL.jpg' },
    { id: 'BK010', title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', status: 'Available', cover: 'https://m.media-amazon.com/images/I/713jIoMO3UL.jpg' },
];

const SmartLibrary: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'catalog' | 'my-books'>('catalog');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [books, setBooks] = useState<Book[]>(mockBooks);
    
    const [readingBook, setReadingBook] = useState<Book | null>(null);
    const [bookPages, setBookPages] = useState<string[]>([]);
    const [summary, setSummary] = useState('');
    const [currentPage, setCurrentPage] = useState(0); 
    const [isReadingLoading, setIsReadingLoading] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [contentLanguage, setContentLanguage] = useState<'English' | 'Hindi'>('Hindi'); 
    
    const contentAreaRef = useRef<HTMLDivElement>(null);
    const { playAudio, stopAudio, isSpeaking } = useSpeech({ initialLanguage: contentLanguage });

    const categories = ['All', ...Array.from(new Set(mockBooks.map(b => b.category)))].sort();

    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [books, searchQuery, selectedCategory]);

    const generatePageContent = async (book: Book, chapterNum: number, lang: string): Promise<string> => {
        const prompt = `Act as the book "${book.title}" by ${book.author}. Generate the full text content for Chapter ${chapterNum} in ${lang}. Format as clean HTML.`;
        return await generateText(prompt, 'gemini-3-flash-preview');
    };

    const handleSummarize = async () => {
        if (!readingBook) return;
        setIsSummarizing(true);
        try {
            const prompt = `Provide a 3-paragraph executive summary of the entire book "${readingBook.title}" by ${readingBook.author} in simple Hindi. Highlight the key lessons for a student. Format as HTML.`;
            const res = await generateText(prompt, 'gemini-3-pro-preview');
            setSummary(res);
            toast.success("किताब का सारांश तैयार है!");
        } catch (e) {
            toast.error("Summary generation failed.");
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleReadBook = async (book: Book) => {
        setReadingBook(book);
        setBookPages([]);
        setSummary('');
        setCurrentPage(0);
        setIsReadingLoading(true);
        try {
            const content = await generatePageContent(book, 1, contentLanguage);
            setBookPages([content]);
        } catch (error: any) {
            toast.error("Could not load book content.");
            setReadingBook(null);
        } finally {
            setIsReadingLoading(false);
        }
    };

    const handleNextPage = async () => {
        if (!readingBook || isReadingLoading) return;
        const nextPageIdx = currentPage + 1;
        if (nextPageIdx < bookPages.length) {
            setCurrentPage(nextPageIdx);
        } else {
            setIsReadingLoading(true);
            try {
                const content = await generatePageContent(readingBook, nextPageIdx + 1, contentLanguage);
                setBookPages(prev => [...prev, content]);
                setCurrentPage(nextPageIdx);
            } catch (error: any) {
                toast.error("Could not generate the next chapter.");
            } finally {
                setIsReadingLoading(false);
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col relative">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                    <BookOpenIcon className="h-8 w-8 text-primary" />
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">Smart Library</h2>
                        <p className="text-sm text-neutral-500 font-hindi">AI-Powered Reader & Summarizer</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 shrink-0">
                <div className="relative flex-grow">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" placeholder="Search books..." value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {categories.map(cat => (
                        <button 
                            key={cat} onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-10">
                {filteredBooks.map(book => (
                    <div key={book.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleReadBook(book)} className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all">
                                    <EyeIcon className="h-4 w-4" /> Read Now
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{book.category}</p>
                            <h4 className="font-bold text-slate-800 text-base mb-1 line-clamp-2">{book.title}</h4>
                            <p className="text-sm text-slate-500 mb-4">{book.author}</p>
                            <button onClick={() => handleReadBook(book)} className="mt-auto w-full py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">
                                Open Book
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {readingBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-2 sm:p-4" onClick={() => setReadingBook(null)}>
                    <div className="w-full max-w-4xl h-full bg-white rounded-3xl overflow-hidden flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-bold text-slate-800 truncate max-w-[200px] sm:max-w-md">{readingBook.title}</h3>
                                <p className="text-xs text-slate-500">Chapter {currentPage + 1}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleSummarize} disabled={isSummarizing}
                                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-200 transition-all"
                                >
                                    <SparklesIcon className="h-4 w-4"/> {isSummarizing ? 'Summarizing...' : 'Quick Summary'}
                                </button>
                                <button onClick={() => setReadingBook(null)} className="p-2 hover:bg-slate-200 rounded-full"><XIcon className="h-6 w-6 text-slate-500"/></button>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                             {/* Content Area */}
                            <div ref={contentAreaRef} className="flex-1 overflow-y-auto p-6 sm:p-10 font-serif text-lg leading-relaxed text-slate-800 bg-[#fffdf7] scroll-smooth">
                                {summary && (
                                    <div className="mb-10 p-8 bg-indigo-50 border-2 border-indigo-100 rounded-[2rem] animate-pop-in relative">
                                        <div className="absolute top-4 right-4"><SparklesIcon className="h-6 w-6 text-indigo-400"/></div>
                                        <h4 className="text-indigo-900 font-black mb-4 uppercase tracking-widest text-xs">AI Book Summary (सारांश)</h4>
                                        <div className="prose prose-sm font-hindi text-indigo-900" dangerouslySetInnerHTML={{ __html: summary }} />
                                        <button onClick={() => setSummary('')} className="mt-4 text-xs font-bold text-indigo-500 hover:underline">Close Summary</button>
                                    </div>
                                )}
                                
                                {isReadingLoading ? <Loader message="AI is writing this chapter..." /> : <div dangerouslySetInnerHTML={{ __html: bookPages[currentPage] }} />}
                            </div>
                        </div>

                        <div className="p-4 border-t bg-white flex justify-between items-center shrink-0">
                            <button onClick={() => setCurrentPage(p => Math.max(0, p-1))} disabled={currentPage === 0} className="px-6 py-2 rounded-xl border font-bold text-sm disabled:opacity-30">Back</button>
                            <button onClick={handleNextPage} disabled={isReadingLoading} className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-primary transition-all shadow-xl">NEXT CHAPTER</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartLibrary;
