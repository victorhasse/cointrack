/* ==========================================================================
   Mock data layer. Replace the functions below with real API calls,
   without touching the rest of the app.
    ---------------------------------------------------------------------
    Camada de dados simulados. Substitui as funções abaixo por chamadas reais
    de API, sem tocar no restante do aplicativo.
   ========================================================================== */

// ── i18n (TRADUÇÃO) ─────────────────────────────────────────────────────

export const TRANSLATIONS = {
  'pt-BR': {
    liveLabel:      'TEMPO REAL',
    refreshBtn:     'Atualizar',
    navMarket:      'Mercado',
    navChart:       'Gráfico',
    navConverter:   'Conversor',
    navArbitrage:   'Arbitragem',
    navAlerts:      'Alertas',
    navFavorites:   'Favoritos',
    titleMarket:    'Visão Geral do Mercado',
    titleChart:     'Variação Histórica',
    titleConverter: 'Conversor Híbrido',
    titleAlerts:    'Alertas de Preço',
    titleArbitrage: 'Arbitragem Simulada',
    titleFavorites: 'Favoritos',
    labelFrom:      'De',
    labelTo:        'Para',
    rateUpdated:    'Taxa atualizada agora',
    addFavorite:    '★ Adicionar par aos Favoritos',
    alertAbove:     'Acima',
    alertBelow:     'Abaixo',
    alertCreate:    '+ Criar Alerta',
    alertAboveOf:   '↑ Acima de',
    alertBelowOf:   '↓ Abaixo de',
    alertActive:    '● ATIVO',
    alertWaiting:   '○ aguardando',
    alertEmpty:     'Nenhum alerta criado',
    alertTarget:    'Preço alvo (USD)',
    alertCreated:   (a, d, p) => `Alerta criado: ${a} ${d} $${p}`,
    alertAboveDir:  'acima de',
    alertBelowDir:  'caiu abaixo de',
    alertSurpassed: 'superou',
    alertErrorPrice:'Insira um preço alvo',
    alreadyFav:     'Par já está nos favoritos',
    favAdded:       'Par adicionado ★',
    favEmpty:       'Nenhum favorito. Use o conversor para adicionar.',
    addPair:        '+ Adicionar Par',
    arbAsset:       'Ativo',
    arbExchA:       'Exchange A',
    arbExchB:       'Exchange B',
    arbSpread:      'Δ Spread',
    arbNote:        'Spreads simulados para demonstração',
    tocMarket:      'Mercado',
    tocChart:       'Gráfico',
    tocConverter:   'Conversor',
    tocAlerts:      'Alertas',
    tocArbitrage:   'Arbitragem',
    tocFavorites:   'Favoritos',
    themeLight:     'Modo Claro',
    themeDark:      'Modo Escuro',
    colorTitle:     'Personalizar Cor',
    colorApply:     'Aplicar',
    settings:       'Configurações',
    language:       'Idioma',
    theme:          'Tema',
    accent:         'Cor de destaque',
    miniChart:      s => `Mini gráfico ${s}`,
    chartAria:      'Gráfico de variação histórica de preço',
    loading:        'Carregando...',
    fiatSection:    'Moedas Fiduciárias',
    cryptoSection:  'Criptomoedas',
    seeMore:        'Ver mais',
    seeLess:        'Ver menos',
    errorApi:       'Erro ao buscar dados. Usando valores em cache.',
  },
  'en': {
    liveLabel:      'LIVE',
    refreshBtn:     'Refresh',
    navMarket:      'Market',
    navChart:       'Chart',
    navConverter:   'Converter',
    navArbitrage:   'Arbitrage',
    navAlerts:      'Alerts',
    navFavorites:   'Favorites',
    titleMarket:    'Market Overview',
    titleChart:     'Price History',
    titleConverter: 'Hybrid Converter',
    titleAlerts:    'Price Alerts',
    titleArbitrage: 'Simulated Arbitrage',
    titleFavorites: 'Favorites',
    labelFrom:      'From',
    labelTo:        'To',
    rateUpdated:    'Rate updated now',
    addFavorite:    '★ Add pair to Favorites',
    alertAbove:     'Above',
    alertBelow:     'Below',
    alertCreate:    '+ Create Alert',
    alertAboveOf:   '↑ Above',
    alertBelowOf:   '↓ Below',
    alertActive:    '● ACTIVE',
    alertWaiting:   '○ waiting',
    alertEmpty:     'No alerts created',
    alertTarget:    'Target price (USD)',
    alertCreated:   (a, d, p) => `Alert created: ${a} ${d} $${p}`,
    alertAboveDir:  'above',
    alertBelowDir:  'dropped below',
    alertSurpassed: 'surpassed',
    alertErrorPrice:'Enter a target price',
    alreadyFav:     'Pair already in favorites',
    favAdded:       'Pair added ★',
    favEmpty:       'No favorites. Use the converter to add.',
    addPair:        '+ Add Pair',
    arbAsset:       'Asset',
    arbExchA:       'Exchange A',
    arbExchB:       'Exchange B',
    arbSpread:      'Δ Spread',
    arbNote:        'Simulated spreads for demonstration',
    tocMarket:      'Market',
    tocChart:       'Chart',
    tocConverter:   'Converter',
    tocAlerts:      'Alerts',
    tocArbitrage:   'Arbitrage',
    tocFavorites:   'Favorites',
    themeLight:     'Light Mode',
    themeDark:      'Dark Mode',
    colorTitle:     'Customize Color',
    colorApply:     'Apply',
    settings:       'Settings',
    language:       'Language',
    theme:          'Theme',
    accent:         'Accent color',
    miniChart:      s => `Mini chart ${s}`,
    chartAria:      'Historical price variation chart',
    loading:        'Loading...',
    fiatSection:    'Fiat Currencies',
    cryptoSection:  'Cryptocurrencies',
    seeMore:        'See more',
    seeLess:        'See less',
    errorApi:       'Failed to fetch data. Using cached values.',
  },
};

