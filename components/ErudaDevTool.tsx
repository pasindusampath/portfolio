"use client";

import Script from "next/script";

/**
 * Loads Eruda mobile dev tools in development only.
 * Must be a Client Component because <Script onLoad> is an event handler.
 */
export function ErudaDevTool() {
  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/eruda"
      strategy="afterInteractive"
      onLoad={() => {
        // @ts-expect-error eruda is loaded via CDN
        window.eruda?.init();
      }}
    />
  );
}
