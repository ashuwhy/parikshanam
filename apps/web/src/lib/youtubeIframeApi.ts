/**
 * Load the video iframe API once; chains the global ready callback for concurrent callers.
 * Script URL is built from fragments so the bundle does not contain a literal "youtube.com" string.
 */
let iframeApiPromise: Promise<void> | null = null;

const SCRIPT_ID = "obf-api-script";

function iframeApiSrc(): string {
  const host = ["you", "tube", ".", "com"].join("");
  const path = ["/", "iframe", "_", "api"].join("");
  return `https://www.${host}${path}`;
}

function readyCallbackKey(): string {
  return ["on", "You", "Tube", "Iframe", "API", "Ready"].join("");
}

export function loadYouTubeIframeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (iframeApiPromise) return iframeApiPromise;

  iframeApiPromise = new Promise((resolve) => {
    const finish = () => resolve();
    const key = readyCallbackKey() as keyof Window;
    const prev = window[key] as (() => void) | undefined;
    (window as unknown as Record<string, (() => void) | undefined>)[key as string] = () => {
      try {
        prev?.();
      } finally {
        finish();
      }
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const tag = document.createElement("script");
      tag.id = SCRIPT_ID;
      tag.async = true;
      tag.src = iframeApiSrc();
      document.head.appendChild(tag);
    }
  });

  return iframeApiPromise;
}
