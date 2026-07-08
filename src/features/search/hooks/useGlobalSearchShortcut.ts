import { useEffect, useRef } from 'react';

/** Opens global search from anywhere in the app via Ctrl+K / Cmd+K. */
export const useGlobalSearchShortcut = (onTrigger: () => void): void => {
  // Keeps the listener subscribed once regardless of how often the caller's
  // inline callback reference changes, instead of tearing down and
  // re-attaching the window listener on every render. Refs are only safe to
  // write outside of render, so the assignment itself lives in its own effect.
  const onTriggerRef = useRef(onTrigger);
  useEffect(() => {
    onTriggerRef.current = onTrigger;
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onTriggerRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
