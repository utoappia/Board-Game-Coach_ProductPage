# Board Game Coach — product site

Static website for the Board Game Coach apps, served by GitHub Pages. No build
step: plain HTML, CSS and JavaScript.

| Page | Path |
| --- | --- |
| All games | `/` |
| One game | `/<game-id>/` (go, four-in-a-row, reversi, chess, gomoku, shogi, chinese-chess, nine-mens-morris, dots-and-boxes, mancala, checkers, janggi; planned: international-draughts, backgammon) |
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
  five languages.
- **Store links:** on iOS every game links only to the hub app, Board Game Coach
  (`hubAppStore`); we market the hub on iOS. A game's own `appStore` (Go, Four in
  a Row, Reversi) stays on the store for its existing users but is not linked, unless
  the game says `"hub": false`. `playStore` adds the Google Play button. The games list
  shows two pills, Apple and Android: green where the game is out, grey where it is
  not yet. A game on neither store shows "Coming soon", or "Planned" with
  `"status": "planned"`.
- **Rendering:** `assets/app.js` fills each page shell (`<body data-page="…">`).
- **Look:** `assets/style.css` (light and dark, follows the device).
- **A new game page:** copy `go/index.html` to `<id>/index.html`, change
  `data-game` and the `<title>`, add the game to `SITE.games`, and its icon to
  `assets/icons/<id>.jpg` (384×384, from the app's 1024 px icon:
  `sips -s format jpeg -s formatOptions 82 -z 384 384 icon.png --out <id>.jpg`; or a `tile` character).
- **Privacy policy changes:** edit `SITE.privacy` in all five languages and
  update `SITE.privacy.updated`.


Preview locally: `python3 -m http.server` in this folder, then open
http://localhost:8000.
