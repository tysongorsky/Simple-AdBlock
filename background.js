const RULESET_ID = "ads";

chrome.runtime.onInstalled.addListener(async () => {
  const state = await chrome.storage.local.get({ enabled: true });
  await setBlockingEnabled(state.enabled);
});

async function setBlockingEnabled(enabled) {
  const current = await chrome.declarativeNetRequest.getEnabledRulesets();
  const isEnabled = current.includes(RULESET_ID);

  if (enabled && !isEnabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [RULESET_ID]
    });
  } else if (!enabled && isEnabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: [RULESET_ID]
    });
  }

  await chrome.storage.local.set({ enabled });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "SET_BLOCKING") {
    setBlockingEnabled(Boolean(message.enabled))
      .then(() => sendResponse({ ok: true }))
      .catch(error => sendResponse({ ok: false, error: error.message }));
    return true;
  }
});
