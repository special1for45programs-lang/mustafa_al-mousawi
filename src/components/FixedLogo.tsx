import React from 'react';
import { ASSETS } from '../constants';

const FixedLogo: React.FC = () => {
    return (
        <a
            href="#home"
            className="fixed top-8 left-8 z-50 group flex items-center gap-3"
        >
            <div className="w-14 h-14 bg-brand-black/20 backdrop-blur-md border border-white/5 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-brand-black/40 group-hover:scale-105 shadow-xl">
                <img
                    src={ASSETS.logo}
                    alt="Mustafa Logo"
                    className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(204,255,0,0.2)]"
                />
            </div>

            <div className="flex flex-col opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-bold text-white text-sm tracking-widest leading-none mb-1 group-hover:text-brand-lime transition-colors">
                    MUSTAFA
                </span>
                <span className="text-[10px] text-gray-400 font-light tracking-wide leading-none uppercase">
                    Al Moussawi
                </span>
            </div>
        </a>
    );
};

export default FixedLogo;