// ── STATIC METADATA - icons, colors, never changes (METADADOS ESTÁTICOS - icones, cores, nunca mudam) ──────────────────────────

export const FIAT_META = {
  USD: { name: 'US Dollar',       icon: '$',  color: '#22c55e' },
  EUR: { name: 'Euro',            icon: '€',  color: '#3b82f6' },
  GBP: { name: 'British Pound',   icon: '£',  color: '#8b5cf6' },
  BRL: { name: 'Real Brasileiro', icon: 'R$', color: '#f59e0b' },
  JPY: { name: 'Japanese Yen',    icon: '¥',  color: '#ef4444' },
  CAD: { name: 'Canadian Dollar', icon: 'C$', color: '#06b6d4' },
};

export const CRYPTO_META = {
  BTC: { name: 'Bitcoin',  icon: '₿', color: '#f7931a', cgId: 'bitcoin'   },
  ETH: { name: 'Ethereum', icon: 'Ξ', color: '#627eea', cgId: 'ethereum'  },
  SOL: { name: 'Solana',   icon: '◎', color: '#9945ff', cgId: 'solana'    },
  BNB: { name: 'BNB',      icon: 'B', color: '#f3ba2f', cgId: 'binancecoin' },
};

export const ALL_ICONS = {
  USD:'$', EUR:'€', GBP:'£', BRL:'R$', JPY:'¥', CAD:'C$',
  BTC:'₿', ETH:'Ξ', SOL:'◎', BNB:'◈',
};

// ── FALLBACK PRICES - used if APIs fail - (PREÇOS DE RESERVA - usados se APIs falharem) ──────────────────────────────────────

const FALLBACK = {
  USD: { price: 1,       change24h:  0.00, isFiat: true  },
  EUR: { price: 1.087,   change24h:  0.12, isFiat: true  },
  GBP: { price: 1.270,   change24h: -0.08, isFiat: true  },
  BRL: { price: 0.174,   change24h: -0.34, isFiat: true  },
  JPY: { price: 0.0067,  change24h:  0.21, isFiat: true  },
  CAD: { price: 0.740,   change24h:  0.09, isFiat: true  },
  BTC: { price: 96800,   change24h:  2.34, isFiat: false },
  ETH: { price: 3240,    change24h: -1.12, isFiat: false },
  SOL: { price: 178,     change24h:  4.67, isFiat: false },
  BNB: { price: 612,     change24h:  0.89, isFiat: false },
};

// ── PRICE FETCHING ────────────────────────────────────────────────────────────
//
// using CoinGecko for EVERYTHING — it has CORS headers open for all
// origins (including localhost and file://) and generous rate limits (50-100 calls/minute). No need for a backend proxy.
//
// Fiat rates come from CoinGecko /exchange_rates which returns each currency
// value relative to BTC. We convert: price_in_USD = btc_price / fiat_btc_rate.
//
// Crypto prices come from the usual /simple/price endpoint

