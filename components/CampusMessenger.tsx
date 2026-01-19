
import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleIcon, UserCircleIcon, PaperAirplaneIcon, PhoneIcon, VideoCameraIcon, MagnifyingGlassIcon, PaperClipIcon, MicrophoneIcon, CheckCircleIcon, ArrowLeftIcon, FaceSmileIcon, DocumentTextIcon, XCircleIcon, StopCircleIcon, SpeakerWaveIcon } from './icons/AllIcons';
import { User } from '../types';
import { useToast } from '../hooks/useToast';

interface Contact {
    id: number;
    name: string;
    role: string;
    lastMessage: string;
    time: string;
    unread: number;
    isOnline: boolean;
}

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
    time: string;
    status: 'sent' | 'delivered' | 'read';
    isAudio?: boolean;
    file?: { name: string; type: string };
}

const mockContacts: Contact[] = [
    { id: 1, name: "Class 10 - Science Group", role: "Group", lastMessage: "Homework deadline extended!", time: "10:30 AM", unread: 2, isOnline: true },
    { id: 2, name: "Rahul Sharma (Teacher)", role: "Teacher", lastMessage: "Can we meet regarding the project?", time: "Yesterday", unread: 0, isOnline: false },
    { id: 3, name: "Priya Patel", role: "Student", lastMessage: "Thanks for the notes!", time: "Yesterday", unread: 1, isOnline: true },
    { id: 4, name: "Admin Office", role: "Admin", lastMessage: "Fee receipt generated.", time: "24/07/24", unread: 0, isOnline: true },
];

const initialMessages: Message[] = [
    { id: 1, text: "Hello! Is the science assignment due tomorrow?", sender: "me", time: "10:00 AM", status: "read" },
    { id: 2, text: "Yes, by 5 PM.", sender: "them", time: "10:05 AM", status: "read" },
];

