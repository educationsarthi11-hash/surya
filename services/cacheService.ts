
// This service acts as the "Brain Memory" to save costs.
// If a question is asked once, it is saved here. 
// If asked again, it is served from here without paying Google/OpenAI.

interface CacheEntry {
    prompt: string;
    response: string;
    timestamp: number;
}

const STORAGE_KEY = 'sarthi_ai_smart_cache_v1';

// Clean text to improve matching (removes spaces, case sensitivity, special chars)
// Example: "What is Atom?" and "what is atom ? " become the same.
const normalizeText = (text: string): string => {
    return text.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]/g, "").trim(); // Supports English & Hindi
};

export const cacheService = {
    getCache: (): CacheEntry[] => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    findResponse: (prompt: string): string | null => {
        const cache = cacheService.getCache();
        const normalizedPrompt = normalizeText(prompt);

        // Check for exact or near-exact match
        const entry = cache.find(item => {
            const normalizedItem = normalizeText(item.prompt);
            return normalizedItem === normalizedPrompt;
        });

        if (entry) {
            console.log("⚡ Smart Cache Hit! Money Saved.");
            return entry.response;
        }
        return null;
    },

    saveResponse: (prompt: string, response: string) => {
        const cache = cacheService.getCache();
        
        // Don't save very short greetings or errors
        if (response.length < 10 || response.includes("Error") || response.includes("व्यस्त")) return;

        // Add new entry
        const newEntry: CacheEntry = {
            prompt,
            response,
            timestamp: Date.now()
        };

        // Keep only last 500 answers to prevent browser storage full
        const updatedCache = [newEntry, ...cache].slice(0, 500);
        
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCache));
        } catch (e) {
            console.warn("Cache full, clearing old entries");
            localStorage.removeItem(STORAGE_KEY);
        }
    },

    clearCache: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
