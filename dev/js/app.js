let metricsChart = null;

function initChart(ctx, history) {
  const labels = history.map(function(h) { return h.hour.slice(4,6) + '/' + h.hour.slice(6,8) + ' ' + h.hour.slice(8,10) + ':00'; });
  const values = history.map(function(h) { return h.requests; });
  if (metricsChart) { metricsChart.data.labels = labels; metricsChart.data.datasets[0].data = values; metricsChart.update('none'); return; }
  metricsChart = new Chart(ctx, {
    type: 'line',
    data: { labels: labels, datasets: [{ label: 'Requests', data: values, borderColor: '#6FA6D8', backgroundColor: function(c) { var g = c.chart.ctx.createLinearGradient(0,0,0,200); g.addColorStop(0,'rgba(111,166,216,0.25)'); g.addColorStop(1,'rgba(111,166,216,0)'); return g; }, fill: true, tension: 0.3, pointRadius: 2, pointHoverRadius: 5, borderWidth: 2 }] },
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
  results.sort(function(a,b) { return (a.status === 'down' ? -1 : 1) || (a.time - b.time); });
  grid.innerHTML = results.map(renderCard).join('');
  updateSummary(results.filter(function(r) { return r.status === 'up'; }).length, results.length);
  lucide.createIcons();
}

async function refreshMetrics() {
  const data = await loadMetrics();
  if (!data) { document.getElementById('stat-live').textContent = '?'; document.getElementById('stat-today').textContent = '?'; document.getElementById('stat-total').textContent = '?'; document.getElementById('stat-errors').textContent = '?'; return; }
  document.getElementById('stat-live').textContent = data.liveUsers;
  document.getElementById('stat-today').textContent = formatNum(data.requestsToday);
  document.getElementById('stat-total').textContent = formatNum(data.requestsTotal);
  document.getElementById('stat-errors').textContent = data.errorRate + '%';
  var ctx = document.getElementById('metrics-chart');
  if (ctx && data.history) initChart(ctx.getContext('2d'), data.history);
}

document.addEventListener('DOMContentLoaded', function() {
  refreshDomains();
  refreshMetrics();
  var btn = document.getElementById('check-all-btn');
  if (btn) btn.addEventListener('click', refreshDomains);
  setInterval(function() { if (!document.hidden) { refreshDomains(); refreshMetrics(); } }, 60000);
});