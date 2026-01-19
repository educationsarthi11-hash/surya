
import React, { useState } from 'react';
import { FolderIcon, PlusIcon, TrashIcon, EyeIcon, LockClosedIcon, DocumentTextIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

interface Doc {
    id: string;
    name: string;
    type: string;
    size: string;
    date: string;
    file?: File;
}

const mockDocs: Doc[] = [
    { id: '1', name: 'Class 10 Marksheet', type: 'PDF', size: '2.4 MB', date: '2023-05-15' },
    { id: '2', name: 'Aadhar Card', type: 'JPG', size: '1.1 MB', date: '2023-01-10' },
    { id: '3', name: 'Transfer Certificate', type: 'PDF', size: '0.8 MB', date: '2023-04-20' },
];

const DigitalLocker: React.FC = () => {
    const toast = useToast();
    const [documents, setDocuments] = useState<Doc[]>(mockDocs);
    
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newDoc: Doc = {
                id: `DOC-${Date.now()}`,
                name: file.name,
                type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                date: new Date().toISOString().split('T')[0],
                file: file
            };
            setDocuments([newDoc, ...documents]);
            toast.success("Document uploaded securely.");
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to remove this document?")) {
            setDocuments(prev => prev.filter(d => d.id !== id));
            toast.info("Document removed.");
        }
    };

    const handleDownload = (doc: Doc) => {
        if (doc.file) {
            const url = URL.createObjectURL(doc.file);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // Mock download for static items
            toast.info(`Downloading ${doc.name}...`);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <LockClosedIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">Digital Locker</h2>
                        <p className="text-sm text-neutral-500 font-hindi">आपके सभी महत्वपूर्ण दस्तावेज़ों का सुरक्षित घर</p>
                    </div>
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer shadow-md transition-transform hover:scale-105">
                    <PlusIcon className="h-5 w-5" /> Upload Doc
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {documents.map(doc => (
                    <div key={doc.id} className="group relative p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all bg-slate-50 hover:bg-white">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-3 bg-white border rounded-lg text-blue-500">
                                {doc.type === 'PDF' ? <DocumentTextIcon className="h-6 w-6"/> : <FolderIcon className="h-6 w-6"/>}
                            </div>
                            <button onClick={() => handleDelete(doc.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <h4 className="font-bold text-slate-800 truncate mb-1" title={doc.name}>{doc.name}</h4>
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>{doc.date}</span>
                            <span>{doc.size}</span>
                        </div>
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                            <button onClick={() => handleDownload(doc)} className="px-3 py-1 bg-white rounded-full text-xs font-bold shadow-sm hover:bg-blue-50 text-blue-600">
                                Download
                            </button>
                        </div>
                    </div>
                ))}
                {documents.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400 border-2 border-dashed rounded-xl">
                        <LockClosedIcon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>Your locker is empty. Upload certificates, marksheets, or IDs.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DigitalLocker;
