/* ==========================================================================
   Pure DOM-rendering functions. Each function receives data and writes HTML.
   Funções de renderização pura do DOM. Cada função recebe dados e escreve HTML.
    ---------------------------------------------------------------------
    No state is stored here — all state lives in main.js.
    Nenhum estado é armazenado aqui - todo o estado vive em main.js.
   ========================================================================== */

import { getUSDPrice, formatNumber, ALL_ICONS, FIAT_META, CRYPTO_META } from './data.js';
import { drawMiniChart } from './chart.js';

const MOBILE_FIAT_INITIAL   = 3;
const MOBILE_CRYPTO_INITIAL = 2;

// ── TICKERS ──────────────────────────────────────────────────────────────────

export function renderTickers(prices, selectedAsset, onSelect, t) {
  const root     = document.getElementById('ticker-grid');
  const isMobile = window.innerWidth < 640;
  root.innerHTML = '';

  const fiatEntries   = Object.keys(FIAT_META)  .map(s => [s, prices[s]]).filter(([,v]) => v);
  const cryptoEntries = Object.keys(CRYPTO_META).map(s => [s, prices[s]]).filter(([,v]) => v);

  _renderGroup(root, t.fiatSection,   fiatEntries,   isMobile ? MOBILE_FIAT_INITIAL   : Infinity, selectedAsset, onSelect, t);
  _renderGroup(root, t.cryptoSection, cryptoEntries, isMobile ? MOBILE_CRYPTO_INITIAL : Infinity, selectedAsset, onSelect, t);
}

function _renderGroup(container, label, entries, initialCount, selectedAsset, onSelect, t) {
  if (!entries.length) return;
  const section = document.createElement('div');
  section.className = 'ticker-group';

  const header = document.createElement('div');
  header.className = 'ticker-group-label';
  header.textContent = label;
  section.appendChild(header);

  const visible = entries.slice(0, initialCount === Infinity ? entries.length : initialCount);
  const hidden  = entries.length > initialCount ? entries.slice(initialCount) : [];

  const visibleGrid = document.createElement('div');
  visibleGrid.className = 'cards-grid';
  visible.forEach(([sym, info]) => visibleGrid.appendChild(_makeCard(sym, info, selectedAsset, onSelect, t)));
  section.appendChild(visibleGrid);

  if (hidden.length) {
    const hiddenGrid = document.createElement('div');
    hiddenGrid.className = 'cards-grid hidden-cards';
    hidden.forEach(([sym, info]) => hiddenGrid.appendChild(_makeCard(sym, info, selectedAsset, onSelect, t)));
    section.appendChild(hiddenGrid);

    const btn = document.createElement('button');
    btn.className = 'see-more-btn';
    btn.textContent = `${t.seeMore} (${hidden.length})`;
    let expanded = false;
    btn.addEventListener('click', () => {
      expanded = !expanded;
      hiddenGrid.classList.toggle('expanded', expanded);
      btn.textContent = expanded ? t.seeLess : `${t.seeMore} (${hidden.length})`;
      if (expanded) {
        requestAnimationFrame(() => {
          hidden.forEach(([sym, info]) => {
            const c = document.getElementById(`mini-${sym}`);
            if (c) drawMiniChart(c, info.price, info.change24h >= 0);
          });
        });
      }
    });
    section.appendChild(btn);
  }

  container.appendChild(section);

  requestAnimationFrame(() => {
    visible.forEach(([sym, info]) => {
      const c = document.getElementById(`mini-${sym}`);
      if (c) drawMiniChart(c, info.price, info.change24h >= 0);
    });
  });
}

