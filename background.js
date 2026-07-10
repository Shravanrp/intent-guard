// ─────────────────────────────────────────
// DISTRACTING SITES LIST
// Add or remove domains here as needed
// ─────────────────────────────────────────
const DISTRACTING_SITES = [
  "youtube.com",
  "twitter.com",
  "x.com",
  "facebook.com",
  "instagram.com",
  "reddit.com",
  "tiktok.com",
  "netflix.com",
  "twitch.tv",
  "9gag.com"
];

// ─────────────────────────────────────────
// LISTEN FOR TAB UPDATES
// Fires every time a tab's URL changes or
// a page finishes loading
// ─────────────────────────────────────────
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

  // Only act when the page has fully loaded and has a URL
  if (changeInfo.status !== "complete" || !tab.url) return;

  // Fetch the user's saved intent from Chrome Storage
  const result = await chrome.storage.sync.get(["userIntent", "distractionCount"]);
  const userIntent = result.userIntent;
  const distractionCount = result.distractionCount || 0;

  // If the user hasn't set an intent yet, do nothing
  if (!userIntent) return;

  // Check whether the current tab URL contains a distracting domain
  const isDistracting = DISTRACTING_SITES.some(site => tab.url.includes(site));

  if (isDistracting) {

    // Increment the distraction counter and save it
    await chrome.storage.sync.set({
      distractionCount: distractionCount + 1
    });

    // Extract just the domain name for a cleaner display (e.g. "reddit.com")
    let siteName = "";
    try {
      siteName = new URL(tab.url).hostname.replace("www.", "");
    } catch {
      siteName = "this site";
    }

    // Send a message TO the content script running on that tab
    // The content script will receive this and show the warning overlay
    chrome.tabs.sendMessage(tabId, {
      type: "SHOW_DISTRACTION_WARNING",
      intent: userIntent,
      site: siteName
    });
  }
});