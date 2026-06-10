async function refreshDomains() {
  const grid = document.getElementById('domains-grid');
  const results = await checkAllDomains();
  results.sort((a, b) => (a.status === 'down' ? -1 : 1) || (a.time - b.time));
  grid.innerHTML = results.map(renderCard).join('');
  updateHealthBar(results);
  lucide.createIcons();
}

window.addEventListener('scroll', () => {
  document.getElementById('main-header').classList.toggle('header-sticky', window.scrollY > 50);
});

document.addEventListener('DOMContentLoaded', () => {
  refreshDomains();
  setInterval(refreshDomains, CONFIG.refreshInterval);
});