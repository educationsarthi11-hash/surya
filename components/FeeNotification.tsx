
import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { BellIcon, PaperAirplaneIcon, EnvelopeIcon, PhoneIcon, SparklesIcon, SpeakerWaveIcon, ExclamationTriangleIcon, WhatsAppIcon } from './icons/AllIcons';
import { generateText } from '../services/geminiService';
import Loader from './Loader';
import { useAppConfig } from '../contexts/AppConfigContext';
import { feeService } from '../services/feeService';

interface NotificationRecord {
    id: number;
    studentName: string;
    target: string;
    purpose: string;
    amount: number;
    dueDate: string;
    sentDate: string;
    deliveryMethods: string[];
    message: string;
}

interface OverdueStudent {
    studentName: string;
    email: string;
    mobileNumber: string;
    className: string;
    dueAmount: number;
}

const FeeNotification: React.FC = () => {
    const { institutionName } = useAppConfig();
    const [history, setHistory] = useState<NotificationRecord[]>([]);
    const toast = useToast();
    
    const [overdueStudents, setOverdueStudents] = useState<OverdueStudent[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<OverdueStudent | null>(null);

    // Form state
    const [studentName, setStudentName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [targetClass, setTargetClass] = useState('');
    const [purpose, setPurpose] = useState('Outstanding Fee Payment');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [deliveryMethods, setDeliveryMethods] = useState<string[]>(['Email']);
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Call State
    const [isCalling, setIsCalling] = useState(false);
    const [callStatus, setCallStatus] = useState('');

    useEffect(() => {
        setOverdueStudents(feeService.getOverdueStudents());
    }, []);

    useEffect(() => {
        if (selectedStudent) {
            setStudentName(selectedStudent.studentName);
            setEmail(selectedStudent.email);
            setMobileNumber(selectedStudent.mobileNumber);
            setTargetClass(selectedStudent.className);
            setAmount(String(selectedStudent.dueAmount));
        }
    }, [selectedStudent]);

    const handleDeliveryMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setDeliveryMethods(prev => {
            if (checked) {
                return [...prev, value];
            } else {
                return prev.filter(method => method !== value);
            }
        });
    };

    const resetForm = () => {
        setStudentName('');
        setEmail('');
        setMobileNumber('');
        setTargetClass('');
        setPurpose('Outstanding Fee Payment');
        setAmount('');
        setDueDate(new Date().toISOString().split('T')[0]);
        setDeliveryMethods(['Email']);
        setGeneratedMessage('');
        setSelectedStudent(null);
        setCallStatus('');
    };

    const handleGenerateMessage = async () => {
        if (!studentName || !amount || !purpose || !dueDate) {
            toast.error("Please fill Student Name, Amount, Purpose, and Due Date to generate a message.");
            return;
        }
        setIsGenerating(true);
        setGeneratedMessage('');
        try {
            const prompt = `Write a polite fee reminder for ${studentName}. Amount: ₹${amount}. Due: ${dueDate}. From: ${institutionName}. Short for SMS/WhatsApp.`;
            const response = await generateText(prompt);
            setGeneratedMessage(response);
            toast.info("AI has generated the notification message.");
        } catch (error) {
            console.error("Failed to generate message:", error);
            toast.error("AI failed to generate the message. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAICallSimulation = async (targetStudent?: OverdueStudent) => {
        const nameToCall = targetStudent ? targetStudent.studentName : studentName;
        const numberToCall = targetStudent ? targetStudent.mobileNumber : mobileNumber;
        const amountToCall = targetStudent ? targetStudent.dueAmount : amount;

        if (!numberToCall || !amountToCall) {
            toast.error("Mobile number and Amount are required for AI Call.");
            return;
        }
        
        setIsCalling(true);
        setCallStatus(`Initializing AI Agent for ${nameToCall}...`);
        
        // Simulating Call Process
        try {
            setTimeout(() => { setCallStatus(`Dialing +91 ${numberToCall}...`); }, 1500);
            setTimeout(() => { setCallStatus('Ringing...'); }, 3000);
            setTimeout(() => { setCallStatus('Call Connected. AI Agent Speaking...'); toast.info("Call Connected"); }, 5000);
            setTimeout(() => {
                setCallStatus('Call Completed.');
                toast.success(`AI Call to ${nameToCall} successful!`);
                setIsCalling(false);
            }, 8000);
        } catch (error) {
            setCallStatus('Call Failed.');
            setIsCalling(false);
            toast.error("Failed to connect call.");
        }
    };

    const handleSendWhatsApp = (targetStudent?: OverdueStudent) => {
        const name = targetStudent ? targetStudent.studentName : studentName;
        const number = targetStudent ? targetStudent.mobileNumber : mobileNumber;
        const amt = targetStudent ? targetStudent.dueAmount : amount;
        
        if (!number) {
            toast.error("Mobile number required");
            return;
        }

        const msg = generatedMessage || `Dear ${name}, friendly reminder that fees of Rs. ${amt} are overdue. Please pay at the earliest. - ${institutionName}`;
        const url = `https://wa.me/91${number}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
        toast.success("Opened WhatsApp!");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending
        toast.success(`Notification sent.`);
        resetForm();
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-6">
                <BellIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Fee Notification & Recovery</h2>
            </div>
            
            {/* Call Status Overlay */}
            {isCalling && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full border border-slate-700 animate-pop-in">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <PhoneIcon className="h-12 w-12 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">AI Agent Active (Demo)</h3>
                        <p className="text-slate-400 font-mono text-sm mb-6">{callStatus}</p>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-progress"></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-neutral-50 space-y-4">
                        <h3 className="text-lg font-bold text-neutral-800">Send Manual Reminder</h3>
                         <div>
                            <label className="block text-sm font-medium text-neutral-700">Student Name</label>
                            <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Amount (₹)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-neutral-700">Mobile Number</label>
                            <input type="text" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700">Purpose</label>
                            <select value={purpose} onChange={e => setPurpose(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2">
                                <option>Outstanding Fee Payment</option>
                                <option>Late Fee Notice</option>
                                <option>Final Warning</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-neutral-700">Message Content</label>
                            <textarea 
                                value={generatedMessage} 
                                onChange={e => setGeneratedMessage(e.target.value)} 
                                rows={3} 
                                className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 text-sm" 
                                placeholder="Message will be generated here or type manually..."
                            ></textarea>
                            <button type="button" onClick={handleGenerateMessage} disabled={isGenerating} className="mt-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                                <SparklesIcon className="h-3 w-3"/> {isGenerating ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                             <button type="submit" className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark">
                                <PaperAirplaneIcon className="h-4 w-4 mr-2"/> Send Email/SMS
                            </button>
                            <button type="button" onClick={() => handleSendWhatsApp()} className="flex justify-center items-center p-2 rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600" title="Send WhatsApp">
                                <WhatsAppIcon className="h-5 w-5"/>
                            </button>
                        </div>
                        <button type="button" onClick={() => handleAICallSimulation()} className="w-full flex justify-center items-center py-2 px-4 border border-primary text-primary bg-white rounded-md hover:bg-primary/5 font-semibold text-sm">
                            <SpeakerWaveIcon className="h-4 w-4 mr-2"/> Trigger AI Call
                        </button>
                    </form>
                </div>

                {/* Overdue List */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500"/> Overdue Accounts
                    </h3>
                    <div className="bg-white border rounded-lg overflow-hidden shadow-sm max-h-[500px] overflow-y-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase">Student</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase">Class</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-neutral-500 uppercase">Due Amount</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-neutral-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {overdueStudents.length === 0 ? (
                                    <tr><td colSpan={4} className="p-8 text-center text-neutral-500">No overdue payments found.</td></tr>
                                ) : (
                                    overdueStudents.map((student, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td 
                                                className="px-4 py-3 text-sm font-medium text-primary cursor-pointer hover:underline"
                                                onClick={() => setSelectedStudent(student)}
                                            >
                                                {student.studentName}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-neutral-600">{student.className}</td>
                                            <td className="px-4 py-3 text-sm font-bold text-red-600">₹{student.dueAmount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleSendWhatsApp(student)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="WhatsApp">
                                                        <WhatsAppIcon className="h-4 w-4"/>
                                                    </button>
                                                    <button onClick={() => handleAICallSimulation(student)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="AI Call">
                                                        <PhoneIcon className="h-4 w-4"/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeeNotification;
