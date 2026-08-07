import React from 'react';
import { ASSETS } from '../constants';

const FixedLogo: React.FC = () => {
    return (
        <a
            href="#home"
            className="fixed top-8 left-8 z-50 group flex items-center gap-3 bg-brand-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-xl transition-all duration-300 hover:bg-brand-black/60 hover:shadow-2xl"
            style={{ flexDirection: 'row' }}
            dir="ltr"
        >
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                <img
                    src={ASSETS.logo}
                    alt="Mustafa Logo"
                    className="w-full h-full object-contain drop-shadow-md"
                />
            </div>

            <div className="flex flex-col opacity-80 group-hover:opacity-100 transition-opacity duration-300 text-left items-start">
                <span className="font-bold text-white text-sm tracking-widest leading-none mb-1 group-hover:text-brand-lime transition-colors text-left">
                    MUSTAFA
                </span>
                <span className="text-[10px] text-gray-400 font-light tracking-wide leading-none uppercase text-left">
                    AL MOUSAWI
                </span>
            </div>
        </a>
    );
};

export default FixedLogo;
