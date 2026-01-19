
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { LocationType } from '../types';
import { getDefaultClassesForType, allLevels } from '../config/classroomData';
import { useAppConfig } from './AppConfigContext';

interface ClassroomConfig {
    institutionType: LocationType;
    institutionName: string;
    _classesMap: { [key in LocationType]?: string[] };
    selectedClass: string;
    board: string;
    subject: string;
    language: string;
    customBooks: { [className: string]: string[] }; 
}

interface ClassroomContextType extends Omit<ClassroomConfig, '_classesMap'> {
    classes: string[]; 
    updateConfig: (newConfig: Partial<Omit<ClassroomConfig, '_classesMap' | 'classes' | 'selectedClass' | 'customBooks'>>) => void;
    setClasses: (classes: string[]) => void;
    setSelectedClass: (className: string) => void;
    setSubject: (subject: string) => void;
    addCustomBook: (className: string, bookName: string) => void;
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined);

const createDefaultConfig = (globalType: LocationType, globalName: string): ClassroomConfig => {
    const defaultClassesMap: { [key in LocationType]?: string[] } = {};
    (Object.values(LocationType) as LocationType[]).forEach(type => {
        defaultClassesMap[type] = getDefaultClassesForType(type);
    });

    const initialClasses = defaultClassesMap[globalType] || [];

    return {
        institutionType: globalType,
        institutionName: globalName,
        _classesMap: defaultClassesMap,
        selectedClass: initialClasses[0] || 'Class 10',
        board: 'CBSE',
        subject: 'Science',
        language: 'English',
        customBooks: {},
    };
};

export const ClassroomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { institutionType: globalType, institutionName: globalName } = useAppConfig();

    const [config, setConfigState] = useState<ClassroomConfig>(() => createDefaultConfig(globalType, globalName));

    useEffect(() => {
        // Ensure classes are refreshed when institution type changes
        const activeClasses = getDefaultClassesForType(globalType);
        setConfigState(prev => ({
            ...prev,
            institutionType: globalType,
            institutionName: globalName,
            selectedClass: activeClasses.includes(prev.selectedClass) ? prev.selectedClass : (activeClasses[0] || 'Class 10')
        }));
    }, [globalType, globalName]);

    const updateConfig = useCallback((newConfig: Partial<ClassroomConfig>) => {
        setConfigState(prev => ({ ...prev, ...newConfig }));
    }, []);

    const setClasses = useCallback((newClasses: string[]) => {
        setConfigState(prev => ({
            ...prev,
            selectedClass: newClasses.includes(prev.selectedClass) ? prev.selectedClass : (newClasses[0] || 'Class 10')
        }));
    }, []);

    const setSelectedClass = useCallback((className: string) => {
        setConfigState(prev => ({ ...prev, selectedClass: className }));
    }, []);

    const setSubject = useCallback((subject: string) => {
        setConfigState(prev => ({ ...prev, subject }));
    }, []);

    const addCustomBook = useCallback((className: string, bookName: string) => {
        setConfigState(prev => ({
            ...prev,
            customBooks: {
                ...prev.customBooks,
                [className]: [...(prev.customBooks[className] || []), bookName]
            }
        }));
    }, []);

    const activeClasses = getDefaultClassesForType(config.institutionType);

    const value: ClassroomContextType = {
        ...config,
        classes: activeClasses,
        updateConfig,
        setClasses,
        setSelectedClass,
        setSubject,
        addCustomBook,
    };

    return (
        <ClassroomContext.Provider value={value}>
            {children}
        </ClassroomContext.Provider>
    );
};

export const useClassroom = () => {
    const context = useContext(ClassroomContext);
    if (!context) {
        throw new Error('useClassroom must be used within a ClassroomProvider');
    }
    return context;
};
