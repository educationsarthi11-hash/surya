
import React from 'react';
import { BuildingOfficeIcon, BuildingLibraryIcon, UserCircleIcon, GlobeAltIcon } from '../icons/AllIcons';

interface Props {
    onSelect: (type: string) => void;
}

const InstitutionSelector: React.FC<Props> = ({ onSelect }) => {
    const types = [
        { id: 'school', name: 'School', icon: <BuildingOfficeIcon className="h-6 w-6"/>, color: 'bg-orange-100 text-orange-600' },
        { id: 'college', name: 'College', icon: <BuildingLibraryIcon className="h-6 w-6"/>, color: 'bg-blue-100 text-blue-600' },
        { id: 'coaching', name: 'Coaching', icon: <UserCircleIcon className="h-6 w-6"/>, color: 'bg-yellow-100 text-yellow-600' },
        { id: 'university', name: 'University', icon: <GlobeAltIcon className="h-6 w-6"/>, color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto my-8">
            {types.map((type) => (
                <button
                    key={type.id}
                    onClick={() => onSelect(type.id)}
                    className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:shadow-lg hover:border-primary/50 transition-all group"
                >
                    <div className={`p-3 rounded-full mb-3 ${type.color} group-hover:scale-110 transition-transform`}>
                        {type.icon}
                    </div>
                    <span className="font-bold text-slate-700">{type.name}</span>
                </button>
            ))}
        </div>
    );
};

export default InstitutionSelector;
