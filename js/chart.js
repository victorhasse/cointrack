/* ==========================================================================
   All Chart.js rendering: main price chart + mini sparklines.
   Todas renderizações do Chart.js: gráfico de preço principal + mini sparklines.
   ========================================================================== */

import { fetchHistory, formatNumber, generateSparkline } from './data.js';

let chartInstance  = null;
let chartLoading   = false;

export async function renderChart(asset, prices, period, chartColor, locale) {
  if (chartLoading) return;
  chartLoading = true;

  const canvas = document.getElementById('priceChart');
  if (!canvas) { chartLoading = false; return; }

  // Show loading state / Mostra estado de carregamento
  const wrapper = canvas.closest('.chart-wrapper');
  wrapper?.classList.add('chart-loading');

  let labels, data;
  try {
    ({ labels, data } = await fetchHistory(asset, period, locale, prices));
  } catch {
    chartLoading = false;
    wrapper?.classList.remove('chart-loading');
    return;
  }

  const info  = prices[asset];
  const isUp  = data.length > 1 ? data.at(-1) >= data[0] : true;
  const color = isUp ? chartColor : '#ff4757';
  const ctx   = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 240);
  grad.addColorStop(0, color + '28');
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
        pointHoverBorderColor: 'transparent',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0d1118',
          borderColor: color + '50',
          borderWidth: 1,
          titleColor: '#7a8299',
          bodyColor: '#e8eaf2',
          padding: 10,
          callbacks: {
            label: ctx => '  ' + formatNumber(ctx.parsed.y) + ' USD',
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { color: '#4a5068', font: { family: 'DM Mono', size: 11 }, maxTicksLimit: 8, maxRotation: 0 },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { color: '#4a5068', font: { family: 'DM Mono', size: 11 }, callback: v => formatNumber(v) },
          position: 'right',
        },
      },
    },
  });

  wrapper?.classList.remove('chart-loading');
  chartLoading = false;
}

export function drawMiniChart(canvas, basePrice, isUp) {
  const data  = generateSparkline(basePrice, isUp);
  const color = isUp ? '#00c97a' : '#ff4757';
  const w = canvas.offsetWidth || 150;
  const h = 38;
  canvas.width = w; canvas.height = h;

  const min    = Math.min(...data);
  const max    = Math.max(...data);
  const range  = max - min || 0.001;
  const scaleY = v => h - ((v - min) / range) * h;
  const scaleX = i => (i / (data.length - 1)) * w;
  const ctx    = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '40');
  grad.addColorStop(1, color + '00');

  ctx.beginPath();
  ctx.moveTo(scaleX(0), scaleY(data[0]));
  data.forEach((v, i) => i > 0 && ctx.lineTo(scaleX(i), scaleY(v)));
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();

  ctx.beginPath();
  ctx.moveTo(scaleX(0), scaleY(data[0]));
  data.forEach((v, i) => i > 0 && ctx.lineTo(scaleX(i), scaleY(v)));
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
}
