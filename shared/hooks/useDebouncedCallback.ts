import { useCallback, useEffect, useRef } from "react";

export function useDebouncedCallback(
    callback: (...args: any[]) => void,
    delay = 300
) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const debounced = useCallback(
        (...args: any[]) => {
            cancel();
            timeoutRef.current = setTimeout(() => {
                callback(...args);
                timeoutRef.current = null;
            }, delay);
        },
        [callback, delay, cancel]
    );

    useEffect(() => cancel, [cancel]);

    return { debounced, cancel };
}