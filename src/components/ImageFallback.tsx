import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIconSize?: number;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackIconSize = 20, 
  ...props 
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div 
        className={`bg-[#EEF2EC] dark:bg-[#151D17] border border-primary/10 flex flex-col items-center justify-center text-primary relative overflow-hidden select-none ${className}`}
      >
        {/* Subtle decorative circles for premium depth */}
        <div className="absolute w-16 h-16 rounded-full border border-primary/5 -top-4 -right-4 pointer-events-none" />
        <div className="absolute w-12 h-12 rounded-full border border-primary/5 -bottom-3 -left-3 pointer-events-none" />
        
        {/* Center content */}
        <div className="flex flex-col items-center justify-center gap-1 z-10">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm">
            <Utensils size={fallbackIconSize} className="text-primary stroke-[1.5]" />
          </div>
          <span className="text-[8px] font-bold tracking-widest uppercase opacity-70 text-primary">Savora</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
};
