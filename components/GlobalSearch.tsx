

import React, { useState, useEffect, useRef } from 'react';
import { ServiceName, StudentData, Service } from '../types';
import { studentService } from '../services/studentService';
import { ALL_SERVICES } from '../config/servicesConfig';
import { MagnifyingGlassIcon, XIcon } from './icons/AllIcons';

interface SearchResult {
    students: StudentData[];
    tools: Service[];
}

interface GlobalSearchProps {
    onNavigate: (service: ServiceName) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    const [results, setResults] = useState<SearchResult | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setResults(null);
            setIsOpen(false);
            return;
        }

        const lowerCaseQuery = debouncedQuery.toLowerCase();

        const studentResults = studentService.getStudents().filter(
            s => s.name.toLowerCase().includes(lowerCaseQuery) || s.id.toLowerCase().includes(lowerCaseQuery)
        ).slice(0, 3);

        const toolResults = ALL_SERVICES.filter(
            s => s.name.toLowerCase().includes(lowerCaseQuery) || s.description.toLowerCase().includes(lowerCaseQuery) || s.hindiDescription?.toLowerCase().includes(lowerCaseQuery)
        ).slice(0, 5);

        if (studentResults.length > 0 || toolResults.length > 0) {
            setResults({ students: studentResults, tools: toolResults });
            setIsOpen(true);
        } else {
            setResults(null);
            setIsOpen(true);
        }

    }, [debouncedQuery]);

    const handleSelect = (service: ServiceName) => {
        onNavigate(service);
        setQuery('');
        setResults(null);
        setIsOpen(false);
    };
    
    const clearSearch = () => {
        setQuery('');
        setResults(null);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={searchRef}>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setIsOpen(true)}
                    placeholder="Search students, tools..."
                    aria-label="Global search"
                    className="block w-full rounded-md border-neutral-300 bg-neutral-100 py-2 pl-10 pr-10 text-sm focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary"
                />
                {query && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button onClick={clearSearch} type="button" className="text-neutral-400 hover:text-neutral-600" aria-label="Clear search">
                          <XIcon className="h-5 w-5" />
                      </button>
                  </div>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {results ? (
                        <>
                            {results.students.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase">Students</div>
                                    <ul>
                                        {results.students.map(student => (
                                            <li key={student.id} onClick={() => handleSelect('Student Database')} className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-neutral-900 hover:bg-neutral-100">
                                                <div className="flex items-center">
                                                    <span className="font-normal block truncate">{student.name}</span>
                                                    <span className="ml-2 text-neutral-500">{student.className}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {results.tools.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase border-t">Tools</div>
                                    <ul>
                                        {results.tools.map(tool => (
                                            <li key={tool.name} onClick={() => handleSelect(tool.name)} className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-neutral-900 hover:bg-neutral-100">
                                                <span className="font-normal block truncate">{tool.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="relative cursor-default select-none py-2 px-4 text-neutral-700">No results found for "{query}".</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;