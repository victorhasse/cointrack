/* ==========================================================================
   Pure DOM-rendering functions. Each function receives data and writes HTML.
   Funções de renderização pura do DOM. Cada função recebe dados e escreve HTML.
    ---------------------------------------------------------------------
    No state is stored here — all state lives in main.js.
    Nenhum estado é armazenado aqui - todo o estado vive em main.js.
   ========================================================================== */

import { getUSDPrice, formatNumber, CRYPTO_ICONS } from './data.js';
import { drawMiniChart } from './chart.js';

// ── TICKER CARDS ─────────────────────────────────────────────────────────────

/**
 * Renders the market-overview ticker grid.
 * Renderiza a grade de visão geral do mercado.
 *
 * @param {object}  prices       – preços atuais
 * @param {string}  selectedAsset
 * @param {Function} onSelect    – callback(sym) para quando um ticker é clicado
 */
export function renderTickers(prices, selectedAsset, onSelect) {
  const grid = document.getElementById('ticker-grid');
  grid.innerHTML = '';

  for (const [sym, info] of Object.entries(prices)) {
    const isUp = info.change24h >= 0;
    const card = document.createElement('div');
    card.className = 'ticker-card' + (sym === selectedAsset ? ' selected' : '');
    card.addEventListener('click', () => onSelect(sym));

    card.innerHTML = `
      <div class="ticker-top">
        <div>
          <div class="ticker-symbol">${sym}</div>
          <div class="ticker-name">${info.name}</div>
        </div>
        <div class="ticker-icon"
             style="background:${info.color}20;color:${info.color};
                    font-family:var(--font-display);font-weight:700">
          ${info.icon}
        </div>
      </div>
      <div class="ticker-price">$${formatNumber(info.price)}</div>
      <span class="ticker-change ${isUp ? 'change-up' : 'change-down'}">
        ${isUp ? '▲' : '▼'} ${Math.abs(info.change24h).toFixed(2)}%
      </span>
      <div class="mini-chart">
        <canvas id="mini-${sym}"
                role="img"
                aria-label="Mini gráfico ${sym}"></canvas>
      </div>`;

    grid.appendChild(card);

    // Draw sparkline after the canvas is in the DOM
    // Desenha o gráfico depois que o canvas está no DOM
    requestAnimationFrame(() => {
      const canvas = document.getElementById(`mini-${sym}`);
      if (canvas) drawMiniChart(canvas, info.price, isUp);
    });
  }
}

// ── CONVERTER ────────────────────────────────────────────────────────────────

/**
 * Reads the converter form, computes the result and updates the DOM.
 * Lê o formulário do conversor, calcula o resultado e atualiza o DOM.
 * @param {object} prices – preços atuais
 */
export function convertCurrency(prices) {
  const amount   = parseFloat(document.getElementById('from-amount').value) || 0;
  const fromSym  = document.getElementById('from-currency').value;
  const toSym    = document.getElementById('to-currency').value;

  const fromRate = getUSDPrice(fromSym, prices);
  const toRate   = getUSDPrice(toSym,   prices);
  const result   = (amount * fromRate) / toRate;

  const fmt = result < 0.01
    ? result.toFixed(8)
    : result < 1
      ? result.toFixed(4)
      : formatNumber(result);

  document.getElementById('to-amount').value    = fmt;
  document.getElementById('result-value').textContent = fmt + ' ' + toSym;

  const unitRate = fromRate / toRate;
  const rateStr  = unitRate < 0.001
    ? unitRate.toFixed(8)
    : unitRate.toFixed(4);
  document.getElementById('result-rate').textContent =
    `1 ${fromSym} = ${rateStr} ${toSym}  •  Taxa atualizada agora`;
}

// ── ALERTS (ALERTAS) ───────────────────────────────────────────────────────────────────

/**
 * Renders the alerts list.
 * Renderiza a lista de alertas.
 *
 * @param {Array}    alerts  – array de alertas { asset, price, direction, id }
 * @param {object}   prices
 * @param {Function} onDelete – callback(id)
 */
