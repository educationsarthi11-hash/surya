import React, { useState } from 'react';
import { StudentData } from '../types';
import { useToast } from '../hooks/useToast';
import { EnvelopeIcon, PaperAirplaneIcon, XCircleIcon } from './icons/AllIcons';

interface MessageModalProps {
    student: StudentData;
    onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ student, onClose }) => {
    const [message, setMessage] = useState('');
    const toast = useToast();

    const handleSend = () => {
        if (!message.trim()) {
            toast.error("Message cannot be empty.");
            return;
        }

        // Simulate sending the message
        console.log(`--- SIMULATING MESSAGE SEND ---`);
        console.log(`To: ${student.name} (${student.id})`);
        console.log(`Contact: ${student.mobileNumber} / ${student.email}`);
        console.log(`Message: ${message}`);
        console.log(`-----------------------------`);

        toast.success(`Message sent to ${student.name}!`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-pop-in" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-6 w-6 text-primary" />
                        <h3 className="text-lg font-bold">Send Message to {student.name}</h3>
                    </div>
                    <button onClick={onClose} aria-label="Close modal">
                        <XCircleIcon className="h-6 w-6 text-neutral-500 hover:text-neutral-800"/>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="message-content" className="block text-sm font-medium text-neutral-700">Your Message (आपका संदेश)</label>
                        <textarea
                            id="message-content"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2 focus:ring-primary focus:border-primary"
                            placeholder="Type your message here..."
                        />
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-md text-sm font-semibold hover:bg-neutral-300">
                        Cancel
                    </button>
                    <button onClick={handleSend} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark flex items-center gap-2">
                        <PaperAirplaneIcon className="h-5 w-5" />
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
