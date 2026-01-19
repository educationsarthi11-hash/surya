
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ToastProvider } from './hooks/useToast';
import { AppConfigProvider } from './contexts/AppConfigContext';
import { ClassroomProvider } from './contexts/ClassroomContext';
import { LanguageProvider } from './contexts/LanguageContext';

// --- FORCE UPDATE VERSION ---
// Updated to 5.5.0 (Critical Patch)
const VERSION = '5.5.0-CRITICAL-FIX'; 

async function clearOldSystemCache() {
    const current = localStorage.getItem('sarthi_version_tag');
    if (current !== VERSION) {
        console.warn("System Repair Refresh Initiated...");
        
        // 1. Service Worker Cache Clear
        if ('caches' in window) {
            const names = await caches.keys();
            for (let name of names) await caches.delete(name);
        }
        
        localStorage.setItem('sarthi_version_tag', VERSION);
        return true;
    }
    return false;
}

// --- SERVICE WORKER REGISTRATION (OFFLINE SUPPORT) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Sarthi Offline Mode Registered:', registration.scope);
            })
            .catch(error => {
                console.log('Sarthi Offline Registration Failed:', error);
            });
    });
}

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    const start = () => {
        root.render(
            <React.StrictMode>
                <LanguageProvider>
                    <ToastProvider>
                        <AppConfigProvider>
                            <ClassroomProvider>
                                <App />
                            </ClassroomProvider>
                        </AppConfigProvider>
                    </ToastProvider>
                </LanguageProvider>
            </React.StrictMode>
        );
    };

    clearOldSystemCache().then(reloaded => {
        if (reloaded) {
             // Reload once to apply cache clear
             window.location.reload();
        } else {
            start();
        }
    }).catch(() => start());
}
