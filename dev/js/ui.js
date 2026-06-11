function renderCard(data) {
  const up = data.status === 'up';
  const timeColor = data.time < 200 ? 'text-emerald-400' : data.time < 500 ? 'text-amber-400' : 'text-rose-400';
  return '<div class="rounded-2xl p-5 border transition-all glow cursor-pointer group animate-fade-in" style="background:rgba(7,13,30,0.6);border-color:' + (up ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)') + '" onclick="window.open('' + data.url + '','_blank')">' +
    '<div class="flex items-start justify-between mb-4">' +
      '<div class="flex items-center gap-3 min-w-0">' +
        '<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(111,166,216,0.15)">' +
          '<svg data-lucide="globe" class="w-5 h-5 text-[#B6F1FF]"></svg>' +
        '</div>' +
        '<h3 class="text-sm font-bold text-white truncate">' + data.name + '</h3>' +
      '</div>' +
      '<span class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ' + (up ? 'text-emerald-400' : 'text-rose-400') + '">' +
        (up ? 'Online' : 'Offline') +
      '</span>' +
    '</div>' +
    '<div class="grid grid-cols-2 gap-3 text-center">' +
      '<div class="rounded-lg py-2.5 bg-black/30">' +
        '<p class="text-[10px] text-[#9FB0D1] uppercase font-semibold">Latency</p>' +
        '<p class="text-xs font-bold ' + timeColor + ' mt-0.5">' + (data.time ? data.time + 'ms' : '—') + '</p>' +
      '</div>' +
      '<div class="rounded-lg py-2.5 bg-black/30">' +
        '<p class="text-[10px] text-[#9FB0D1] uppercase font-semibold">Status</p>' +
        '<p class="text-xs font-bold text-white mt-0.5">' + (up ? (data.code || '200') : 'ERR') + '</p>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function updateHealthBar(results) {
  const bar = document.getElementById('global-health-bar');
  const upCount = results.filter(r => r.status === 'up').length;
  const percent = (upCount / results.length) * 100;
  bar.innerHTML = '<div class="bg-emerald-500" style="width:' + percent + '%"></div><div class="bg-rose-500" style="width:' + (100 - percent) + '%"></div>';
}