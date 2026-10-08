(() => {
'use strict';
const $ = s => document.querySelector(s);
const stage = $('#stage');
const api = window.ForestOrbit.create(stage, {assetBase: 'assets/'});
const duration = 9;
let time = 0, playing = false, last = null, rate = 1, photoUrls = [];
const video = document.body.dataset.video;
$('#download').href = video;
function resize() { stage.style.transform = 'scale(' + (stage.parentElement.clientWidth / 1280) + ')'; }
new ResizeObserver(resize).observe(stage.parentElement); resize();
function show(t) {
  time = Math.min(duration, Math.max(0, t));
  api.seek(time);
  $('#scrub').value = time;
  $('#clock').replaceChildren(document.createTextNode(time.toFixed(2) + ' '));
  const small = document.createElement('small'); small.textContent = '/ 9.00 s'; $('#clock').append(small);
}
function setPlaying(value) {
  playing = value; last = null;
  $('#play').textContent = playing ? 'Ⅱ' : '▶';
  $('#play').setAttribute('aria-label', playing ? '暂停' : '播放');
}
function frame(now) {
  if (playing && !document.hidden) {
    if (last !== null) {
      let next = time + Math.min((now-last)/1000, 0.1)*rate;
      if (next >= duration) {
        if ($('#loop').checked) next %= duration;
        else {next = duration; setPlaying(false);}
      }
      show(next);
    }
    last = now;
  } else last = null;
  requestAnimationFrame(frame);
}
$('#play').onclick = () => { if (time>=duration) show(0); setPlaying(!playing); };
$('#restart').onclick = () => { show(0); setPlaying(true); };
$('#scrub').oninput = e => {setPlaying(false); show(Number(e.target.value));};
$('#speed').onchange = e => {rate=Number(e.target.value);};
document.querySelectorAll('[data-seek]').forEach(b=>b.onclick=()=>{setPlaying(false);show(Number(b.dataset.seek));});
document.querySelectorAll('[data-layer]').forEach(input=>input.onchange=()=>api.setLayer(input.dataset.layer,input.checked));
function releasePhotos(){photoUrls.forEach(u=>URL.revokeObjectURL(u));photoUrls=[];}
$('#photos').onchange = async e => {
  const files = [...e.target.files].filter(f=>f.type.startsWith('image/')).slice(0,12);
  if (!files.length) return;
  const urls = files.map(f=>URL.createObjectURL(f));
  const results = await Promise.all(urls.map(url=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(true);image.onerror=()=>resolve(false);image.src=url;})));
  const valid = urls.filter((url,i)=>results[i]);
  urls.filter((url,i)=>!results[i]).forEach(u=>URL.revokeObjectURL(u));
  if (!valid.length) {$('#photo-status').textContent='这些图片暂时无法读取，请选择 JPG、PNG 或 WebP。';return;}
  releasePhotos();photoUrls=valid;
  api.replacePhotos(photoUrls);show(time);
  $('#photo-status').textContent=`已替换 ${valid.length} 张照片${valid.length<12?'，循环填满 12 个位置':''} · 仅当前预览`;
};
$('#reset-photos').onclick=()=>{api.resetPhotos();releasePhotos();$('#photos').value='';$('#photo-status').textContent='当前使用 12 张森林照片';};
window.addEventListener('pagehide',releasePhotos);
document.addEventListener('keydown', e=>{if(e.code==='Space'&&!['INPUT','SELECT','BUTTON','A'].includes(document.activeElement.tagName)){e.preventDefault();$('#play').click();}});
const requested=Number(new URLSearchParams(location.hash.slice(1)).get('t'));
show(Number.isFinite(requested)?requested:0);
window.forestViewer={api,seek:show,play:()=>setPlaying(true),pause:()=>setPlaying(false),get time(){return time;},get playing(){return playing;}};
requestAnimationFrame(frame);
})();
