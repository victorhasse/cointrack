/* ==========================================================================
   Mock data layer. Replace the functions below with real API calls
   (CoinGecko, AwesomeAPI, etc.) without touching the rest of the app.
    ---------------------------------------------------------------------
    Camada de dados simulados. Substitui as funções abaixo por chamadas reais
    de API (CoinGecko, AwesomeAPI, etc.) sem tocar no restante do aplicativo.
   ========================================================================== */

export const CRYPTO_BASE = {
  BTC: { name: 'Bitcoin',  icon: '₿', color: '#f7931a', price: 96800, change24h:  2.34 },
  ETH: { name: 'Ethereum', icon: 'Ξ', color: '#627eea', price:  3240, change24h: -1.12 },
  SOL: { name: 'Solana',   icon: '◎', color: '#9945ff', price:   178, change24h:  4.67 },
  BNB: { name: 'BNB',      icon: 'B', color: '#f3ba2f', price:   612, change24h:  0.89 },
};

export const FIAT_RATES = {
  USD: 1,
  BRL: 5.76,
  EUR: 0.92,
  GBP: 0.79,
};

export const CRYPTO_ICONS = {
  BTC: '₿', ETH: 'Ξ', SOL: '◎', BNB: '◈',
  USD: '$', BRL: 'R$', EUR: '€', GBP: '£',
};

/**
 * Simula um tick de preço com ruído de ±0,1%.
 * Substitui por uma chamada de API real que retorne a mesma forma:
 *   { [symbol]: { name, icon, color, price, change24h } }
 */
export function simulatePrices() {
  const result = {};
  for (const [sym, info] of Object.entries(CRYPTO_BASE)) {
    const noise = (Math.random() - 0.5) * 0.002;
    result[sym] = { ...info, price: info.price * (1 + noise) };
  }
  return result;
}

/**
 * Retorna um preço em USD para qualquer símbolo suportado (fiat ou cripto).
 * sym    = símbolo a ser convertido (e.g. 'EUR', 'BTC').
 * prices = objeto de preços atuais de simulatePrices().
 */
export function getUSDPrice(sym, prices) {
  if (FIAT_RATES[sym]) return 1 / FIAT_RATES[sym];
  const p = prices[sym] ?? CRYPTO_BASE[sym];
  return p ? p.price : 1;
}

/**
 * Gera um array de histórico de preços sintético.
 * points    – número de pontos (24 para 24h, 7 para 7d, etc.)
 * volatility – escala de desvio padrão (0.015 para 24h, 0.04 para 7d, etc.)
 */
export function generateHistory(basePrice, points, volatility = 0.03) {
  const arr = [];
  let p = basePrice * (0.9 + Math.random() * 0.1);
  for (let i = 0; i < points; i++) {
    p = p * (1 + (Math.random() - 0.48) * volatility);
    arr.push(Math.round(p * 100) / 100);
  }
  arr[arr.length - 1] = basePrice;
  return arr;
}

/**
 * Gera rótulos legíveis de tempo/data para um período específico.
 */
export function generateLabels(period) {
  const now = new Date();
  const labels = [];
  if (period === '24h') {
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now - i * 3600000);
      labels.push(d.getHours() + 'h');
    }
  } else if (period === '7d') {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      labels.push(d.toLocaleDateString('pt-BR', { weekday: 'short' }));
    }
  } else {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      labels.push(d.getDate() + '/' + (d.getMonth() + 1));
    }
  }
  return labels;
}

/**
 * Formata um número para exibição na interface do usuário.
 */
export function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (n >= 1)         return n.toFixed(2);
  return n.toFixed(6);
}

/**
 * Converte uma string de cor hexadecimal para um objeto { r, g, b }.
 */
export function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}
