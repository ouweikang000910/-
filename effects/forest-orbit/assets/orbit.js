/*
 * Forest Orbit — deterministic DOM adaptation of HyperFrames' installed
 * three-orbiting-cards primitive: paused GSAP state + pure render adapter.
 * CSS perspective provides actual depth sorting around the PNG subject,
 * with offline file:// playback and no required WebGL runtime.
 */
(function(global){
  'use strict';
  const DURATION=9, COUNT=12, TAU=Math.PI*2;
  const CFG=Object.freeze({
    width:1280,height:720,perspective:900,
    centerX:640,centerY:386,radiusX:360,radiusY:116,radiusZ:300,
    revolutionSeconds:6,phase:Math.PI/12,bobPixels:5,bobSeconds:2.8,
    labelAt:5.6,labelEnter:.32
  });
  function create(host,options){
    options=options||{};
    if(!host||!global.gsap) throw new Error('ForestOrbit requires a host and local GSAP.');
    const gsap=global.gsap, base=options.assetBase||'assets/';
    const prefix=(options.id||'forest-orbit')+'-';
    const timeline=options.timeline||gsap.timeline({paused:true});
    const state={seconds:0};
    const layers={background:true,person:true,photos:true,label:true};
    const cards=[], photos=[];
    host.classList.add('fo-host');
    const background=document.createElement('img');
    background.id=prefix+'background';background.className='fo-background';
    background.src=base+'forest.png';background.alt='阳光穿过松树林';
    background.setAttribute('data-layout-allow-overflow','true');host.appendChild(background);
    const space=document.createElement('div');space.className='fo-space';
    const world=document.createElement('div');world.className='fo-world';
    const ring=document.createElement('div');ring.id=prefix+'photos';ring.className='fo-photos';
    space.appendChild(world);world.appendChild(ring);host.appendChild(space);
    for(let i=0;i<COUNT;i++){
      const card=document.createElement('div');
      card.id=prefix+'card-'+String(i+1).padStart(2,'0');card.className='fo-card';
      card.setAttribute('aria-label','自然照片 '+(i+1));
      card.setAttribute('data-layout-allow-occlusion','true');
      const photo=document.createElement('div');photo.className='fo-photo';
      card.appendChild(photo);ring.appendChild(card);cards.push(card);photos.push(photo);
    }
    const person=document.createElement('img');
    person.id=prefix+'person';person.className='fo-person';
    person.src=base+'person.png';person.alt='坐在森林里的男子';
    person.setAttribute('data-layout-allow-overflow','true');
    person.setAttribute('data-layout-allow-occlusion','true');world.appendChild(person);
    gsap.set(person,{z:0,force3D:true});
    const label=document.createElement('div');label.id=prefix+'label';label.className='fo-label';
    const mark=document.createElement('span');mark.className='fo-label-mark';mark.textContent='✦';
    const text=document.createElement('span');text.textContent='the-meta colorize';
    label.appendChild(mark);label.appendChild(text);host.appendChild(label);
    function resetPhotos(){
      photos.forEach(function(photo,i){
        photo.style.backgroundImage='url("'+base+'photos.png")';
        photo.style.backgroundSize='400% 300%';
        photo.style.backgroundPosition=((i%4)*100/3)+'% '+(Math.floor(i/4)*50)+'%';
      });
    }
    function replacePhotos(urls){
      if(!Array.isArray(urls)||urls.length===0) return resetPhotos();
      photos.forEach(function(photo,i){
        photo.style.backgroundImage='url('+JSON.stringify(String(urls[i%urls.length]))+')';
        photo.style.backgroundSize='cover';photo.style.backgroundPosition='center';
      });
    }
    function renderOrbit(){
      const seconds=state.seconds, angular=seconds/CFG.revolutionSeconds*TAU;
      cards.forEach(function(card,i){
        const theta=CFG.phase+i/COUNT*TAU+angular, depth=Math.sin(theta);
        const bob=Math.sin(seconds/CFG.bobSeconds*TAU+i*.73)*CFG.bobPixels;
        gsap.set(card,{
          x:Math.cos(theta)*CFG.radiusX,
          y:CFG.centerY-360+depth*CFG.radiusY+bob,z:depth*CFG.radiusZ,
          xPercent:-50,yPercent:-50,rotationY:90-theta*180/Math.PI,
          rotationX:-depth*5.5+Math.sin(i*.9)*1.4,
          rotation:Math.cos(theta)*2.5+Math.sin(i*1.7)*1.3,force3D:true
        });
        card.dataset.depth=String(Math.round(depth*CFG.radiusZ));
      });
    }
    resetPhotos();renderOrbit();
    timeline.addLabel('环绕开始',0);
    timeline.to(state,{seconds:DURATION,duration:DURATION,ease:'none',onUpdate:renderOrbit},0);
    timeline.addLabel('标签出现',CFG.labelAt);
    timeline.fromTo(label,{autoAlpha:0,y:8,scale:.96},
      {autoAlpha:1,y:0,scale:1,duration:CFG.labelEnter,ease:'power3.out'},CFG.labelAt);
    timeline.seek(0,false);
    function seek(time){
      const safe=Math.max(0,Math.min(DURATION,Number(time)||0));
      timeline.time(safe,false);state.seconds=safe;renderOrbit();return safe;
    }
    function setLayer(name,visible){
      if(!Object.prototype.hasOwnProperty.call(layers,name)) return;
      layers[name]=Boolean(visible);
      const target={background:background,person:person,photos:ring,label:label}[name];
      target.style.display=layers[name]?'':'none';
    }
    return Object.freeze({
      timeline:timeline,duration:DURATION,config:CFG,seek:seek,
      setLayer:setLayer,replacePhotos:replacePhotos,resetPhotos:resetPhotos,
      getState:function(){return {time:state.seconds,layers:Object.assign({},layers)};},
      destroy:function(){timeline.kill();host.replaceChildren();host.classList.remove('fo-host');}
    });
  }
  global.ForestOrbit=Object.freeze({create:create,duration:DURATION,config:CFG});
})(window);
