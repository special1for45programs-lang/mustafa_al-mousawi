import React, { useEffect, useRef } from 'react';
import { BRAND_LOGOS } from '../imageConfig';

interface Particle {
    x: number;
    y: number;
    originX: number;
    originY: number;
    size: number;
    type: 'frame' | 's1';
    speed: number;
    offset: number;
}

const InteractiveBackgroundLogo: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let mouse = { x: -1000, y: -1000 };

        // Load images
        const imgFrame = new Image();
        imgFrame.src = (BRAND_LOGOS as any).frame;

        const imgS1 = new Image();
        imgS1.src = (BRAND_LOGOS as any).black;

        const initParticles = () => {
            particles = [];
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Calculate Margin Size (15% of width or at least 200px)
            const marginSize = Math.max(200, width * 0.15);

            // Define Safe Zones (Left Side & Right Side)
            const zones = [
                { start: 0, end: marginSize },
                { start: width - marginSize, end: width }
            ];

            zones.forEach(zone => {
                // Density: Columns per zone
                const cols = 3;
                const rows = 8; // Spread vertically
                const colSpacing = (zone.end - zone.start) / cols;
                const rowSpacing = height / rows;

                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        // Randomize position within grid cell
                        const x = zone.start + (i * colSpacing) + (Math.random() * colSpacing * 0.5);
                        const y = (j * rowSpacing) + (Math.random() * rowSpacing * 0.5);

                        particles.push({
                            x,
                            y,
                            originX: x,
                            originY: y,
                            size: Math.random() > 0.5 ? 30 : 60, // Smaller sizes for "quiet" feel
                            type: Math.random() > 0.6 ? 'frame' : 's1',
                            speed: 0.0005 + Math.random() * 0.001, // Slower speed
                            offset: Math.random() * Math.PI * 2
                        });
                    }
                }
            });
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const time = Date.now();

            particles.forEach(p => {
                // Wave movement (vertical sine wave) - Quieter amplitude
                const waveY = Math.sin(time * p.speed + p.offset) * 8;

                // Mouse interaction (Repulsion) - Gentler
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 150;

                let moveX = 0;
                let moveY = 0;

                if (distance < maxDist) {
                    const force = (maxDist - distance) / maxDist;
                    const angle = Math.atan2(dy, dx);
                    moveX = -Math.cos(angle) * force * 20; // Reduced push force
                    moveY = -Math.sin(angle) * force * 20;
                }

                const targetX = p.originX + moveX;
                const targetY = p.originY + waveY + moveY;

                // Smooth easing
                p.x += (targetX - p.x) * 0.03;
                p.y += (targetY - p.y) * 0.03;

                // Draw
                const img = p.type === 'frame' ? imgFrame : imgS1;

                // Opacity - Quieter base
                const baseOpacity = 0.08;
                const activeOpacity = 0.4;
                const opacity = baseOpacity + (distance < maxDist ? (1 - distance / maxDist) * (activeOpacity - baseOpacity) : 0);

                ctx.globalAlpha = opacity;

                // Scale - Subtle pop
                const s = p.size * (1 + (distance < maxDist ? 0.1 : 0));
                ctx.drawImage(img, p.x - s / 2, p.y - s / 2, s, s);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[30] overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
};

export default InteractiveBackgroundLogo;
