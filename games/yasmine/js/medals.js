/* Paint the same medal for the cabinet, the enlarged view and the story card. */
(function () {
'use strict';
const designs = {
 sales50: ['#ae603a','#ffdda2','#264d53',0,'coins'],
 sales100:['#526879','#f1f8ff','#614772',8,'shop'],
 sales500:['#ad721c','#ffed99','#823a48',12,'crown'],
 level5:  ['#357153','#bce49a','#b07843',6,'sprout'],
 team:    ['#357388','#b5eced','#324978',10,'team'],
 cat50:   ['#ad6c39','#ffe0b3','#82503a',0,'paw'],
 heart50: ['#ad4576','#ffccdb','#73445f',8,'heart'],
 geo25:   ['#986b39','#ffe2a3','#436c61',6,'compass'],
 geo100:  ['#316693','#bde7ff','#345081',0,'globe'],
 geo200:  ['#665095','#f2d5ff','#5a3879',12,'mountain'],
 plants:  ['#507337','#e7ec9e','#32664c',10,'flower']
};
const icons = {
 coins:'M31 61h30v6H31z M31 51h30v6H31z M38 41h30v6H38z',
 shop:'M28 47l5-12h34l5 12z M32 51h6v15h8V54h11v12h6V51h5v20H32z',
 crown:'M27 41l13 9 10-18 10 18 13-9-6 24H33z M34 69h32v4H34z',
 sprout:'M48 70V54Q29 55 27 36q22 0 25 16 3-22 23-23-1 26-22 28v13z',
 team:'M50 32a7 7 0 1 1-.01 0 M31 40a6 6 0 1 1-.01 0 M69 40a6 6 0 1 1-.01 0 M37 66q0-17 13-17t13 17z M22 64q0-13 10-13l5 1-5 12z M68 64l-5-12 5-1q10 0 10 13z',
 paw:'M38 55q12-18 24 0 13 20-7 13-5-2-10 0-20 7-7-13z M29 41a5 7 0 1 1-.01 0 M43 33a5 7 0 1 1-.01 0 M57 33a5 7 0 1 1-.01 0 M70 42a5 7 0 1 1-.01 0',
 heart:'M50 71Q18 50 31 37q10-10 19 2 9-12 19-2Q82 50 50 71z',
 compass:'M65 32L55 55 34 69l10-25z M50 46l-4 9 9-6z',
 globe:'M50 30a21 21 0 1 0 .01 0 M50 34q-8 7-8 14h16q0-7-8-14z M34 48h5q0-7 5-13-8 3-10 13z M61 48h5q-2-10-10-13 5 6 5 13z M34 53q2 10 10 14-5-7-5-14z M42 53q0 8 8 15 8-7 8-15z M61 53q0 7-5 14 8-4 10-14z',
 mountain:'M24 67l19-28 7 10 9-18 20 36z M52 49l6 3 4-3 4 4-7-14z',
 flower:'M50 49C23 33 51 16 53 42 62 17 84 41 59 49 85 54 68 79 55 57 56 84 28 75 43 55 16 65 18 37 44 47z'
};
const cache = new Map();
function medal(id) {
 if(cache.has(id)) return cache.get(id);
 const [dark,light,ribbon,sides,icon]=designs[id];
 const canvas=document.createElement('canvas');canvas.width=canvas.height=400;
 const ctx=canvas.getContext('2d');ctx.scale(4,4);
 const fill=(path,color)=>{ctx.fillStyle=color;ctx.fill(new Path2D(path),'evenodd')};
 fill('M29 60h19l-3 34-9-8-10 5z M52 60h19l3 31-10-5-9 8z',ribbon);
 ctx.save();ctx.translate(0,-5);
 function rim(radius,color){
   ctx.beginPath();
   if(!sides)ctx.arc(50,51,radius,0,2*Math.PI);
   else for(let i=0;i<sides;i++){
     const angle=2*Math.PI*i/sides-Math.PI/2;
     const x=50+radius*Math.cos(angle),y=51+radius*Math.sin(angle);
     if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
   }
   ctx.closePath();ctx.fillStyle=color;ctx.fill();
 }
 const shine=ctx.createLinearGradient(20,18,80,81);
 shine.addColorStop(0,light);shine.addColorStop(.45,dark);shine.addColorStop(.68,light);shine.addColorStop(1,dark);
 rim(39,dark);rim(37,shine);rim(31,light);rim(29,dark);fill(icons[icon],light);ctx.restore();
 cache.set(id,canvas);return canvas;
}
const thumb={};
function condition(row,en){
 const n=row[5], id=row[0];
 if(id.startsWith('sales'))return en?'Complete '+n+' sales':'أكمل '+n+' عملية بيع';
 if(id.startsWith('geo'))return en?'Answer '+n+' geography questions correctly':'جاوب صح على '+n+' سؤال جغرافيا مع أبو وردة';
 return ({
 level5:['وصّل المشتل للمستوى '+n,'Reach nursery level '+n],
 team:['وظّف ياسمين وأبو وردة ونانا','Hire Yasmin, John and Nana'],
 cat50:['أطعم القط '+n+' مرة','Feed the cat '+n+' times'],
 heart50:['اسمع '+n+' رسالة تشجيع من نانا','Hear '+n+' words of encouragement from Nana'],
 plants:['ازرع '+n+' أنواع مختلفة لحدّ النضج','Grow '+n+' different plant species to maturity']
 })[id][en?1:0];
}
let signature='', activeId=null, current, prepared, dialog;
function render(area,rows,awards,en,acknowledge){
 current={area,rows,awards,en,acknowledge};
 const key=JSON.stringify([en,rows.map(r=>[r[0],r[4],awards[r[0]]])]);
 if(key===signature)return;
 signature=key;
 const earned=rows.filter(r=>awards[r[0]]);
 const locked=rows.filter(r=>!awards[r[0]]).sort((a,b)=>b[4]/b[5]-a[4]/a[5]);
 function tile(r){
   const id=r[0], won=awards[id];
   if(!thumb[id])thumb[id]=medal(id).toDataURL();
   return '<button type="button" class="medal-tile" data-medal="'+id+'"><img alt="" src="'+thumb[id]+'"><span><strong>'+r[en?3:2]+'</strong><small>'+condition(r,en)+'</small><small>'+(won?(won.unread?(en?'New · ':'جديدة · '):'')+won.date:'<bdi>'+Math.min(r[4],r[5])+' / '+r[5]+'</bdi>')+'</small></span></button>';
 }
 const previousFocus=area.contains(document.activeElement)?document.activeElement.dataset.medal:null;
 area.innerHTML='<h2>'+(en?'Medal cabinet':'قاعة الميداليات')+'</h2><h3>'+(en?'My medals':'ميدالياتي')+' <bdi>'+earned.length+' / '+rows.length+'</bdi></h3><div class="medal-grid">'+earned.map(tile).join('')+'</div>'+(!earned.length?'<p>'+(en?'Your first medal will appear here.':'أول ميدالية بتربحها رح تظهر هون.')+'</p>':'')+(locked.length?'<h3>'+(en?'Next medals':'الميداليات الجاية')+'</h3><div class="medal-grid pending">'+locked.map(tile).join('')+'</div>':'');
 if(previousFocus)area.querySelector('[data-medal="'+previousFocus+'"]')?.focus({preventScroll:true});
 area.onclick=e=>{const tile=e.target.closest('[data-medal]');if(tile)open(tile.dataset.medal)};
}
function story(row,date,en){
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;
 const g=canvas.getContext('2d'),[dark,light]=designs[row[0]];
 const bg=g.createLinearGradient(0,0,1080,1920);bg.addColorStop(0,'#152b29');bg.addColorStop(1,dark);
 g.fillStyle=bg;g.fillRect(0,0,1080,1920);g.strokeStyle=light;g.lineWidth=3;g.strokeRect(50,65,980,1790);
 g.textAlign='center';g.direction=en?'ltr':'rtl';
 function line(value,y,size,color){g.fillStyle=color;g.font='bold '+size+'px sans-serif';g.fillText(value,540,y,930)}
 line(en?'My nursery medals':'ميدالياتي في المشتل',360,52,light);
 g.drawImage(medal(row[0]),170,470,740,740);
 line(row[en?3:2],1335,83,'#fff');line(condition(row,en),1460,48,'#fff');line(date,1630,38,light);
 return new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
}
function open(id){
 if(!dialog){
   dialog=document.createElement('dialog');dialog.className='medal-dialog';dialog.setAttribute('aria-labelledby','medalHeading');document.body.append(dialog);
   dialog.addEventListener('close',()=>{const tile=current.area.querySelector('[data-medal="'+activeId+'"]');activeId=null;prepared=null;tile?.focus({preventScroll:true})});
 }
 const {rows,awards,en,acknowledge}=current,r=rows.find(x=>x[0]===id),won=awards[id];
 activeId=id;prepared=null;
 dialog.dir=en?'ltr':'rtl';
 dialog.innerHTML='<button type="button" class="medal-close">'+(en?'Close':'إغلاق')+'</button><img class="medal-large" alt="" src="'+thumb[id]+'"><h2 id="medalHeading">'+r[en?3:2]+'</h2><p>'+condition(r,en)+'</p><p>'+(won?(en?'Earned on ':'ربحتها بتاريخ ')+won.date:(en?'Progress ':'تقدّمك ' )+'<bdi>'+Math.min(r[4],r[5])+' / '+r[5]+'</bdi>')+' · '+r[6]+' '+(en?'coins':'عملة')+'</p>'+(won?'<button type="button" class="medal-share" disabled>'+(en?'Share medal':'مشاركة الميدالية')+'</button><p class="medal-status" role="status"></p>':'');
 dialog.querySelector('.medal-close').onclick=()=>dialog.close();dialog.showModal();
 if(!won)return;
 if(won.unread)acknowledge(id);
 const button=dialog.querySelector('.medal-share');
 story(r,won.date,en).then(blob=>{
   if(activeId!==id||!dialog.open||!blob)return;
   prepared=new File([blob],'medal-'+id+'.png',{type:'image/png'});button.disabled=false;
   const download=()=>{const link=document.createElement('a'),url=URL.createObjectURL(prepared);link.href=url;link.download=prepared.name;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);dialog.querySelector('.medal-status').textContent=en?'Image saved for your story.':'نزّلت صورة الميدالية لتشاركها بالستوري أو الحالة.'};
   if(!navigator.canShare?.({files:[prepared]})){button.textContent=en?'Save story image':'تنزيل صورة للستوري';button.onclick=download;return}
   button.onclick=async()=>{try{await navigator.share({files:[prepared]})}catch(e){if(e.name!=='AbortError'&&activeId===id){button.textContent=en?'Save story image':'تنزيل صورة للستوري';button.onclick=download}}};
 });
}
const celebrations=[];
let celebrating=false;
function celebrate(row,en,showAward){
 celebrations.push({row,en,showAward});
 if(!celebrating)showCelebration();
}
function showCelebration(){
 const item=celebrations.shift();
 if(!item){celebrating=false;return}
 celebrating=true;
 const {row,en,showAward}=item,notice=document.createElement('div');
 notice.className='medal-notice';notice.setAttribute('role','status');
 const button=document.createElement('button');button.type='button';
 const art=document.createElement('img');art.alt='';art.src=medal(row[0]).toDataURL();
 button.append(art,document.createTextNode((en?'Medal earned! ':'ربحت ميدالية! ')+row[en?3:2]));
 notice.append(button);document.body.append(notice);
 function finish(){notice.remove();showCelebration()}
 const timer=setTimeout(finish,6500);
 button.onclick=()=>{clearTimeout(timer);if(dialog?.open)dialog.close();showAward();open(row[0]);finish()};
}
window.YasmineMedals={render,celebrate};
})();
