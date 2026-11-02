import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface GoogleAdUnitProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
}

export const GoogleAdUnit: React.FC<GoogleAdUnitProps> = ({
  slotId,
  format = 'auto',
  className = '',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    if (!isPushed.current && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      } catch {
        // Suppress preview / ad-blocker push notice
      }
    }
  }, []);

  const reservedHeightClass =
    format === 'horizontal' ? 'min-h-[90px] sm:min-h-[100px]' : 'min-h-[250px] sm:min-h-[280px]';

  return (
    <div
      aria-label="Sponsored Advertisement Slot"
      className={`my-4 flex items-center justify-center overflow-hidden text-center rounded-2xl bg-amber-50/40 border border-amber-200/50 ${reservedHeightClass} ${className}`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle w-full"
        style={{ display: 'block', minHeight: format === 'horizontal' ? '90px' : '250px' }}
        data-ad-client="ca-pub-8193475484408755"
        data-ad-slot={slotId || 'default'}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
