import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    const updateMatch = () => {
      setMatches(media.matches);
    };

    updateMatch();

    // Listen for changes
    media.addEventListener('change', updateMatch);

    return () => {
      media.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
}

// Predefined breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 600px)');
export const useIsTablet = () => useMediaQuery('(min-width: 601px) and (max-width: 960px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 961px)');