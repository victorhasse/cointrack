/* ==========================================================================
   Application entry point: state management, event wiring, lifecycle.
   ========================================================================== */

import {
  CRYPTO_BASE, simulatePrices, getUSDPrice, hexToRgb,
} from './data.js';
import { renderChart } from './chart.js';
import {
  renderTickers, convertCurrency, renderAlerts,
  renderArbitrage, renderFavorites, showToast,
} from './ui.js';

// ── STATE ─────────────────────────────────────────────────────────────────────

let prices        = {};
let selectedAsset = 'BTC';
let currentPeriod = '24h';
let chartColor    = localStorage.getItem('ctfx_color') || '#00e5a0';
let userAccent    = chartColor;
let alerts        = JSON.parse(localStorage.getItem('ctfx_alerts')     || '[]');
let favorites     = JSON.parse(localStorage.getItem('ctfx_favorites')  || '[]');

// ── HELPERS ───────────────────────────────────────────────────────────────────

function saveAlerts()    { localStorage.setItem('ctfx_alerts',    JSON.stringify(alerts)); }
function saveFavorites() { localStorage.setItem('ctfx_favorites', JSON.stringify(favorites)); }

function updateTimestamp() {
  document.getElementById('last-update').textContent =
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ── COLOR PICKER (SELETOR DE CORES) ───────────────────────────────────────────────────────────────

export function applyAccentColor(hex) {
  chartColor = hex;
  userAccent = hex;
  const { r, g, b } = hexToRgb(hex);
  document.documentElement.style.setProperty('--user-accent', hex);
  document.documentElement.style.setProperty('--user-accent-rgb', `${r},${g},${b}`);
  document.getElementById('color-swatch').style.background = hex;
  localStorage.setItem('ctfx_color', hex);
  renderChart(selectedAsset, prices, CRYPTO_BASE, currentPeriod, chartColor);
}

export function openColorModal()  { document.getElementById('color-modal').classList.add('show'); }
export function closeColorModal() { document.getElementById('color-modal').classList.remove('show'); }

export function applyPreset(hex) {
  applyAccentColor(hex);
  document.getElementById('hex-input').value = hex;
  document.querySelectorAll('.color-preset').forEach(p => {
    p.classList.toggle('active', p.style.background === hex);
  });
}

export function applyCustomColor() {
  const v = document.getElementById('hex-input').value;
  if (/^#[0-9a-fA-F]{6}$/.test(v)) {
    applyAccentColor(v);
    closeColorModal();
  }
}

// ── THEME (TEMAS) ──────────────────────────────────────────────────────────────

export function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-label').textContent = isDark ? 'Modo Escuro' : 'Modo Claro';
  setTimeout(() => renderChart(selectedAsset, prices, CRYPTO_BASE, currentPeriod, chartColor), 50);
}

// ── SIDEBAR (BARRA LATERAL) ────────────────────────────────────────────────────────────

export function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('mobile-overlay').classList.add('show');
}
export function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mobile-overlay').classList.remove('show');
}
export function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  setTimeout(closeSidebar, 150);
}

// ── CHART CONTROLS (CONTROLES DO GRÁFICO) ─────────────────────────────────────────────────────────────

export function setPeriod(period, btn) {
  currentPeriod = period;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderChart(selectedAsset, prices, CRYPTO_BASE, currentPeriod, chartColor);
}

// ── TICKER SELECTION (SELEÇÃO DO TICKER) ──────────────────────────────────────────────────────────

