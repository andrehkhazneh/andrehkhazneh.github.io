/* Each route is a series of cubic curves. The movement table and the painted
   road use the same samples, including the last few steps up to the roots. */
window.createNurseryArena=function({state,save,level,visit}){
 const get=id=>document.getElementById(id),tab=get('arenaTab'),area=get('arenaArea'),map=get('arenaMap');
 const routeShapes=[
  [[-15,126],[63,105,71,213,129,203],[217,193,154,319,239,318],[265,318,276,310,300,306]],
  [[609,84],[528,80,556,194,491,205],[431,211,457,300,389,317],[353,329,324,312,300,306]],
  [[81,615],[78,524,246,550,222,480],[200,412,363,463,354,382],[349,348,313,331,300,306]]
 ];
 function buildRoute(shape){
   let [x,y]=shape[0],dist=0;const points=[{x,y,dist}];
   for(const [ax,ay,bx,by,ex,ey] of shape.slice(1)){
     for(let i=1;i<=50;i++){
       const t=i/50,u=1-t,nx=u*u*u*x+3*u*u*t*ax+3*u*t*t*bx+t*t*t*ex,ny=u*u*u*y+3*u*u*t*ay+3*u*t*t*by+t*t*t*ey;
       const last=points[points.length-1];dist+=Math.hypot(nx-last.x,ny-last.y);points.push({x:nx,y:ny,dist});
     }
     x=ex;y=ey;
   }
   return points;
 }
 const paths=routeShapes.map(buildRoute),pads=[[67,223],[173,290],[540,217],[413,259],[150,488],[303,392]];
 const tree=new Image();tree.src='yasmine/images/spirit-oak.webp?v=1';
 const land=document.createElement('canvas');land.width=land.height=800;
 const g=land.getContext('2d');g.scale(4/3,4/3);
 let seed=713;function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
 function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
 const meadow=g.createRadialGradient(300,295,40,300,295,425);meadow.addColorStop(0,'#bbcb75');meadow.addColorStop(.66,'#86a967');meadow.addColorStop(1,'#416d50');g.fillStyle=meadow;g.fillRect(0,0,600,600);
 for(let i=0;i<5300;i++){const x=rand()*600,y=rand()*600;oval(g,x,y,1+rand()*3,1+rand(),i%4?'#405e3329':'#f8eab556');if(i%9===0){g.strokeStyle='#537c47';g.beginPath();g.moveTo(x,y);g.lineTo(x-2,y-5);g.moveTo(x,y);g.lineTo(x+2,y-4);g.stroke()}}
 // Low flowering hedges frame the clearing.
 for(let i=0;i<420;i++){
   let x=rand()*600,y=rand()*600;if(Math.min(x,y,600-x,600-y)>29+rand()*24)continue;
   const r=8+rand()*15;oval(g,x+3,y+7,r,r*.75,'#294d41');oval(g,x,y,r,r*.78,'#457451');oval(g,x-3,y-4,r*.78,r*.52,'#639454');oval(g,x-5,y-6,r*.52,r*.32,'#87aa62');
   if(i%3===0){oval(g,x,y,2.3,2.1,'#e7bc75');oval(g,x+5,y+2,2.1,1.9,'#ffdeb0')}
 }
 for(const path of paths){
   g.lineCap='round';g.lineJoin='round';
   for(const [width,color] of [[40,'#607845'],[35,'#93855b'],[31,'#d0b579'],[24,'#ddc58b']]){
     g.strokeStyle=color;g.lineWidth=width;g.beginPath();path.forEach(({x,y},i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();
   }
   for(let i=0;i<path.length;i+=2){const p=path[i];oval(g,p.x+rand()*18-9,p.y+rand()*14-7,2+rand()*3,1.3,'#ae966950')}
 }
 oval(g,300,310,68,22,'#839953');oval(g,301,309,54,15,'#687f46');
 const c=get('arenaCanvas').getContext('2d'),buttons=[],shots=[];
 const ar=()=>state.lang!=='en',t=(a,b)=>ar()?a:b;
 function data(){return state.arena ||= {hp:1000,pads:[],round:0,wave:null}}
 function locate(bug){const path=paths[bug.lane];return path.find(p=>p.dist>=bug.distance)||path[path.length-1]}
 function bugArt(bug,time){
   const p=locate(bug),before=locate({...bug,distance:bug.distance-5});
   c.save();c.translate(p.x,p.y);c.rotate(Math.atan2(p.y-before.y,p.x-before.x));const gait=Math.sin(time*.017+bug.id)*2;
   c.strokeStyle='#30293a';c.lineWidth=2.2;
   for(const s of [-1,1])for(const x of [-5,0,5]){c.beginPath();c.moveTo(x,s*3);c.lineTo(x-2,s*8);c.lineTo(x+gait,s*11);c.stroke()}
   oval(c,6,0,4,5,'#2b3931');oval(c,-1,0,8,6.5,bug.lane===1?'#9d5239':'#653f65');oval(c,-3,-2,4,2,'#dfac83');c.restore();
 }
 function draw(time){
   c.setTransform(4/3,0,0,4/3,0,0);c.drawImage(land,0,0,600,600);
   const s=data();for(const bug of s.wave?.bugs||[])bugArt(bug,time);
   if(tree.complete&&tree.naturalWidth){const h=220,w=h*tree.naturalWidth/tree.naturalHeight;c.drawImage(tree,300-w/2,311-h,w,h)}
   for(const shot of shots){c.strokeStyle='rgba(255,240,143,'+Math.min(1,shot.life*5)+')';c.lineWidth=3;c.beginPath();c.moveTo(...pads[shot.from]);c.lineTo(shot.x,shot.y);c.stroke();oval(c,shot.x,shot.y,4,4,'#fff6b4')}
 }
 function step(dt){
   const s=data(),w=s.wave;if(!w)return;
   w.clock+=dt;
   if(w.sent<12&&w.clock>=w.sent*1.2){w.bugs.push({id:w.sent,lane:(w.sent+s.round)%3,distance:0,hp:3});w.sent++}
   for(const bug of w.bugs)bug.distance+=dt*39;
   for(const index of s.pads){
     if((w.cool[index]||0)>w.clock)continue;
     const [x,y]=pads[index];
     const target=w.bugs.filter(b=>b.hp>0&&Math.hypot(locate(b).x-x,locate(b).y-y)<108).sort((a,b)=>b.distance-a.distance)[0];
     if(target){const point=locate(target);target.hp--;w.cool[index]=w.clock+.8;shots.push({from:index,x:point.x,y:point.y,life:.22})}
   }
   w.bugs=w.bugs.filter(b=>{if(b.hp<=0){w.stopped++;return false}if(b.distance>=paths[b.lane].at(-1).dist){s.hp=Math.max(0,s.hp-80);return false}return true});
   if(s.hp===0||(w.sent===12&&!w.bugs.length)){s.last=w.stopped;s.round++;s.wave=null;save();labels()}
 }
 function labels(){
   const s=data(),w=s.wave;
   get('arenaTitle').textContent=t('ساحة الدفاع','Defense arena');
   get('arenaIntro').textContent=t('كبر مشتلك ولفت نظر الأعداء. رح يبعثوا حشرات من بين الشجيرات لتهاجم شجرة روح المشتل. بس لا تشيل هم، فيك تحميها!','Your nursery has grown and drawn the attention of rivals. They’re sending insects through the hedges to attack the Nursery Spirit Tree. You can protect it!');
   get('arenaBack').textContent=t('رجوع','Back');
   get('arenaTree').textContent=t('شجرة روح المشتل','Nursery Spirit Tree');
   get('arenaHealth').value=s.hp;get('arenaHP').textContent=s.hp+' / 1000';
   const tip=t('اضغط على + لتركيب زهرة حارسة. فيك توزّع ٣ زهرات وتغيّر أماكنها قبل الهجمة.','Tap + to plant a flower turret. Position up to three and move them before the wave.');
   get('arenaTip').textContent=w?t('الحشرات عم تقرب! الزهرات بتطلق بذور مضيئة تلقائياً.','The insects are approaching! Your flowers fire glowing seeds automatically.'):tip;
   get('arenaStatus').textContent=w?t('تم صدّ ','Stopped ')+w.stopped+' / 12':s.last!=null?t('آخر هجمة · انصدّ منها ','Last wave · stopped ')+s.last+' / 12':t('الدفاعات المركّبة ','Defenses placed ')+s.pads.length+' / 3';
   const start=get('arenaStart');start.hidden=!!w;start.disabled=!!s.hp&&!s.pads.length;start.textContent=s.hp?t('ابدأ هجمة الحشرات','Start insect wave'):t('جدّد الشجرة','Restore tree');
   buttons.forEach((b,i)=>{const on=s.pads.includes(i);b.textContent=on?'✿':'+';b.disabled=!!w||(!on&&s.pads.length>=3);b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',t(on?'إزالة الدفاع من الموقع ':'تركيب دفاع في الموقع ',on?'Remove turret from site ':'Place turret at site ')+(i+1))});
 }
 pads.forEach(([x,y],i)=>{const b=document.createElement('button');b.type='button';b.className='arena-pad';b.style.left=x/6+'%';b.style.top=y/6+'%';b.onclick=()=>{
   const s=data();if(level()<10||s.wave)return;
   if(s.pads.includes(i))s.pads=s.pads.filter(n=>n!==i);else if(s.pads.length<3)s.pads.push(i);save();labels()
 };buttons.push(b);map.append(b)});
 get('arenaStart').onclick=()=>{const s=data();if(level()<10||s.wave)return;if(!s.hp){s.hp=1000;s.last=null}else if(s.pads.length)s.wave={clock:0,sent:0,stopped:0,bugs:[],cool:{}};save();labels()};
 get('arenaBack').onclick=()=>visit('overview');
 tab.onclick=()=>{if(level()>=10){visit(area.hidden?'arena':'overview');if(!area.hidden)area.scrollIntoView({block:'start'})}};
 let frame=0,previous=0;
 function animate(now){
   frame=0;if(area.hidden||document.hidden){previous=0;return}
   const dt=previous?Math.min(.12,(now-previous)/1000):0;previous=now;step(dt);
   for(let i=shots.length-1;i>=0;i--){shots[i].life-=dt;if(shots[i].life<=0)shots.splice(i,1)}
   draw(now);if(data().wave||shots.length)frame=requestAnimationFrame(animate);else previous=0;
 }
 function refresh(active){
   const open=level()>=10;tab.disabled=!open;tab.textContent=(open?'🛡️ ':'🔒 ')+t('ساحة الدفاع','Defense arena')+(open?'':t(' · المستوى ١٠',' · Level 10'));
   area.hidden=active!=='arena'||!open;tab.setAttribute('aria-pressed',String(!area.hidden));
   if(area.hidden){if(frame)cancelAnimationFrame(frame);frame=0;previous=0;return}
   labels();if(!frame&&!document.hidden)frame=requestAnimationFrame(animate);
 }
 tree.onload=()=>{if(!area.hidden)draw(performance.now())};
 get('arenaStart').addEventListener('click',()=>{if(!frame)frame=requestAnimationFrame(animate)});
 return refresh;
};
