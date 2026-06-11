function renderCard(data) {
  const up = data.status === 'up';
  const timeColor = data.time < 200 ? 'text-emerald-400' : data.time < 500 ? 'text-amber-400' : 'text-rose-400';
  return '<div class="rounded-2xl p-5 border transition-all glow cursor-pointer group animate-fade-in" style="background:rgba(7,13,30,0.6);border-color:' + (up ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)') + '" onclick="window.open(\'' + data.url + '\',\'_blank\')">' +
    '<div class="flex items-start justify-between mb-4">' +
      '<div class="flex items-center gap-3 min-w-0">' +
        '<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(111,166,216,0.15)">' +
          '<svg data-lucide="globe" class="w-5 h-5 text-[#B6F1FF]"></svg>' +
        '</div>' +
        '<div class="min-w-0">' +
          '<h3 class="text-sm font-bold text-white truncate group-hover:text-[#6FA6D8] transition-colors">' + data.name + '</h3>' +
          '<p class="text-[11px] text-[#9FB0D1] truncate max-w-[200px]">' + data.url + '</p>' +
        '</div>' +
      '</div>' +
      '<span class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ' + (up ? 'text-emerald-400' : 'text-rose-400') + '" style="background:' + (up ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)') + '">' +
        '<span class="w-1.5 h-1.5 rounded-full ' + (up ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse') + '"></span>' +
        (up ? 'Online' : 'Offline') +
      '</span>' +
    '</div>' +
    '<div class="grid grid-cols-3 gap-3 text-center">' +
      '<div class="rounded-lg py-2.5 bg-black/30"><p class="text-[10px] text-[#9FB0D1] uppercase font-semibold">Status</p><p class="text-xs font-bold text-white mt-0.5">' + (up ? (data.code || '200') : 'ERR') + '</p></div>' +
      '<div class="rounded-lg py-2.5 bg-black/30"><p class="text-[10px] text-[#9FB0D1] uppercase font-semibold">Response</p><p class="text-xs font-bold ' + timeColor + ' mt-0.5">' + (data.time ? data.time + 'ms' : '—') + '</p></div>' +
      '<div class="rounded-lg py-2.5 bg-black/30"><p class="text-[10px] text-[#9FB0D1] uppercase font-semibold">Checked</p><p class="text-xs font-bold text-white mt-0.5" title="' + new Date(data.checked).toLocaleString() + '">' + timeAgo(data.checked) + '</p></div>' +
    '</div>' +
    (data.error && !up ? '<p class="text-[10px] text-rose-400/70 mt-2 text-center truncate">' + data.error + '</p>' : '') +
    '<div class="mt-3 pt-3 border-t border-white/5 text-center">' +
      '<span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#6FA6D8] group-hover:text-[#B6F1FF] transition-colors">' +
        '<svg data-lucide="external-link" class="w-3.5 h-3.5"></svg>Visit ' + data.name.split('(')[0].trim() +
      '</span>' +
    '</div>' +
  '</div>';
}

function timeAgo(ts) {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 5) return 'just now';
  if (sec < 60) return sec + 's ago';
  return Math.floor(sec / 60) + 'm ago';
}

function updateSummary(up, total) {
  const el = document.getElementById('domains-summary');
  if (el) el.textContent = up + '/' + total + ' online';
}