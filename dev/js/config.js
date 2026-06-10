window.CONFIG = {
  domains: [
    { name: 'Aetheris (GitHub Pages)', url: 'https://sharktubey.github.io/Aetheris/', type: 'primary' },
    { name: 'Aetheris (Wispbyte)',    url: 'https://aetheris.wispbyte.app/',   type: 'mirror' },
    { name: 'Aetheris (Vercel)',      url: 'https://aetheris-pi.vercel.app/',  type: 'mirror' }
  ],
  workerCheck: 'https://tmdb-proxy.sharktubey.workers.dev/api/check',
  metricsUrl:  'https://tmdb-proxy.sharktubey.workers.dev/api/metrics',
  checkTimeout: 15000,
  refreshInterval: 60000
};
console.log('Config loaded');