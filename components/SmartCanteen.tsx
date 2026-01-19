
import React, { useState, useMemo } from 'react';
import { CakeIcon, ShoppingCartIcon, PlusIcon, XCircleIcon, CheckCircleIcon, QrCodeIcon, CurrencyRupeeIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import Loader from './Loader';

interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: 'Snacks' | 'Meals' | 'Beverages' | 'Desserts';
    image: string;
}

interface CartItem extends MenuItem {
    quantity: number;
}

const menuItems: MenuItem[] = [
    { id: 1, name: 'Veg Burger', price: 45, category: 'Snacks', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop' },
    { id: 2, name: 'Masala Dosa', price: 60, category: 'Meals', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=400&auto=format&fit=crop' },
    { id: 3, name: 'Cold Coffee', price: 50, category: 'Beverages', image: 'https://images.unsplash.com/photo-1461023058943-48db09b4c8f4?q=80&w=400&auto=format&fit=crop' },
    { id: 4, name: 'Fruit Salad', price: 40, category: 'Desserts', image: 'https://images.unsplash.com/photo-1519996529931-9c42a9990915?q=80&w=400&auto=format&fit=crop' },
    { id: 5, name: 'Veg Sandwich', price: 35, category: 'Snacks', image: 'https://images.unsplash.com/photo-1553909489-cd47e3b4430f?q=80&w=400&auto=format&fit=crop' },
    { id: 6, name: 'Thali (Lunch)', price: 80, category: 'Meals', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop' },
    { id: 7, name: 'Fresh Lime Soda', price: 25, category: 'Beverages', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400&auto=format&fit=crop' },
];

const SmartCanteen: React.FC = () => {
    const toast = useToast();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [category, setCategory] = useState<string>('All');
    const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const [orderToken, setOrderToken] = useState<string>('');

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        toast.success(`${item.name} added to tray.`);
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

    const handlePlaceOrder = () => {
        if (cart.length === 0) return;
        setOrderStatus('processing');
        
        setTimeout(() => {
            setOrderToken(`ORD-${Math.floor(1000 + Math.random() * 9000)}`);
            setOrderStatus('success');
            setCart([]);
            toast.success("Order placed successfully!");
        }, 2000);
    };

    const filteredItems = category === 'All' ? menuItems : menuItems.filter(i => i.category === category);

    if (orderStatus === 'success') {
        return (
            <div className="bg-white p-8 rounded-xl shadow-soft h-[600px] flex flex-col items-center justify-center text-center animate-pop-in">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircleIcon className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h3>
                <p className="text-slate-500 mb-6">Your food is being prepared. Show this token at the counter.</p>
                
                <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-300 mb-8">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-2">Pickup Token</p>
                    <h2 className="text-4xl font-mono font-black text-primary tracking-widest">{orderToken}</h2>
                    <div className="mt-4 flex justify-center">
                         <QrCodeIcon className="h-32 w-32 text-slate-800" />
                    </div>
                </div>
                
                <button 
                    onClick={() => setOrderStatus('idle')}
                    className="px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-primary-dark transition-transform hover:scale-105"
                >
                    Order More
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft h-full min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                        <CakeIcon className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">Smart Canteen</h2>
                        <p className="text-sm text-neutral-500 font-hindi">Pre-order & Skip the Line</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                    <CurrencyRupeeIcon className="h-5 w-5" />
                    <span>Wallet: ₹450</span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Menu Area */}
                <div className="lg:col-span-2 flex flex-col overflow-hidden">
                    {/* Filters */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                        {['All', 'Snacks', 'Meals', 'Beverages', 'Desserts'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${category === cat ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {filteredItems.map(item => (
                                <div key={item.id} className="group bg-white border rounded-xl overflow-hidden hover:shadow-md transition-all">
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-bold text-sm text-slate-800 truncate">{item.name}</h4>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="font-bold text-slate-900">₹{item.price}</span>
                                            <button onClick={() => addToCart(item)} className="p-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors">
                                                <PlusIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart Area */}
                <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b bg-white">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <ShoppingCartIcon className="h-5 w-5 text-primary" /> Your Tray
                        </h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center text-slate-400 py-10">
                                <p>Your tray is empty.</p>
                                <p className="text-xs mt-1">Add some delicious food!</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                            <p className="text-xs text-slate-500">₹{item.price}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded hover:bg-slate-200">-</button>
                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded hover:bg-slate-200">+</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-600 font-medium">Total</span>
                            <span className="text-xl font-bold text-primary">₹{cartTotal}</span>
                        </div>
                        <button 
                            onClick={handlePlaceOrder}
                            disabled={cart.length === 0 || orderStatus === 'processing'}
                            className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                        >
                            {orderStatus === 'processing' ? <Loader message="Paying..." /> : 'Pay & Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartCanteen;
