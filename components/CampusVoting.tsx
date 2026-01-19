
import React, { useState } from 'react';
import { HandRaisedIcon, CheckCircleIcon, ChartBarIcon, PlusIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

interface Candidate {
    id: string;
    name: string;
    class: string;
    agenda: string;
    votes: number;
    photoUrl: string;
}

interface Election {
    id: string;
    title: string;
    status: 'Active' | 'Closed';
    candidates: Candidate[];
}

const mockElections: Election[] = [
    {
        id: 'E1',
        title: 'School Head Boy Election 2024',
        status: 'Active',
        candidates: [
            { id: 'C1', name: 'Aarav Sharma', class: '12-A', agenda: 'More sports events and better canteen food.', votes: 45, photoUrl: 'https://i.pravatar.cc/150?u=aarav' },
            { id: 'C2', name: 'Rohan Mehta', class: '12-B', agenda: 'Focus on peer tutoring and library upgrades.', votes: 38, photoUrl: 'https://i.pravatar.cc/150?u=rohan' }
        ]
    },
    {
        id: 'E2',
        title: 'Sports Captain Election',
        status: 'Closed',
        candidates: [
            { id: 'C3', name: 'Vikram Singh', class: '11-C', agenda: 'Inter-house cricket league.', votes: 120, photoUrl: 'https://i.pravatar.cc/150?u=vikram' },
            { id: 'C4', name: 'Rahul Verma', class: '11-A', agenda: 'New football kits for everyone.', votes: 95, photoUrl: 'https://i.pravatar.cc/150?u=rahul' }
        ]
    }
];

const CampusVoting: React.FC = () => {
    const toast = useToast();
    const [elections, setElections] = useState<Election[]>(mockElections);
    const [selectedElectionId, setSelectedElectionId] = useState<string>(mockElections[0].id);
    const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({}); // Track votes locally for demo

    const activeElection = elections.find(e => e.id === selectedElectionId);

    const handleVote = (electionId: string, candidateId: string) => {
        if (hasVoted[electionId]) {
            toast.error("You have already voted in this election.");
            return;
        }
        
        const updatedElections = elections.map(e => {
            if (e.id === electionId) {
                return {
                    ...e,
                    candidates: e.candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
                };
            }
            return e;
        });

        setElections(updatedElections);
        setHasVoted({ ...hasVoted, [electionId]: true });
        toast.success("Vote cast successfully!");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px]">
            <div className="flex items-center mb-6">
                <HandRaisedIcon className="h-8 w-8 text-primary" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Campus Voting System (Loktantra)</h2>
                    <p className="text-sm text-neutral-500 font-hindi">डिजिटल छात्र चुनाव और मतदान</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Election List */}
                <div className="lg:col-span-1 space-y-3">
                    <h3 className="font-bold text-slate-800 mb-2">Active Elections</h3>
                    {elections.map(e => (
                        <button
                            key={e.id}
                            onClick={() => setSelectedElectionId(e.id)}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${selectedElectionId === e.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-neutral-200 hover:bg-slate-50'}`}
                        >
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-800">{e.title}</h4>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${e.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{e.status}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{e.candidates.length} Candidates</p>
                        </button>
                    ))}
                </div>

                {/* Voting Area */}
                <div className="lg:col-span-2">
                    {activeElection ? (
                        <div className="animate-pop-in">
                            <div className="flex justify-between items-end mb-6 border-b pb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">{activeElection.title}</h3>
                                    <p className="text-slate-500 text-sm">Cast your vote carefully. You can only vote once.</p>
                                </div>
                                {hasVoted[activeElection.id] && (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded-full flex items-center gap-2">
                                        <CheckCircleIcon className="h-4 w-4"/> Voted
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {activeElection.candidates.map(candidate => (
                                    <div key={candidate.id} className="border rounded-xl p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow bg-white">
                                        <img src={candidate.photoUrl} alt={candidate.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm mb-3" />
                                        <h4 className="text-lg font-bold text-slate-800">{candidate.name}</h4>
                                        <p className="text-sm text-primary font-medium">{candidate.class}</p>
                                        <div className="bg-slate-50 p-3 rounded-lg mt-3 w-full text-xs text-slate-600 italic">
                                            "{candidate.agenda}"
                                        </div>
                                        
                                        {/* Voting Controls or Results */}
                                        {activeElection.status === 'Active' && !hasVoted[activeElection.id] ? (
                                            <button 
                                                onClick={() => handleVote(activeElection.id, candidate.id)}
                                                className="mt-4 w-full py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-transform active:scale-95"
                                            >
                                                Vote Now
                                            </button>
                                        ) : (
                                            <div className="mt-4 w-full">
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span>Votes</span>
                                                    <span>{candidate.votes}</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-green-500 transition-all duration-1000" 
                                                        style={{ width: `${(candidate.votes / (activeElection.candidates.reduce((sum, c) => sum + c.votes, 0) || 1)) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">Select an election to view details.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampusVoting;
