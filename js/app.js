let metricsChart = null;

function initChart(ctx, history) {
  const labels = history.map(function(h) {
    var m = h.hour.slice(4, 6);
    var d = h.hour.slice(6, 8);
    var hh = h.hour.slice(8, 10);
    return m + '/' + d + ' ' + hh + ':00';
  });
  var values = history.map(function(h) { return h.requests; });

  if (metricsChart) {
    metricsChart.data.labels = labels;
    metricsChart.data.datasets[0].data = values;
    metricsChart.update('none');
    return;
  }

  metricsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Requests',
        data: values,
        borderColor: '#6FA6D8',
        backgroundColor: function(c) {
          var g = c.chart.ctx.createLinearGradient(0, 0, 0, 200);
          g.addColorStop(0, 'rgba(111,166,216,0.25)');
          g.addColorStop(1, 'rgba(111,166,216,0)');
          return g;
        },
        fill: true,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: '#9FB0D1', font: { size: 9 }, maxTicksLimit: 12 },
          grid: { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          ticks: { color: '#9FB0D1', font: { size: 9 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
          beginAtZero: true
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });
}

async function refreshDomains() {
  var grid = document.getElementById('domains-grid');
  var btn = document.getElementById('check-all-btn');

  btn.disabled = true;
  btn.classList.add('opacity-50', 'pointer-events-none');
  grid.innerHTML = CONFIG.domains.map(function() { return skeleton(); }).join('');

  var results = await checkAllDomains();
  var up = results.filter(function(r) { return r.status === 'up'; }).length;

  grid.innerHTML = results.map(renderCard).join('');
  lucide.createIcons();
  updateSummary(up, results.length);

  btn.disabled = false;
  btn.classList.remove('opacity-50', 'pointer-events-none');
}

async function refreshMetrics() {
  var data = await loadMetrics();
  if (!data) {
    updateStats({});
    return;
  }
  updateStats(data);
  var ctx = document.getElementById('metrics-chart').getContext('2d');
  if (data.history) initChart(ctx, data.history);
}

document.addEventListener('DOMContentLoaded', function() {
  refreshDomains();
  refreshMetrics();
  document.getElementById('check-all-btn').addEventListener('click', refreshDomains);

  var autoTimer;
  function scheduleNext() {
    autoTimer = setTimeout(function() {
      if (!document.hidden) { refreshDomains(); refreshMetrics(); }
      scheduleNext();
    }, CONFIG.refreshInterval);
  }
  scheduleNext();
});