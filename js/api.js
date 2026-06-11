async function checkDomain(domain) {
  try {
    const res = await fetch(window.CONFIG.workerCheck + '?url=' + encodeURIComponent(domain.url), {
      signal: AbortSignal.timeout(window.CONFIG.checkTimeout)
    });
    const data = await res.json();
    return { ...domain, status: data.status, code: data.code, time: data.time, error: data.error, checked: Date.now() };
  } catch (e) {
    return { ...domain, status: 'down', error: e.message, checked: Date.now() };
  }
}

async function checkAllDomains() {
  return Promise.all(window.CONFIG.domains.map(checkDomain));
}

async function loadMetrics() {
  try {
    const res = await fetch(window.CONFIG.metricsUrl, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch {
    return null;
  }
}
console.log('API loaded');