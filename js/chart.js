/* ==========================================================================
   All Chart.js rendering: main price chart + mini sparklines.
   Todas renderizações do Chart.js: gráfico de preço principal + mini sparklines.
   ========================================================================== */

import { generateHistory, generateLabels, formatNumber } from './data.js';

let chartInstance = null;

/**
 * Draws (or re-draws) the main price chart.
 * Desenha (ou redesenha) o gráfico de preço principal.
 *
 * @param {string} asset        – e.g. 'BTC'
 * @param {object} prices       – preços atuais
 * @param {object} CRYPTO_BASE  – preços base (fallback)
 * @param {string} period       – '24h' | '7d' | '30d'
 * @param {string} chartColor   – cor do gráfico (baseada na cor do ativo)
 */
export function renderChart(asset, prices, CRYPTO_BASE, period, chartColor) {
  const info = prices[asset] ?? CRYPTO_BASE[asset];

  const pointCount  = period === '24h' ? 24 : period === '7d' ? 7  : 30;
  const volatility  = period === '24h' ? 0.015 : period === '7d' ? 0.04 : 0.07;
  const data   = generateHistory(info.price, pointCount, volatility);
  const labels = generateLabels(period);
  const isUp   = data.at(-1) >= data[0];
  const color  = isUp ? chartColor : '#ff4757';

  const canvas = document.getElementById('priceChart');
  const ctx    = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 220);
  grad.addColorStop(0, color + '30');
  grad.addColorStop(1, color + '00');

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: color,
        backgroundColor: grad,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#12161f',
          borderColor: color + '40',
          borderWidth: 1,
          titleColor: '#7a8299',
          bodyColor:  '#e8eaf2',
          callbacks: {
            label: ctx => '  $' + formatNumber(ctx.parsed.y),
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            color: '#4a5068',
            font: { family: 'DM Mono', size: 11 },
            maxTicksLimit: 8,
          },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: {
            color: '#4a5068',
            font: { family: 'DM Mono', size: 11 },
            callback: v => '$' + formatNumber(v),
          },
          position: 'right',
        },
      },
    },
  });
}

/**
 * Draws a mini sparkline inside the given canvas element.
 * Desenha um mini gráfico dentro do elemento canvas fornecido.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number}  basePrice
 * @param {boolean} isUp
 */
export function drawMiniChart(canvas, basePrice, isUp) {
  const data  = generateHistory(basePrice, 20, 0.02);
  const color = isUp ? '#00c97a' : '#ff4757';
  const w = canvas.offsetWidth || 160;
  const h = 40;
  canvas.width  = w;
  canvas.height = h;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const scaleY = v => h - ((v - min) / (max - min + 0.001)) * h;
  const scaleX = i => (i / (data.length - 1)) * w;

  const ctx  = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '40');
  grad.addColorStop(1, color + '00');

  // Fill area
  // Área de preenchimento
  ctx.beginPath();
  ctx.moveTo(scaleX(0), scaleY(data[0]));
  data.forEach((v, i) => i > 0 && ctx.lineTo(scaleX(i), scaleY(v)));
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  // Linha
  ctx.beginPath();
  ctx.moveTo(scaleX(0), scaleY(data[0]));
  data.forEach((v, i) => i > 0 && ctx.lineTo(scaleX(i), scaleY(v)));
  ctx.strokeStyle = color;
  ctx.lineWidth   = 1.5;
  ctx.stroke();
}
