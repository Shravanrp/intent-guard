// ─────────────────────────────────────────
// MESSAGE LISTENER
// Receives messages from background.js
// ─────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "SHOW_DISTRACTION_WARNING") {
    showDistractionOverlay(message.intent, message.site);
  }

  if (message.type === "REMOVE_WARNING") {
    removeDistractionOverlay();
  }
});

// ─────────────────────────────────────────
// SHOW THE FULL-SCREEN WARNING OVERLAY
// ─────────────────────────────────────────
function showDistractionOverlay(intent, site) {

  // Prevent duplicate overlays — if one already exists, skip
  if (document.getElementById("intent-guard-overlay")) return;

  // Create the overlay wrapper (covers the whole screen)
  const overlay = document.createElement("div");
  overlay.id = "intent-guard-overlay";

  // Build the inner box HTML
  overlay.innerHTML = `
    <div id="intent-guard-box">
      <div id="intent-guard-icon">⚠️</div>
      <h2 id="intent-guard-title">Distraction Detected</h2>
      <p class="intent-guard-label">Your current focus is:</p>
      <p id="intent-guard-goal">"${intent}"</p>
      <p class="intent-guard-label">But you just opened:</p>
      <p id="intent-guard-site">${site}</p>
      <p id="intent-guard-question">Is this helping you reach your goal?</p>
      <div id="intent-guard-buttons">
        <button id="intent-go-back-btn">← Go Back</button>
        <button id="intent-stay-btn" disabled>Stay (10s)</button>
      </div>
    </div>
  `;

  // Inject the overlay into the page's body
  document.body.appendChild(overlay);

  // ── Countdown Timer ──────────────────────────────
  // The "Stay" button is disabled for 10 seconds.
  // This forces the user to pause and think.
  let countdown = 10;
  const stayBtn = document.getElementById("intent-stay-btn");

  const timer = setInterval(() => {
    countdown--;
    stayBtn.textContent = countdown > 0
      ? `Stay (${countdown}s)`
      : "Stay Anyway";

    if (countdown <= 0) {
      clearInterval(timer);
      stayBtn.disabled = false; // Enable after countdown ends
    }
  }, 1000);

  // ── Go Back Button ───────────────────────────────
  // Takes the user back to the previous page
  document.getElementById("intent-go-back-btn")
    .addEventListener("click", () => {
      removeDistractionOverlay();
      history.back();
    });

  // ── Stay Button ──────────────────────────────────
  // Only works after the countdown finishes
  stayBtn.addEventListener("click", () => {
    if (!stayBtn.disabled) {
      removeDistractionOverlay();
    }
  });
}

// ─────────────────────────────────────────
// REMOVE THE OVERLAY
// ─────────────────────────────────────────
function removeDistractionOverlay() {
  const overlay = document.getElementById("intent-guard-overlay");
  if (overlay) overlay.remove();
}