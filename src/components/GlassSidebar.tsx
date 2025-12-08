import React, { useState, useEffect } from 'react';
import { Home, Briefcase, FileText, Cpu, Mail, PenTool } from 'lucide-react';

const GlassSidebar: React.FC = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [isHovered, setIsHovered] = useState(false);

    // Scroll spy to update active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'portfolio', 'resume', 'process', 'brief'];

            // Find the section currently in view
            // We look for the one that takes up the most screen space or is at the top
            let current = 'home';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If top overlapping with center of screen, or mostly visible
                    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                        current = section;
                        break;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { id: 'home', icon: Home, label: 'الرئيسية' },
        { id: 'portfolio', icon: Briefcase, label: 'أعمالي' },
        { id: 'resume', icon: FileText, label: 'السيرة الذاتية' },
        { id: 'process', icon: Cpu, label: 'طريقة العمل' },
        { id: 'brief', icon: PenTool, label: 'ابدأ مشروعك' },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div
            className={`fixed right-0 top-0 h-screen z-[40] transition-all duration-500 ease-in-out border-l border-white/5 bg-brand-black/20 backdrop-blur-md flex flex-col items-center justify-center py-20
        ${isHovered ? 'w-64 shadow-2xl' : 'w-20'}
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background overlay for extra readability when expanded */}
            <div className={`absolute inset-0 bg-brand-black/40 transition-opacity duration-500 -z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

            <div className="flex flex-col gap-8 w-full">
                {menuItems.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`relative flex items-center w-full group transition-all duration-300
                ${isHovered ? 'justify-start px-8' : 'justify-center'}
              `}
                        >
                            {/* Active Indicator Line (When folded or expanded) */}
                            <div
                                className={`absolute right-0 top-1/2 -translate-y-1/2 bg-brand-lime transition-all duration-300 rounded-l-full
                  ${isActive ? 'h-12 w-1 opacity-100' : 'h-0 w-0 opacity-0'}
                `}
                            ></div>

                            {/* Icon Container */}
                            <div
                                className={`p-3 rounded-xl transition-all duration-300 z-10
                  ${isActive ? 'text-brand-lime bg-white/5 shadow-[0_0_15px_rgba(204,255,0,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                            </div>

                            {/* Label (Visible on hover) */}
                            <span
                                className={`mr-4 text-sm font-bold whitespace-nowrap overflow-hidden transition-all duration-300
                  ${isHovered ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 translate-x-4 w-0'}
                  ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
                `}
                            >
                                {item.label}
                            </span>

                            {/* Glow dot for active state in minimized mode */}
                            {!isHovered && isActive && (
                                <div className="absolute inset-0 flex items-center justify-center -z-10">
                                    <div className="w-10 h-10 bg-brand-lime/10 rounded-full blur-md"></div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GlassSidebar;
