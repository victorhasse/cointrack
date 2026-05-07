# CoinTrack FX Dashboard

Modern financial dashboard featuring real-time data for forex and cryptocurrencies, a hybrid fiat ↔ crypto converter, historical charts, price alerts, and arbitrage detection.

<p align="center">
  🇺🇸 English | <a href="docs/README_PT.md">🇧🇷 Português</a>
</p>

## File Structure

```
cryptotrack-fx/
├── index.html          # Clean HTML5 markup
├── diagnostico.html    # Tests each endpoint individually in the browser and shows exactly what is failing
├── .gitignore
├── css/
│   └── styles.css      # Design tokens, themes, components, responsiveness
└── js/
    ├── data.js         # Real APIs + i18n + fallback + formatting
    ├── chart.js        # Chart.js rendering (main chart + sparklines)
    ├── ui.js           # Pure DOM rendering functions
    └── main.js         # Global state, events, lifecycle
```

## Features

- **Real-time data** — Frankfurter (fiat, ECB) + CoinGecko (crypto), both free and API key-free.
- **Automatic Fallback** — Cached values if APIs are unavailable.
- **Market Overview** — Cards for 6 fiat currencies + 4 cryptos with real-time sparklines.
- **"See More" on Mobile** — Displays 3 fiat + 2 crypto by default, with an expand button.
- **Hybrid Converter** — Any fiat ↔ any crypto with live exchange rates.
- **Historical Chart** — 6 timeframes: 1D / 7D / 1M / 3M / 1Y / 5Y with real data.
- **Price Alerts — Visual notification when an asset crosses a target value.
- **Simulated Arbitrage** — Binance vs. Kraken comparison with percentage spread.
- **Favorites** — Saved pairs via `localStorage`.
- **Loading Skeleton** — Animated cards while APIs respond.
- **Dark / Light Mode** — Toggle with smooth transitions.
- **PT / EN Language Switch** — All strings translated within `data.js`.
- **Color Customization** — Change the accent color of the entire dashboard.
- **Hamburger Menu** — Theme, language, and color settings in a clean side drawer.
- **Smart TOC** — Side navigation with scroll spy (for wide screens).
- **Responsive** — 2-column grid on mobile, top bar with horizontal scroll.
- **Responsivo** — grade de 2 colunas no mobile, topbar com scroll horizontal

## Screenshots

| CoinTrack | FX Dashboard |
| :---: | :---: |
| <img src="" alt="foto1" width="100%"/> | <img src="" alt="foto2" width="100%"/> 

## How to Run Locally

JS modules use `import`/`export` (Native ES Modules), which require an HTTP server:

```bash
# Node.js
npx serve .

# Python
python3 -m http.server 8080

# VS Code → Live Server extension → "Go Live"
```

> **Warning:** Opening `index.html` in `file://` will fail due to CORS restrictions on ES modules.

## APIs used

| Service | Data | Limit | Key |
|---------|-------|--------|-------|
| [Frankfurter](https://frankfurter.app) | Fiat rates (ECB) | No declared limit | No |
| [CoinGecko Public](https://www.coingecko.com/en/api) | Prices + crypto history | ~30 req/min | No |

Auto-refresh occurs every 60 seconds to respect free API rate limits.

## Stack

- Semantic HTML5
- Pure CSS with Custom Properties (No framework)
- JavaScript ES Modules (No bundler)
- [Chart.js 4](https://www.chartjs.org/)
- [Syne](https://fonts.google.com/specimen/Syne) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) Google Fonts

## Credits

Developed by **Victor Hasse** <br>
[![GitHub](https://img.shields.io/badge/victorhasse-181717?style=flat&logo=github)](https://github.com/victorhasse)

Academic and portfolio project — 2026



## License

This project is licensed under the MIT License.