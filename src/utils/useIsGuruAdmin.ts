import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isUserSuperAdmin } from '../firebase';

/**
 * Returns true when the app is either:
 * 1) Running inside the Google AI Studio preview/dev environment (*.run.app or localhost), OR
 * 2) Logged in as the verified super-admin (dheerujallavaram@gmail.com) on the live website.
 *
 * Public visitors on www.telugujyothisham.com (unless logged in as Guruji) receive `false`,
 * keeping all PDF / Image / Reel downloads strictly hidden on the public side.
 */
export function isStudioOrLocalHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.run.app') ||
    host.includes('aistudio')
  );
}

export function useIsGuruAdmin(): {
  isGuruAdmin: boolean;
  isStudioPreview: boolean;
  isSuperAdminUser: boolean;
} {
  const [isSuperAdminUser, setIsSuperAdminUser] = useState<boolean>(() =>
    isUserSuperAdmin(auth.currentUser)
  );
  const [isStudioPreview] = useState<boolean>(() => isStudioOrLocalHost());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setIsSuperAdminUser(isUserSuperAdmin(currentUser));
    });
    return () => unsub();
  }, []);

  return {
    isGuruAdmin: isStudioPreview || isSuperAdminUser,
    isStudioPreview,
    isSuperAdminUser,
  };
}
