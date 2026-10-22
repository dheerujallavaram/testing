import React from 'react';

interface OmEmblemProps {
  className?: string;
  size?: number;
}

export const OmEmblem: React.FC<OmEmblemProps> = ({ className = 'w-6 h-6', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Om Sacred Symbol"
      role="img"
    >
      {/* Sacred Om Symbol Vector Path */}
      <circle cx="50" cy="50" r="46" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="3" />
      <path
        d="M38.5 32.2c-2.4-2.8-5.7-4.2-9.8-4.2-5.4 0-9.8 2.2-13.1 6.6-3.3 4.4-5 9.9-5 16.5 0 6.8 1.9 12.3 5.7 16.5 3.8 4.2 8.7 6.3 14.7 6.3 5.2 0 9.6-1.5 13.2-4.5 3.6-3 5.4-7.2 5.4-12.6 0-3.9-1.1-7.1-3.3-9.6-2.2-2.5-5.2-4.1-9-4.8 2.8-.8 5.1-2.2 6.9-4.2 1.8-2 2.7-4.5 2.7-7.5 0-4.3-1.4-7.7-4.2-10.2-2.8-2.5-6.6-3.8-11.4-3.8-5.3 0-9.6 1.6-12.9 4.8-3.3 3.2-5 7.4-5 12.6h7.5c0-3.3.9-5.8 2.7-7.5 1.8-1.7 4.3-2.6 7.5-2.6 3 0 5.4.8 7.2 2.4 1.8 1.6 2.7 3.8 2.7 6.6 0 3-1 5.3-3 6.9-2 1.6-4.9 2.4-8.7 2.4h-4.5v6.5h4.5c4.6 0 8.1 1 10.5 3 2.4 2 3.6 4.9 3.6 8.7 0 3.8-1.3 6.8-3.9 9-2.6 2.2-6.2 3.3-10.8 3.3-4.4 0-7.9-1.3-10.5-3.9-2.6-2.6-3.9-6.3-3.9-11.1 0-4.8 1.2-8.7 3.6-11.7 2.4-3 5.6-4.5 9.6-4.5 2.6 0 4.8.7 6.6 2.1 1.8 1.4 2.7 3.3 2.7 5.7h7.5c0-4.2-1.6-7.6-4.8-10.2z"
        fill="currentColor"
      />
      {/* Chandra and Bindu */}
      <path
        d="M58 22c5 0 9.5 2 13 5.5l-4 4c-2.5-2.5-5.5-4-9-4s-6.5 1.5-9 4l-4-4c3.5-3.5 8-5.5 13-5.5z"
        fill="currentColor"
      />
      <circle cx="58" cy="14" r="3.5" fill="currentColor" />
      {/* Tail flourish */}
      <path
        d="M48 55c5 5 11 8 18 8 9 0 16-5 19-14l7 3c-4 12-14 18-26 18-9 0-17-4-23-10l5-5z"
        fill="currentColor"
      />
    </svg>
  );
};