function _makeCard(sym, info, selectedAsset, onSelect, t) {
  const isUp = info.change24h >= 0;
  const card = document.createElement('div');
  card.className = 'ticker-card' + (sym === selectedAsset ? ' selected' : '');
  card.dataset.asset = sym;
  card.addEventListener('click', () => onSelect(sym));

  const priceLabel = info.isFiat
    ? `1 ${sym} = ${formatNumber(info.price)} USD`
    : `$${formatNumber(info.price)}`;

  card.innerHTML = `
    <div class="ticker-top">
      <div>
        <div class="ticker-symbol">${sym}</div>
        <div class="ticker-name">${info.name}</div>
      </div>
      <div class="ticker-icon"
           style="background:${info.color}22;color:${info.color};font-family:var(--font-display);font-weight:700;font-size:13px">
        ${info.icon}
      </div>
    </div>
    <div class="ticker-price">${priceLabel}</div>
    <span class="ticker-change ${isUp ? 'change-up' : 'change-down'}">
      ${isUp ? '▲' : '▼'} ${Math.abs(info.change24h).toFixed(2)}%
    </span>
    <div class="mini-chart">
      <canvas id="mini-${sym}" role="img" aria-label="${t.miniChart(sym)}"></canvas>
    </div>`;

  return card;
}

// ── CONVERTER ────────────────────────────────────────────────────────────────

export function convertCurrency(prices, t) {
  const amount  = parseFloat(document.getElementById('from-amount').value) || 0;
  const fromSym = document.getElementById('from-currency').value;
  const toSym   = document.getElementById('to-currency').value;

  const fromRate = getUSDPrice(fromSym, prices);
  const toRate   = getUSDPrice(toSym, prices);
  const result   = (amount * fromRate) / toRate;

  const fmt = result < 0.01 ? result.toFixed(8) : result < 1 ? result.toFixed(6) : formatNumber(result);
  document.getElementById('to-amount').value          = fmt;
  document.getElementById('result-value').textContent = fmt + ' ' + toSym;

  const unitRate = fromRate / toRate;
  const rateStr  = unitRate < 0.001 ? unitRate.toFixed(8) : unitRate.toFixed(6);
  document.getElementById('result-rate').textContent =
    `1 ${fromSym} = ${rateStr} ${toSym}  •  ${t.rateUpdated}`;
}

// ── ALERTS ───────────────────────────────────────────────────────────────────

export function renderAlerts(alerts, prices, onDelete, t) {
  const list = document.getElementById('alerts-list');
  if (!alerts.length) { list.innerHTML = `<div class="empty-state">${t.alertEmpty}</div>`; return; }

  list.innerHTML = alerts.map(a => {
    const current   = prices[a.asset]?.price ?? 0;
    const triggered = a.direction === 'above' ? current >= a.price : current <= a.price;
    const cls       = triggered ? (a.direction === 'above' ? 'triggered' : 'triggered-down') : '';
    return `
      <div class="alert-item ${cls}">
        <div>
          <div class="alert-symbol">${a.asset}</div>
          <div class="alert-target">${a.direction === 'above' ? t.alertAboveOf : t.alertBelowOf} $${formatNumber(a.price)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <span class="alert-status" style="color:${triggered ? 'var(--up)' : 'var(--text3)'}">
            ${triggered ? t.alertActive : t.alertWaiting}
          </span>
          <button class="delete-btn" data-id="${a.id}">×</button>
        </div>
      </div>`;
  }).join('');

  list.querySelectorAll('.delete-btn').forEach(btn =>
    btn.addEventListener('click', () => onDelete(Number(btn.dataset.id)))
  );
}

// ── ARBITRAGE ─────────────────────────────────────────────────────────────────

export function renderArbitrage(prices, t) {
  const body = document.getElementById('arb-body');
  const note = document.getElementById('arb-note');
  if (note) note.textContent = t.arbNote;

  body.innerHTML = ['BTC','ETH','SOL','BNB'].map(sym => {
    const base    = prices[sym]?.price ?? 0;
    const binance = base * (1 + (Math.random() - 0.5) * 0.006);
    const kraken  = base * (1 + (Math.random() - 0.5) * 0.006);
    const diff    = binance - kraken;
    const pct     = (diff / kraken * 100).toFixed(3);
    return `
      <tr>
        <td><strong style="font-family:var(--font-display)">${sym}</strong></td>
        <td><span class="exchange-badge">Binance</span><div style="font-size:12px;margin-top:4px">$${formatNumber(binance)}</div></td>
        <td><span class="exchange-badge">Kraken</span><div style="font-size:12px;margin-top:4px">$${formatNumber(kraken)}</div></td>
        <td class="${diff > 0 ? 'arb-diff-pos' : 'arb-diff-neg'}">${diff > 0 ? '+' : ''}${pct}%</td>
      </tr>`;
  }).join('');
}

