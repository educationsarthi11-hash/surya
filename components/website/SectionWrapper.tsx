import React, { useEffect, useRef, useState } from 'react';

interface SectionWrapperProps {
    id: string;
    className?: string;
    children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, className, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <section
            id={id}
            ref={ref}
            className={`py-16 sm:py-20 md:py-24 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} ${className || ''}`}
        >
            <div className="container mx-auto px-4 max-w-7xl">
                {children}
            </div>
        </section>
    );
};

export default SectionWrapper;