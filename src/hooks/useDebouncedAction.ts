import { useRef, useCallback } from "react";

export function useDebouncedAction<T extends HTMLElement>(
  callback: (el: T | null | undefined) => void,
  delay: number = 500,
) {
  const elementsRef = useRef<Map<number, T | null>>(new Map());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const register = useCallback(
    (index: number) => (el: T | null) => {
      elementsRef.current.set(index, el);
    },
    [],
  );

  const trigger = useCallback(
    (index: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const el = elementsRef.current.get(index);
        callback(el);
      }, delay);
    },
    [callback, delay],
  );

  return { register, trigger };
}
