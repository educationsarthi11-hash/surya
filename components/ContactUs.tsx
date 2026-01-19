
import React, { useState, useEffect, useRef } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from './icons/AllIcons';
import Loader from './Loader';
import { useToast } from '../hooks/useToast';

// This lets TypeScript know that 'L' (from Leaflet.js) is available globally.
declare const L: any;

const ContactUs: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const schoolLocation = { lat: 28.6139, lng: 77.2090, name: 'Education Sarthi - Main Campus' };

    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current).setView([schoolLocation.lat, schoolLocation.lng], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const customIcon = L.divIcon({
                html: `<div class="bg-primary h-6 w-6 rounded-full border-2 border-white shadow-md"></div>`,
                className: 'custom-map-marker',
                iconSize: [24, 24],
                iconAnchor: [12, 24],
                popupAnchor: [0, -24]
            });

            L.marker([schoolLocation.lat, schoolLocation.lng], { icon: customIcon })
             .addTo(map)
             .bindPopup(`<b>${schoolLocation.name}</b>`)
             .openPopup();
            
            mapInstanceRef.current = map;
        }
    }, [schoolLocation.lat, schoolLocation.lng, schoolLocation.name]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, subject, message } = formData;
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            toast.error('Please fill out all fields.');
            return;
        }
        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success('Your message has been sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error: any) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-soft">
            <div className="flex items-center mb-4">
                <EnvelopeIcon aria-hidden="true" className="h-8 w-8 text-primary" />
                <h2 className="ml-3 text-2xl font-bold text-neutral-900">Sarthi Help Desk</h2>
            </div>
            <p className="text-sm text-neutral-600 mb-8 font-hindi">हम आपकी मदद के लिए यहां हैं। कृपया नीचे दिए गए तरीकों से हमसे संपर्क करें।</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="space-y-4">
                         <h3 className="text-lg font-semibold text-neutral-800">Contact Information</h3>
                        <div className="flex items-start">
                            <MapPinIcon aria-hidden="true" className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div className="ml-3">
                                <h4 className="font-semibold">Our Address</h4>
                                <p className="text-sm text-neutral-600">Mangmat Campus, Haryana, India</p>
                            </div>
                        </div>
                         <div className="flex items-start">
                            <PhoneIcon aria-hidden="true" className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div className="ml-3">
                                <h4 className="font-semibold">Call Us</h4>
                                <p className="text-sm text-neutral-600">+91 98177 76765</p>
                            </div>
                        </div>
                         <div className="flex items-start">
                            <EnvelopeIcon aria-hidden="true" className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                            <div className="ml-3">
                                <h4 className="font-semibold">Email Us</h4>
                                <p className="text-sm text-neutral-600">contact@educationsarthi.com</p>
                            </div>
                        </div>
                    </div>
                    <div ref={mapContainerRef} className="h-64 w-full rounded-lg z-0 border" />
                </div>
                
                <div className="lg:col-span-2">
                     <h3 className="text-lg font-semibold text-neutral-800 mb-4">Send us a Message</h3>
                     <form onSubmit={handleSubmit} className="space-y-4">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">Full Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email Address</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" required />
                            </div>
                         </div>
                         <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-neutral-700">Subject</label>
                            <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" required />
                         </div>
                         <div>
                            <label htmlFor="message" className="block text-sm font-medium text-neutral-700">Message</label>
                            <textarea name="message" id="message" value={formData.message} onChange={handleInputChange} rows={5} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm p-2" required></textarea>
                         </div>

                         <div>
                             <button type="submit" disabled={loading} className="w-full sm:w-auto flex justify-center items-center py-2.5 px-6 bg-primary text-white rounded-md hover:bg-primary-dark transition-all">
                                 {loading ? <Loader message="Sending..." /> : 'Send Message'}
                             </button>
                         </div>
                     </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
