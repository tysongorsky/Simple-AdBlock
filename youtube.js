(() => {
  "use strict";

  // YouTube changes its player markup frequently. These selectors target
  // common ad containers and skip controls, and are best-effort only.
  const AD_SELECTORS = [
    "ytd-ad-slot-renderer",
    "ytd-in-feed-ad-layout-renderer",
    "ytd-banner-promo-renderer",
    "ytd-promoted-sparkles-web-renderer",
    "ytd-display-ad-renderer",
    "#player-ads",
    ".ytp-ad-overlay-container"
  ];

  const SKIP_SELECTORS = [
    ".ytp-ad-skip-button",
    ".ytp-ad-skip-button-modern",
    ".ytp-skip-ad-button",
    "button.ytp-ad-skip-button"
  ];

  function hidePageAdSlots() {
    for (const selector of AD_SELECTORS) {
      document.querySelectorAll(selector).forEach((element) => {
        element.setAttribute("data-simple-adblock-hidden", "true");
      });
    }
  }

  function clickAvailableSkipButton() {
    const button = SKIP_SELECTORS
      .map((selector) => document.querySelector(selector))
      .find((candidate) => candidate && candidate.getClientRects().length > 0 && !candidate.disabled);

    if (button) button.click();
  }

  function handlePlayerAd() {
    const player = document.querySelector("#movie_player");
    if (!player) return;

    if (player.classList.contains("ad-showing")) {
      clickAvailableSkipButton();
    }
  }

  let scheduled = false;
  function scheduleWork() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      hidePageAdSlots();
      handlePlayerAd();
    });
  }

  const observer = new MutationObserver(scheduleWork);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true,
    attributeFilter: ["class", "style"] });

  // YouTube's player state can change without a useful DOM mutation.
  window.setInterval(handlePlayerAd, 800);
  scheduleWork();
})();
