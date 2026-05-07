/* ==========================================================================
   Application entry point: state management, event wiring, lifecycle.
   (Aplication entry point: gerenciamento de estado, ligação de eventos, ciclo de vida).
   ========================================================================== */

import {
  fetchPrices, getUSDPrice, hexToRgb, TRANSLATIONS, FIAT_META, CRYPTO_META,
} from './data.js';
import { renderChart } from './chart.js';
import {
  renderTickers, convertCurrency, renderAlerts,
  renderArbitrage, renderFavorites, showToast, applyTranslations,
} from './ui.js';

// ── STATE ─────────────────────────────────────────────────────────────────────

let prices        = {};
let selectedAsset = 'USD';
let currentPeriod = '1d';
let chartColor    = localStorage.getItem('ctfx_color')   || '#00e5a0';
let locale        = localStorage.getItem('ctfx_locale')  || 'pt-BR';
let alerts        = JSON.parse(localStorage.getItem('ctfx_alerts')    || '[]');
let favorites     = JSON.parse(localStorage.getItem('ctfx_favorites') || '[]');
let isLoading     = false;

const t = () => TRANSLATIONS[locale] ?? TRANSLATIONS['pt-BR'];

// ── STORAGE (Armazenamento) ────────────────────────────────────────────────────────────────────

function saveAlerts()    { localStorage.setItem('ctfx_alerts',    JSON.stringify(alerts)); }
function saveFavorites() { localStorage.setItem('ctfx_favorites', JSON.stringify(favorites)); }

// ── HELPERS (Funções Auxiliares) ───────────────────────────────────────────────────────────────────

function updateTimestamp() {
  const el = document.getElementById('last-update');
  if (el) el.textContent = new Date().toLocaleTimeString(
    locale === 'en' ? 'en-US' : 'pt-BR',
    { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  );
}

function setLoading(v) {
  isLoading = v;
  document.getElementById('refresh-icon')?.classList.toggle('spinning', v);
}

function doRenderAll() {
  const tr = t();
  renderTickers(prices, selectedAsset, selectAsset, tr);
  renderChart(selectedAsset, prices, currentPeriod, chartColor, locale);
  renderArbitrage(prices, tr);
  renderFavorites(favorites, prices, removeFavorite, tr);
  renderAlerts(alerts, prices, deleteAlert, tr);
  convertCurrency(prices, tr);
}

// ── HAMBURGER MENU ────────────────────────────────────────────────────────────

export function openMenu() {
  document.getElementById('settings-menu')?.classList.add('open');
  document.getElementById('menu-overlay')?.classList.add('show');
}

export function closeMenu() {
  document.getElementById('settings-menu')?.classList.remove('open');
  document.getElementById('menu-overlay')?.classList.remove('show');
}

// ── i18n (Internacionalização) ──────────────────────────────────────────────────────────────────────

export function toggleLocale() {
  locale = locale === 'pt-BR' ? 'en' : 'pt-BR';
  localStorage.setItem('ctfx_locale', locale);
  _syncLangBtns();
  applyTranslations(t(), locale);
  doRenderAll();
}

function _syncLangBtns() {
  const label = locale === 'pt-BR' ? '🇺🇸 EN' : '🇧🇷 PT';
  ['lang-btn', 'menu-lang-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = label;
  });
}

// ── COLOR ─────────────────────────────────────────────────────────────────────

export function applyAccentColor(hex) {
  chartColor = hex;
  const { r, g, b } = hexToRgb(hex);
  document.documentElement.style.setProperty('--user-accent', hex);
  document.documentElement.style.setProperty('--user-accent-rgb', `${r},${g},${b}`);
  ['color-swatch-topbar', 'color-swatch-chart', 'menu-color-swatch'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.background = hex;
  });
  localStorage.setItem('ctfx_color', hex);
  renderChart(selectedAsset, prices, currentPeriod, chartColor, locale);
}

export function openColorModal()  { closeMenu(); document.getElementById('color-modal')?.classList.add('show'); }
export function closeColorModal() { document.getElementById('color-modal')?.classList.remove('show'); }

export function applyPreset(hex) {
  applyAccentColor(hex);
  const inp = document.getElementById('hex-input');
  if (inp) inp.value = hex;
  document.querySelectorAll('.color-preset').forEach(p =>
    p.classList.toggle('active', p.dataset.color === hex)
  );
}

export function applyCustomColor() {
  const v = document.getElementById('hex-input')?.value ?? '';
  if (/^#[0-9a-fA-F]{6}$/.test(v)) { applyAccentColor(v); closeColorModal(); }
}

// ── THEME ─────────────────────────────────────────────────────────────────────

export function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  const tr = t();
  const label = isDark ? tr.themeDark : tr.themeLight;
  ['theme-label', 'menu-theme-value'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = label;
  });
  setTimeout(() => renderChart(selectedAsset, prices, currentPeriod, chartColor, locale), 50);
}

// ── CHART (Gráfico) ──────────────────────────────────────────────────────────────────────

export function setPeriod(period, btn) {
  currentPeriod = period;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderChart(selectedAsset, prices, currentPeriod, chartColor, locale);
}

