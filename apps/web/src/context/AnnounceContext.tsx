import { createContext, useCallback, useRef, useState, type ReactNode } from "react";

interface AnnounceContextValue {
  announce: (message: string) => void;
}

export const AnnounceContext = createContext<AnnounceContextValue>({
  announce: () => {},
});

export function AnnounceProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const announce = useCallback((msg: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage("");
    // Force DOM update cycle so repeated identical messages still announce
    requestAnimationFrame(() => {
      setMessage(msg);
      timeoutRef.current = setTimeout(() => setMessage(""), 3000);
    });
  }, []);

  return (
    <AnnounceContext value={{ announce }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="sr-only"
      >
        {message}
      </div>
    </AnnounceContext>
  );
}
