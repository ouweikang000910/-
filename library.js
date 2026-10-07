(() => {
 'use strict';
 const cfg=window.SHOT_LIBRARY;
 function migrateLegacyLink(){const state=new URLSearchParams(location.hash.slice(1));if(state.has('t')&&!state.has('shot')){const u=new URL('effect.html',location.href);u.hash=location.hash;location.replace(u.href);return true;}return false;}
 if(migrateLegacyLink())return;
 const $=s=>document.querySelector(s);
 const repo=`https://github.com/${cfg.owner}/${cfg.repository}`;
 const key=`shot-library:${cfg.owner}/${cfg.repository}`;
 const mediaPattern=/\.(mp4|webm|m4v|mov|png|jpe?g|webp|gif)$/i;
 const videoPattern=/\.(mp4|webm|m4v|mov)$/i;
 const encodePath=p=>p.split('/').map(encodeURIComponent).join('/');
 const mediaUrl=p=>new URL(encodePath(p),new URL('./',location.href)).href;
 const playIcon='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>';
 let items=[],type='all',category='all',opened=null,observer=null;
 function status(t){$('#status').textContent=t;}
 function text(tag,value,cls){const e=document.createElement(tag);e.textContent=value;if(cls)e.className=cls;return e;}
 function size(n){return n?((n/1048576).toFixed(n<1048576?2:1)+' MB'):'镜头素材';}
 function duration(n){return Number.isFinite(n)?n.toFixed(2)+' s':'';}
 function convert(tree){
  return tree.filter(e=>e.type==='blob'&&e.path.startsWith(cfg.folder+'/')&&mediaPattern.test(e.path)).map(e=>{
   const meta=cfg.metadata[e.path]||{};
   const parts=e.path.split('/');const filename=parts.at(-1);const video=videoPattern.test(filename);
   return {path:e.path,filename,title:meta.title||filename.replace(/\.[^.]+$/,'').replace(/[_-]/g,' '),category:meta.category||(parts.length>2?parts[1]:'未分类'),tags:Array.isArray(meta.tags)?meta.tags.filter(t=>typeof t==='string'):[],description:meta.description||'',cover:meta.cover||'',duration:meta.duration,size:e.size||meta.size||0,type:video?'video':'image',sample:!!meta.sample,effect:meta.effect||''};
  });
 }
 function filtered(){
  const query=$('#search').value.trim().toLocaleLowerCase();
  const result=items.filter(i=>(type==='all'||type===i.type)&&(category==='all'||category===i.category)&&[i.title,i.category,...i.tags].join(' ').toLocaleLowerCase().includes(query));
  const sort=$('#sort').value;
  return result.sort((a,b)=>sort==='size'?b.size-a.size:(sort==='desc'?-1:1)*a.title.localeCompare(b.title,'zh-CN'));
 }
 function chooseCategory(value){category=value;render();}
 function renderCategories(){
  $('#categories').replaceChildren();
  const categories=[...new Set(items.map(i=>i.category))].sort();
  const all=text('option','全部分类');all.value='all';$('#category-select').replaceChildren(all);
  for(const cat of categories){
   const option=text('option',cat);option.value=cat;$('#category-select').append(option);
   const button=text('button','', 'nav-button'+(category===cat?' active':''));button.type='button';button.append(text('span',cat),text('small',String(items.filter(i=>i.category===cat).length)));button.onclick=()=>chooseCategory(category===cat?'all':cat);$('#categories').append(button);
  }
  $('#category-select').value=category;
  document.querySelectorAll('[data-type]').forEach(b=>{b.classList.toggle('active',type===b.dataset.type);b.setAttribute('aria-pressed',String(type===b.dataset.type));b.querySelector('small').textContent=String(items.filter(i=>b.dataset.type==='all'||i.type===b.dataset.type).length);});
 }
 function coverElement(item){
  if(item.cover||item.type==='image'){
   const img=document.createElement('img');img.src=item.cover||mediaUrl(item.path);img.alt=item.title;img.loading='lazy';return img;
  }
  const video=document.createElement('video');video.dataset.src=mediaUrl(item.path);video.muted=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',item.title+'的预览');
  video.addEventListener('loadedmetadata',()=>{if(video.duration>0)video.currentTime=Math.min(.08,video.duration/2);const card=video.closest('.card');if(card&&Number.isFinite(video.duration))card.querySelector('.duration').textContent=duration(video.duration);});
  return video;
 }
 function render(){
  if(observer)observer.disconnect();renderCategories();
  const list=filtered();$('#gallery').replaceChildren();$('#total').textContent=String(items.length);$('#visible-count').textContent=`${list.length} 个镜头`;
  $('#empty').hidden=list.length>0;$('#empty-title').textContent=items.length?'没有找到这个镜头':'存下你的第一个镜头';$('#empty-text').textContent=items.length?'试试其他关键词，或清除当前筛选。':'上传视频或画面，让你的镜头库慢慢丰富起来。';$('#clear').hidden=!items.length;$('#empty-upload').hidden=!!items.length;
  for(const item of list){
   const card=document.createElement('article');card.className='card';
   const preview=document.createElement('button');preview.className='card-preview';preview.type='button';preview.setAttribute('aria-label','预览 '+item.title);preview.append(coverElement(item));
   preview.append(text('span',item.sample?'动效示例':item.type==='video'?'视频':'画面','media-label'));
   if(item.type==='video'){const badge=text('span','','play-badge');badge.innerHTML=playIcon;preview.append(badge);}
   preview.append(text('span',duration(item.duration),'duration'));preview.onclick=()=>open(item);
   const body=text('div','','card-body');const title=text('button',item.title,'card-title');title.type='button';title.onclick=()=>open(item);body.append(title);
   const meta=text('div','','card-meta');meta.append(text('span',item.category),text('span',size(item.size)));body.append(meta);
   if(item.tags.length){const tags=text('div','','tags card-tags');item.tags.forEach(t=>tags.append(text('span',t,'tag')));body.append(tags);}
   const footer=text('div','','card-footer');footer.append(text('span',item.filename.split('.').at(-1).toUpperCase()));const share=text('button','分享镜头 ↗');share.type='button';share.onclick=()=>{open(item);shareLink(item);};footer.append(share);card.append(preview,body,footer);$('#gallery').append(card);
  }
  observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.src=entry.target.dataset.src;observer.unobserve(entry.target);}},{rootMargin:'200px'});
  document.querySelectorAll('.card video[data-src]').forEach(v=>observer.observe(v));
  const featured=items.find(i=>i.sample)||items[0];$('#spotlight').hidden=!featured;
  if(featured){
   $('#featured-title').textContent=featured.title;$('#featured-desc').textContent=featured.description||'从你的镜头库中选取一个片段，打开预览即可查看细节。';
   const isVideo=!featured.cover&&featured.type==='video';$('#featured-cover').hidden=isVideo;$('#featured-video').hidden=!isVideo;
   if(isVideo){const src=mediaUrl(featured.path);if($('#featured-video').src!==src)$('#featured-video').src=src;}
   else{$('#featured-cover').src=featured.cover||mediaUrl(featured.path);$('#featured-cover').alt=featured.title;$('#featured-video').removeAttribute('src');}
   $('#featured-tags').replaceChildren(...featured.tags.map(t=>text('span',t,'tag')));$('#featured-play').onclick=$('#featured-visual').onclick=()=>open(featured);$('#featured-effect').hidden=!featured.effect;if(featured.effect)$('#featured-effect').href=featured.effect;
  }
 }
 function open(item){
  opened=item;$('#viewer-title').textContent=item.title;$('#viewer-description').textContent=item.description||item.filename;$('#viewer-category').textContent=item.category;$('#viewer-size').textContent=size(item.size);$('#viewer-time').textContent=duration(item.duration);$('#player-error').textContent='';$('#share-link').hidden=true;$('#share-status').textContent='';$('#share-item').textContent='分享镜头';
  const video=$('#player');video.pause();video.removeAttribute('src');video.load();video.hidden=item.type!=='video';$('#viewer-image').hidden=item.type!=='image';$('#speed-label').hidden=item.type!=='video';
  if(item.type==='video'){video.src=mediaUrl(item.path);if(item.cover)video.poster=item.cover;else video.removeAttribute('poster');video.playbackRate=1;$('#playback-speed').value='1';}else{$('#viewer-image').src=mediaUrl(item.path);$('#viewer-image').alt=item.title;}
  $('#download').href=mediaUrl(item.path);$('#download').download=item.filename;$('#source-file').href=repo+'/blob/'+encodeURIComponent(cfg.branch)+'/'+encodePath(item.path);$('#viewer-effect').hidden=!item.effect;if(item.effect)$('#viewer-effect').href=item.effect;
  if(!$('#viewer').open)$('#viewer').showModal();
 }
 function close(){const v=$('#player');v.pause();v.removeAttribute('src');v.load();$('#viewer-image').removeAttribute('src');opened=null;}
 function shareLink(item){
  const u=new URL('./',location.href);u.search='';u.hash=new URLSearchParams({shot:item.path}).toString();
  if(location.protocol==='file:')u.href='https://ouweikang000910.github.io/-/#'+new URLSearchParams({shot:item.path});
  $('#share-link').value=u.href;$('#share-link').hidden=false;
  if(navigator.clipboard&&isSecureContext)navigator.clipboard.writeText(u.href).then(()=>{$('#share-item').textContent='已复制';$('#share-status').textContent='镜头链接已复制。';},()=>manualShare());else manualShare();
 }
 function manualShare(){$('#share-link').focus();$('#share-link').select();$('#share-status').textContent='复制上方链接，就可以分享这个镜头。';}
 function showDeepLink(){const path=new URLSearchParams(location.hash.slice(1)).get('shot');if(!path)return;const item=items.find(i=>i.path===path);if(item&&opened?.path!==path)open(item);}
 async function sync(){
  $('#sync').disabled=true;status('正在同步仓库中的镜头…');
  try{
   const endpoint=location.hostname==='127.0.0.1'||location.hostname==='localhost'?'/api/shot-tree':new URL('library-index.json',location.href).href;
   const response=await fetch(endpoint,{headers:{Accept:'application/json'},cache:'no-store',signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error('sync');const data=await response.json();if(data.truncated||!Array.isArray(data.tree))throw new Error('incomplete');
   items=convert(data.tree);try{localStorage.setItem(key,JSON.stringify({tree:data.tree.filter(e=>e.path.startsWith(cfg.folder+'/')),time:Date.now()}));}catch{}
   render();showDeepLink();status('镜头已同步 · 保存于 GitHub 仓库');
  }catch{status('暂时无法同步，正在显示已保存的镜头列表。可稍后点击「同步」。');}finally{$('#sync').disabled=false;}
 }
 document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>{type=b.dataset.type;category='all';render();});
 document.querySelectorAll('[data-upload]').forEach(b=>b.onclick=()=>$('#upload').showModal());
 document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).close());
 $('#upload-link').href=repo+'/upload/'+encodeURIComponent(cfg.branch)+'/'+encodePath(cfg.folder);
 $('#repository').href=$('#manage').href=repo+'/tree/'+encodeURIComponent(cfg.branch)+'/'+encodePath(cfg.folder);
 $('#sync').onclick=sync;$('#search').oninput=render;$('#sort').onchange=render;$('#category-select').onchange=e=>chooseCategory(e.target.value);$('#clear').onclick=()=>{type='all';category='all';$('#search').value='';render();};
 $('#viewer').addEventListener('close',close);$('#player').addEventListener('loadedmetadata',()=>{if(Number.isFinite($('#player').duration))$('#viewer-time').textContent=duration($('#player').duration);});
 $('#player').addEventListener('error',()=>{if($('#player').getAttribute('src'))$('#player-error').textContent='当前浏览器无法播放这个文件。可以下载镜头查看，或上传 H.264 编码的 MP4。';});
 $('#playback-speed').onchange=()=>{$('#player').playbackRate=Number($('#playback-speed').value);};$('#share-item').onclick=()=>opened&&shareLink(opened);
 window.addEventListener('hashchange',()=>{if(!migrateLegacyLink())showDeepLink();});
 items=convert(cfg.fallback);
 try{const cache=JSON.parse(localStorage.getItem(key));if(Array.isArray(cache?.tree))items=convert(cache.tree);}catch{}
 render();showDeepLink();if(location.protocol!=='file:')sync();else status('本地预览 · 启动本地服务后可读取 shots 目录');
})();
