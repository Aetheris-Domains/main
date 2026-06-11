let metricsChart = null;

function initChart(ctx, history) {
  const labels = history.map(function(h) {
    return h.hour.slice(4, 6) + '/' + h.hour.slice(6, 8) + ' ' + h.hour.slice(8, 10) + ':00';
  });
  const values = history.map(function(h) { return h.requests; });
  if (metricsChart) { metricsChart.data.labels = labels; metricsChart.data.datasets[0].data = values; metricsChart.update('none'); return; }
  metricsChart = new Chart(ctx, {
    type: 'line',
    data: { labels: labels, datasets: [{ label: 'Requests', data: values, borderColor: '#6FA6D8', backgroundColor: function(c) { var g = c.chart.ctx.createLinearGradient(0, 0, 0, 200); g.addColorStop(0, 'rgba(111,166,216,0.25)'); g.addColorStop(1, 'rgba(111,166,216,0)'); return g; }, fill: true, tension: 0.3, pointRadius: 2, pointHoverRadius: 5, borderWidth: 2 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#9FB0D1', font: { size: 9 }, maxTicksLimit: 12 }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { ticks: { color: '#9FB0D1', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true } }, interaction: { intersect: false, mode: 'index' } }
  });
}

function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

async function refreshDomains() {
  const grid = document.getElementById('domains-grid');
  const results = await checkAllDomains();
  results.sort(function(a, b) { return (a.status === 'down' ? -1 : 1) || (a.time - b.time); });
  grid.innerHTML = results.map(renderCard).join('');
  updateHealthBar(results);
  updateSummary(results.filter(function(r) { return r.status === 'up'; }).length, results.length);
  lucide.createIcons();
}

async function refreshMetrics() {
  const data = await loadMetrics();
  if (!data) {
    ['stat-live','stat-today','stat-total','stat-errors'].forEach(function(id) { var el = document.getElementById(id); if (el) el.textContent = '?'; });
    return;
  }
  ['liveUsers','requestsToday','requestsTotal','errorRate'].forEach(function(key) { var el = document.getElementById('stat-' + key.replace(/[A-Z]/g, function(m) { return '-' + m.toLowerCase(); }).replace(/^-/, '')); if (!el) return; });
  var elLive = document.getElementById('stat-live'); if (elLive) elLive.textContent = data.liveUsers;
  var elToday = document.getElementById('stat-today'); if (elToday) elToday.textContent = formatNum(data.requestsToday);
  var elTotal = document.getElementById('stat-total'); if (elTotal) elTotal.textContent = formatNum(data.requestsTotal);
  var elErrors = document.getElementById('stat-errors'); if (elErrors) elErrors.textContent = data.errorRate + '%';
  var ctx = document.getElementById('metrics-chart'); if (ctx && data.history) initChart(ctx.getContext('2d'), data.history);
}

window.addEventListener('scroll', function() {
  var h = document.getElementById('main-header');
  if (h) h.classList.toggle('header-sticky', window.scrollY > 50);
});

document.addEventListener('DOMContentLoaded', function() {
  refreshDomains();
  refreshMetrics();
  var btn = document.getElementById('check-all-btn');
  if (btn) btn.addEventListener('click', refreshDomains);
  setInterval(function() { if (!document.hidden) { refreshDomains(); refreshMetrics(); } }, window.CONFIG ? window.CONFIG.refreshInterval || 60000 : 60000);
});