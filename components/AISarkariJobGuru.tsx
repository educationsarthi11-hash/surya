import React, { useState, useEffect } from 'react';
import { SarkariJob } from '../types';
import { findSarkariJobs } from '../services/geminiService';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';
import { BriefcaseIcon } from './icons/AllIcons';

const qualifications = ['10th Pass', '12th Pass', 'Graduate'];

const JobCard: React.FC<{ job: SarkariJob }> = ({ job }) => (
    <div className="bg-white p-4 rounded-lg border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 flex flex-col">
        <div className="flex-grow">
            <h4 className="font-bold text-primary">{job.title}</h4>
            <p className="text-sm font-semibold text-neutral-700 mt-1">{job.organization}</p>
            <p className="text-xs text-neutral-500 mt-2"><strong>Eligibility:</strong> {job.eligibility}</p>
            
            {job.requiredDocuments && job.requiredDocuments.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                    <h5 className="text-xs font-bold text-neutral-600 mb-2 font-hindi">आवश्यक दस्तावेज़ (Required Documents):</h5>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                        {job.requiredDocuments.map((doc, index) => (
                            <li key={index} className="text-xs text-neutral-600">{doc}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t shrink-0">
            <p className="text-sm font-bold text-red-600">Last Date: {job.lastDate}</p>
            <a href={job.link} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 text-sm font-semibold rounded-full bg-secondary text-white hover:bg-secondary-dark">
                Details
            </a>
        </div>
    </div>
);

const AISarkariJobGuru: React.FC = () => {
    const [activeQualification, setActiveQualification] = useState(qualifications[0]);
    const [jobs, setJobs] = useState<SarkariJob[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setJobs([]);
            try {
                const fetchedJobs = await findSarkariJobs(activeQualification);
                
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set time to the beginning of the day for accurate comparison

                const activeJobs = fetchedJobs.filter(job => {
                    // The AI returns dates like "31-Aug-2024". new Date() can parse this.
                    const lastDate = new Date(job.lastDate);
                    // Check if the date is valid and not in the past.
                    return !isNaN(lastDate.getTime()) && lastDate >= today;
                });

                setJobs(activeJobs);

                if (activeJobs.length === 0) {
                    toast.info(`No active government jobs found for ${activeQualification} at the moment. The AI is always searching!`);
                }
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                toast.error("AI couldn't fetch job listings. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [activeQualification, toast]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-4">
                <BriefcaseIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">AI Sarkari Job Guru</h2>
                    <p className="text-sm text-neutral-500 font-hindi">आपकी योग्यता के अनुसार नवीनतम सरकारी नौकरियां</p>
                </div>
            </div>

            <div className="mb-6 border-b pb-4">
                <p className="text-sm font-semibold text-neutral-700 mb-2 font-hindi">अपनी उच्चतम योग्यता चुनें:</p>
                <div className="flex flex-wrap gap-2">
                    {qualifications.map(q => (
                        <button
                            key={q}
                            onClick={() => setActiveQualification(q)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full border-2 ${activeQualification === q ? 'bg-primary text-white border-primary' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'}`}
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader message={`AI is searching for ${activeQualification} jobs...`} />
                </div>
            ) : jobs.length > 0 ? (
                <div className="space-y-4">
                    {jobs.map((job, index) => <JobCard key={index} job={job} />)}
                </div>
            ) : (
                <div className="text-center py-16 text-neutral-500">
                    <p>AI couldn't find any active government jobs for this qualification right now.</p>
                    <p className="font-hindi">AI को अभी इस योग्यता के लिए कोई सक्रिय सरकारी नौकरी नहीं मिली।</p>
                </div>
            )}
        </div>
    );
};

export default AISarkariJobGuru;