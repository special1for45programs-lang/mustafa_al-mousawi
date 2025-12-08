import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const updateCursorType = () => {
            const target = document.elementFromPoint(position.x, position.y);
            if (target) {
                const computedStyle = window.getComputedStyle(target);
                setIsPointer(computedStyle.cursor === 'pointer' || target.tagName === 'A' || target.tagName === 'BUTTON');
            }
        };

        const handleMouseEnter = () => setIsHidden(false);
        const handleMouseLeave = () => setIsHidden(true);

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mouseover', updateCursorType);
        document.body.addEventListener('mouseenter', handleMouseEnter);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mouseover', updateCursorType);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [position.x, position.y]);

    if (isHidden) return null;

    return (
        <>
            <div
                className="fixed top-0 left-0 w-4 h-4 bg-brand-lime rounded-full pointer-events-none z-[100] mix-blend-difference transition-transform duration-100 ease-out"
                style={{
                    transform: `translate(${position.x - 8}px, ${position.y - 8}px) scale(${isPointer ? 1.5 : 1})`
                }}
            />
            <div
                className="fixed top-0 left-0 w-8 h-8 border border-brand-lime rounded-full pointer-events-none z-[100] transition-transform duration-300 ease-out"
                style={{
                    transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 1.5 : 1})`
                }}
            />
        </>
    );
};

export default CustomCursor;