async function _fetch(url, { timeoutMs = 8000, retries = 1 } = {}) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      if (res.status === 429) {
        const wait = parseInt(res.headers.get('Retry-After') ?? '61', 10) * 1000;
        console.warn(`[CryptoTrack] Rate limited. Waiting ${Math.round(wait/1000)}s…`);
        if (attempt < retries) { await new Promise(r => setTimeout(r, Math.min(wait, 12000))); continue; }
        throw new Error(`HTTP 429 — rate limit`);
      }
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${body.slice(0, 120)}`);
      }
      return res;
    } catch (err) {
      clearTimeout(timer);
      if (err.name === 'AbortError') throw new Error(`Timeout após ${timeoutMs}ms`);
      throw err;
    }
  }
}

/**
 * Fetches fiat exchange rates using CoinGecko /exchange_rates.
 * That endpoint returns how many units of each fiat = 1 BTC.
 * We also fetch the BTC/USD price to convert everything to USD.
 *
 * Returns { USD: 1, EUR: 1.087, BRL: 0.174, ... }
 */
async function fetchFiatRates() {
  // Fetch both in parallel: BTC price in USD + all fiat/BTC rates
  const [priceRes, ratesRes] = await Promise.all([
    _fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
    _fetch('https://api.coingecko.com/api/v3/exchange_rates'),
  ]);

  const priceData = await priceRes.json();
  const ratesData = await ratesRes.json();

  const btcUsd   = priceData?.bitcoin?.usd;
  const cgRates  = ratesData?.rates;

  if (!btcUsd || !cgRates) throw new Error('CoinGecko exchange_rates: resposta inválida');

  // cgRates[sym].value = units of sym per 1 BTC
  // So 1 USD in BTC = 1 / cgRates.usd.value
  // And 1 EUR in USD = cgRates.usd.value / cgRates.eur.value
  const usdPerBtc = cgRates['usd']?.value;
  if (!usdPerBtc) throw new Error('USD rate not found in exchange_rates');

  const FIAT_CG_KEYS = { USD: 'usd', EUR: 'eur', GBP: 'gbp', BRL: 'brl', JPY: 'jpy', CAD: 'cad' };

  const out = { USD: 1 };
  for (const [sym, cgKey] of Object.entries(FIAT_CG_KEYS)) {
    if (sym === 'USD') continue;
    const val = cgRates[cgKey]?.value;
    if (val) out[sym] = usdPerBtc / val;  // USD value of 1 unit of sym
  }

  console.info('[CryptoTrack] Fiat rates via CoinGecko OK:', out);
  return out;
}

async function fetchCryptoPrices() {
  const ids  = Object.values(CRYPTO_META).map(m => m.cgId).join(',');
  const url  = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const res  = await _fetch(url, { retries: 1 });
  const data = await res.json();
  const out  = {};
  for (const [sym, meta] of Object.entries(CRYPTO_META)) {
    const raw = data[meta.cgId];
    if (raw) out[sym] = { price: raw.usd, change24h: raw.usd_24h_change ?? 0 };
  }
  if (!Object.keys(out).length) throw new Error('CoinGecko: nenhum símbolo retornado');
  console.info('[CryptoTrack] Crypto prices OK:', out);
  return out;
}

export async function fetchPrices(onError) {
  const result = {};

  const [fiatResult, cryptoResult] = await Promise.allSettled([
    fetchFiatRates(),
    fetchCryptoPrices(),
  ]);

  if (fiatResult.status === 'fulfilled') {
    const rates = fiatResult.value;
    for (const [sym, meta] of Object.entries(FIAT_META)) {
      const price     = rates[sym] ?? FALLBACK[sym].price;
      const prev      = FALLBACK[sym].price;
      const change24h = prev ? ((price - prev) / prev) * 100 : 0;
      result[sym] = { ...meta, price, change24h, isFiat: true };
    }
  } else {
    console.error('[CryptoTrack] Fiat fetch failed:', fiatResult.reason?.message);
    onError?.('fiat', fiatResult.reason);
    for (const [sym, meta] of Object.entries(FIAT_META)) result[sym] = { ...meta, ...FALLBACK[sym] };
  }

  if (cryptoResult.status === 'fulfilled') {
    const crypto = cryptoResult.value;
    for (const [sym, meta] of Object.entries(CRYPTO_META)) {
      const d = crypto[sym] ?? FALLBACK[sym];
      result[sym] = { ...meta, price: d.price, change24h: d.change24h, isFiat: false };
    }
  } else {
    console.error('[CryptoTrack] Crypto fetch failed:', cryptoResult.reason?.message);
    onError?.('crypto', cryptoResult.reason);
    for (const [sym, meta] of Object.entries(CRYPTO_META)) result[sym] = { ...meta, ...FALLBACK[sym] };
  }

  return result;
}

export function getUSDPrice(sym, prices) {
  return prices[sym]?.price ?? FALLBACK[sym]?.price ?? 1;
}

// ── CHART HISTORY ─────────────────────────────────────────────────────────────
//
// For fiat: CoinGecko doesn't have timeseries for fiat pairs directly, but we
// can compute EUR/USD history by dividing BTC/USD by BTC/EUR from the
// /coins/bitcoin/market_chart endpoint with vs_currency=eur and vs_currency=usd.
//
// Approach: fetch BTC in USD and BTC in target fiat, then divide point-by-point
// to get (target fiat) / USD over time. Accurate and CORS-friendly.

export async function fetchHistory(sym, period, locale, prices) {
  const isFiat = !!FIAT_META[sym];
  try {
    return isFiat
      ? await _fiatHistory(sym, period, locale)
      : await _cryptoHistory(sym, period, locale);
  } catch (err) {
    console.warn('[CryptoTrack] History fallback for', sym, ':', err.message);
    return _fallbackHistory(prices[sym]?.price ?? FALLBACK[sym]?.price ?? 1, period, locale, isFiat);
  }
}

async function _fiatHistory(sym, period, locale) {
  if (sym === 'USD') {
    // USD/USD is trivially 1 — show a flat line with tiny noise from fallback
    return _fallbackHistory(1, period, locale, true);
  }

  const days = _periodDays(period);
  const cgSym = { EUR:'eur', GBP:'gbp', BRL:'brl', JPY:'jpy', CAD:'cad' }[sym];
  if (!cgSym) throw new Error('Unknown fiat: ' + sym);

  // Fetch BTC price in USD and in the target fiat simultaneously
  const [usdRes, fiatRes] = await Promise.all([
    _fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`),
    _fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${cgSym}&days=${days}`),
  ]);

  const usdData  = await usdRes.json();
  const fiatData = await fiatRes.json();

  const usdPrices  = usdData.prices  ?? [];
  const fiatPrices = fiatData.prices ?? [];

  // Align by length (both should be equal, but be safe)
  const len  = Math.min(usdPrices.length, fiatPrices.length);
  const step = Math.max(1, Math.floor(len / 60));

  const loc    = locale === 'en' ? 'en-US' : 'pt-BR';
  const labels = [], data = [];

  for (let i = 0; i < len; i += step) {
    const btcUsd  = usdPrices[i][1];
    const btcFiat = fiatPrices[i][1];
    if (!btcFiat) continue;
    // 1 unit of fiat = btcUsd / btcFiat USD
    const fiatInUsd = btcUsd / btcFiat;
    labels.push(new Date(usdPrices[i][0]).toLocaleDateString(loc, _labelFmt(period)));
    data.push(Math.round(fiatInUsd * 1e6) / 1e6);
  }

  return { labels, data };
}

async function _cryptoHistory(sym, period, locale) {
  const cgId = CRYPTO_META[sym]?.cgId;
  if (!cgId) throw new Error('Unknown crypto: ' + sym);
  const days    = _periodDays(period);
  const res     = await _fetch(`https://api.coingecko.com/api/v3/coins/${cgId}/market_chart?vs_currency=usd&days=${days}`);
  const json    = await res.json();
  const raw     = json.prices ?? [];
  const step    = Math.max(1, Math.floor(raw.length / 60));
  const sampled = raw.filter((_, i) => i % step === 0);
  const loc     = locale === 'en' ? 'en-US' : 'pt-BR';
  return {
    labels: sampled.map(([ts]) => new Date(ts).toLocaleDateString(loc, _labelFmt(period))),
    data:   sampled.map(([, p]) => Math.round(p * 100) / 100),
  };
}

export function generateSparkline(basePrice, isUp, points = 20) {
  const vol = basePrice > 100 ? 0.018 : 0.006;
  let p = basePrice * (isUp ? 0.97 : 1.03);
  return Array.from({ length: points }, () => {
    p = p * (1 + (Math.random() - (isUp ? 0.45 : 0.55)) * vol);
    return Math.round(p * 10000) / 10000;
  });
}

function _periodDays(p) { return { '1d':1,'7d':7,'1m':30,'3m':90,'1y':365,'5y':1825 }[p] ?? 1; }
function _dateRange(period) {
  const e = new Date(), s = new Date(e - _periodDays(period) * 86_400_000);
  return { start: s.toISOString().slice(0,10), end: e.toISOString().slice(0,10) };
}
function _labelFmt(period) {
  if (period==='1d') return { hour:'2-digit', minute:'2-digit' };
  if (period==='7d') return { weekday:'short' };
  if (period==='1m') return { day:'numeric', month:'short' };
  return { month:'short', year:'2-digit' };
}

export function formatNumber(n) {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 1)         return n.toFixed(4);
  if (n >= 0.0001)    return n.toFixed(6);
  return n.toFixed(8);
}

export function hexToRgb(hex) {
  return { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) };
}
