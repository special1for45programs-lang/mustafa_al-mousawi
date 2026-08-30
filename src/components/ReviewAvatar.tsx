import React from 'react';
import { User } from 'lucide-react';

interface ReviewAvatarProps {
  name?: string;
  className?: string;
}

const ReviewAvatar: React.FC<ReviewAvatarProps> = ({ name, className = '' }) => {
  const getInitial = (name?: string) => {
    if (!name || name.trim() === '') return null;
    // Extract first character and handle potential emojis or special chars
    const initial = Array.from(name.trim())[0];
    return initial ? initial.toUpperCase() : null;
  };

  const initial = getInitial(name);

  return (
    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold bg-brand-lime/10 text-brand-lime border border-brand-lime/20 ${className}`}>
      {initial ? (
        <span className="text-lg leading-none">{initial}</span>
      ) : (
        <User className="w-5 h-5 opacity-80" />
      )}
    </div>
  );
};

export default ReviewAvatar;
