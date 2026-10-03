export const GA_ID = "G-3BBW7XEREH";

// gtag.js expects the `arguments` object itself on the dataLayer, not an array.
export function gtag() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

export const initAnalytics = () => {
  gtag("js", new Date());
  gtag("config", GA_ID);
};

/**
 * Record a copy of a timestamp code. `format` is the Discord style letter
 * (R, t, T, d, D, f, F, S) or "combined" for the multi-code presets.
 */
export const trackCopy = (format) => {
  gtag("event", "copy_timestamp", { format });
};
