(() => {
  "use strict";

  // SponsorBlock-compatible client. Uses the public API's 4-character
  // SHA-256 prefix endpoint so the full YouTube video ID is not sent.
  const API = "https://sponsor.ajay.app/api/skipSegments/";
  const CATEGORIES = [
    "sponsor",
    "selfpromo",
    "interaction",
    "intro",
    "outro",
    "preview",
    "music_offtopic",
    "filler",
    "hook"
  ];

  let activeVideoId = "";
  let segments = [];
  let skipped = new Set();
  let loadingVideoId = "";
  let lastSkipAt = 0;

  function getVideoId() {
    try {
      return new URL(location.href).searchParams.get("v") ||
        document.querySelector("ytd-watch-flexy")?.getAttribute("video-id") ||
        "";
    } catch {
      return "";
    }
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  async function loadSegments(videoId) {
    if (!videoId || loadingVideoId === videoId) return;
    loadingVideoId = videoId;
    activeVideoId = videoId;
    segments = [];
    skipped = new Set();

    try {
      const hash = await sha256(videoId);
      const categories = encodeURIComponent(JSON.stringify(CATEGORIES));
      const response = await fetch(API + hash.slice(0, 4) + "?categories=" + categories, {
        method: "GET",
        credentials: "omit",
        cache: "no-store"
      });

      if (!response.ok) {
        segments = [];
        return;
      }

      const results = await response.json();
      if (getVideoId() !== videoId || !Array.isArray(results)) return;

      const exactVideo = results.find(item =>
        item && item.videoID === videoId && Array.isArray(item.segments)
      );

      segments = (exactVideo?.segments || [])
        .filter(item =>
          item &&
          item.actionType !== "mute" &&
          item.actionType !== "poi" &&
          item.actionType !== "chapter" &&
          Array.isArray(item.segment) &&
          Number.isFinite(item.segment[0]) &&
          Number.isFinite(item.segment[1]) &&
          item.segment[0] >= 0 &&
          item.segment[1] > item.segment[0]
        )
        .sort((a, b) => a.segment[0] - b.segment[0]);
    } catch {
      // SponsorBlock being unavailable should never interrupt playback.
      segments = [];
    } finally {
      if (loadingVideoId === videoId) loadingVideoId = "";
    }
  }

  function findVideo() {
    const id = getVideoId();
    if (id && id !== activeVideoId && id !== loadingVideoId) {
      loadSegments(id);
    }
  }

  function skipCurrentSegment(video) {
    if (!video || video.paused || !segments.length || activeVideoId !== getVideoId()) return;

    const now = performance.now();
    if (now - lastSkipAt < 900) return;

    const currentTime = video.currentTime;
    const segment = segments.find(item => {
      const [start, end] = item.segment;
      return !skipped.has(item.UUID) && currentTime >= start && currentTime < end;
    });

    if (!segment) return;

    const [start, end] = segment.segment;
    skipped.add(segment.UUID || String(start) + ":" + String(end));
    lastSkipAt = now;
    video.currentTime = end + 0.05;
  }

  document.addEventListener("timeupdate", event => {
    if (event.target instanceof HTMLVideoElement) {
      skipCurrentSegment(event.target);
    }
  }, true);

  document.addEventListener("yt-navigate-finish", findVideo);
  window.addEventListener("popstate", findVideo);
  findVideo();

  // Covers YouTube's client-side navigation and player replacement.
  const navigationObserver = new MutationObserver(findVideo);
  navigationObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