function selectAsset(sym) {
  selectedAsset = sym;
  document.querySelectorAll('.ticker-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`[data-asset="${sym}"]`)?.classList.add('selected');
  document.getElementById('chart-asset-label').textContent = sym + '/USD';
  renderChart(selectedAsset, prices, CRYPTO_BASE, currentPeriod, chartColor);
}

// ── CONVERTER (CONVERSOR) ─────────────────────────────────────────────────────────────────

export function swapCurrencies() {
  const fromSel = document.getElementById('from-currency');
  const toSel   = document.getElementById('to-currency');
  [fromSel.value, toSel.value] = [toSel.value, fromSel.value];
  convertCurrency(prices);
}

export function addToFavorites() {
  const from = document.getElementById('from-currency').value;
  const to   = document.getElementById('to-currency').value;
  const pair = `${from}/${to}`;

  if (favorites.find(f => f.pair === pair)) {
    showToast('Par já está nos favoritos');
    return;
  }

  favorites.push({ pair, id: Date.now() });
  saveFavorites();
  renderFavorites(favorites, prices, removeFavorite);
  showToast('Par adicionado aos favoritos ★', 'success');
}

function removeFavorite(id) {
  favorites = favorites.filter(f => f.id !== id);
  saveFavorites();
  renderFavorites(favorites, prices, removeFavorite);
}

// ── ALERTS (ALERTAS) ───────────────────────────────────────────────────────────────────

export function addAlert() {
  const asset     = document.getElementById('alert-asset').value;
  const price     = parseFloat(document.getElementById('alert-price').value);
  const direction = document.getElementById('alert-direction').value;

  if (!price) {
    showToast('Insira um preço alvo', 'error');
    return;
  }

  alerts.push({ asset, price, direction, id: Date.now() });
  saveAlerts();
  renderAlerts(alerts, prices, deleteAlert);
  document.getElementById('alert-price').value = '';
  const label = direction === 'above' ? 'acima de' : 'abaixo de';
  showToast(`Alerta criado: ${asset} ${label} $${price.toLocaleString()}`);
}

function deleteAlert(id) {
  alerts = alerts.filter(a => a.id !== id);
  saveAlerts();
  renderAlerts(alerts, prices, deleteAlert);
}

function checkAlerts() {
  alerts.forEach(a => {
    const current   = (prices[a.asset] ?? {}).price ?? 0;
    const triggered = a.direction === 'above' ? current >= a.price : current <= a.price;
    if (triggered && !a._notified) {
      a._notified = true;
      const label = a.direction === 'above' ? 'superou' : 'caiu abaixo de';
      showToast(`🔔 ${a.asset} ${label} $${a.price.toLocaleString()}!`, 'alert-trigger');
    }
  });
}

// ── TOC SCROLL SPY (SELETOR DE NAVEGAÇÃO POR ROLAGEM) ────────────────────────────────────────────────────────────

function updateToc() {
  const sectionIds = ['market', 'chart-section', 'converter', 'alerts', 'arbitrage', 'favorites'];
  let current = sectionIds[0];

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) current = id;
  });

  document.querySelectorAll('.toc-item').forEach((item, i) => {
    item.classList.toggle('active', sectionIds[i] === current);
  });
}

// ── REFRESH ───────────────────────────────────────────────────────────────────

function refreshData() {
  const icon = document.getElementById('refresh-icon');
  icon.classList.add('spinning');

  prices = simulatePrices();

  renderTickers(prices, selectedAsset, sym => {
    selectedAsset = sym;
    document.getElementById('chart-asset-label').textContent = sym + '/USD';
    renderChart(selectedAsset, prices, CRYPTO_BASE, currentPeriod, chartColor);
  });

  renderChart(selectedAsset, prices, CRYPTO_BASE, currentPeriod, chartColor);
  renderArbitrage(prices);
  renderFavorites(favorites, prices, removeFavorite);
  renderAlerts(alerts, prices, deleteAlert);
  checkAlerts();
  convertCurrency(prices);
  updateTimestamp();

  setTimeout(() => icon.classList.remove('spinning'), 600);
}

// ── INIT (INICIALIZAÇÃO) ───────────────────────────────────────────────────────────────────────

function init() {
  // Apply saved accent colour
  applyAccentColor(chartColor);

  // Initial data
  prices = simulatePrices();

  // Render all sections
  renderTickers(prices, selectedAsset, sym => {
    selectedAsset = sym;
    document.getElementById('chart-asset-label').textContent = sym + '/USD';
    renderChart(selectedAsset, prices, CRYPTO_BASE, currentPeriod, chartColor);
  });
  renderChart(selectedAsset, prices, CRYPTO_BASE, currentPeriod, chartColor);
  renderArbitrage(prices);
  renderFavorites(favorites, prices, removeFavorite);
  renderAlerts(alerts, prices, deleteAlert);
  convertCurrency(prices);
  updateTimestamp();

  // Event listeners
  document.getElementById('from-amount')  .addEventListener('input',  () => convertCurrency(prices));
  document.getElementById('from-currency').addEventListener('change', () => convertCurrency(prices));
  document.getElementById('to-currency')  .addEventListener('change', () => convertCurrency(prices));

  window.addEventListener('scroll', updateToc, { passive: true });

  // Auto-refresh every 30 s
  setInterval(refreshData, 30_000);

  Object.assign(window, {
    toggleTheme, openSidebar, closeSidebar, setActive,
    openColorModal, closeColorModal, applyPreset, applyCustomColor,
    setPeriod, swapCurrencies, addToFavorites, addAlert, refreshData,
  });
}

window.addEventListener('load', init);
