import { useEffect, useRef, useCallback } from 'react';

const IDLE_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click',
];

/**
 * Signs the user out after `timeoutMs` of inactivity.
 * Shows a warning callback `warningMs` before logout.
 */
export function useIdleTimeout({
  timeoutMs = 15 * 60 * 1000,   // 15 min
  warningMs = 2 * 60 * 1000,    // warn 2 min before
  onWarning,
  onTimeout,
  enabled = true,
}: {
  timeoutMs?: number;
  warningMs?: number;
  onWarning?: () => void;
  onTimeout: () => void;
  enabled?: boolean;
}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const warningRef = useRef<ReturnType<typeof setTimeout>>();
  const warnedRef = useRef(false);

  const resetTimers = useCallback(() => {
    if (!enabled) return;
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);
    warnedRef.current = false;

    warningRef.current = setTimeout(() => {
      warnedRef.current = true;
      onWarning?.();
    }, timeoutMs - warningMs);

    timeoutRef.current = setTimeout(() => {
      onTimeout();
    }, timeoutMs);
  }, [timeoutMs, warningMs, onWarning, onTimeout, enabled]);

  useEffect(() => {
    if (!enabled) return;

    resetTimers();

    const handler = () => resetTimers();
    IDLE_EVENTS.forEach((e) => window.addEventListener(e, handler, { passive: true }));

    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(warningRef.current);
      IDLE_EVENTS.forEach((e) => window.removeEventListener(e, handler));
    };
  }, [resetTimers, enabled]);
}
