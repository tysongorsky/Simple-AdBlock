# Simple AdBlock

A lightweight ad and tracker blocker for Chrome and other Chromium-based browsers.

## Features

- Blocks requests to a curated starter list of advertising and tracking domains.
- Best-effort YouTube support: hides common page ad placements and clicks visible Skip Ad controls when YouTube exposes them.
- One-click enable/disable switch in the extension popup.
- Uses Chrome Manifest V3 and the built-in Declarative Net Request API.
- No account, external server, analytics, or data collection.

## Install from source

1. Download this repository using **Code → Download ZIP**, then extract it.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the extracted `Simple-AdBlock` folder.

## Use

Click the Simple AdBlock toolbar icon to see protection status and switch blocking on or off. Refresh an open page after changing the setting.

## Limitations

This is an early domain-based blocker, not a complete replacement for a maintained content blocker. It may not remove ads served from the same domain as a website, YouTube support is best-effort: it can hide common page ad placements and use visible Skip Ad controls, but it cannot guarantee removal of every in-stream ad. YouTube frequently changes its player, and some ads cannot be skipped. Blocking a shared domain can occasionally affect website features.

## Customize the blocklist

Edit `rules.json` and reload the extension from `chrome://extensions`. Rules block network requests to the listed domains; they do not inspect page content.

## Privacy

The extension does not transmit browsing data. Its rules are processed locally by the browser.
