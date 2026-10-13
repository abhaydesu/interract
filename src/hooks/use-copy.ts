"use client";

import * as React from "react";

/**
 * Copies text to the clipboard and exposes a short-lived `copied` flag.
 * Fails quietly when the Clipboard API is unavailable (insecure origin,
 * denied permission) instead of throwing an unhandled rejection.
 */
export function useCopy(timeout = 1600) {
  const [copied, setCopied] = React.useState<string | null>(null);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = React.useCallback(
    async (text: string, key: string = text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return false;
      }
      setCopied(key);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), timeout);
      return true;
    },
    [timeout]
  );

  return { copied, copy };
}
