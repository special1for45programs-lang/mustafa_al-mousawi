import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Wand2, Info, CheckCircle2 } from 'lucide-react';
import { INDUSTRY_PALETTES } from '../../utils/designConstants';
import { 
    hsvToHex, hexToHSV, isValidHex, formatHex, 
    generatePalettesFromKeyword, GeneratedPalette 
} from '../../utils/colorUtils';

const CANVAS_SIZE = 280;
const CENTER = CANVAS_SIZE / 2;
const RING_OUTER_R = 140;
const RING_INNER_R = 115;
const RING_MID_R = (RING_OUTER_R + RING_INNER_R) / 2;
const TRIANGLE_R = 95;

interface ColorWheelTabProps {
    activeTab: 'wheel' | 'presets';
    activeHSV: { h: number, s: number, v: number };
    setActiveHSV: React.Dispatch<React.SetStateAction<{ h: number, s: number, v: number }>>;
    hexInput: string;
    setHexInput: (val: string) => void;
    handleAddColor: () => void;
    applyPreset: (colors: string[]) => void;
    currentPalette?: string[];
}

export const ColorWheelTab: React.FC<ColorWheelTabProps> = ({
    activeTab, activeHSV, setActiveHSV, hexInput, setHexInput, handleAddColor, applyPreset, currentPalette
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const [isDraggingRing, setIsDraggingRing] = useState(false);
    const [isDraggingTriangle, setIsDraggingTriangle] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchSubmit = (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;
        window.open(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery.trim() + ' color palette branding')}`, '_blank');
    };

    // Render Triangle Mathematics (Barycentric)
    useEffect(() => {
        if (activeTab !== 'wheel') return;

        const frameId = requestAnimationFrame(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            const imgData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
            const data = imgData.data;
            const R = TRIANGLE_R;
            const safeHue = isNaN(activeHSV.h) ? 210 : activeHSV.h;

            const hsvToRgbLocal = (h: number, s: number, v: number) => {
                let r=0, g=0, b=0, i = Math.floor(h / 60), f = h / 60 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
                switch (i % 6) { case 0: r = v, g = t, b = p; break; case 1: r = q, g = v, b = p; break; case 2: r = p, g = v, b = t; break; case 3: r = p, g = q, b = v; break; case 4: r = t, g = p, b = v; break; case 5: r = v, g = p, b = q; break; }
                return [r * 255, g * 255, b * 255];
            };

            for (let py = 0; py < CANVAS_SIZE; py++) {
                for (let px = 0; px < CANVAS_SIZE; px++) {
                    const x = px - CENTER;
                    const y = py - CENTER;
                    
                    if (x < -R/2 - 2 || x > R + 2 || y < -R*Math.sqrt(3)/2 - 2 || y > R*Math.sqrt(3)/2 + 2) continue;

                    const w_h = (x + R/2) / (1.5 * R);
                    const Dy = y / (R * Math.sqrt(3) / 2);
                    const w_b = (1 - w_h + Dy) / 2;
                    const w_w = (1 - w_h - Dy) / 2;

                    const dist = Math.min(w_h, w_b, w_w) * 1.5 * R;
                    if (dist > -1) {
                        const alpha = Math.max(0, Math.min(255, (dist + 1) * 255));
                        const clamped_b = Math.max(0, Math.min(1, w_b || 0));
                        const clamped_h = Math.max(0, Math.min(1, w_h || 0));
                        const V = Math.max(0, Math.min(1, 1 - clamped_b));
                        const S = V > 0 ? Math.max(0, Math.min(1, clamped_h / V)) : 0;
                        
                        const [r, g, b] = hsvToRgbLocal(safeHue, S, V);
                        const idx = (py * CANVAS_SIZE + px) * 4;
                        data[idx] = r; data[idx+1] = g; data[idx+2] = b; data[idx+3] = alpha;
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);
        });

        return () => cancelAnimationFrame(frameId);
    }, [activeHSV.h, activeTab]);

    const updateRing = (x: number, y: number) => {
        let angle = Math.atan2(y, x) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        if (isNaN(angle)) angle = 210;
        
        setActiveHSV(prev => {
            const newHSV = { ...prev, h: angle };
            setHexInput(hsvToHex(newHSV.h, newHSV.s, newHSV.v));
            return newHSV;
        });
    };

    const updateTriangle = (x: number, y: number) => {
        const R = TRIANGLE_R;
        let w_h = (x + R/2) / (1.5 * R);
        const Dy = y / (R * Math.sqrt(3) / 2);
        let w_b = (1 - w_h + Dy) / 2;
        let w_w = (1 - w_h - Dy) / 2;

        let h = w_h || 0, w = w_w || 0, b = w_b || 0;
        
        if (h < 0) { h = 0; if (w < 0) { w = 0; b = 1; } else if (b < 0) { b = 0; w = 1; } else { w = w / (w + b); b = 1 - w; } } 
        else if (w < 0) { w = 0; if (h < 0) { h = 0; b = 1; } else if (b < 0) { b = 0; h = 1; } else { h = h / (h + b); b = 1 - h; } } 
        else if (b < 0) { b = 0; if (h < 0) { h = 0; w = 1; } else if (w < 0) { w = 0; h = 1; } else { h = h / (h + w); w = 1 - h; } }

        const V = Math.max(0, Math.min(1, 1 - b));
        const S = V > 0 ? Math.max(0, Math.min(1, h / V)) : 0;
        
        setActiveHSV(prev => {
            const newHSV = { ...prev, s: S * 100, v: V * 100 };
            setHexInput(hsvToHex(newHSV.h, newHSV.s, newHSV.v));
            return newHSV;
        });
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left - CENTER;
        const y = e.clientY - rect.top - CENTER;
        const dist = Math.hypot(x, y);

        if (dist >= RING_INNER_R - 10 && dist <= RING_OUTER_R + 10) {
            setIsDraggingRing(true);
            updateRing(x, y);
        } else if (dist < RING_INNER_R - 10) {
            setIsDraggingTriangle(true);
            updateTriangle(x, y);
        }
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRing && !isDraggingTriangle) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left - CENTER;
        const y = e.clientY - rect.top - CENTER;

        if (isDraggingRing) updateRing(x, y);
        else if (isDraggingTriangle) updateTriangle(x, y);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDraggingRing(false);
        setIsDraggingTriangle(false);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setHexInput(val);
        if (isValidHex(val)) {
            const formatted = formatHex(val);
            const parsed = hexToHSV(formatted);
            if (!isNaN(parsed.h)) setActiveHSV(parsed);
        }
    };

    const handleHexInputBlur = () => {
        if (isValidHex(hexInput)) {
            setHexInput(formatHex(hexInput));
        } else {
            setHexInput(hsvToHex(activeHSV.h, activeHSV.s, activeHSV.v));
        }
    };

    const safeH = isNaN(activeHSV.h) ? 210 : activeHSV.h;
    const safeS = isNaN(activeHSV.s) ? 100 : activeHSV.s;
    const safeV = isNaN(activeHSV.v) ? 100 : activeHSV.v;

    const ringAngleRad = safeH * (Math.PI / 180);
    const ringThumbX = CENTER + RING_MID_R * Math.cos(ringAngleRad);
    const ringThumbY = CENTER + RING_MID_R * Math.sin(ringAngleRad);

    const S_factor = safeS / 100;
    const V_factor = safeV / 100;
    const triX = CENTER + (1.5 * TRIANGLE_R * S_factor * V_factor - TRIANGLE_R / 2);
    const triY = CENTER + (TRIANGLE_R * Math.sqrt(3) / 2 * (1 - 2 * V_factor + V_factor * S_factor));
    const activeHex = hsvToHex(safeH, safeS, safeV);

    if (activeTab === 'presets') {
        return (
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
                <div className="relative group">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-brand-lime group-focus-within:text-white transition-colors">
                        <Search size={22} />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchSubmit(e);
                            }
                        }}
                        placeholder="ابحث عن أفكار إضافية (مثلاً: مطعم، سيارات، قهوة...)"
                        className="w-full bg-brand-black border-2 border-white/10 rounded-2xl py-4 pr-12 pl-32 text-white placeholder-gray-500 outline-none focus:border-brand-lime transition-colors text-lg shadow-inner"
                    />
                    <button 
                        type="button"
                        onClick={handleSearchSubmit}
                        disabled={!searchQuery.trim()}
                        className="absolute inset-y-2 left-2 bg-brand-lime text-black px-6 rounded-xl font-bold hover:bg-lime-400 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        بحث 🚀
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 w-full">
                    {INDUSTRY_PALETTES.map((p) => {
                        const isActive = currentPalette && JSON.stringify(currentPalette) === JSON.stringify(p.colors);
                        return (
                        <button 
                            key={p.id} 
                            type="button" 
                            onClick={() => applyPreset(p.colors)} 
                            className={`flex flex-col p-4 sm:p-5 rounded-2xl transition-all shadow-lg group text-right relative ${isActive ? 'border-2 border-[#ccff00] bg-brand-dark' : 'border border-white/10 bg-brand-black hover:border-brand-lime'}`}
                        >
                            {isActive && (
                                <div className="absolute -top-3 -right-3 bg-brand-lime text-brand-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md z-20 animate-fadeIn">
                                    <CheckCircle2 size={14} /> تم اختيار هذه اللوحة
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-2 w-full relative z-10">
                                <span className="text-sm sm:text-lg font-bold text-white group-hover:text-brand-lime transition-colors">{p.label}</span>
                                <div className="flex items-center gap-2">
                                    <div 
                                        role="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(p.pinterestQuery || (p.label + ' color palette branding'))}`, '_blank');
                                        }}
                                        className="text-gray-500 hover:text-brand-lime transition-colors p-1"
                                        title="بحث استلهام في Pinterest"
                                    >
                                        <Search size={16} />
                                    </div>
                                    <div className="relative flex items-center justify-center">
                                        <Info size={16} className="text-gray-500 group-hover:text-brand-lime peer" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-100 text-zinc-900 text-xs px-2.5 py-1.5 rounded-md shadow-xl border border-zinc-200 z-50 pointer-events-none opacity-0 peer-hover:opacity-100 transition-opacity text-center">
                                            انقر لاختيار هذه المجموعة وتطبيقها فوراً
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[11px] sm:text-xs text-gray-400 mb-4 h-7 leading-relaxed line-clamp-2 relative z-10">{p.desc}</p>
                            <div className="flex w-full h-10 sm:h-12 rounded-xl overflow-hidden shadow-inner mt-auto relative z-10">
                                {p.colors.map((c, i) => (
                                    <div 
                                        key={i} 
                                        className="flex-1 transition-transform group-hover:scale-110 group-hover:-translate-y-1" 
                                        style={{ backgroundColor: c, transitionDelay: `${i * 50}ms` }} 
                                    />
                                ))}
                            </div>
                            {/* Subtle background glow on hover */}
                            <div className="absolute inset-0 bg-brand-lime/5 opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none rounded-2xl" />
                        </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto mt-4">
            <div 
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative touch-none cursor-crosshair drop-shadow-2xl"
                style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
            >
                <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'conic-gradient(from 90deg, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))',
                        maskImage: `radial-gradient(circle, transparent ${RING_INNER_R}px, black ${RING_INNER_R + 1}px, black ${RING_OUTER_R}px, transparent ${RING_OUTER_R + 1}px)`,
                        WebkitMaskImage: `radial-gradient(circle, transparent ${RING_INNER_R}px, black ${RING_INNER_R + 1}px, black ${RING_OUTER_R}px, transparent ${RING_OUTER_R + 1}px)`
                    }}
                />
                <div className="absolute inset-0 rounded-full pointer-events-none ring-1 ring-inset ring-white/20 shadow-inner" style={{ margin: CANVAS_SIZE/2 - RING_OUTER_R }} />

                <canvas 
                    ref={canvasRef} 
                    width={CANVAS_SIZE} 
                    height={CANVAS_SIZE} 
                    className="absolute inset-0 pointer-events-none" 
                />

                <div 
                    className="absolute w-5 h-5 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.5)] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform"
                    style={{ left: ringThumbX, top: ringThumbY, backgroundColor: `hsl(${safeH}, 100%, 50%)` }}
                />

                <div 
                    className="absolute w-4 h-4 rounded-full border-[2.5px] border-white shadow-[0_0_8px_rgba(0,0,0,0.8)] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform"
                    style={{ left: triX, top: triY, backgroundColor: activeHex }}
                />
            </div>

            <div className="w-full flex items-center justify-between bg-brand-black border border-white/10 rounded-xl p-2.5 shadow-inner">
                <div className="flex items-center gap-3 pl-2">
                    <div className="w-10 h-10 rounded-lg shadow-md border border-white/20" style={{ backgroundColor: activeHex }} />
                    <input 
                        type="text" 
                        value={hexInput} 
                        onChange={handleHexInputChange}
                        onBlur={handleHexInputBlur}
                        className="bg-transparent text-white font-mono font-bold text-lg outline-none w-28 tracking-wider uppercase"
                        dir="ltr"
                    />
                </div>
                <button 
                    type="button"
                    onClick={handleAddColor}
                    className="bg-brand-lime text-brand-black px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#b3e600] transition-colors shadow-lg"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>إضافة للوحة</span>
                </button>
            </div>
        </div>
    );
};
