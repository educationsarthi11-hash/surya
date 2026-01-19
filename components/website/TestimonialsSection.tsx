import React from 'react';
import SectionWrapper from './SectionWrapper';

const TestimonialsSection: React.FC = () => {
    const testimonials = [
        { quote: "The AI Study Guru has been a game-changer for my son. His understanding of complex science topics has improved dramatically. The platform is intuitive and truly personalized.", name: "Priya Sharma", role: "Parent, Class 8", avatar: "https://i.pravatar.cc/150?u=priya" },
        { quote: "As a teacher, the AI Staff Assistant saves me hours every week on administrative tasks. I can now focus more on what I love – teaching and mentoring my students.", name: "David Chen", role: "Teacher, Grade 10", avatar: "https://i.pravatar.cc/150?u=david" },
        { quote: "Generating video lessons used to be a complex process. With the AI Video Generator, I can create engaging content for my class in minutes. It's an incredible tool!", name: "Anjali Rao", role: "Admin & Curriculum Designer", avatar: "https://i.pravatar.cc/150?u=anjali" }
    ];

    return (
        <SectionWrapper id="testimonials" className="bg-slate-50">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Loved by Our Community</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white p-8 rounded-xl shadow-soft border border-slate-200/80 flex flex-col" style={{ animationDelay: `${index * 100}ms` }}>
                        <svg className="w-10 h-10 text-slate-200 mb-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-2.724-1.194-4.575-3.494-5.602l.68-1.581c3.153 1.356 4.814 3.987 4.814 7.182v7.392h-2zm-8 0v-7.391c0-2.724-1.194-4.575-3.494-5.602l.68-1.581c3.153 1.356 4.814 3.987 4.814 7.182v7.392h-2z"/></svg>
                        <blockquote className="text-slate-600 flex-grow"><p>"{testimonial.quote}"</p></blockquote>
                        <footer className="mt-6 flex items-center">
                            <img className="h-12 w-12 rounded-full object-cover" src={testimonial.avatar} alt={testimonial.name} loading="lazy" decoding="async" />
                            <div className="ml-4">
                                <p className="font-semibold text-slate-800">{testimonial.name}</p>
                                <p className="text-sm text-slate-500">{testimonial.role}</p>
                            </div>
                        </footer>
                    </div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default TestimonialsSection;