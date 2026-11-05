# Simple AdBlock

A lightweight ad and tracker blocker for Chrome and other Chromium-based browsers.

## Features

- Blocks requests to a curated starter list of advertising and tracking domains.
- YouTube ad handling: hides common page ad placements and clicks visible Skip Ad controls when available.
- SponsorBlock integration: automatically skips community-reported sponsor segments, intros, outros, self-promotion, and other selected segment categories.
- One-click enable/disable switch in the extension popup.
- Uses Chrome Manifest V3 and the built-in Declarative Net Request API.
- No account or analytics. SponsorBlock lookups use its public API with a four-character SHA-256 video-ID prefix; the extension matches the exact video locally.

## Install from source

1. Download this repository using **Code → Download ZIP**, then extract it.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the extracted `Simple-AdBlock` folder.

## Use

Click the Simple AdBlock toolbar icon to see protection status and switch blocking on or off. Refresh an open page after changing the setting.

## Limitations

This is an early domain-based blocker, not a complete replacement for a maintained content blocker. It may not remove ads served from the same domain as a website, YouTube ad handling is best-effort and cannot guarantee removal of every in-stream ad. SponsorBlock only skips segments that have been submitted by its community and returned by its API. The extension does not submit segments or vote. Blocking a shared domain can occasionally affect website features.

## Customize the blocklist

Edit `rules.json` and reload the extension from `chrome://extensions`. Rules block network requests to the listed domains; they do not inspect page content.

## Privacy

The ad-domain rules are processed locally. For SponsorBlock, the extension hashes the YouTube video ID and sends only the first four characters to the SponsorBlock API. The API returns possible matches, and the extension checks the exact video ID locally. See the [SponsorBlock API documentation](https://wiki.sponsor.ajay.app/w/API_Docs) and [SponsorBlock project](https://sponsor.ajay.app/).


## Attribution

Sponsor segment data is provided by the [SponsorBlock project](https://sponsor.ajay.app/). Simple AdBlock is an independent integration and is not an official SponsorBlock extension.
