/* Paint the same medal for the cabinet, the enlarged view and the story card. */
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
 const n=target.toLocaleString(en?'en':'ar');
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
   return '<button type="button" class="medal-tile'+(won?.unread?' unread':'')+'" data-medal="'+id+'"><img alt="" src="'+artwork(id)+'"><span><strong>'+r[en?3:2]+'</strong><small>'+(won?accomplishment(r,en):condition(r,en))+'</small><small>'+(won?(won.unread?(en?'New':'جديد'):''):'<bdi>'+Math.min(r[4],r[5])+' / '+r[5]+'</bdi>')+'</small></span></button>';
 }
 const previousFocus=area.contains(document.activeElement)?document.activeElement.dataset.medal:null;
 area.innerHTML='<h2>'+(en?'Medal book':'كتاب الميداليات')+'</h2><h3>'+(en?'My medals':'ميدالياتي')+' <bdi>'+earned.length+' / '+rows.length+'</bdi></h3><div class="medal-grid">'+earned.map(tile).join('')+'</div>'+(!earned.length?'<p>'+(en?'Your first medal will appear here.':'أول ميدالية بتربحها رح تظهر هون.')+'</p>':'')+(locked.length?'<h3>'+(en?'Next medals':'الميداليات الجاية')+'</h3><div class="medal-grid pending">'+locked.map(tile).join('')+'</div>':'');
 if(previousFocus)area.querySelector('[data-medal="'+previousFocus+'"]')?.focus({preventScroll:true});
 area.onclick=e=>{const tile=e.target.closest('[data-medal]');if(tile)open(tile.dataset.medal)};
}
async function story(row,en){
 const [art,qr]=await Promise.all([loadImage(artwork(row[0])),loadImage('yasmine/images/game-qr.png')]);
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
 if(!dialog){
   dialog=document.createElement('dialog');dialog.className='medal-dialog';dialog.setAttribute('aria-labelledby','medalHeading');document.body.append(dialog);
   dialog.addEventListener('close',()=>{const tile=current.area.querySelector('[data-medal="'+activeId+'"]');activeId=null;prepared=null;tile?.focus({preventScroll:true})});
 }
 const {rows,awards,en,acknowledge}=current,r=rows.find(x=>x[0]===id),won=awards[id];
 activeId=id;prepared=null;
 dialog.dir=en?'ltr':'rtl';
 const title=r[en?3:2];
 const note=won&&id==='plants'
   ? '<aside class="keeper-note"><img alt="" src="yasmine/images/abu-warda-portrait.webp"><span><strong>'+(en?'John':'أبو وردة')+'</strong>'+(en?'Remember your first pot? Look at everything you’ve grown since. You earned this medal.':'بتتذكّر أول أصيص؟ شوف قديش كبر مشتلك من وقتها. هالوسام إلك!')+'</span></aside>'
   : '';
 dialog.innerHTML='<button type="button" class="medal-close">'+(en?'Close':'إغلاق')+'</button><img class="medal-large" alt="" src="'+artwork(id)+'"><h2 id="medalHeading">'+title+'</h2><p>'+(won?accomplishment(r,en):condition(r,en))+'</p><p>'+(won?'':(en?'Progress ':'تقدّمك ')+'<bdi>'+Math.min(r[4],r[5])+' / '+r[5]+'</bdi> · ')+r[6]+' '+(en?'coins':'عملة')+'</p>'+note+(won?'<button type="button" class="medal-share" disabled>'+(en?'Share medal':'شارك وسامك')+'</button><p class="medal-status" role="status"></p>':'');
 dialog.querySelector('.medal-close').onclick=()=>dialog.close();dialog.showModal();
 if(!won)return;
 if(won.unread)acknowledge(id);
 const button=dialog.querySelector('.medal-share');
 story(r,en).then(blob=>{
   if(activeId!==id||!dialog.open||!blob)return;
   prepared=new File([blob],'medal-'+id+'.png',{type:'image/png'});button.disabled=false;
   const download=()=>{const link=document.createElement('a'),url=URL.createObjectURL(prepared);link.href=url;link.download=prepared.name;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);dialog.querySelector('.medal-status').textContent=en?'Image saved for your story.':'نزّلت صورة الميدالية لتشاركها بالستوري أو الحالة.'};
   if(!navigator.canShare?.({files:[prepared]})){button.textContent=en?'Save story image':'تنزيل صورة للستوري';button.onclick=download;return}
   button.onclick=async()=>{try{await navigator.share({files:[prepared],text:(en?'I earned the '+title+' medal in Jasmine Nursery!':'ربحت وسام «'+title+'» بلعبة مشتل الياسمينة!')+' '+gameUrl})}catch(e){if(e.name!=='AbortError'&&activeId===id){button.textContent=en?'Save story image':'تنزيل صورة للستوري';button.onclick=download}}};
 }).catch(()=>{
   if(activeId!==id||!dialog.open)return;
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
 button.onclick=()=>{clearTimeout(timer);if(dialog?.open)dialog.close();showAward();open(row[0]);finish()};
}
document.getElementById('achievementsTab').style.setProperty('--gold-medal','url('+artwork('sales500')+')');
window.YasmineMedals={render,celebrate};
})();