// ── FAVORITES ─────────────────────────────────────────────────────────────────

export function renderFavorites(favorites, prices, onRemove, t) {
  const grid = document.getElementById('favorites-grid');
  let html = '';

  if (!favorites.length) {
    html += `<div class="empty-state" style="grid-column:1/-1">${t.favEmpty}</div>`;
  } else {
    html += favorites.map(f => {
      const [from, to] = f.pair.split('/');
      const rate = getUSDPrice(from, prices) / getUSDPrice(to, prices);
      const fmt  = rate < 0.001 ? rate.toFixed(8) : rate < 1 ? rate.toFixed(6) : formatNumber(rate);
      return `
        <div class="fav-card">
          <div style="font-size:18px">${ALL_ICONS[from] ?? from}</div>
          <div><div class="fav-pair">${f.pair}</div><div class="fav-rate">${fmt}</div></div>
          <button class="fav-remove" data-id="${f.id}">×</button>
        </div>`;
    }).join('');
  }

  html += `<button class="add-fav-btn" id="add-fav-scroll-btn">
    <span>+</span> ${t.addPair}
  </button>`;

  grid.innerHTML = html;
  grid.querySelector('#add-fav-scroll-btn')?.addEventListener('click', () =>
    document.getElementById('converter').scrollIntoView({ behavior: 'smooth' })
  );
  grid.querySelectorAll('.fav-remove').forEach(btn =>
    btn.addEventListener('click', () => onRemove(Number(btn.dataset.id)))
  );
}

// ── TOAST (Notificação) ──────────────────────────────────────────────────────────────────────

let _toastTimer;
export function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = `toast ${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

// ── i18n DOM PATCH ────────────────────────────────────────────────────────────

export function applyTranslations(t, locale) {
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
  const setAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el[attr] = val; };

  set('live-label',      t.liveLabel);
  set('refresh-label',   t.refreshBtn);
  set('nav-market',      t.navMarket);
  set('nav-chart',       t.navChart);
  set('nav-converter',   t.navConverter);
  set('nav-arbitrage',   t.navArbitrage);
  set('nav-alerts',      t.navAlerts);
  set('nav-favorites',   t.navFavorites);
  set('title-market',    t.titleMarket);
  set('title-chart',     t.titleChart);
  set('title-converter', t.titleConverter);
  set('title-alerts',    t.titleAlerts);
  set('title-arbitrage', t.titleArbitrage);
  set('title-favorites', t.titleFavorites);
  set('label-from',      t.labelFrom);
  set('label-to',        t.labelTo);
  set('add-fav-btn-label', t.addFavorite);
  set('menu-title',      t.settings);
  set('menu-lang-label', t.language);
  set('menu-theme-label-text', t.theme);
  set('menu-color-label', t.accent);
  set('color-modal-title', t.colorTitle);
  set('color-apply-btn', t.colorApply);
  setAttr('alert-price', 'placeholder', t.alertTarget);
  set('alert-above-opt', t.alertAbove);
  set('alert-below-opt', t.alertBelow);
  set('alert-create-btn', t.alertCreate);
  set('toc-market',    t.tocMarket);
  set('toc-chart',     t.tocChart);
  set('toc-converter', t.tocConverter);
  set('toc-alerts',    t.tocAlerts);
  set('toc-arbitrage', t.tocArbitrage);
  set('toc-favorites', t.tocFavorites);

  // Year labels per locale
  // Rótulos de ano por localidade
  const yr = locale === 'en' ? ['1Y','5Y'] : ['1A','5A'];
  document.querySelectorAll('.period-btn[data-period="1y"]').forEach(b => b.textContent = yr[0]);
  document.querySelectorAll('.period-btn[data-period="5y"]').forEach(b => b.textContent = yr[1]);

  // Theme label
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  set('theme-label', isDark ? t.themeLight : t.themeDark);
  set('menu-theme-value', isDark ? t.themeLight : t.themeDark);

  document.documentElement.lang = locale === 'en' ? 'en' : 'pt-BR';
}