export function renderAlerts(alerts, prices, onDelete) {
  const list = document.getElementById('alerts-list');

  if (!alerts.length) {
    list.innerHTML = '<div class="empty-state">Nenhum alerta criado</div>';
    return;
  }

  list.innerHTML = alerts.map(a => {
    const current   = (prices[a.asset] ?? {}).price ?? 0;
    const triggered = a.direction === 'above' ? current >= a.price : current <= a.price;
    const cls       = triggered
      ? (a.direction === 'above' ? 'triggered' : 'triggered-down')
      : '';

    return `
      <div class="alert-item ${cls}">
        <div>
          <div class="alert-symbol">${a.asset}</div>
          <div class="alert-target">
            ${a.direction === 'above' ? '↑ Acima de' : '↓ Abaixo de'}
            $${formatNumber(a.price)}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <span class="alert-status"
                style="color:${triggered ? 'var(--up)' : 'var(--text3)'}">
            ${triggered ? '● ATIVO' : '○ aguardando'}
          </span>
          <button class="delete-btn" data-id="${a.id}">×</button>
        </div>
      </div>`;
  }).join('');

  // Attach delete handlers
  // Anexa manipuladores de exclusão
  list.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => onDelete(Number(btn.dataset.id)));
  });
}

// ── ARBITRAGE ─────────────────────────────────────────────────────────────────

/**
 * Renders the simulated arbitrage table.
 * Renderiza a tabela de arbitragem simulada.
 * @param {object} prices
 */
export function renderArbitrage(prices) {
  const body   = document.getElementById('arb-body');
  const assets = ['BTC', 'ETH', 'SOL', 'BNB'];

  body.innerHTML = assets.map(sym => {
    const base    = (prices[sym] ?? {}).price ?? 0;
    const binance = base * (1 + (Math.random() - 0.5) * 0.006);
    const kraken  = base * (1 + (Math.random() - 0.5) * 0.006);
    const diff    = binance - kraken;
    const pct     = (diff / kraken * 100).toFixed(3);
    const sign    = diff > 0 ? '+' : '';

    return `
      <tr>
        <td><strong style="font-family:var(--font-display)">${sym}</strong></td>
        <td>
          <span class="exchange-badge">Binance</span>
          <div style="font-size:12px;margin-top:4px">$${formatNumber(binance)}</div>
        </td>
        <td>
          <span class="exchange-badge">Kraken</span>
          <div style="font-size:12px;margin-top:4px">$${formatNumber(kraken)}</div>
        </td>
        <td class="${diff > 0 ? 'arb-diff-pos' : 'arb-diff-neg'}">
          ${sign}${pct}%
        </td>
      </tr>`;
  }).join('');
}

// ── FAVORITES (FAVORITOS) ─────────────────────────────────────────────────────────────────

/**
 * Renders the favorites grid.
 * Renderiza a grade de favoritos.
 *
 * @param {Array}    favorites
 * @param {object}   prices
 * @param {Function} onRemove – callback(id)
 */
export function renderFavorites(favorites, prices, onRemove) {
  const grid = document.getElementById('favorites-grid');

  let html = '';

  if (!favorites.length) {
    html += `<div class="empty-state" style="grid-column:1/-1">
               Nenhum favorito salvo. Use o conversor para adicionar.
             </div>`;
  } else {
    html += favorites.map(f => {
      const [from, to] = f.pair.split('/');
      const rate = getUSDPrice(from, prices) / getUSDPrice(to, prices);
      const fmt  = rate < 0.001
        ? rate.toFixed(8)
        : rate < 1
          ? rate.toFixed(4)
          : formatNumber(rate);

      return `
        <div class="fav-card">
          <div style="font-size:20px">${CRYPTO_ICONS[from] ?? from}</div>
          <div>
            <div class="fav-pair">${f.pair}</div>
            <div class="fav-rate">${fmt}</div>
          </div>
          <button class="fav-remove" data-id="${f.id}">×</button>
        </div>`;
    }).join('');
  }

  html += `<button class="add-fav-btn" id="add-fav-scroll-btn">
             <span style="font-size:18px">+</span> Adicionar Par
           </button>`;

  grid.innerHTML = html;

  // Scroll to converter on "add" button
  // Rolar para o conversor no botão "adicionar"
  grid.querySelector('#add-fav-scroll-btn')?.addEventListener('click', () => {
    document.getElementById('converter').scrollIntoView({ behavior: 'smooth' });
  });

  // Attach remove handlers
  // Anexa manipuladores de remoção
  grid.querySelectorAll('.fav-remove').forEach(btn => {
    btn.addEventListener('click', () => onRemove(Number(btn.dataset.id)));
  });
}

// ── TOAST (NOTIFICAÇÕES) ──────────────────────────────────────────────────────────────────────

let _toastTimer;

/**
 * Shows a transient notification toast.
 * Mostra uma notificação transitória.
 * @param {string} msg
 * @param {'success'|'alert-trigger'|'error'} type
 */
export function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = `toast ${type} show`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}
