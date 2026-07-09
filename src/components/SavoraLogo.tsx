import React from 'react';

interface SavoraLogoProps {
  /** Size in pixels for both width and height. Default: 40 */
  size?: number;
  /** Optional CSS class */
  className?: string;
}

/**
 * Official Savora brand logo — plate with fork, knife, and spoon in brand green.
 * Uses inline SVG so it scales perfectly at any size, on any background.
 */
export const SavoraLogo: React.FC<SavoraLogoProps> = ({ size = 40, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    fill="none"
    width={size}
    height={size}
    className={className}
    aria-label="Savora Logo"
    role="img"
  >
    {/* Plate / circle base (light fill) */}
    <circle cx="100" cy="100" r="80" fill="#5F8D6E" opacity="0.12" />
    {/* Plate rim */}
    <circle cx="100" cy="100" r="80" fill="none" stroke="#5F8D6E" strokeWidth="6" />
    {/* Fork (left) — handle */}
    <line x1="66" y1="148" x2="66" y2="91" stroke="#5F8D6E" strokeWidth="5" strokeLinecap="round" />
    {/* Fork — tines */}
    <line x1="58" y1="52" x2="58" y2="78" stroke="#5F8D6E" strokeWidth="4" strokeLinecap="round" />
    <line x1="66" y1="52" x2="66" y2="78" stroke="#5F8D6E" strokeWidth="4" strokeLinecap="round" />
    <line x1="74" y1="52" x2="74" y2="78" stroke="#5F8D6E" strokeWidth="4" strokeLinecap="round" />
    {/* Fork — tine join curve */}
    <path d="M58 78 Q66 92 74 78" stroke="#5F8D6E" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* Knife (right) — handle */}
    <line x1="134" y1="148" x2="134" y2="98" stroke="#5F8D6E" strokeWidth="5" strokeLinecap="round" />
    {/* Knife — blade */}
    <path d="M134 98 Q134 52 148 52 L148 80 Q148 98 134 98" fill="#5F8D6E" opacity="0.8" />
    {/* Spoon (center) — handle */}
    <line x1="100" y1="148" x2="100" y2="106" stroke="#5F8D6E" strokeWidth="5" strokeLinecap="round" />
    {/* Spoon — bowl */}
    <ellipse cx="100" cy="88" rx="13" ry="18" stroke="#5F8D6E" strokeWidth="5" fill="none" />
  </svg>
);
