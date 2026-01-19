
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { findInstitutionsByQuery } from '../services/geminiService';
import { Institution } from '../types';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';
import { MapPinIcon, SparklesIcon, BuildingOfficeIcon, NavigationIcon } from './icons/AllIcons';

declare const L: any;

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

// Fixed: Added distance property to InstitutionWithId
type InstitutionWithId = Institution & { id: string; distance?: number };

const NearbySchoolFinder: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<InstitutionWithId[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const toast = useToast();

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRefs = useRef<{ [key: string]: any }>({});


    const initializeMap = useCallback(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5); // Default to India
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            mapInstanceRef.current = map;
        }
    }, []);

    useEffect(() => {
        initializeMap();
    }, [initializeMap]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.warn(`Geolocation error: ${error.message}`);
                toast.info("Could not access your location. 'Nearby Me' searches may be affected.");
            }, { timeout: 10000 }
        );
    }, [toast]);

    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const map = mapInstanceRef.current;
        
        // Clear previous markers
        Object.values(markerRefs.current).forEach(marker => map.removeLayer(marker));
        markerRefs.current = {};

        if (results.length > 0) {
            const bounds = L.latLngBounds();

            results.forEach(inst => {
                const marker = L.marker([inst.lat, inst.lng]).addTo(map);
                marker.bindPopup(`<b>${inst.name}</b><br>${inst.address}`);
                marker.on('click', () => {
                     const element = document.getElementById(`result-item-${inst.id}`);
                     element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                     setSelectedId(inst.id);
                });
                markerRefs.current[inst.id] = marker;
                bounds.extend([inst.lat, inst.lng]);
            });

            if (userLocation) {
                const userIcon = L.divIcon({
                    html: `<div class="bg-blue-500 h-4 w-4 rounded-full border-2 border-white ring-2 ring-blue-500"></div>`,
                    className: 'user-location-marker', iconSize: [16, 16],
                });
                const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map).bindPopup("Your Location");
                bounds.extend([userLocation.lat, userLocation.lng]);
                markerRefs.current['user-location'] = userMarker;
            }
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (userLocation) {
             map.setView([userLocation.lat, userLocation.lng], 13);
        }
        
    }, [results, userLocation]);
    
    useEffect(() => {
        if(selectedId && markerRefs.current[selectedId]) {
            const marker = markerRefs.current[selectedId];
            mapInstanceRef.current.flyTo(marker.getLatLng(), 15);
            marker.openPopup();
        }
    }, [selectedId]);

    const handleSearch = async (queryOverride?: string) => {
        const query = queryOverride || searchQuery;
        if (!query.trim()) {
            toast.error('Please enter a search query.');
            return;
        }

        setLoading(true);
        setResults([]);
        setSelectedId(null);
        try {
            const institutions: Institution[] = await findInstitutionsByQuery(query);
            const institutionsWithId = institutions.map(inst => ({...inst, id: `${inst.name}-${inst.lat}-${inst.lng}`}));
            
            if (userLocation) {
                const institutionsWithDistance = institutionsWithId.map(inst => ({
                    ...inst,
                    distance: haversineDistance(userLocation.lat, userLocation.lng, inst.lat, inst.lng)
                })).sort((a,b) => (a.distance ?? 0) - (b.distance ?? 0));
                setResults(institutionsWithDistance);
            } else {
                setResults(institutionsWithId);
            }
             if (institutions.length === 0) {
                toast.info("No institutions found for your query. Try being more specific.");
            }
        } catch (error) {
            console.error('Search failed:', error);
            toast.error('An error occurred. The AI might be busy, please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleUseLocation = () => {
        if (!userLocation) {
            toast.error('Could not get your location. Please enable location services and try again.');
            return;
        }
        setSearchQuery(`Institutions near me`);
        handleSearch(`educational institutions near latitude ${userLocation.lat}, longitude ${userLocation.lng}`);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };

    const handleResultClick = (inst: InstitutionWithId) => {
        setSelectedId(inst.id);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-soft">
            <div className="flex items-center mb-4">
                <MapPinIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Nearby School Finder</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-6 font-hindi">पिनकोड, शहर या अपने पास के स्कूल, कॉलेज और कोचिंग सेंटर खोजें।</p>
            
            <form onSubmit={handleFormSubmit} className="mb-6 flex flex-col sm:flex-row gap-2">
                <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Enter PIN Code (e.g. 110001), City, or 'colleges in Delhi'" 
                    className="flex-grow w-full p-2.5 border rounded-md shadow-sm border-neutral-300 focus:ring-primary focus:border-primary"
                />
                <button 
                    type="button"
                    onClick={handleUseLocation}
                    disabled={loading || !userLocation}
                    className="w-full sm:w-auto p-2.5 bg-white border border-neutral-300 text-neutral-600 rounded-md hover:bg-neutral-100 disabled:opacity-50 flex items-center justify-center gap-2"
                    aria-label="Find institutions near me"
                >
                   <NavigationIcon className="h-5 w-5"/> <span className="sm:hidden">Nearby Me</span>
                </button>
                 <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-neutral-400 flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5 mr-2" /> Search
                </button>
            </form>
            
            {loading && <Loader message="AI is searching the map..." />}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[400px]">
                <div ref={mapContainerRef} className="md:col-span-2 h-96 md:h-full w-full rounded-lg z-0 shadow-md" />
                <div className="md:col-span-1 h-96 md:h-full overflow-y-auto pr-2 space-y-3">
                    {results.length > 0 ? (
                        results.map((inst) => (
                            <div 
                                key={inst.id}
                                id={`result-item-${inst.id}`}
                                onClick={() => handleResultClick(inst)} 
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedId === inst.id ? 'bg-primary/10 border-primary shadow-md' : 'bg-neutral-50 hover:bg-neutral-100'}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-md mt-1 ${selectedId === inst.id ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}><BuildingOfficeIcon className="h-5 w-5"/></div>
                                    <div>
                                        <h4 className="font-bold text-sm text-neutral-800">{inst.name}</h4>
                                        <p className="text-xs text-neutral-500">{inst.address}</p>
                                        {/* Fixed: distance is now recognized on InstitutionWithId */}
                                        {inst.distance !== undefined && (
                                            <p className="text-xs font-semibold text-primary mt-1">{inst.distance.toFixed(1)} km away</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && <p className="text-sm text-center text-neutral-500 pt-10">No results to display. Start a search to see institutions here.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NearbySchoolFinder;
