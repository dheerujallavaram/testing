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
    // Only push once per mount to prevent Duplicate Ad Push errors
    if (!isPushed.current && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushed.current = true;
      } catch (err) {
        // Suppress benign preview / ad-blocker push errors
        console.debug('AdSense push notice:', err);
      }
    }
  }, []);

  return (
    <div className={`my-4 flex justify-center overflow-hidden text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8193475484408755"
        data-ad-slot={slotId || 'default'}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
