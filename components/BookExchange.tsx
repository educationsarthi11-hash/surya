
import React, { useState } from 'react';
import { BookOpenIcon, CurrencyRupeeIcon, MapPinIcon, PhoneIcon, PlusIcon, MagnifyingGlassIcon, CheckCircleIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { useClassroom } from '../contexts/ClassroomContext';

interface BookListing {
    id: string;
    title: string;
    class: string;
    condition: 'New' | 'Good' | 'Used';
    price: number; // 0 for free
    sellerName: string;
    contact: string;
    image: string;
}

const mockListings: BookListing[] = [
    { id: '1', title: 'RD Sharma Mathematics', class: 'Class 10', condition: 'Good', price: 200, sellerName: 'Rahul (Class 11)', contact: '9876543210', image: 'https://m.media-amazon.com/images/I/51+M8b-sEQL._AC_UF1000,1000_QL80_.jpg' },
    { id: '2', title: 'NCERT Science Complete Set', class: 'Class 9', condition: 'Used', price: 0, sellerName: 'Amit (Class 10)', contact: '9988776655', image: 'https://ncert.nic.in/textbook/textbook/jhsc1cc.jpg' },
];

const BookExchange: React.FC = () => {
    const toast = useToast();
    const { selectedClass } = useClassroom();
    const [listings, setListings] = useState<BookListing[]>(mockListings);
    const [filter, setFilter] = useState<'All' | 'Free'>('All');
    const [showPostForm, setShowPostForm] = useState(false);
    
    // Form Data
    const [newTitle, setNewTitle] = useState('');
    const [newPrice, setNewPrice] = useState('');

    const handleContact = (seller: string, contact: string) => {
        toast.success(`Seller contact sent to your phone: ${contact}`);
    };

    const handlePostAd = (e: React.FormEvent) => {
        e.preventDefault();
        const newAd: BookListing = {
            id: Date.now().toString(),
            title: newTitle,
            class: selectedClass,
            condition: 'Good',
            price: parseInt(newPrice) || 0,
            sellerName: 'You',
            contact: 'Your Profile',
            image: 'https://via.placeholder.com/150'
        };
        setListings([newAd, ...listings]);
        setShowPostForm(false);
        setNewTitle('');
        setNewPrice('');
        toast.success("आपकी किताब लिस्ट कर दी गई है!");
    };

    const filteredList = listings.filter(l => filter === 'All' || (filter === 'Free' && l.price === 0));

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full flex flex-col min-h-[600px] animate-pop-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b pb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                        <BookOpenIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Student Book Exchange</h2>
                        <p className="text-sm text-slate-500 font-hindi">पुरानी किताबें बेचें या मुफ्त पाएं (Save Money)</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowPostForm(true)}
                    className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-primary hover:text-slate-900 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
                >
                    <PlusIcon className="h-4 w-4"/> Sell/Donate Book
                </button>
            </div>

            {showPostForm && (
                <div className="mb-8 p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-200 animate-slide-in-up">
                    <h3 className="font-bold text-slate-800 mb-4">Post a Book Ad</h3>
                    <form onSubmit={handlePostAd} className="flex gap-4">
                        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Book Name" className="flex-1 p-3 rounded-xl border border-slate-300" required />
                        <input value={newPrice} onChange={e => setNewPrice(e.target.value)} type="number" placeholder="Price (0 for Free)" className="w-40 p-3 rounded-xl border border-slate-300" />
                        <button type="submit" className="bg-green-600 text-white px-6 rounded-xl font-bold">Post</button>
                        <button type="button" onClick={() => setShowPostForm(false)} className="text-slate-400 font-bold px-4">Cancel</button>
                    </form>
                </div>
            )}

            <div className="flex gap-2 mb-6">
                <button onClick={() => setFilter('All')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'All' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>All Books</button>
                <button onClick={() => setFilter('Free')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'Free' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700'}`}>Free / Donation</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {filteredList.map(book => (
                    <div key={book.id} className="border border-slate-100 rounded-[2rem] p-4 flex gap-4 hover:shadow-lg transition-all group bg-white">
                        <img src={book.image} className="w-24 h-32 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform" />
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${book.price === 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {book.price === 0 ? 'FREE DONATION' : `₹${book.price}`}
                                </span>
                                <h4 className="font-bold text-slate-800 mt-2 leading-tight line-clamp-2">{book.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{book.class} • {book.condition}</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400">{book.sellerName}</span>
                                <button onClick={() => handleContact(book.sellerName, book.contact)} className="bg-primary text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform">
                                    <PhoneIcon className="h-4 w-4"/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookExchange;
