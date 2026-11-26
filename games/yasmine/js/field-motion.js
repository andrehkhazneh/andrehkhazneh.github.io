// Paint the rain and the walking cat in the same coordinate system as the nursery floor.
(function () {
  const scene = document.getElementById('scene');
  const spy = document.getElementById('spyMimi');
  const canvas = document.createElement('canvas');
  canvas.id = 'fieldMotion';
  canvas.setAttribute('aria-hidden', 'true');
  scene.append(canvas);
  const ctx = canvas.getContext('2d');
  const walk = new Image();
  walk.src = 'yasmine/images/cat-care/walk.webp';
  const frames = [0,6,2,7,3,5,1,4];
  const drops = Array.from({length:52}, (_,i)=>({
    x:(i*.61803399)%1, y:(i*.3819)%1, speed:.72+(i%7)*.09
  }));
  let visible=false, request=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const smooth=n=>{n=Math.min(1,Math.max(0,n));return n*n*(3-2*n)};
  function pose(t){
    const creep=smooth(t/2.3), lean=smooth((t-2.5)/.8),duck=smooth((t-4)/.23),escape=smooth((t-6.25)/1.65);
    const x=1.14-.638*creep-.11*lean+.11*duck+.66*escape;
    const face=t<6.25?-1:1;
    const steps=(1.14-x)*64;
    const stride=t<2.3||t>6.25?Math.abs(Math.sin(steps)):0;
    return {x,face,step:Math.floor(Math.abs(steps)*1.4)%8,
      height:.68+.19*lean-.29*duck+.37*escape, bob:stride*.006};
  }
  function draw(now){
    request=0;
    const w=scene.clientWidth,h=scene.clientHeight,ratio=Math.min(devicePixelRatio||1,2);
    if(canvas.width!==Math.round(w*ratio)||canvas.height!==Math.round(h*ratio)){
      canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
    }
    ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);
    const spying=!spy.hidden, raining=scene.dataset.weather==='rain';
    if(!visible||document.hidden||(!raining&&!spying))return;
    if(spying && walk.naturalWidth){
      const t=Math.max(0,Math.min(8,8-(Number(spy.dataset.end)-Date.now())/1000));
      const p=pose(reduced.matches?(t<4?3.6:4.5):t);
      const size=Math.min(w*.215,h*.32),height=size*1.27*p.height;
      const fw=walk.width/4,fh=walk.height/2,frame=frames[p.step];
      ctx.save();ctx.translate(w*p.x,h*(.939-p.bob));ctx.scale(p.face,1);
      ctx.fillStyle='rgba(63,44,23,.17)';ctx.beginPath();ctx.ellipse(0,0,size*.32,size*.032,0,0,2*Math.PI);ctx.fill();
      ctx.drawImage(walk,(frame%4)*fw,Math.floor(frame/4)*fh,fw,fh,-size*.5,-height*.91,size,height);
      ctx.restore();
    }
    if(raining){
      ctx.lineWidth=1.2;ctx.strokeStyle='rgba(223,242,255,.75)';ctx.beginPath();
      for(const d of drops){
        const y=((d.y+now*.00075*d.speed)%1)*(h+18)-10;
        const x=(d.x*w-y*.13+w)%w;
        ctx.moveTo(x,y);ctx.lineTo(x-1.7,y+7*d.speed);
      }
      ctx.stroke();
    }
    request=requestAnimationFrame(draw);
  }
  function sync(){
    cancelAnimationFrame(request);request=requestAnimationFrame(draw);
  }
  const changes=new MutationObserver(sync);
  changes.observe(scene,{attributes:true,attributeFilter:['data-weather']});
  changes.observe(spy,{attributes:true,attributeFilter:['hidden']});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()}).observe(scene);
  document.addEventListener('visibilitychange',sync);
})();
