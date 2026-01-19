
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { LocationType } from '../types';

interface AppConfig {
    selectedCountry: string;
    selectedState: string;
    selectedBoard: string; 
    institutionType: LocationType;
    institutionName: string;
    slogan: string;
    logoUrl?: string;
    primaryColor: string; 
    userName: string;
    fatherName: string;
    motherName: string;
    dob: string;
    tob: string;
}

interface AppConfigContextType extends AppConfig {
    setConfirmConfig: (config: Partial<AppConfig>) => void;
    setConfig: (config: Partial<AppConfig>) => void;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

// Default defaults set for Education Sarthi Platform, Mangmat (No Cost Version)
const DEFAULT_CONFIG: AppConfig = {
    selectedCountry: 'India',
    selectedState: 'Haryana', 
    selectedBoard: 'HBSE (BSEH)', 
    institutionType: LocationType.School,
    institutionName: 'Education Sarthi School, Mangmat', 
    slogan: 'Full AI Smart System (No Cost Version)', 
    logoUrl: undefined,
    primaryColor: '#f59e0b', // Surya Gold
    userName: 'Student',
    fatherName: '',
    motherName: '',
    dob: '',
    tob: ''
};

const getInitialState = (): AppConfig => {
    try {
        const storedConfigRaw = localStorage.getItem('appConfig_v5_Surya'); 
        if (storedConfigRaw) {
            const parsed = JSON.parse(storedConfigRaw);
            // Merge allows existing users to keep some settings while getting new defaults if keys are missing
            return { ...DEFAULT_CONFIG, ...parsed, institutionName: DEFAULT_CONFIG.institutionName, slogan: DEFAULT_CONFIG.slogan };
        }
    } catch (e) {
        console.error("Storage loading error:", e);
    }
    return DEFAULT_CONFIG;
};

export const AppConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfigState] = useState<AppConfig>(getInitialState);

    const setConfig = (newConfig: Partial<AppConfig>) => {
        setConfigState(prev => {
            const updated = { ...prev, ...newConfig };
            localStorage.setItem('appConfig_v5_Surya', JSON.stringify(updated));
            return updated;
        });
    };

    // --- WHITE LABEL ENGINE ---
    // This effect ensures the entire app repaints itself with the institution's colors
    useEffect(() => {
        const root = document.documentElement;
        
        // Convert Hex to RGB for tailwind opacity utilities
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '245 158 11';
        };

        const rgb = hexToRgb(config.primaryColor);

        // Set CSS Variables dynamically
        root.style.setProperty('--color-primary', config.primaryColor);
        // We use a CSS trick for Tailwind 'bg-primary/10' to work with dynamic colors if configured in tailwind.config.js
        // For now, standard variables:
        root.style.setProperty('--tw-color-primary', config.primaryColor);
        
        // Update Title dynamically
        document.title = `${config.institutionName} | Surya Smart Portal`;
        
        // Update Favicon dynamically if logo exists (Advanced)
        if (config.logoUrl) {
            const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (link) link.href = config.logoUrl;
        }

    }, [config.primaryColor, config.institutionName, config.logoUrl]);

    return (
        <div className="eco-system-root h-full overflow-hidden" style={{ '--primary-color': config.primaryColor } as any}>
            <AppConfigContext.Provider value={{ ...config, setConfig, setConfirmConfig: setConfig }}>
                {children}
            </AppConfigContext.Provider>
        </div>
    );
};

export const useAppConfig = () => {
    const context = useContext(AppConfigContext);
    if (!context) throw new Error('useAppConfig must be used within an AppConfigProvider');
    return context;
};
