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
  let visible=false, request=0, start=null;
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
      const t=Math.min(8,(now-(start??now))/1000);
      const outbound=t<5.4;
      const progress=outbound?Math.min(1,t/3.1):Math.max(0,1-(t-5.4)/2.6);
      // A brief step past the planter reveals her face before she ducks back.
      const peek=t>=3.1&&t<=5.4?Math.sin(Math.PI*(t-3.1)/2.3)**2:0;
      const x=w*(1.13-progress*.64-.125*peek),floor=h*.94,size=Math.min(w*.26,h*.39);
      const frame=frames[Math.floor(progress*w*.64/(size*.38)*8)%8];
      const fw=walk.width/4,fh=walk.height/2;
      ctx.save();ctx.translate(x,floor);ctx.scale(outbound?-1:1,1);
      ctx.fillStyle='rgba(63,44,23,.16)';ctx.beginPath();ctx.ellipse(0,0,size*.30,size*.035,0,0,2*Math.PI);ctx.fill();
      ctx.drawImage(walk,(frame%4)*fw,Math.floor(frame/4)*fh,fw,fh,-size*.5,-size*1.10,size,size*1.33);
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
    if(spy.hidden)start=null;else if(start===null)start=performance.now();
    cancelAnimationFrame(request);request=requestAnimationFrame(draw);
  }
  const changes=new MutationObserver(sync);
  changes.observe(scene,{attributes:true,attributeFilter:['data-weather']});
  changes.observe(spy,{attributes:true,attributeFilter:['hidden']});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()}).observe(scene);
  document.addEventListener('visibilitychange',sync);
})();
