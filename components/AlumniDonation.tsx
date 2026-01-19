
import React, { useState } from 'react';
import { GiftIcon, CurrencyRupeeIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';

const campaigns = [
    { id: 1, title: 'New Computer Lab', goal: 500000, raised: 120000, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=200&fit=crop' },
    { id: 2, title: 'Sponsor a Student', goal: 200000, raised: 45000, image: 'https://images.unsplash.com/photo-1427504746696-ea309381655f?q=80&w=200&fit=crop' },
];

const AlumniDonation: React.FC = () => {
    const toast = useToast();
    const [amount, setAmount] = useState('');
    const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);

    const handleDonate = () => {
        if (!amount || !selectedCampaign) {
            toast.error("Please select a campaign and enter amount.");
            return;
        }
        toast.success(`Thank you! ₹${amount} donation initiated.`);
        setAmount('');
        setSelectedCampaign(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[500px]">
            <div className="flex items-center mb-6">
                <GiftIcon className="h-8 w-8 text-pink-500" />
                <div className="ml-3">
                    <h2 className="text-2xl font-bold text-neutral-900">Alumni Give Back</h2>
                    <p className="text-sm text-neutral-500 font-hindi">पूर्व छात्र दान और फंडरेजिंग</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700">Active Campaigns</h3>
                    {campaigns.map(camp => (
                        <div 
                            key={camp.id} 
                            onClick={() => setSelectedCampaign(camp.id)}
                            className={`p-4 border rounded-xl cursor-pointer transition-all flex gap-4 ${selectedCampaign === camp.id ? 'border-pink-500 bg-pink-50' : 'bg-white hover:bg-slate-50'}`}
                        >
                            <img src={camp.image} alt={camp.title} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800">{camp.title}</h4>
                                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-pink-500 h-full" style={{ width: `${(camp.raised / camp.goal) * 100}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>₹{camp.raised.toLocaleString()} raised</span>
                                    <span>Goal: ₹{camp.goal.toLocaleString()}</span>
                                </div>
                            </div>
                            {selectedCampaign === camp.id && <CheckCircleIcon className="h-6 w-6 text-pink-500"/>}
                        </div>
                    ))}
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border h-fit">
                    <h3 className="font-bold text-slate-800 mb-4">Make a Donation</h3>
                    <div className="relative mb-4">
                        <CurrencyRupeeIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400"/>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-lg" 
                            placeholder="Enter Amount"
                        />
                    </div>
                    <button 
                        onClick={handleDonate}
                        className="w-full py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 shadow-md transition-transform hover:scale-105"
                    >
                        Proceed to Pay
                    </button>
                    <p className="text-xs text-slate-400 mt-4 text-center">Secure Payment Gateway • Tax Deductible</p>
                </div>
            </div>
        </div>
    );
};

export default AlumniDonation;
