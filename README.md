# Board Game Coach — product site

Static website for the Board Game Coach apps, served by GitHub Pages. No build
step: plain HTML, CSS and JavaScript.

| Page | Path |
| --- | --- |
| All games | `/` |
| One game | `/<game-id>/` (go, four-in-a-row, chess, gomoku, shogi, chinese-chess, nine-mens-morris, dots-and-boxes, mancala) |
| Privacy policy (all apps) | `/privacy/` |
| Support (all apps) | `/support/` |

## Languages

English, 简体中文 (`zh-Hans`), 繁體中文 (`zh-Hant`), 日本語 (`ja`), 한국어 (`ko`).
The page follows the browser's languages (zh-TW / zh-HK / zh-Hant → 繁體中文,
other zh → 简体中文) and falls back to English. `?lang=zh-Hant` (or any of the
codes above) forces a language; internal links keep it, and the menu in the
header sets it.

## Editing

- **Texts and games:** `assets/content.js` (`window.SITE`). Every text has all
  five languages. A game with `appStore` / `playStore` links shows the store
  buttons and "Available now"; without them it is "Coming soon".
- **Rendering:** `assets/app.js` fills each page shell (`<body data-page="…">`).
- **Look:** `assets/style.css` (light and dark, follows the device).
- **A new game page:** copy `go/index.html` to `<id>/index.html`, change
  `data-game` and the `<title>`, add the game to `SITE.games`, and its icon to
  `assets/icons/<id>.png` (or a `tile` character).
- **Privacy policy changes:** edit `SITE.privacy` in all five languages and
  update `SITE.privacy.updated`.

Reversi is not listed for now.

Preview locally: `python3 -m http.server` in this folder, then open
http://localhost:8000.
