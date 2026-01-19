
import React, { useState, useRef } from 'react';
import { FeeRecord } from '../types';
import { useAppConfig } from '../contexts/AppConfigContext';
import { CheckCircleIcon, XCircleIcon, CurrencyRupeeIcon, SparklesIcon, PrinterIcon, ArrowDownTrayIcon, QrCodeIcon } from './icons/AllIcons';
import { useToast } from '../hooks/useToast';
import { feeService } from '../services/feeService';
import Loader from './Loader';

interface Props {
    fee: FeeRecord;
    studentName: string;
    onClose: () => void;
}

const PaymentCheckout: React.FC<Props> = ({ fee, studentName, onClose }) => {
    const { institutionName, logoUrl } = useAppConfig();
    const toast = useToast();
    const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
    const [txnId, setTxnId] = useState('');
    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePay = () => {
        setStep('processing');
        const simulatedTxn = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
        setTxnId(simulatedTxn);

        setTimeout(() => {
            const success = feeService.processOnlinePayment(fee.id, fee.amount - fee.paidAmount, simulatedTxn);
            if (success) {
                setStep('success');
                toast.success("Payment Successful!");
            } else {
                setStep('method');
                toast.error("Payment failed. Please try again.");
            }
        }, 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-pop-in border-4 border-white">
                
                {step === 'method' && (
                    <div className="p-8 space-y-8">
                        <div className="text-center">
                            {logoUrl ? <img src={logoUrl} className="h-16 mx-auto mb-4 object-contain" alt="Logo"/> : <div className="p-4 bg-primary/10 rounded-2xl w-fit mx-auto mb-4 text-primary font-black">SARTHI</div>}
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{institutionName}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Payment Secure Gateway</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Paying for {studentName}</p>
                                <h4 className="text-lg font-bold text-slate-800">{fee.description.split('(')[0]}</h4>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                                <p className="text-2xl font-black text-primary">₹{(fee.amount - fee.paidAmount).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Choose Payment Method</p>
                            <div className="grid grid-cols-1 gap-3">
                                {[
                                    { id: 'upi', label: 'UPI (PhonePe, GPay, Paytm)', icon: <QrCodeIcon className="h-5 w-5"/> },
                                    { id: 'card', label: 'Credit / Debit Card', icon: <CurrencyRupeeIcon className="h-5 w-5"/> },
                                    { id: 'netbanking', label: 'Net Banking', icon: <SparklesIcon className="h-5 w-5"/> }
                                ].map((method: any) => (
                                    <button 
                                        key={method.id} 
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${paymentMethod === method.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 hover:bg-slate-50'}`}
                                    >
                                        <div className={`p-2 rounded-xl ${paymentMethod === method.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>{method.icon}</div>
                                        <span className="font-bold text-slate-700">{method.label}</span>
                                        {paymentMethod === method.id && <CheckCircleIcon className="ml-auto h-5 w-5 text-primary"/>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl">CANCEL</button>
                            <button onClick={handlePay} className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3">
                                PAY NOW <ArrowDownTrayIcon className="h-5 w-5 rotate-[-90deg]"/>
                            </button>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="p-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Loader message="" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Processing Payment...</h3>
                        <p className="text-slate-500 font-hindi font-bold">कृपया पेज को रिफ्रेश न करें।</p>
                        <div className="flex justify-center gap-2">
                             <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                             <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                             <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="p-8 text-center space-y-6 animate-pop-in overflow-y-auto max-h-[85vh] custom-scrollbar no-print">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircleIcon className="h-12 w-12" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Payment Success!</h3>
                        
                        <div ref={receiptRef} className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-left relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><QrCodeIcon className="h-32 w-32"/></div>
                             <div className="mb-6 border-b pb-4">
                                <h4 className="font-black text-slate-900">{institutionName}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Official Digital Receipt</p>
                             </div>
                             
                             <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Student</span>
                                    <span className="text-sm font-bold text-slate-800">{studentName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Description</span>
                                    <span className="text-sm font-bold text-slate-800">{fee.description.split('(')[0]}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">Transaction ID</span>
                                    <span className="text-sm font-mono font-bold text-indigo-600">{txnId}</span>
                                </div>
                                <div className="flex justify-between border-t pt-4">
                                    <span className="text-sm font-black text-slate-400 uppercase">Total Paid</span>
                                    <span className="text-2xl font-black text-green-600">₹{(fee.amount - fee.paidAmount).toLocaleString()}</span>
                                </div>
                             </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 no-print">
                            <button onClick={handlePrint} className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3">
                                <PrinterIcon className="h-5 w-5"/> PRINT RECEIPT
                            </button>
                            <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl">GO BACK</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentCheckout;