const CampusMessenger: React.FC<{ user: User }> = ({ user }) => {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const toast = useToast();
    
    // Mock File State
    const [mockFile, setMockFile] = useState<{name: string, type: string} | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const recordingInterval = useRef<number | null>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, selectedContact]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputMessage.trim() && !mockFile) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputMessage,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
            file: mockFile || undefined
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage("");
        setMockFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        // Simulate automated response
        if (selectedContact?.id === 4) {
            setTimeout(() => {
                 setMessages(prev => [...prev, { id: Date.now() + 1, text: "We have received your query. An admin will reply shortly.", sender: 'them', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'read' }]);
            }, 1500);
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        setRecordingTime(0);
        recordingInterval.current = window.setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = (send: boolean) => {
        if (recordingInterval.current) clearInterval(recordingInterval.current);
        setIsRecording(false);
        
        if (send) {
            const newMessage: Message = {
                id: Date.now(),
                text: "", 
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent',
                isAudio: true
            };
            setMessages(prev => [...prev, newMessage]);
            toast.success("Voice note sent!");
        }
        setRecordingTime(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMockFile({ name: file.name, type: file.type });
        }
    };

    const filteredContacts = mockContacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-white rounded-xl shadow-lg h-full overflow-hidden flex border border-slate-200 font-sans">
            {/* Left Sidebar */}
            <div className={`${selectedContact ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[30%] border-r border-slate-200 bg-white h-full overflow-hidden`}>
                <div className="p-3 bg-[#f0f2f5] border-b border-slate-200 flex justify-between items-center shrink-0">
                     <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                         <UserCircleIcon className="h-12 w-12 text-slate-500"/>
                     </div>
                     <div className="flex gap-4 text-slate-500">
                        <button><ChatBubbleIcon className="h-5 w-5" /></button>
                    </div>
                </div>
                <div className="p-2 border-b border-slate-100 shrink-0">
                    <div className="bg-[#f0f2f5] rounded-lg flex items-center px-3 py-1.5">
                         <MagnifyingGlassIcon className="h-4 w-4 text-slate-500 mr-2" />
                        <input type="text" placeholder="Search or start new chat" className="bg-transparent border-none focus:ring-0 w-full text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredContacts.map(contact => (
                        <div key={contact.id} onClick={() => setSelectedContact(contact)} className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#f5f6f6] border-b border-slate-50 ${selectedContact?.id === contact.id ? 'bg-[#f0f2f5]' : ''}`}>
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center"><UserCircleIcon className="h-8 w-8 text-slate-500" /></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between"><h3 className="font-normal text-slate-900 truncate">{contact.name}</h3><span className="text-xs text-slate-400">{contact.time}</span></div>
                                <p className="text-xs text-slate-500 truncate">{contact.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`${!selectedContact ? 'hidden md:flex' : 'flex'} flex-col flex-1 bg-[#efe7dd] relative h-full overflow-hidden`}>
                <div className="absolute inset-0 opacity-[0.06] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] pointer-events-none"></div>
                
                {selectedContact ? (
                    <div className="flex flex-col h-full z-10">
                        {/* Header */}
                        <div className="p-2 bg-[#f0f2f5] border-b border-slate-200 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedContact(null)} className="md:hidden text-slate-600 mr-1"><ArrowLeftIcon className="h-6 w-6" /></button>
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center"><UserCircleIcon className="h-6 w-6 text-slate-500" /></div>
                                <div><h3 className="font-normal text-slate-800">{selectedContact.name}</h3><p className="text-xs text-slate-500">Online</p></div>
                            </div>
                            <div className="flex gap-5 text-slate-500 pr-4">
                                <button><VideoCameraIcon className="h-5 w-5" /></button>
                                <button><PhoneIcon className="h-5 w-5" /></button>
                            </div>
                        </div>
                        
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-2 px-3 rounded-lg shadow-sm relative text-sm ${msg.sender === 'me' ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                                        <div className={`absolute top-0 w-0 h-0 border-[6px] border-transparent ${msg.sender === 'me' ? 'right-[-6px] border-t-[#dcf8c6] border-l-[#dcf8c6]' : 'left-[-6px] border-t-white border-r-white'}`}></div>
                                        
                                        {msg.file && (
                                            <div className="mb-2 bg-white/50 p-2 rounded flex items-center gap-2 border border-black/10">
                                                <div className="bg-red-100 p-2 rounded-full text-red-500"><DocumentTextIcon className="h-5 w-5"/></div>
                                                <div className="text-xs font-semibold truncate max-w-[150px]">{msg.file.name}</div>
                                            </div>
                                        )}
                                        
                                        {msg.isAudio ? (
                                            <div className="flex items-center gap-3 py-1">
                                                <div className="bg-slate-200 p-2 rounded-full text-slate-600"><SpeakerWaveIcon className="h-5 w-5"/></div>
                                                <div className="flex flex-col">
                                                     <div className="h-1 w-24 bg-slate-300 rounded-full mb-1 overflow-hidden">
                                                         <div className="h-full bg-slate-500 w-2/3"></div>
                                                     </div>
                                                     <span className="text-[10px] text-slate-500">0:05</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        )}
                                        <span className="text-[10px] text-slate-400 block text-right mt-1">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        {/* Input Area */}
                        <div className="p-2 bg-[#f0f2f5] flex items-end gap-2 relative shrink-0">
                             {/* File Preview */}
                             {mockFile && (
                                <div className="absolute bottom-16 left-4 bg-white p-2 rounded shadow-lg border border-slate-200 flex items-center gap-2 z-20">
                                    <div className="h-10 w-10 bg-red-100 flex items-center justify-center rounded text-red-500"><DocumentTextIcon className="h-6 w-6"/></div>
                                    <span className="text-xs max-w-[100px] truncate">{mockFile.name}</span>
                                    <button onClick={() => { setMockFile(null); if(fileInputRef.current) fileInputRef.current.value=''; }} className="bg-red-100 text-red-500 rounded-full p-1"><XCircleIcon className="h-4 w-4"/></button>
                                </div>
                             )}

                            {isRecording ? (
                                <div className="flex-1 bg-white rounded-lg px-4 py-3 flex items-center justify-between animate-pulse border border-red-200">
                                     <div className="flex items-center gap-3 text-red-500 font-semibold">
                                        <div className="flex items-end gap-1 h-4">
                                             <div className="w-1 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite]" style={{height: '60%'}}></div>
                                             <div className="w-1 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite_0.1s]" style={{height: '100%'}}></div>
                                             <div className="w-1 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite_0.2s]" style={{height: '50%'}}></div>
                                             <div className="w-1 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite_0.3s]" style={{height: '80%'}}></div>
                                             <div className="w-1 bg-red-500 rounded-full animate-[wave_1s_ease-in-out_infinite_0.4s]" style={{height: '40%'}}></div>
                                        </div>
                                        {formatTime(recordingTime)}
                                     </div>
                                     <p className="text-xs text-slate-400">Recording...</p>
                                </div>
                            ) : (
                                <>
                                    <button className="p-2 text-slate-500"><FaceSmileIcon className="h-6 w-6"/></button>
                                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500"><PaperClipIcon className="h-6 w-6"/></button>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                                    
                                    <div className="flex-1 bg-white rounded-lg px-3 py-2">
                                        <input 
                                            type="text" 
                                            placeholder="Type a message" 
                                            className="w-full border-none focus:ring-0 p-0 text-sm" 
                                            value={inputMessage} 
                                            onChange={(e) => setInputMessage(e.target.value)} 
                                            onKeyPress={e => e.key === 'Enter' && handleSendMessage()} 
                                        />
                                    </div>
                                </>
                            )}

                            {inputMessage || mockFile ? (
                                <button onClick={() => handleSendMessage()} className="p-3 rounded-full text-white bg-[#00a884] hover:bg-[#008f6f]">
                                    <PaperAirplaneIcon className="h-5 w-5"/>
                                </button>
                            ) : isRecording ? (
                                 <div className="flex gap-2">
                                     <button onClick={() => stopRecording(false)} className="p-3 rounded-full text-red-500 bg-white hover:bg-red-50 shadow-md">
                                        <XCircleIcon className="h-6 w-6"/>
                                    </button>
                                    <button onClick={() => stopRecording(true)} className="p-3 rounded-full text-white bg-[#00a884] hover:bg-[#008f6f] shadow-md">
                                        <PaperAirplaneIcon className="h-5 w-5"/>
                                    </button>
                                 </div>
                            ) : (
                                <button onClick={startRecording} className="p-3 rounded-full text-white bg-[#00a884] hover:bg-[#008f6f]">
                                    <MicrophoneIcon className="h-5 w-5"/>
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10 bg-[#f0f2f5] border-l border-slate-200">
                         <h2 className="text-3xl font-light text-slate-600 mb-4">WhatsApp Web</h2>
                         <p className="text-sm text-slate-500">Send and receive messages without keeping your phone online.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampusMessenger;
