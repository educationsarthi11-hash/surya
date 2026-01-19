
import { Franchise, LocationType } from '../types';
import { INSTITUTIONS_BY_STATE } from '../config/institutions';

const STORAGE_KEY = 'registered_franchises_v2';

let franchises: Franchise[] = [];

const loadFranchises = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load franchises", e);
    }
    return generateFranchiseData(); // Fallback to mock data
};

const generateFranchiseData = () => {
    const allInstitutions: Franchise[] = [];
    let idCounter = 1;

    for (const state in INSTITUTIONS_BY_STATE) {
        const institutionTypes = INSTITUTIONS_BY_STATE[state];
        for (const type in institutionTypes) {
            const typeEnum = type as LocationType;
            const institutions = institutionTypes[typeEnum];

            if (typeEnum === LocationType.School) {
                const schoolBoards = institutions as { [board: string]: string[] };
                for (const board in schoolBoards) {
                    schoolBoards[board].forEach(name => {
                        allInstitutions.push({
                            id: `MGM-FRAN-${idCounter++}`,
                            name: `Mangmat School - ${name}, ${state}`,
                            type: typeEnum,
                            studentCount: Math.floor(500 + Math.random() * 2500),
                            revenue: Math.floor(5000000 + Math.random() * 20000000),
                        });
                    });
                }
            } else {
                const otherInstitutions = institutions as string[];
                otherInstitutions.forEach(name => {
                    allInstitutions.push({
                        id: `MGM-FRAN-${idCounter++}`,
                        name: `Mangmat ${typeEnum} - ${name}, ${state}`,
                        type: typeEnum,
                        studentCount: Math.floor(1000 + Math.random() * 10000),
                        revenue: Math.floor(10000000 + Math.random() * 50000000),
                    });
                });
            }
        }
    }
    return allInstitutions;
};

// Initialize
franchises = loadFranchises();

export const franchiseService = {
    getFranchises: (): Franchise[] => {
        return franchises;
    },
    
    getFranchiseById: (id: string): Franchise | undefined => {
        return franchises.find(f => f.id === id);
    },

    // New Method for Dynamic Registration
    registerNewFranchise: (data: any) => {
        const newFranchise: Franchise = {
            id: data.id,
            name: data.name,
            type: data.type,
            studentCount: 0,
            revenue: 0,
            isVerified: true,
            logoUrl: data.logoUrl, // Persist Logo URL
            // Storing extra auth data in the franchise object for simple demo auth
            // In real app, this would be separate
            ...data 
        };
        
        franchises = [newFranchise, ...franchises];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(franchises));
        return newFranchise;
    },

    // Helper to find login credentials
    authenticateFranchise: (id: string, pass: string) => {
        // Check dynamic registrations first
        const found = franchises.find(f => f.id === id && (f as any).password === pass);
        return found;
    }
};
