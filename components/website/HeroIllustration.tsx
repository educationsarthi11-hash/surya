import React from 'react';

const HeroIllustration: React.FC = () => (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--tw-color-primary-light)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--tw-color-primary)', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--tw-color-secondary)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'var(--tw-color-accent)', stopOpacity: 1 }} />
            </linearGradient>
            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }
                .node { animation: float 6s ease-in-out infinite; }
                .main-node { animation: float 5s ease-in-out infinite, pulse 3s ease-in-out infinite; }
                .sub-node-1 { animation-delay: -1s; }
                .sub-node-2 { animation-delay: -2s; }
                .sub-node-3 { animation-delay: -3s; }
                .sub-node-4 { animation-delay: -4s; }
                `}
            </style>
        </defs>
        
        {/* Connections */}
        <g stroke="#e5e7eb" strokeWidth="1.5">
            <path d="M200 200 L 90 100" />
            <path d="M200 200 L 310 100" />
            <path d="M200 200 L 90 300" />
            <path d="M200 200 L 310 300" />
            <path d="M200 200 L 150 40" />
            <path d="M200 200 L 250 360" />
        </g>
        
        {/* Nodes */}
        <g>
            {/* Main Center Node */}
            <circle cx="200" cy="200" r="35" fill="url(#grad1)" className="main-node" />
            <text x="200" y="205" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">AI</text>

            {/* Sub Nodes */}
            <circle cx="90" cy="100" r="25" fill="url(#grad2)" className="node sub-node-1" />
            <circle cx="310" cy="100" r="20" fill="url(#grad1)" className="node sub-node-2" />
            <circle cx="90" cy="300" r="22" fill="url(#grad1)" className="node sub-node-3" />
            <circle cx="310" cy="300" r="28" fill="url(#grad2)" className="node sub-node-4" />
            <circle cx="150" cy="40" r="15" fill="url(#grad2)" className="node sub-node-2" />
            <circle cx="250" cy="360" r="18" fill="url(#grad1)" className="node sub-node-1" />
        </g>
    </svg>
);

export default HeroIllustration;
