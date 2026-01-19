import React from 'react';
import SectionWrapper from './SectionWrapper';

const NewsAndEventsSection: React.FC = () => {
    const newsItems = [
        { img: "https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?q=80&w=800&auto=format&fit=crop", category: "Event", date: "October 15, 2024", title: "Annual Science Fair 2024", description: "Discover amazing student projects and innovations at our biggest science fair yet. Open to all families." },
        { img: "https://images.unsplash.com/photo-1611095965942-8fc09a9a083a?q=80&w=800&auto=format&fit=crop", category: "Webinar", date: "September 28, 2024", title: "AI in Modern Education", description: "Join our expert panel as they discuss how AI is transforming classrooms and personalized learning." },
        { img: "https://images.unsplash.com/photo-1581092921447-4a0b84c759a2?q=80&w=800&auto=format&fit=crop", category: "Announcement", date: "September 1, 2024", title: "New Robotics Club Launch", description: "We are thrilled to launch our new Robotics Club for students of Class 8 and above. Registrations are now open!" }
    ];

    return (
        <SectionWrapper id="news">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Latest News & Events</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsItems.map((item, index) => (
                    <article key={index} className="bg-white rounded-xl shadow-soft overflow-hidden group flex flex-col transition-all duration-300 hover:shadow-lifted hover:-translate-y-1 border border-slate-200/80" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="overflow-hidden"><img src={item.img} alt={item.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" /></div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                                <span className="font-semibold text-primary">{item.category}</span><time>{item.date}</time>
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                            <p className="mt-2 text-sm text-slate-600 flex-grow">{item.description}</p>
                            <a href="#news" className="mt-4 text-sm font-semibold text-primary hover:underline self-start">Read More &rarr;</a>
                        </div>
                    </article>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default NewsAndEventsSection;