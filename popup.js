const toggle = document.getElementById("toggle");
const statusText = document.getElementById("status");
const message = document.getElementById("message");

async function loadState() {
  const stored = await chrome.storage.local.get({ enabled: true });
  const enabledRulesets = await chrome.declarativeNetRequest.getEnabledRulesets();
  const enabled = stored.enabled && enabledRulesets.includes("ads");
  toggle.checked = enabled;
  render(enabled);
}

function render(enabled) {
  statusText.textContent = enabled ? "On" : "Off";
  message.textContent = enabled
    ? "Common ad and tracker domains are being blocked."
    : "Ad blocking is paused. Switch it on to protect browsing.";
}

toggle.addEventListener("change", async () => {
  toggle.disabled = true;
  message.textContent = "Updating protection…";
  try {
    const response = await chrome.runtime.sendMessage({
      type: "SET_BLOCKING",
      enabled: toggle.checked
    });
    if (!response?.ok) throw new Error(response?.error || "Could not update setting");
    render(toggle.checked);
  } catch (error) {
    toggle.checked = !toggle.checked;
    render(toggle.checked);
    message.textContent = error.message;
  } finally {
    toggle.disabled = false;
  }
});

loadState().catch(error => {
  statusText.textContent = "Unavailable";
  message.textContent = error.message;
});
