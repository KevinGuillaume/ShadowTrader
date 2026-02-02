import React from 'react';

interface IconProps {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const TrophyIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <defs>
      <linearGradient id="holo-trophy" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#dbeafe" />
        <stop offset="40%" stopColor="#a5d6ff" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
      <linearGradient id="holo-base" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a5d6ff" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>

    {/* Cup body – main holographic fill */}
    <path
      d="M7 4 C7 3 8 2 12 2 C16 2 17 3 17 4 L17 10 C17 12 15.5 14 12 14 C8.5 14 7 12 7 10 Z"
      fill="url(#holo-trophy)"
      opacity="0.94"
    />

    {/* Handles – left and right */}
    <path
      d="M6 8 C4 8 3 10 4 12 C5 14 7 14 8 12"
      stroke="url(#holo-trophy)"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.92"
    />
    <path
      d="M18 8 C20 8 21 10 20 12 C19 14 17 14 16 12"
      stroke="url(#holo-trophy)"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.92"
    />

    {/* Pedestal base */}
    <rect x="6" y="15" width="12" height="5" rx="1.5" fill="url(#holo-base)" opacity="0.9" />
    <rect x="7" y="16" width="10" height="3" rx="1" fill="#60a5fa" opacity="0.4" />

    {/* Shine / highlight accents */}
    <path
      d="M9 5 L15 5"
      stroke="#ffffff"
      strokeWidth="0.9"
      opacity="0.5"
    />
    <ellipse cx="12" cy="7" rx="3" ry="2" fill="none" stroke="#dbeafe" strokeWidth="1" opacity="0.6" />

    {/* Subtle glow highlight on top rim */}
    <path
      d="M8 3.5 C8 3 9 2.5 12 2.5 C15 2.5 16 3 16 3.5"
      stroke="#dbeafe"
      strokeWidth="1.1"
      opacity="0.65"
    />
  </svg>
);