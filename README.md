# Flappy Bird for X

A classic-style Flappy Bird browser game built with Canvas 2D and plain JavaScript. No WebGL, dependencies or build step.

**Play:** https://flappy-bird.awesamarth.dev/  
**Embed:** https://flappy-bird.awesamarth.dev/embed.html

Tap, click, Space or Arrow Up to flap. Holding a flight key uses normal keyboard repeat during play. P pauses; M toggles sound. Sound starts enabled on the first user gesture, with an intentional mute choice saved locally. Your best score stays in your browser.

Pipe collisions stop the world, rotate the bird downward and let it fall to the ground. The score panel appears shortly after impact, while the bird is still falling. A deliberate input restarts; a held key cannot restart. Flying above the visible screen is allowed. Leaving the tab pauses live play.

## Run locally

From this repository:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/ .

## Deploy

Serve the root HTML, JavaScript, CSS and assets with any static web server. JavaScript `.mjs` files must use `application/javascript` and `.wav` files should use `audio/wav`. Publish only the game files and asset directories, keeping Git metadata and local configuration outside the public web root.

For a different domain, edit the absolute canonical, Open Graph and Twitter Card URLs directly in `index.html` and `embed.html`. Use HTTPS for every game/card asset and redirect HTTP to HTTPS. The live deployment uses a small isolated Nginx site on an Oracle VPS with a free Let's Encrypt certificate.

For embedding, permit the intended frame origins in your server's CSP `frame-ancestors`. The current game permits its own origin plus X/Twitter origins. Do not send `X-Frame-Options: DENY` or `SAMEORIGIN` if you intend to allow X frames.

## X Player Card

Both HTML documents contain static Player Card metadata: the HTTPS embedded game URL, a square preview PNG, title/description and 360×360 player dimensions. The regular page keeps a portrait playfield. The embedded page follows the actual iframe ratio: X was observed opening a square player, so the embedded scene fills it with uniformly scaled pixel art and fitted controls. It does not stretch or crop the canvas. The hidden live region and focus handling prevent the playfield from scrolling on restart.

Desktop X rendering was observed. Mobile X did not show the playable card in the checked post; use the direct-play link there. Card acceptance, caching and presentation are controlled by X, and this project does not guarantee them or bypass platform restrictions.

## Files

- `index.html` and `embed.html`: direct-play and embedded pages.
- `engine.mjs`: physics, collision and scoring.
- `game.mjs`: controls and browser integration.
- `render.mjs`: Canvas artwork and screens.
- `audio.mjs`, `audio/`: sound playback and files.
- `style.css`, `icon.svg`, `preview.png`: layout and visual assets.
- `notices/`: retained third-party asset credits and license.

## Credits and licenses

Game code and recreated pixel artwork are released under the [MIT License](LICENSE).

The actual classic sound files are unchanged downloads from [samuelcust/flappy-bird-assets](https://github.com/samuelcust/flappy-bird-assets/tree/master/audio). The community pack publishes an MIT notice by Samuel Custodio (2019); its original [license](notices/flappy-bird-assets-LICENSE.txt), README and [source notice](notices/audio-source.txt) are included. That pack's notice is retained separately from this project's code license; no independent original-rightsholder media grant or official endorsement is asserted. `flap.wav` is a byte-identical alias of `wing.wav`.
