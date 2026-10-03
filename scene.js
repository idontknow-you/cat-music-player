(() => {
  const NS = 'http://www.w3.org/2000/svg', W = 800, H = 300;
  let s = 7; const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
  const svg = document.getElementById('city');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
  const rect = (x, y, w, h, fill) => {
    const r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('fill', fill);
    svg.appendChild(r); return r;
  };
  const lights = ['#fde68a', '#5eead4', '#f9a8d4'];
  const layer = (color, minH, maxH, chance) => {
    for (let x = 0; x < W;) {
      const w = Math.round(30 + rnd() * 46), h = Math.round(minH + rnd() * (maxH - minH));
      rect(x, H - h, w, h, color);
      for (let y = H - h + 8; y < H - 8; y += 10)
        for (let wx = x + 6; wx < x + w - 8; wx += 10)
          if (rnd() < chance) {
            const r = rect(wx, y, 4, 4, lights[Math.floor(rnd() * 3)]);
            if (rnd() < .15) r.setAttribute('class', 'flick');
          }
      x += w + Math.round(rnd() * 6);
    }
  };
  layer('#3a2a7a', 90, 220, .16);
  layer('#1b1248', 50, 140, .3);

  const stars = document.getElementById('stars');
  for (let n = 0; n < 70; n++) {
    const i = document.createElement('i'), z = rnd() < .8 ? 2 : 3;
    i.style.cssText = `left:${rnd() * 100}%;top:${rnd() * 50}%;width:${z}px;height:${z}px;animation-delay:${(rnd() * 3).toFixed(1)}s`;
    stars.appendChild(i);
  }
  const bokeh = document.getElementById('bokeh'), cols = ['#5eead4', '#f472b6', '#fde68a', '#a78bfa'];
  for (let n = 0; n < 14; n++) {
    const i = document.createElement('i'), z = 14 + rnd() * 30;
    i.style.cssText = `left:${rnd() * 100}%;top:${45 + rnd() * 45}%;width:${z}px;height:${z}px;background:${cols[n % 4]};animation-duration:${14 + rnd() * 12}s;animation-delay:-${rnd() * 14}s`;
    bokeh.appendChild(i);
  }
})();