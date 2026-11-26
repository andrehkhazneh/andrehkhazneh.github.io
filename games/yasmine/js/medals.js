/* Use lightweight book thumbnails and detailed medal artwork for pages and stories. */
(function () {
'use strict';
const designs = {
 sales50: ['#ae603a', '#ffdda2'],
 sales100: ['#526879', '#f1f8ff'],
 sales500: ['#ad721c', '#ffed99'],
 level5: ['#357153', '#bce49a'],
 team: ['#357388', '#b5eced'],
 cat50: ['#ad6c39', '#ffe0b3'],
 heart50: ['#ad4576', '#ffccdb'],
 geo25: ['#986b39', '#ffe2a3'],
 geo100: ['#316693', '#bde7ff'],
 geo200: ['#665095', '#f2d5ff'],
 plants: ['#507337', '#e7ec9e']
};
const gameUrl='https://andrehkhazneh.github.io/games/yasmine-preview.html';
function artwork(id){
 return id==='plants'?'yasmine/images/plant-lover.webp':'yasmine/images/medals/'+id+'.webp';
}
function fullArtwork(id){
 return 'yasmine/images/medals/hd/'+id+'.webp';
}
function loadImage(src){
 return new Promise((resolve,reject)=>{
   const image=new Image();
   image.onload=()=>resolve(image);
   image.onerror=()=>reject(new Error('Image unavailable'));
   image.src=src;
 });
}
function accomplishment(row,en,firstPerson=false){
 const [id,,,,,target]=row;
 const n=target.toLocaleString(en?'en':'ar-u-nu-latn');
 if(id.startsWith('sales'))return en?(firstPerson?'I completed ':'You completed ')+n+' sales.':'أتممت '+n+' عملية بيع.';
 if(id.startsWith('geo'))return en?(firstPerson?'I answered ':'You answered ')+n+' geography questions correctly.':'جاوبت صح على '+n+' سؤال جغرافيا.';
 const subject=firstPerson?'I ':'You ';
 const lines={
   level5:['وصلت بالمشتل للمستوى '+n+'.',subject+'reached nursery level '+n+'.'],
   team:['جمعت فريق المشتل كله.',subject+'hired the whole nursery team.'],
   cat50:['أطعمت القطة '+n+' مرة.',subject+'fed the cat '+n+' times.'],
   heart50:['سمعت '+n+' كلمة تشجيع من نانا.',subject+'heard '+n+' words of encouragement from Nana.'],
   plants:['زرعت '+n+' أنواع مختلفة '+(firstPerson?'بمشتلي':'بمشتلك')+' ووصلت كلها للنضج.',subject+'grew '+n+' different plants to maturity.']
 };
 return lines[id][en?1:0];
}
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
let signature='', activeId=null, current, dialog;
function render(area,rows,awards,en,acknowledge){
 current={area,rows,awards,en,acknowledge};
 const key=JSON.stringify([en,rows.map(r=>[r[0],r[4],awards[r[0]]])]);
 if(key===signature)return;
 signature=key;
 const earned=rows.filter(r=>awards[r[0]]);
 const count=earned.length+' / '+rows.length;
 area.innerHTML='<button type="button" class="album-cover"><img alt="" src="'+artwork('plants')+'"><strong>'+(en?'Medal book':'كتاب الميداليات')+'</strong><span>'+(en?'My medals':'ميدالياتي')+' · <bdi>'+count+'</bdi></span><span class="album-open">'+(en?'Open book':'افتح الكتاب')+'</span></button>';
 area.querySelector('.album-cover').onclick=showContents;
}
function showDialog(){
 if(!dialog.open)dialog.showModal();
 dialog.scrollTop=0;
 dialog.querySelector('h2')?.focus({preventScroll:true});
}
function initBook(){
 if(!dialog){
   dialog=document.createElement('dialog');
   dialog.className='medal-dialog';
   dialog.setAttribute('aria-labelledby','medalHeading');
   document.body.append(dialog);
   dialog.addEventListener('close',()=>{
     if(dialog.open)return;
     activeId=null;
     current.area.querySelector('.album-cover')?.focus({preventScroll:true});
   });
 }
 dialog.dir=current.en?'ltr':'rtl';
}
function showContents(){
 initBook();
 const {en,rows,awards}=current;
 activeId=null;
 const entries=rows.map((row,i)=>{
   const won=awards[row[0]];
   const state=won?(won.unread?(en?'New':'جديد'):(en?'Earned':'مكتسب')):(en?'Not earned':'غير مكتسب');
   return '<button class="album-entry'+(won?.unread?' unread':'')+'" data-medal="'+row[0]+'"><img alt="" src="'+artwork(row[0])+'"><span>'+row[en?3:2]+'<small>'+state+'</small></span><bdi>'+String(i+1).padStart(2,'0')+'</bdi></button>';
 });
 dialog.innerHTML='<header><h2 id="medalHeading" tabindex="-1">'+(en?'Contents':'الفهرس')+'</h2><button class="medal-close">'+(en?'Close':'إغلاق')+'</button></header><div class="album-entries">'+entries.join('')+'</div>';
 dialog.querySelector('.medal-close').onclick=()=>dialog.close();
 dialog.querySelector('.album-entries').onclick=e=>{
   const entry=e.target.closest('[data-medal]');
   if(entry)open(entry.dataset.medal);
 };
 showDialog();
}
async function story(row,en){
 const [art,qr]=await Promise.all([loadImage(fullArtwork(row[0])),loadImage('yasmine/images/game-qr.png')]);
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;
 const g=canvas.getContext('2d'),[dark,light]=designs[row[0]];
 const bg=g.createLinearGradient(0,0,1080,1920);bg.addColorStop(0,'#152b29');bg.addColorStop(1,dark);
 g.fillStyle=bg;g.fillRect(0,0,1080,1920);g.strokeStyle=light;g.lineWidth=3;g.strokeRect(50,65,980,1790);
 g.textAlign='center';g.direction=en?'ltr':'rtl';
 function line(value,y,size,color){g.fillStyle=color;g.font='bold '+size+'px sans-serif';g.fillText(value,540,y,930)}
 line(en?'From Jasmine Nursery':'من لعبة مشتل الياسمينة',270,50,light);
 line(en?'I earned a medal':'ربحت وسام',425,55,'#fff');
 const scale=Math.min(730/art.width,740/art.height);
 g.drawImage(art,(1080-art.width*scale)/2,510,art.width*scale,art.height*scale);
 line(row[en?3:2],1360,82,'#fff');
 line(accomplishment(row,en,true),1460,48,'#fff');
 line(en?'Which medal will you earn first?':'أي وسام رح تربح أول؟',1570,42,light);
 g.imageSmoothingEnabled=false;g.drawImage(qr,435,1610,210,210);
 return new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
}
function open(id){
 initBook();
 const {rows,awards,en,acknowledge}=current,r=rows.find(x=>x[0]===id),won=awards[id];
 activeId=id;
 dialog.dir=en?'ltr':'rtl';
 const title=r[en?3:2];
 const note=won&&id==='plants'
   ? '<aside class="keeper-note"><img alt="" src="yasmine/images/abu-warda-portrait.webp"><span><strong>'+(en?'John':'أبو وردة')+'</strong>'+(en?'Remember your first pot? Look at everything you’ve grown since. You earned this medal.':'بتتذكّر أول أصيص؟ شوف قديش كبر مشتلك من وقتها. هالوسام إلك!')+'</span></aside>'
   : '';
 const page=rows.indexOf(r);
 const leaf='<article class="album-leaf"><img class="medal-large" alt="" src="'+fullArtwork(id)+'"><h2 id="medalHeading" tabindex="-1">'+title+'</h2><p class="award-state">'+(won?(en?'Earned':'مكتسب'):(en?'Not earned':'غير مكتسب'))+'</p><p>'+(won?accomplishment(r,en):condition(r,en))+'</p><p>'+(won?'':(en?'Progress ':'تقدّمك ')+'<bdi>'+Math.min(r[4],r[5])+' / '+r[5]+'</bdi> · ')+r[6]+' '+(en?'coins':'عملة')+'</p>'+note+(won?'<button type="button" class="medal-share" disabled>'+(en?'Share medal':'شارك وسامك')+'</button><p class="medal-status" role="status"></p>':'')+ '</article>';
 dialog.innerHTML='<header><button class="contents-link">'+(en?'Contents':'الفهرس')+'</button><button class="medal-close">'+(en?'Close':'إغلاق')+'</button></header>'+leaf+
   '<nav class="album-pages"><button class="prev" '+(page===0?'disabled':'')+'>'+(en?'← Previous':'→ السابق')+'</button><bdi>'+(page+1)+' / '+rows.length+'</bdi><button class="next" '+(page===rows.length-1?'disabled':'')+'>'+(en?'Next →':'التالي ←')+'</button></nav>';
 dialog.querySelector('.medal-close').onclick=()=>dialog.close();
 dialog.querySelector('.contents-link').onclick=showContents;
 dialog.querySelector('.prev').onclick=()=>open(rows[page-1][0]);
 dialog.querySelector('.next').onclick=()=>open(rows[page+1][0]);
 showDialog();
 if(!won)return;
 if(won.unread)acknowledge(id);
 const button=dialog.querySelector('.medal-share');
 story(r,en).then(blob=>{
   if(!button.isConnected||activeId!==id||!dialog.open||!blob)return;
   const prepared=new File([blob],'medal-'+id+'.png',{type:'image/png'});button.disabled=false;
   const download=()=>{const link=document.createElement('a'),url=URL.createObjectURL(prepared);link.href=url;link.download=prepared.name;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);dialog.querySelector('.medal-status').textContent=en?'Image saved for your story.':'نزّلت صورة الميدالية لتشاركها بالستوري أو الحالة.'};
   if(!navigator.canShare?.({files:[prepared]})){button.textContent=en?'Save story image':'تنزيل صورة للستوري';button.onclick=download;return}
   button.onclick=async()=>{try{await navigator.share({files:[prepared],text:(en?'I earned the '+title+' medal in Jasmine Nursery!':'ربحت وسام «'+title+'» بلعبة مشتل الياسمينة!')+' '+gameUrl})}catch(e){if(e.name!=='AbortError'&&activeId===id){button.textContent=en?'Save story image':'تنزيل صورة للستوري';button.onclick=download}}};
 }).catch(()=>{
   if(!button.isConnected||activeId!==id||!dialog.open)return;
   dialog.querySelector('.medal-status').textContent=en?'Could not prepare the picture. Open the medal to retry.':'تعذر تجهيز الصورة. افتح الوسام مرة تانية للمحاولة.';
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
 const art=document.createElement('img');art.alt='';art.src=artwork(row[0]);
 button.append(art,document.createTextNode((en?'Medal earned! ':'ربحت ميدالية! ')+row[en?3:2]));
 notice.append(button);document.body.append(notice);
 function finish(){notice.remove();showCelebration()}
 const timer=setTimeout(finish,6500);
 button.onclick=()=>{clearTimeout(timer);showAward();open(row[0]);finish()};
}
document.getElementById('achievementsTab').style.setProperty('--gold-medal','url('+artwork('sales500')+')');
window.YasmineMedals={render,celebrate,open};
})();
