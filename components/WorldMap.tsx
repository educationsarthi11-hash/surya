
import React, { useState, useEffect, useRef } from 'react';
import { LocationData, LocationType } from '../types';
import { GlobeAltIcon } from './icons/AllIcons';
import { searchWithGrounding } from '../services/geminiService';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';


// This lets TypeScript know that 'L' (from Leaflet.js) is available globally.
declare const L: any;

const WorldMap: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null); // To hold the map instance
    const modalRef = useRef<HTMLDivElement>(null);
    const firstFocusableElementRef = useRef<HTMLInputElement>(null);
    
    const [locations, setLocations] = useState<LocationData[]>([
        { id: '1', name: 'Education Sarthi - Main Campus', type: LocationType.School, description: 'Our first and main campus.', lat: 28.6139, lng: 77.2090 },
        { id: '2', name: 'Future Sarthi College - London', type: LocationType.College, description: 'Planned for 2025.', lat: 51.5074, lng: -0.1278 },
        { id: '3', name: 'IIT Bombay', type: LocationType.University, description: 'Indian Institute of Technology, Bombay.', lat: 19.1334, lng: 72.9154 },
        { id: '4', name: 'Global Tech ITI - Singapore', type: LocationType.TechnicalInstitute, description: 'Vocational training center.', lat: 1.3521, lng: 103.8198 },
        { id: '5', name: 'Silicon Valley Computer Center', type: LocationType.ComputerCenter, description: 'Advanced programming courses.', lat: 37.3875, lng: -122.0575 },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLocationInfo, setNewLocationInfo] = useState({ name: '', type: LocationType.School, description: '' });
    const [newLocationCoords, setNewLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ summary: string; places: { title: string; uri: string }[]; webResults: { title: string; uri: string }[] } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const toast = useToast();

    // Initialize map
    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current).setView([20, 0], 2); // Centered view
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            map.on('click', (e: any) => {
                setNewLocationCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
                setIsModalOpen(true);
            });
            
            mapInstanceRef.current = map;
        }
    }, []);

    // Update markers when locations change
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear existing markers
        mapInstanceRef.current.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
                mapInstanceRef.current.removeLayer(layer);
            }
        });

        // Add new markers
        locations.forEach(location => {
             const markerHtml = `<div style="background-color: ${getColor(location.type)};" class="h-6 w-6 rounded-full border-2 border-white shadow-md"></div>`;
             const customIcon = L.divIcon({
                html: markerHtml,
                className: 'custom-map-marker',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
             });

            L.marker([location.lat, location.lng], { icon: customIcon })
             .addTo(mapInstanceRef.current)
             .bindPopup(`<b>${location.name}</b><br>${location.type}<br>${location.description}`);
        });

    }, [locations]);
    
    // Modal accessibility: Focus trap and Escape key
    useEffect(() => {
        if (isModalOpen) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    closeModal();
                    return;
                }
                
                if (e.key === 'Tab') {
                    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    if (!focusableElements || focusableElements.length === 0) return;
                    
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) { // Shift + Tab
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else { // Tab
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };

            document.addEventListener('keydown', handleKeyDown);
            // Set focus to the first focusable element in the modal
            setTimeout(() => firstFocusableElementRef.current?.focus(), 100);
            
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isModalOpen]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            toast.error("Please enter a search query.");
            return;
        }
        setIsSearching(true);
        setSearchResults(null);
        try {
            const results = await searchWithGrounding(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error("Search failed", error);
            toast.error("Search failed. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSaveLocation = () => {
        if (!newLocationCoords || !newLocationInfo.name) return;

        const newLocation: LocationData = {
            id: new Date().toISOString(),
            ...newLocationInfo,
            ...newLocationCoords,
        };
        setLocations(prev => [...prev, newLocation]);
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewLocationInfo({ name: '', type: LocationType.School, description: '' });
        setNewLocationCoords(null);
    };
    
    const getColor = (type: LocationType) => {
        switch (type) {
            case LocationType.School: return '#4285F4'; // Google Blue (Primary)
            case LocationType.College: return '#34A853'; // Google Green (Secondary)
            case LocationType.University: return '#EA4335'; // Google Red (Accent)
            case LocationType.CoachingCenter: return '#FBBC05'; // Google Yellow (Warning)
            case LocationType.TechnicalInstitute: return '#0d9488'; // Teal
            case LocationType.ComputerCenter: return '#7c3aed'; // Purple
            default: return '#6b7280'; // Gray
        }
    };


    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
             <div className="flex items-center mb-6">
                <GlobeAltIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">World Expansion Planner</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Click on the map to add an educational institution, or use the search bar to find locations and information.</p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="e.g., 'Top universities in California' or 'New schools in Delhi'"
                    className="flex-grow w-full p-2 border rounded-md shadow-sm border-neutral-300 focus:ring-primary focus:border-primary"
                    aria-label="Search for locations"
                />
                <button type="submit" disabled={isSearching} className="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-neutral-400 flex items-center justify-center transition-colors">
                    {isSearching ? (
                        <svg aria-hidden="true" className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : 'Search'}
                </button>
            </form>
            
            <div ref={mapContainerRef} className="h-96 w-full rounded-lg z-0" />

            {isSearching && !searchResults && (
                <div className="mt-6 text-center">
                    <Loader message="Searching for locations and information..." />
                </div>
            )}

            {searchResults && (
                <div className="mt-6 p-4 bg-neutral-50 rounded-lg animate-pop-in border border-neutral-200">
                    <h3 className="text-xl font-bold text-neutral-800 mb-3">Search Results for "{searchQuery}"</h3>
                    <div className="prose prose-sm max-w-none text-neutral-700 mb-4" dangerouslySetInnerHTML={{ __html: searchResults.summary }} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {searchResults.places.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-neutral-900 mb-2">Map Locations Found</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {searchResults.places.map((place, index) => (
                                        <li key={index}>
                                            <a href={place.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{place.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {searchResults.webResults.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-neutral-900 mb-2">Related Web Links</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {searchResults.webResults.map((result, index) => (
                                        <li key={index}>
                                            <a href={result.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{result.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add Location Modal */}
            {isModalOpen && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-title"
                >
                    <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md m-4">
                        <h3 id="modal-title" className="text-lg font-bold mb-4">Add New Location</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Name</label>
                                <input ref={firstFocusableElementRef} type="text" id="name" value={newLocationInfo.name} onChange={e => setNewLocationInfo({...newLocationInfo, name: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-neutral-700">Type</label>
                                <select id="type" value={newLocationInfo.type} onChange={e => setNewLocationInfo({...newLocationInfo, type: e.target.value as LocationType})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2">
                                    {Object.values(LocationType).map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
                                <textarea id="description" value={newLocationInfo.description} onChange={e => setNewLocationInfo({...newLocationInfo, description: e.target.value})} rows={3} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2"></textarea>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={closeModal} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-300">Cancel</button>
                            <button onClick={handleSaveLocation} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save Location</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorldMap;
