
import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, User, UserRole } from '../types';
import { useToast } from '../hooks/useToast';
import { 
    ShoppingCartIcon, PlusIcon, XCircleIcon, TrashIcon, 
    CheckCircleIcon, BuildingStorefrontIcon, 
    CurrencyRupeeIcon, SparklesIcon,
    ArchiveBoxIcon, PrinterIcon, TagIcon
} from './icons/AllIcons';
import { productService, ProductCombo } from '../services/productService';
import { useLanguage } from '../contexts/LanguageContext';
import Loader from './Loader';

const SchoolStore: React.FC<{ user: User }> = ({ user }) => {
    const { t } = useLanguage();
    const toast = useToast();
    const [products, setProducts] = useState<ProductCombo[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [viewMode, setViewMode] = useState<'shop' | 'admin' | 'orders'>('shop');
    const [isOrderProcessing, setIsOrderProcessing] = useState(false);

    const isAdmin = [UserRole.Admin, UserRole.Company, UserRole.School].includes(user.role);

    useEffect(() => {
        setProducts(productService.getProducts());
        const unsubscribe = productService.subscribe(() => setProducts([...productService.getProducts()]));
        return unsubscribe;
    }, []);

    const addToCart = (product: ProductCombo) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            return [...prev, { ...product, quantity: 1 }];
        });
        toast.success(`${product.name} ट्रे में जोड़ा गया!`);
    };

    const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

    const handleCheckout = () => {
        setIsOrderProcessing(true);
        setTimeout(() => {
            setIsOrderProcessing(false);
            setCart([]);
            toast.success("ऑर्डर प्लेस कर दिया गया है! वेंडर को सूचना भेज दी गई है।");
        }, 2000);
    };

    return (
        <div className="bg-slate-50 p-4 sm:p-8 rounded-[3.5rem] shadow-soft min-h-[800px] animate-pop-in border border-slate-200">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-5">
                    <div className="bg-slate-900 p-4 rounded-3xl text-white shadow-xl rotate-3">
                        <BuildingStorefrontIcon className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-slate-950 tracking-tighter uppercase">{t('Campus Kart', 'Campus Kart')}</h2>
                        <p className="text-sm font-hindi font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <SparklesIcon className="h-4 w-4 text-primary animate-pulse"/> स्कूल यूनिफॉर्म और एक्सेसरीज स्टोर
                        </p>
                    </div>
                </div>

                <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar">
                    <button onClick={() => setViewMode('shop')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${viewMode === 'shop' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>{t('VIEW', 'VIEW')}</button>
                    {isAdmin && (
                        <>
                            <button onClick={() => setViewMode('admin')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${viewMode === 'admin' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>{t('Manage', 'Manage')}</button>
                            <button onClick={() => setViewMode('orders')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${viewMode === 'orders' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}>{t('Order History', 'Order History')}</button>
                        </>
                    )}
                </div>
            </div>

            {viewMode === 'shop' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map(p => (
                                <div key={p.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all">
                                    <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
                                        <img src={p.image} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border">{p.category}</div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-black text-slate-800 text-sm uppercase mb-4 h-10 line-clamp-2">{p.name}</h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-black text-primary">₹{p.price}</span>
                                            <button onClick={() => addToCart(p)} className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-primary transition-all flex items-center gap-2 shadow-lg">
                                                <PlusIcon className="h-4 w-4"/> {t('ORDER', 'ORDER')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 sticky top-6">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <ShoppingCartIcon className="h-6 w-6 text-primary" /> {t('My Order Tray', 'My Order Tray')}
                            </h3>
                            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.length === 0 ? (
                                    <div className="text-center py-10 opacity-30">
                                        <ArchiveBoxIcon className="h-16 w-16 mx-auto mb-2"/>
                                        <p className="font-bold text-xs uppercase tracking-widest">ट्रे खाली है</p>
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 animate-slide-in-right">
                                            <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0 flex items-center justify-center"><img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black text-slate-800 truncate uppercase">{item.name}</p>
                                                <p className="text-[10px] font-bold text-primary">₹{item.price} x {item.quantity}</p>
                                            </div>
                                            <button onClick={() => toast.info("Removed")} className="text-red-400 p-1 hover:bg-red-50 rounded-lg transition-colors"><XCircleIcon className="h-4 w-4"/></button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Bill</span>
                                    <span className="text-3xl font-black text-slate-950">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <button 
                                    onClick={handleCheckout} 
                                    disabled={cart.length === 0 || isOrderProcessing}
                                    className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 uppercase"
                                >
                                    {isOrderProcessing ? <Loader message="" /> : <><CheckCircleIcon className="h-6 w-6"/> {t('CONFIRM ORDER', 'CONFIRM ORDER')}</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {viewMode === 'admin' && (
                <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 shadow-inner animate-pop-in">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase">
                        <TagIcon className="h-8 w-8 text-primary"/> Bulk Procurement
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                             <p className="text-slate-500 font-hindi text-lg">थोक ऑर्डर (Bulk Orders) के लिए अपनी संस्था का विवरण भरें। ड्रेस, बेल्ट और टाई का स्टॉक सीधे सेंट्रल वेयरहाउस से भेजा जाएगा।</p>
                             <div className="space-y-4">
                                <input placeholder="Sizing Chart (e.g. Medium - 50, Large - 30)" className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all font-bold" />
                                <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-primary transition-all">GENERATE QUOTATION</button>
                             </div>
                        </div>
                        <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
                             <h4 className="text-orange-400 font-black uppercase text-xs mb-4 tracking-widest">Pricing Policy</h4>
                             <ul className="space-y-3 text-sm font-hindi opacity-80">
                                 <li>• 500 से अधिक बेल्ट पर 20% की अतिरिक्त छूट।</li>
                                 <li>• ड्रेस का कपड़ा सरकारी मानकों के अनुसार होगा।</li>
                                 <li>• टाई पर स्कूल लोगो प्रिंटिंग की सुविधा उपलब्ध है।</li>
                             </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolStore;
