const audio = new Audio();
let tracks = [], i = 0, shuffle = false, repeat = false;
const $ = id => document.getElementById(id);
const fmt = s => (isNaN(s) || !isFinite(s)) ? '0:00' : Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
const say = msg => $('nameTag').textContent = msg;
const tryPlay = () => audio.play().catch(e => say('Cannot play: ' + e.message));

fetch('/tracks.json')
  .then(r => { if (!r.ok) throw new Error('tracks.json not found'); return r.json(); })
  .then(d => {
    tracks = (Array.isArray(d) ? d.flat() : (d.tracks || [])).filter(t => t && t.file);
    if (!tracks.length) throw new Error('tracks.json needs entries with "title", "artist" and "file"');
    tracks.forEach(t => { t.title = t.title || t.file.split('/').pop(); t.artist = t.artist || ''; });
    renderList(); load(0);
  })
  .catch(e => say('Error: ' + e.message));

const label = t => t.artist ? `${t.title} — ${t.artist}` : t.title;

function renderList() {
  $('playlist').innerHTML = tracks.map((t, n) => `<li data-n="${n}">${label(t)}</li>`).join('');
  $('playlist').onclick = e => { if (e.target.dataset.n) { load(+e.target.dataset.n); tryPlay(); } };
}
function load(n) {
  i = n; audio.src = tracks[i].file;
  say(label(tracks[i]));
  document.querySelectorAll('#playlist li').forEach((li, k) => li.classList.toggle('active', k === i));
}
const next = () => { load(shuffle ? Math.floor(Math.random() * tracks.length) : (i + 1) % tracks.length); tryPlay(); };
const prev = () => { load((i - 1 + tracks.length) % tracks.length); tryPlay(); };

$('play').onclick = () => audio.paused ? tryPlay() : audio.pause();
$('next').onclick = next;
$('prev').onclick = prev;
$('shuffle').onclick = e => { shuffle = !shuffle; e.currentTarget.classList.toggle('on', shuffle); };
$('repeat').onclick = e => { repeat = !repeat; e.currentTarget.classList.toggle('on', repeat); };
$('vol').oninput = e => audio.volume = e.target.value;
$('seek').oninput = e => { if (audio.duration) audio.currentTime = e.target.value / 100 * audio.duration; };

function setPlaying(on) {
  $('cat').className = 'cat ' + (on ? 'dancing' : 'sleeping');
  document.querySelector('.ic-play').style.display = on ? 'none' : '';
  document.querySelector('.ic-pause').style.display = on ? '' : 'none';
}
audio.onplay = () => setPlaying(true);
audio.onpause = () => setPlaying(false);
audio.ontimeupdate = () => {
  $('cur').textContent = fmt(audio.currentTime);
  $('dur').textContent = fmt(audio.duration);
  $('seek').value = audio.currentTime / audio.duration * 100 || 0;
};
audio.onended = () => repeat ? tryPlay() : next();
audio.onerror = () => say('Cannot load: ' + decodeURI(audio.src.split('/').pop())); 