import { getActiveTabURL } from "./utils.js";

// ─────────────────────────────────────────
// ON POPUP OPEN
// Runs every time the user clicks the icon
// ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {

  // Load everything we have saved in Chrome Storage
  const stored = await chrome.storage.sync.get([
    "userIntent",
    "distractionCount"
  ]);

  const savedIntent        = stored.userIntent       || null;
  const savedCount         = stored.distractionCount || 0;

  // Populate the UI with saved values
  updateIntentDisplay(savedIntent);
  document.getElementById("distraction-count").textContent = savedCount;

  // ── Optional: check if we're on a YouTube/distracting page ──────────
  // We can use getActiveTabURL to show a contextual message if needed
  const activeURL = await getActiveTabURL();
  if (activeURL.includes("youtube.com")) {
    console.log("User is currently on YouTube");
    // You could display a banner here if you like
  }


  // ─────────────────────────────────────────
  // SET INTENT BUTTON
  // Saves the user's typed intent to storage
  // ─────────────────────────────────────────
  document.getElementById("set-intent-btn")
    .addEventListener("click", async () => {

      const input  = document.getElementById("intent-input");
      const intent = input.value.trim();

      // Validate: don't allow empty intent
      if (!intent) {
        showFeedback("Please type your focus goal first!", "error");
        return;
      }

      // Save to Chrome Storage (synced across devices)
      await chrome.storage.sync.set({ userIntent: intent });

      // Update the UI
      updateIntentDisplay(intent);
      input.value = "";
      showFeedback("Intent saved! Stay focused 💪", "success");
    });


  // ─────────────────────────────────────────
  // CLEAR INTENT BUTTON
  // Removes the saved intent from storage
  // ─────────────────────────────────────────
  document.getElementById("clear-intent-btn")
    .addEventListener("click", async () => {

      await chrome.storage.sync.remove("userIntent");
      updateIntentDisplay(null);
      showFeedback("Intent cleared.", "info");
    });


  // ─────────────────────────────────────────
  // RESET COUNT BUTTON
  // Resets the distraction counter to zero
  // ─────────────────────────────────────────
  document.getElementById("reset-count-btn")
    .addEventListener("click", async () => {

      await chrome.storage.sync.set({ distractionCount: 0 });
      document.getElementById("distraction-count").textContent = "0";
      showFeedback("Count reset to zero.", "info");
    });

});


// ─────────────────────────────────────────
// HELPER: Update the intent display text
// ─────────────────────────────────────────
function updateIntentDisplay(intent) {
  const display = document.getElementById("current-intent-display");

  if (intent) {
    display.textContent = `"${intent}"`;
    display.style.color = "#2563eb"; // Blue when an intent is active
  } else {
    display.textContent = "No intent set yet";
    display.style.color = "#9ca3af"; // Grey when nothing is set
  }
}


// ─────────────────────────────────────────
// HELPER: Show a temporary feedback message
// ─────────────────────────────────────────
function showFeedback(message, type = "info") {

  // Remove any existing feedback
  const existing = document.getElementById("popup-feedback");
  if (existing) existing.remove();

  const el = document.createElement("p");
  el.id = "popup-feedback";
  el.textContent = message;
  el.className = `feedback feedback-${type}`;

  document.querySelector(".container").appendChild(el);

  // Auto-remove after 2.5 seconds
  setTimeout(() => el.remove(), 2500);
}