function selectAsset(sym) {
  selectedAsset = sym;
  document.querySelectorAll('.ticker-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`[data-asset="${sym}"]`)?.classList.add('selected');
  const lbl = document.getElementById('chart-asset-label');
  if (lbl) lbl.textContent = sym + '/USD';
  renderChart(selectedAsset, prices, currentPeriod, chartColor, locale);
}

// ── CONVERTER ────────────────────────────────────────────────────────────────

export function swapCurrencies() {
  const from = document.getElementById('from-currency');
  const to   = document.getElementById('to-currency');
  [from.value, to.value] = [to.value, from.value];
  convertCurrency(prices, t());
}

export function addToFavorites() {
  const from = document.getElementById('from-currency').value;
  const to   = document.getElementById('to-currency').value;
  const pair = `${from}/${to}`;
  const tr   = t();
  if (favorites.find(f => f.pair === pair)) { showToast(tr.alreadyFav); return; }
  favorites.push({ pair, id: Date.now() });
  saveFavorites();
  renderFavorites(favorites, prices, removeFavorite, tr);
  showToast(tr.favAdded, 'success');
}

function removeFavorite(id) {
  favorites = favorites.filter(f => f.id !== id);
  saveFavorites();
  renderFavorites(favorites, prices, removeFavorite, t());
}

// ── ALERTS ───────────────────────────────────────────────────────────────────

export function addAlert() {
  const asset     = document.getElementById('alert-asset').value;
  const price     = parseFloat(document.getElementById('alert-price').value);
  const direction = document.getElementById('alert-direction').value;
  const tr        = t();
  if (!price) { showToast(tr.alertErrorPrice, 'error'); return; }
  alerts.push({ asset, price, direction, id: Date.now() });
  saveAlerts();
  renderAlerts(alerts, prices, deleteAlert, tr);
  document.getElementById('alert-price').value = '';
  const dir = direction === 'above' ? tr.alertAboveDir : tr.alertBelowDir;
  showToast(tr.alertCreated(asset, dir, price.toLocaleString()));
}

function deleteAlert(id) {
  alerts = alerts.filter(a => a.id !== id);
  saveAlerts();
  renderAlerts(alerts, prices, deleteAlert, t());
}

function checkAlerts() {
  const tr = t();
  alerts.forEach(a => {
    const current   = prices[a.asset]?.price ?? 0;
    const triggered = a.direction === 'above' ? current >= a.price : current <= a.price;
    if (triggered && !a._notified) {
      a._notified = true;
      const dir = a.direction === 'above' ? tr.alertSurpassed : tr.alertBelowDir;
      showToast(`🔔 ${a.asset} ${dir} $${a.price.toLocaleString()}!`, 'alert-trigger');
    }
  });
}

// ── TOC SCROLL SPY (Spy de Rolagem do TOC) ─────────────────────────────────────────────────────────────

function updateToc() {
  const ids = ['market','chart-section','converter','alerts','arbitrage','favorites'];
  let current = ids[0];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 80) current = id;
  });
  document.querySelectorAll('.toc-item').forEach((item, i) =>
    item.classList.toggle('active', ids[i] === current)
  );
}

// ── REFRESH ───────────────────────────────────────────────────────────────────

function _apiErrorHandler(source, err) {
  const label = source === 'fiat' ? 'Frankfurter' : 'CoinGecko';
  console.error(`[CryptoTrack] ${label} falhou:`, err?.message ?? err);
  console.warn('[CryptoTrack] Abra diagnostico.html para diagnóstico detalhado.');
}

export async function refreshData() {
  if (isLoading) return;
  setLoading(true);
  const errorSources = new Set();
  prices = await fetchPrices((src, err) => { errorSources.add(src); _apiErrorHandler(src, err); });
  if (errorSources.size > 0) showToast(t().errorApi, 'error');
  doRenderAll();
  checkAlerts();
  updateTimestamp();
  setLoading(false);
}

// ── INIT (Inicialização) ───────────────────────────────────────────────────────────────────────

async function init() {
  _syncLangBtns();
  applyAccentColor(chartColor);
  applyTranslations(t(), locale);

  document.getElementById('menu-overlay')?.addEventListener('click', closeMenu);

  document.querySelectorAll('.nav-item').forEach(el =>
    el.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      el.classList.add('active');
    })
  );

  document.getElementById('from-amount')  ?.addEventListener('input',  () => convertCurrency(prices, t()));
  document.getElementById('from-currency')?.addEventListener('change', () => convertCurrency(prices, t()));
  document.getElementById('to-currency')  ?.addEventListener('change', () => convertCurrency(prices, t()));

  window.addEventListener('scroll', updateToc, { passive: true });

  setLoading(true);
  const initErrors = new Set();
  prices = await fetchPrices((src, err) => { initErrors.add(src); _apiErrorHandler(src, err); });
  if (initErrors.size > 0) showToast(t().errorApi, 'error');
  doRenderAll();
  updateTimestamp();
  setLoading(false);

  // Auto-refresh every 60s (polite to free APIs)
  // Atualiza automaticamente a cada 60s (educado para APIs gratuitas)
  setInterval(refreshData, 60_000);

  Object.assign(window, {
    toggleTheme, toggleLocale,
    openColorModal, closeColorModal, applyPreset, applyCustomColor,
    setPeriod, swapCurrencies, addToFavorites, addAlert, refreshData,
    openMenu, closeMenu,
  });
}

window.addEventListener('load', init);