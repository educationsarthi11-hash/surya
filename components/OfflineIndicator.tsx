
import React, { useState, useEffect } from 'react';
import { SignalIcon, ExclamationTriangleIcon, BoltIcon } from './icons/AllIcons';

const OfflineIndicator: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <div className={`fixed top-4 right-20 z-[150] flex items-center gap-2 px-4 py-2 rounded-full border shadow-lg transition-all ${isOnline ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700 animate-pulse'}`}>
            {isOnline ? (
                <><SignalIcon className="h-4 w-4" /> <span className="text-[10px] font-black uppercase">Online Mode</span></>
            ) : (
                <><ExclamationTriangleIcon className="h-4 w-4" /> <span className="text-[10px] font-black uppercase">Offline Mode</span></>
            )}
        </div>
    );
};

export default OfflineIndicator;
