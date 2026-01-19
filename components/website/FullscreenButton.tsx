import React, { useState, useEffect } from 'react';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from '../icons/AllIcons';

const FullscreenButton: React.FC = () => {
    const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message}`));
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    return (
        <button
            onClick={toggleFullscreen}
            className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2"
            aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
        >
            {isFullscreen ? <ArrowsPointingInIcon className="h-6 w-6" /> : <ArrowsPointingOutIcon className="h-6 w-6" />}
        </button>
    );
}

export default FullscreenButton;