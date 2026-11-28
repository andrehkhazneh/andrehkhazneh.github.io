/* Each route is a series of cubic curves. The movement table and the painted
   road use the same samples, including the last few steps up to the roots. */
window.createNurseryArena=function({state,save,financeMove,level,visit}){
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
 const bosses=[
   ['الخنفساء العملاقة','Giant Beetle','الوردة الذهبية','Golden Rose',350],
   ['العنكبوت العملاق','Giant Spider','زهرة القمر','Moonflower',450],
   ['العقرب العملاق','Giant Scorpion','زهرة الياقوت','Ruby Flower',550],
   ['الجرادة العملاقة','Giant Grasshopper','زهرة الكريستال','Crystal Flower',650],
   ['ملكة الدبابير','Wasp Queen','زهرة الشمس الملكية','Royal Sunflower',800]
 ];
 const devices=[
   ['المصيدة البنفسجية','Violet Trap'],['مدفع قطرات الماء','Water Cannon'],['رشاش المبيد','Mist Sprayer'],['برج الصعق','Lightning Spire'],['محطة العلاج','Healing Shrine']
 ];
 const descriptions=[['تصعق الحشرات الطائرة','Zaps flying insects'],['يبطئ الحشرات','Slows insects'],['يرش مجموعة قريبة','Hits nearby groups'],['ضرر قوي ضد الزعماء','Heavy damage against bosses'],['ترمّم الشجرة خلال الهجمة','Heals the tree during a wave']];
 // Paint compact tower portraits with the same silhouettes on the map and in the tray.
 const portraits=devices.map((_,type)=>{
   const tile=document.createElement('canvas');tile.width=tile.height=160;
   const pen=tile.getContext('2d');pen.scale(2,2);pen.lineJoin=pen.lineCap='round';
   function shape(path,fill,edge='#213631'){
     const figure=new Path2D(path);pen.fillStyle=fill;pen.fill(figure);
     pen.strokeStyle=edge;pen.lineWidth=2.5;pen.stroke(figure)
   }
   oval(pen,40,68,28,6,'#18342260');
   shape('M17 59 Q40 47 63 59 L61 65 Q40 75 19 65 Z','#9d7950');
   shape('M17 59 Q39 45 63 59 Q41 68 17 59Z','#e5bd78');
   if(type===0){
     shape('M37 61 Q32 46 39 32 L47 33 Q39 48 45 61Z','#469258');
     shape('M41 44 Q15 43 12 16 L23 26 L24 16 L32 27 L35 21 L42 32 L50 18 L51 26 L61 12 Q67 35 41 44Z','#ad4dd2');
     oval(pen,41,34,7,5,'#ffd39b')
   }else if(type===1){
     shape('M25 58 L30 36 L46 34 L54 59Z','#bb8844');
     shape('M20 40 L53 19 L62 32 L29 51Z','#258dc4');
     shape('M49 18 L57 13 L68 30 L60 35Z','#83e9f5');
     oval(pen,36,44,6,6,'#ffd17e')
   }else if(type===2){
     shape('M22 54 Q14 38 29 32 L44 32 Q56 43 49 55 Q36 65 22 54Z','#6eb743');
     shape('M26 31 L24 25 L42 23 L46 31Z','#e6b563');
     shape('M39 29 L45 19 L61 19 L61 28 L48 26 L45 34Z','#4b7653');
     shape('M57 15 L68 13 L68 30 L57 28Z','#bade77');
     oval(pen,28,42,4,6,'#cef483')
   }else if(type===3){
     shape('M29 59 L35 28 L45 28 L52 59Z','#34517e');
     for(const y of [37,46,55])shape('M29 '+y+' l20 -5 l2 4 l-21 6Z','#8eeeff');
     shape('M43 5 L29 25 L39 24 L35 36 L55 15 L44 17Z','#ffe477')
   }else{
     shape('M28 59 L32 43 L48 43 L54 59Z','#d9ac61');
     shape('M40 47 Q17 47 16 27 Q31 28 39 36 Q42 23 63 24 Q60 43 40 47Z','#78b65e');
     shape('M40 38 Q24 28 40 10 Q56 26 40 38Z','#fff0a5');
     oval(pen,40,27,4,6,'#67d9b2')
   }
   return tile.toDataURL()
 });
 const artURL=(group,i)=>group==='device'?portraits[i]:'yasmine/images/arena/'+group+'-'+i+'.webp';
 const bossImages=bosses.map((_,i)=>{const img=new Image();img.src=artURL('boss',i);return img});
 function setup(){
   const s=data();s.devices||={};s.tiers||={};s.wins||={};
   if(s.wave&&s.wave.number==null){s.wave.number=s.round+1;s.wave.total=12;s.wave.legacy=true}
   return s;
 }
 function el(tag,parent,cls){const e=document.createElement(tag);if(cls)e.className=cls;if(parent)parent.append(e);return e}
 const controls=el('div',null,'arena-kit');get('arenaTip').before(controls);
 const palette=el('div',controls,'arena-palette'),deviceBtns=[];
 let selected=1,replay=0;
 devices.forEach((d,i)=>{
   const b=el('button',palette);b.type='button';const img=el('img',b);img.src=artURL('device',i);img.alt='';el('span',b);
   img.draggable=false;b.onclick=()=>{selected=i;labels()};bindDrag(b,i);deviceBtns.push(b);
 });
 function bindDrag(button,type){
   let origin=null,ghost=null,target=null;
   function highlight(next){
     target?.classList.remove('arena-drop');target=next;target?.classList.add('arena-drop')
   }
   function site(event){
     const hit=document.elementFromPoint(event.clientX,event.clientY)?.closest('.arena-pad');
     return hit&&map.contains(hit)&&!hit.disabled&&!data().pads.includes(buttons.indexOf(hit))?hit:null
   }
   function clear(){
     ghost?.remove();ghost=null;highlight(null);origin=null;map.classList.remove('arena-dragging')
   }
   button.onpointerdown=event=>{
     if(!event.isPrimary||event.button!==0||data().wave)return;
     origin={x:event.clientX,y:event.clientY};button.setPointerCapture(event.pointerId)
   };
   button.onpointermove=event=>{
     if(!origin||!event.isPrimary)return;
     if(!ghost){
       if(Math.hypot(event.clientX-origin.x,event.clientY-origin.y)<5)return;
       selected=type;labels();ghost=art('device',type,'arena-ghost');
       document.body.append(ghost);map.classList.add('arena-dragging')
     }
     ghost.style.left=event.clientX+'px';ghost.style.top=event.clientY+'px';highlight(site(event))
   };
   button.onpointerup=event=>{
     if(!origin||!event.isPrimary)return;
     const drop=ghost&&site(event);clear();
     if(drop){selected=type;drop.click()}
   };
   button.onlostpointercapture=button.onpointercancel=clear
 }
 const deviceInfo=el('p',controls),upgrade=el('button',controls),remove=el('button',controls),replays=el('select',controls);
 remove.type=upgrade.type='button';remove.onclick=()=>{selected=-1;labels()};
 upgrade.onclick=()=>{const s=setup(),tier=s.tiers[selected]||1,price=tier*100;
   if(s.wave||selected<0||tier>=3||state.money<price||level()<10)return;
   financeMove(-price,'arenaUpgrade',{device:selected,tier:tier+1});s.tiers[selected]=tier+1;save();labels()
 };
 replays.onchange=()=>{replay=Number(replays.value);labels()};
 const regrowthMs=60000;
 function treat(revive){
   const s=setup(),price=revive?500:50;
   if(level()<10||s.wave||s.regrowUntil||state.money<price)return;
   if(revive?s.hp!==0:s.hp<=0||s.hp>=1000)return;
   financeMove(-price,revive?'arenaRevive':'arenaHeal');
   if(revive)s.regrowUntil=Date.now()+regrowthMs;
   else s.hp=Math.min(1000,s.hp+100);
   save();labels()
 }
 get('arenaHeal').onclick=()=>treat(false);
 get('arenaRevive').onclick=()=>treat(true);
 function bossAt(n){return n%5===0?(n/5-1)%5:null}
 function art(group,i,cls=''){const im=document.createElement('img');im.src=artURL(group,i);im.alt='';im.className=cls;return im}
 function book(after){
   const panel=el('section',null,'panel boss-book');panel.hidden=true;get(after).after(panel);return panel
 }
 const guide=book('encyclopediaArea'),medals=book('achievementsArea'),bed=el('section',get('nurseryArea'),'panel boss-book');
 let bookStamp='';
 function renderBooks(active){
   const s=setup(),owned=Object.keys(s.wins),ready=s.bed&&Date.now()>=s.bed.ready;
   guide.hidden=active!=='encyclopedia';medals.hidden=active!=='achievements';bed.hidden=active!=='nursery'||!owned.length;
   if(guide.hidden&&medals.hidden&&bed.hidden){bookStamp='';return}
   const seconds=s.bed?Math.max(0,Math.ceil((s.bed.ready-Date.now())/1000)):0;
   const stamp=JSON.stringify([active,state.lang,owned,s.bed,active==='nursery'?seconds:0]);
   if(stamp===bookStamp)return;bookStamp=stamp;
   const panel=active==='nursery'?bed:active==='achievements'?medals:guide;panel.replaceChildren();
   el('h3',panel).textContent=active==='nursery'?t('مشتل النباتات النادرة','Rare plant bed'):active==='achievements'?t('أوسمة زعماء الساحة','Arena boss medals'):t('النباتات النادرة','Rare plants');
   for(let i=0;i<bosses.length;i++){
     const won=!!s.wins[i],d=bosses[i];
     if(panel===bed&&!won)continue;
     const card=el('div',panel,'boss-entry');
     card.append(art(panel===medals?'boss':'flower',i,(won?'':'undiscovered ')+(panel===medals?'boss-medal':'')));
     const desc=el('div',card);el('strong',desc).textContent=panel===medals?t('وسام ','Medal · ')+t(d[0],d[1]):won?t(d[2],d[3]):t('نبات غير مكتشف','Undiscovered plant');
     el('small',desc).textContent=t('الموجة ','Wave ')+(i+1)*5+' · '+(won?t('مكتشف','Unlocked'):t('اهزم ','Defeat ')+t(d[0],d[1]));
     if(panel!==bed)continue;
     const b=el('button',card);b.disabled=!!s.bed&&(s.bed.kind!==i||!ready);
     b.textContent=!s.bed?t('ازرع','Plant'):s.bed.kind!==i?t('الحوض مشغول','Bed occupied'):ready?t('بيع · ','Sell · ')+d[4]+' 🪙':t('عم تنمو · ','Growing · ')+seconds+t(' ث','s');
     b.onclick=()=>{if(!s.wins[i])return;if(!s.bed)s.bed={kind:i,ready:Date.now()+90000};
       else if(s.bed.kind===i&&Date.now()>=s.bed.ready){financeMove(d[4],'sales',{rarePlant:i});s.bed=null}else return;
       save();bookStamp='';renderBooks('nursery')};
   }
 }
 function locate(bug){const path=paths[bug.lane];return path.find(p=>p.dist>=bug.distance)||path[path.length-1]}
 function bugArt(bug,time){
   const p=locate(bug),before=locate({...bug,distance:bug.distance-5});
   if(bug.boss!=null){
     const art=bossImages[bug.boss];
     if(art.complete&&art.naturalWidth)c.drawImage(art,p.x-28,p.y-30,56,56);
     else oval(c,p.x,p.y,16,12,'#6f3648');
     c.fillStyle='#392c30';c.fillRect(p.x-20,p.y-29,40,4);
     c.fillStyle='#f8ce59';c.fillRect(p.x-20,p.y-29,40*bug.hp/bug.max,4);return;
   }
   const beat=time*.018+bug.id, lift=bug.flying?6+2*Math.sin(beat*.4):0;
   oval(c,p.x,p.y+3,11,4,'#30291d48');
   c.save();c.translate(p.x,p.y-lift);c.rotate(Math.atan2(p.y-before.y,p.x-before.x));
   c.lineCap='round';c.strokeStyle='#332c29';c.lineWidth=2;
   for(const side of [-1,1])for(const x of [-6,0,6]){
     const stride=3*Math.sin(beat+x+side);
     c.beginPath();c.moveTo(x,side*4);c.lineTo(x-3,side*8);c.lineTo(x+stride,side*11);c.stroke()
   }
   oval(c,7,0,6,5,'#342c36');
   if(bug.flying){
     oval(c,-3,0,11,6,'#ffc248');
     for(const x of [-7,-1])oval(c,x,0,2,5.5,'#423327');
     for(const side of [-1,1]){
       c.save();c.rotate(side*(.45+.3*Math.sin(beat*2)));oval(c,-6,side*6,8,4,'#e2faffde');c.restore()
     }
   }else{
     oval(c,-3,0,11,8,'#442b34');oval(c,-3,0,9.5,7,bug.lane===1?'#ed793f':'#c54d5e');
     c.fillStyle='#552c38';c.fillRect(-12,-.8,17,1.6);
     for(const side of [-1,1])for(const x of [-7,0])oval(c,x,side*3.5,1.8,1.8,'#492c39')
   }
   oval(c,10,-2,1.6,1.6,'#fff3ae');c.restore()
 }
 function effect(shot){
   const [sx,sy]=pads[shot.from]||[shot.x,shot.y],dx=shot.x-sx,dy=shot.y-sy;
   const age=1-shot.life/shot.duration,travel=Math.min(1,age*2);
   const colors=['#df97ff','#86efff','#b9ed72','#9fe8ff','#8ef0ac','#ff984f'];
   const color=colors[shot.type];c.save();c.globalAlpha=Math.min(1,shot.life*7);c.lineCap='round';
   if(shot.type===3||shot.type===0){
     c.beginPath();c.moveTo(sx,sy);
     for(let n=1;n<8;n++){
       const bend=Math.sin(n*9+Math.floor(age*6))*9,len=Math.hypot(dx,dy)||1;
       c.lineTo(sx+dx*n/8-dy/len*bend,sy+dy*n/8+dx/len*bend)
     }
     c.lineTo(shot.x,shot.y);c.strokeStyle=shot.type===3?'#4278d9':'#8b45b7';c.lineWidth=6;c.stroke();
     c.strokeStyle=color;c.lineWidth=2.5;c.stroke()
   }else if(shot.type<5){
     for(let k=0;k<7;k++){
       const f=Math.max(0,travel-k*.055),spread=shot.type===2?Math.sin(k*7)*f*13:0;
       oval(c,sx+dx*f+spread,sy+dy*f-Math.sin(f*Math.PI)*12+spread*.45,5-k*.45,4-k*.32,color)
     }
   }
   if(age>.45||shot.type===5){
     const radius=4+age*(shot.type===2?34:19);
     c.beginPath();c.arc(shot.x,shot.y,radius,0,Math.PI*2);c.strokeStyle=color;c.lineWidth=3*(1-age)+1;c.stroke();
     for(let i=0;i<6;i++)oval(c,shot.x+Math.cos(i*1.047)*radius,shot.y+Math.sin(i*1.047)*radius,2,2,color)
   }
   c.restore()
 }
 function burst(from,x,y,type){
   shots.push({from,x,y,type,life:.45,duration:.45})
 }
 function draw(time){
   c.setTransform(4/3,0,0,4/3,0,0);c.drawImage(land,0,0,600,600);
   const s=data();for(const bug of s.wave?.bugs||[])bugArt(bug,time);
   if(tree.complete&&tree.naturalWidth){const h=s.regrowUntil?60+160*Math.max(0,1-(s.regrowUntil-Date.now())/regrowthMs):s.hp?220:80,w=h*tree.naturalWidth/tree.naturalHeight;c.drawImage(tree,300-w/2,311-h,w,h)}
   for(const shot of shots)effect(shot);
 }
 function step(dt){
   const s=data(),w=s.wave;if(!w)return;
   w.clock+=dt;
   const boss=bossAt(w.number),total=w.total;
   if(w.sent<total&&w.clock>=w.sent*1.15){
     const isBoss=!w.legacy&&boss!=null&&w.sent===total-1;
     const hp=isBoss?16+boss*5:3+Math.min(4,Math.floor((w.number-1)/5));
     w.bugs.push({id:w.sent,lane:(w.sent+w.number-1)%3,distance:0,hp,max:hp,boss:isBoss?boss:null,flying:isBoss?boss===4:w.sent%3===1});w.sent++
   }
   for(const bug of w.bugs)bug.distance+=dt*(bug.boss!=null?24:39)*(bug.slow>w.clock?.55:1);
   for(const index of s.pads){
     if((w.cool[index]||0)>w.clock)continue;
     const type=s.devices[index]??1,tier=s.tiers[type]||1,[x,y]=pads[index];
     if(type===4){if(s.hp<1000)burst(index,300,280,4);s.hp=Math.min(1000,s.hp+10*tier);w.cool[index]=w.clock+3;continue}
     const within=w.bugs.filter(b=>b.hp>0&&(type!==0||b.flying)&&Math.hypot(locate(b).x-x,locate(b).y-y)<(type===3?155:122)+10*tier);
     within.sort((a,b)=>(type===3?Number(b.boss!=null)-Number(a.boss!=null):0)||b.distance-a.distance);
     const target=within[0];if(!target)continue;
     const point=locate(target),damage=type===3?(target.boss!=null?5:2):type===0?4:2;
     const hits=type===2?w.bugs.filter(b=>Math.hypot(locate(b).x-point.x,locate(b).y-point.y)<50):[target];
     for(const b of hits){b.hp-=damage+tier-1;if(type===1)b.slow=w.clock+2}
     w.cool[index]=w.clock+(type===3?1.25:.85);burst(index,point.x,point.y,type)
   }
   w.bugs=w.bugs.filter(b=>{
     if(b.hp<=0){w.stopped++;if(b.boss!=null){w.defeated=true;if(!s.wins[b.boss]){s.wins[b.boss]=true;s.newPrize=b.boss;w.savePrize=true}}return false}
     if(b.distance>=paths[b.lane].at(-1).dist){burst(-1,300,306,5);s.hp=Math.max(0,s.hp-(b.boss!=null?230:80));return false}return true
   });
   if(w.savePrize){delete w.savePrize;save()}
   if(s.hp===0||(w.sent===total&&!w.bugs.length)){
     s.last=w.stopped;s.lastTotal=total;
     const cleared=s.hp>0&&(w.legacy||boss==null||w.defeated);
     s.lastReward=0;
     if(cleared&&!w.replay&&w.number>s.round){
       s.round=w.number;s.lastReward=w.stopped*2;
       if(s.lastReward)financeMove(s.lastReward,'arenaReward',{wave:w.number})
     }
     s.retry=!cleared;s.wave=null;save();labels()
   }

 }
 function labels(){
   const s=data(),w=s.wave;
   get('arenaTitle').textContent=t('ساحة الدفاع','Defense arena');
   get('arenaIntro').textContent=t('كبر مشتلك ولفت نظر الأعداء. رح يبعثوا حشرات من بين الشجيرات لتهاجم شجرة روح المشتل. بس لا تشيل هم، فيك تحميها!','Your nursery has grown and drawn the attention of rivals. They’re sending insects through the hedges to attack the Nursery Spirit Tree. You can protect it!');
   get('arenaBack').textContent=t('رجوع','Back');
   get('arenaTree').textContent=t('شجرة روح المشتل','Nursery Spirit Tree');
   get('arenaHealth').value=s.hp;get('arenaHP').textContent=s.hp+' / 1000';
   get('arenaHeal').textContent=t('علاج +١٠٠ · ٥٠ عملة','Heal +100 · 50 coins');
   get('arenaRevive').textContent=t('إعادة الإحياء · ٥٠٠ عملة','Revive · 500 coins');
   get('arenaHeal').disabled=!!w||s.hp<=0||s.hp>=1000||state.money<50;
   get('arenaRevive').disabled=!!w||s.hp!==0||!!s.regrowUntil||state.money<500;
   get('arenaCareNotice').textContent=s.regrowUntil?t('عم تنمو الشجرة من جديد · ','Tree regrowing · ')+Math.max(0,Math.ceil((s.regrowUntil-Date.now())/1000))+t(' ث','s'):
     !s.hp?t('توقفت المعركة. فيك تكمّل شغل المشتل وترجع تحيي الشجرة.','Battle paused. Keep running the nursery and return to revive the tree.'):
     w?t('العلاج اليدوي متاح بين الموجات.','Manual treatment is available between waves.'):t('رصيد المشتل · ','Nursery balance · ')+state.money+' 🪙';
   const n=w?.number||replay||s.round+1, boss=bossAt(n);
   const tier=s.tiers[selected]||1;
   deviceBtns.forEach((b,i)=>{b.lastChild.textContent=t(...devices[i]);b.setAttribute('aria-pressed',String(selected===i));b.disabled=!!w});
   remove.textContent=t('فكّ جهاز','Remove device');remove.disabled=!!w;remove.setAttribute('aria-pressed',String(selected===-1));
   deviceInfo.textContent=selected<0?t('اختَر الجهاز على الخريطة لفكّه.','Tap a device on the map to remove it.'):t(...descriptions[selected])+t(' · المستوى ',' · Level ')+tier;
   upgrade.hidden=selected<0||tier===3;upgrade.disabled=!!w||state.money<tier*100;upgrade.textContent=t('ترقية · ','Upgrade · ')+tier*100+' 🪙';
   const options=[[0,t('الموجة التالية ','Next wave ')+(s.round+1)],...bosses.map((d,i)=>[(i+1)*5,t('إعادة · ','Replay · ')+t(d[0],d[1])]).filter(([num])=>num<=s.round)];
   const optionsKey=JSON.stringify(options);if(replays.dataset.key!==optionsKey){replays.replaceChildren();for(const [num,label] of options)replays.add(new Option(label,num));replays.dataset.key=optionsKey}
   replays.value=replay;replays.disabled=!!w;replays.setAttribute('aria-label',t('اختيار الموجة','Select wave'));
   get('arenaTip').textContent=t('الموجة ','Wave ')+n+(boss!=null?' · '+t(bosses[boss][0],bosses[boss][1]):'')+' — '+(w?t('احمِ شجرة روح المشتل!','Protect the Spirit Tree!'):t('اسحب البرج من تحت الخريطة وفلته فوق إشارة +.','Drag a tower from the tray onto a + site.'));
   const prize=s.newPrize==null?null:bosses[s.newPrize];
   get('arenaStatus').textContent=w?t('تم صدّ ','Stopped ')+w.stopped+' / '+w.total:prize?t('🏅 ربحت وسام ','🏅 Earned the medal for ')+t(prize[0],prize[1])+t(' وفتحت زراعة ',' and unlocked ')+t(prize[2],prize[3]):s.retry?t('جرّب الموجة من جديد','Try the wave again'):s.last!=null?t('آخر موجة · ','Last wave · ')+s.last+' / '+(s.lastTotal||12):t('الدفاعات المركبة ','Devices placed ')+s.pads.length+' / '+pads.length;
   if(!w&&s.lastReward)get('arenaStatus').textContent+=' · +'+s.lastReward+' 🪙';
   const start=get('arenaStart');start.hidden=!!w;start.disabled=!s.hp||!!s.regrowUntil||!s.pads.length;start.textContent=t('ابدأ الموجة','Start wave');
   buttons.forEach((b,i)=>{const on=s.pads.includes(i),type=s.devices[i]??1;
     if(b.dataset.icon!==String(on?type:-1)){b.replaceChildren();if(on)b.append(art('device',type));else b.textContent='+';b.dataset.icon=on?type:-1}
     b.disabled=!!w||(!on&&selected<0);b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',(on?t(...devices[type]):t('موقع فارغ','Empty site'))+' '+(i+1))});
 }
 pads.forEach(([x,y],i)=>{const b=document.createElement('button');b.type='button';b.className='arena-pad';b.style.left=x/6+'%';b.style.top=y/6+'%';b.onclick=()=>{
   const s=setup();if(level()<10||s.wave)return;
   if(selected<0){s.pads=s.pads.filter(n=>n!==i);delete s.devices[i]}
   else {if(!s.pads.includes(i))s.pads.push(i);s.devices[i]=selected}
   save();labels()
 };buttons.push(b);map.append(b)});
 get('arenaStart').onclick=()=>{const s=setup();if(level()<10||s.wave||!s.hp||s.regrowUntil)return;
   if(s.pads.length){const number=replay||s.round+1;s.newPrize=null;s.wave={number,total:12+Math.min(12,number-1),replay:!!replay,clock:0,sent:0,stopped:0,bugs:[],cool:{}}}
   save();labels()};

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
   const s=data();
   if(s.regrowUntil&&Date.now()>=s.regrowUntil){s.hp=1000;delete s.regrowUntil;save()}
   renderBooks(active);
   const open=level()>=10;tab.disabled=!open;tab.textContent=(open?'🛡️ ':'🔒 ')+t('ساحة الدفاع','Defense arena')+(open?'':t(' · المستوى ١٠',' · Level 10'));
   area.hidden=active!=='arena'||!open;tab.setAttribute('aria-pressed',String(!area.hidden));
   if(area.hidden){if(frame)cancelAnimationFrame(frame);frame=0;previous=0;return}
   labels();if(!frame&&!document.hidden)frame=requestAnimationFrame(animate);
 }
 tree.onload=()=>{if(!area.hidden)draw(performance.now())};
 get('arenaStart').addEventListener('click',()=>{if(!frame)frame=requestAnimationFrame(animate)});
 return refresh;
};
