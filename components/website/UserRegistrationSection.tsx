import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import { useToast } from '../../hooks/useToast';
import SectionWrapper from './SectionWrapper';
import { UserPlusIcon, MicrophoneIcon } from '../icons/AllIcons';
import { useSpeech } from '../../hooks/useSpeech';

const UserRegistrationSection: React.FC = () => {
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        mobileNumber: '',
        role: UserRole.Student,
        password: '',
        confirmPassword: ''
    });

    const { speechInput, setSpeechInput, isListening, toggleListening } = useSpeech({ enableSpeechRecognition: true });
    const [activeSpeechInput, setActiveSpeechInput] = useState<string | null>(null);

    useEffect(() => {
        if (speechInput && !isListening && activeSpeechInput) {
            setFormData(prev => ({ ...prev, [activeSpeechInput]: speechInput }));
            setSpeechInput('');
            setActiveSpeechInput(null);
        }
    }, [speechInput, isListening, activeSpeechInput, setSpeechInput]);

    const handleMicClick = (fieldName: string) => {
        if (isListening && activeSpeechInput === fieldName) {
            toggleListening();
        } else {
            setSpeechInput('');
            setActiveSpeechInput(fieldName);
            toggleListening();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, username, email, mobileNumber, password, confirmPassword } = formData;
        if (!name.trim() || !username.trim() || !email.trim() || !mobileNumber.trim() || !password.trim()) {
            toast.error('Please fill all fields.');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        // Simulate user creation
        console.log("--- SIMULATING USER REGISTRATION ---");
        console.log("New User Data:", {
            name, username, email, mobileNumber, role: formData.role
        });
        console.log("------------------------------------");

        toast.success(`Account for "${name}" created successfully! You can now log in.`);
        
        // Reset form
        setFormData({
            name: '',
            username: '',
            email: '',
            mobileNumber: '',
            role: UserRole.Student,
            password: '',
            confirmPassword: ''
        });
    };
    
    const formFields: { [key: string]: { label: string; type: string } } = {
        name: { label: "Full Name (पूरा नाम)", type: "text" },
        username: { label: "Username (उपयोगकर्ता नाम)", type: "text" },
        email: { label: "Email Address (ईमेल)", type: "email" },
        mobileNumber: { label: "Mobile Number (मोबाइल नंबर)", type: "tel" },
    };

    return (
        <SectionWrapper id="register" className="bg-slate-50">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Create Your Account</h2>
                <p className="mt-4 text-base sm:text-lg text-slate-600 font-hindi">
                    उपयोगकर्ता पंजीकरण: अपनी यात्रा शुरू करने के लिए एक खाता बनाएँ।
                </p>
            </div>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-soft border border-slate-200/80">
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {Object.entries(formFields).slice(0, 2).map(([key, { label, type }]) => (
                            <div key={key}>
                                <label htmlFor={`reg_${key}`} className="block text-sm font-medium text-slate-700">{label}</label>
                                <div className="relative mt-1">
                                    <input type={type} name={key} id={`reg_${key}`} value={formData[key as keyof typeof formData]} onChange={handleInputChange} className="block w-full rounded-md border-slate-300 shadow-sm p-3 focus:ring-2 focus:ring-primary pr-10" required />
                                    <button type="button" onClick={() => handleMicClick(key)} className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isListening && activeSpeechInput === key ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} aria-label={`Dictate ${label}`}>
                                        <MicrophoneIcon className="h-5 w-5"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {Object.entries(formFields).slice(2).map(([key, { label, type }]) => (
                        <div key={key}>
                            <label htmlFor={`reg_${key}`} className="block text-sm font-medium text-slate-700">{label}</label>
                            <div className="relative mt-1">
                                <input type={type} name={key} id={`reg_${key}`} value={formData[key as keyof typeof formData]} onChange={handleInputChange} className="block w-full rounded-md border-slate-300 shadow-sm p-3 focus:ring-2 focus:ring-primary pr-10" required />
                                <button type="button" onClick={() => handleMicClick(key)} className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isListening && activeSpeechInput === key ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} aria-label={`Dictate ${label}`}>
                                    <MicrophoneIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        </div>
                    ))}

                     <div>
                        <label htmlFor="reg_role" className="block text-sm font-medium text-slate-700">I am a... (आपकी भूमिका)</label>
                        <select name="role" id="reg_role" value={formData.role} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-3 focus:ring-2 focus:ring-primary" required>
                            {Object.values(UserRole).filter(role => ![UserRole.Company, UserRole.Admin].includes(role)).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="reg_password" className="block text-sm font-medium text-slate-700">Password (पासवर्ड)</label>
                            <input type="password" name="password" id="reg_password" value={formData.password} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-3 focus:ring-2 focus:ring-primary" required />
                        </div>
                        <div>
                            <label htmlFor="reg_confirmPassword" className="block text-sm font-medium text-slate-700">Confirm Password (पासवर्ड की पुष्टि करें)</label>
                            <input type="password" name="confirmPassword" id="reg_confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-3 focus:ring-2 focus:ring-primary" required />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                            <UserPlusIcon className="h-5 w-5" />
                            Register Account
                        </button>
                    </div>
                </form>
            </div>
        </SectionWrapper>
    );
};

export default UserRegistrationSection;
