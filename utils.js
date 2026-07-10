// ─────────────────────────────────────────
// Get the URL of the currently active tab
// Returns a Promise that resolves to a URL string
// ─────────────────────────────────────────
export async function getActiveTabURL() {
  return new Promise((resolve) => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs) => {
        // tabs[0] is always the currently focused tab
        resolve(tabs[0]?.url || "");
      }
    );
  });
}


// ─────────────────────────────────────────
// Extract just the domain from a full URL
// e.g. "https://www.reddit.com/r/..." → "reddit.com"
// ─────────────────────────────────────────
export function extractDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace("www.", "");
  } catch {
    return ""; // Return empty string if URL is invalid
  }
}


// ─────────────────────────────────────────
// Check if a URL belongs to a distracting site
// Useful for reuse across multiple files
// ─────────────────────────────────────────
const DISTRACTING_SITES = [
  "youtube.com", "twitter.com", "x.com",
  "facebook.com", "instagram.com", "reddit.com",
  "tiktok.com", "netflix.com", "twitch.tv"
];

export function isDistractingSite(url) {
  return DISTRACTING_SITES.some(site => url.includes(site));
}