
(function(){
'use strict';
var ECONOMY_CONFIG={eventMinMs:25000,eventMaxMs:45000,eventDurationMs:6000,eventRewards:{bee:2,dew:1,pest:1},pestTaps:3,pestQualityLoss:2,eventSaleCap:0.12,starterSales:4,starterBonus:0.15,abuSales:6,catChance:0.30,catMinFullness:30,catMinMood:30,catFullnessCost:10,catCooldownMs:180000,catHourlyCap:4,catRewards:[1,2],extraIncomeRatio:0.25};
var crops=window.YasmineGardenCore.crops;
var txt={ar:{title:'🌿 حديقة السعادة',subtitle:'ازرع، اعتنِ، بِع، وكبّر مشتلك!',preview:'إعدادات اللعبة',moneyLabel:'المال',salesLabel:'المبيعات',qualityLabel:'الجودة',water:'💧 سقاية',feed:'🌱 سماد',sun:'☀️ شمس',careInfo:'كل عناية بتسرّع النمو، والأزرار إلها استراحة 5 ثواني. لا تفرط بالعناية!',buyerTitle:'🧑‍🌾 زبون المشتل',buyerText:'لما تزهر النبتة، بيجي زبون ليشتريها.',sell:'بيع النبتة',shopTitle:'🛒 متجر البذور',shopInfo:'اختار بذرة جديدة بعد البيع. النبتة الحالية لازم تنباع أول.',missionTitle:'🎯 مهمة المشتل',missionInfo:'بيع 3 نباتات وافتح أنواع مختلفة. فيك تكمل بلا حدود.',reset:'إعادة التجربة',stages:['بذرة','برعم صغير','أوراق خضراء','نبتة قوية','براعم الزهور','مزهرة وجاهزة للبيع'],ready:'نبتتك زهرت! الزبون ناطر يشتريها.',sold:'مبروك! بعت النبتة وربحت ',need:'ما معك مصاري كفاية.',plant:'زرعت ',busy:'بيع النبتة الحالية أولاً.',pest:'🐛 دودة! اضغط عليها قبل ما تضرّ النبتة.',pestDone:'شطّور! تخلّصت من الدودة.',pestMiss:'الدودة ضرّت جودة النبتة!',bee:'🐝 نحلة! اضغط عليها لتحصل على مكافأة.',beeDone:'النحلة ساعدت النبتة! +5 جودة.',beeMiss:'النحلة طارت.',waterMsg:'سقيت النبتة.',feedMsg:'أضفت سماد.',sunMsg:'عرّضتها للشمس.',over:'العناية الزايدة خفّضت الجودة شوي.',mission:'بيع 3 نباتات',won:'أنجزت المهمة! كمّل وكبّر مشتلك.',resetAsk:'بدك تمسح تقدم النسخة التجريبية؟'},en:{title:'🌿 Andreh’s Garden',subtitle:'Plant, care, sell, and grow your nursery!',preview:'Game settings',moneyLabel:'Coins',salesLabel:'Sales',qualityLabel:'Quality',water:'💧 Water',feed:'🌱 Fertilize',sun:'☀️ Sunlight',careInfo:'Care speeds growth. Each button has a 5-second cooldown. Avoid overdoing it!',buyerTitle:'🧑‍🌾 Nursery customer',buyerText:'A customer arrives when your plant blooms.',sell:'Sell plant',shopTitle:'🛒 Seed shop',shopInfo:'Choose a new seed after selling your plant.',missionTitle:'🎯 Nursery goal',missionInfo:'Sell 3 plants, unlock new varieties, and keep going.',reset:'Reset test',stages:['Seed','Tiny sprout','Green leaves','Strong plant','Flower buds','Blooming and ready to sell'],ready:'Your plant is blooming! A customer wants it.',sold:'Sold! You earned ',need:'Not enough coins.',plant:'You planted ',busy:'Sell your current plant first.',pest:'🐛 Caterpillar! Tap it before it harms your plant.',pestDone:'Nice! You removed the caterpillar.',pestMiss:'The caterpillar damaged your plant quality!',bee:'🐝 Bee! Tap it for a bonus.',beeDone:'The bee helped your plant! +5 quality.',beeMiss:'The bee flew away.',waterMsg:'You watered the plant.',feedMsg:'You fertilized the plant.',sunMsg:'You gave it sunlight.',over:'Too much care reduced quality a little.',mission:'Sell 3 plants',won:'Goal complete! Keep growing your nursery.',resetAsk:'Reset your test progress?'}};
var audioSettings={sfx:true,music:false,sfxVolume:85,musicVolume:85};try{var storedAudio=JSON.parse(localStorage.getItem('yasmine-audio-v1'));if(storedAudio&&typeof storedAudio==='object')audioSettings=Object.assign(audioSettings,storedAudio)}catch(e){}
var audioCtx=null,jazzTrack=document.getElementById('jazzTrack');function audio(){try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx}catch(e){return null}}
function note(freq,when,dur,vol,type){var ctx=audio();if(!ctx)return;var osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type||'sine';osc.frequency.setValueAtTime(freq,when);var level=Math.min(.25,vol*audioSettings.sfxVolume/100);gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,level),when+.012);gain.gain.exponentialRampToValueAtTime(.0001,when+dur);osc.connect(gain);gain.connect(ctx.destination);osc.start(when);osc.stop(when+dur+.03)}
function sound(kind){if(!audioSettings.sfx)return;var ctx=audio();if(!ctx)return;var t=ctx.currentTime+.02;if(kind==='meow'){note(650,t,.18,.19,'triangle');note(490,t+.17,.26,.16,'sine')}else if(kind==='laugh'){[560,740,610,820,690].forEach(function(n,i){note(n,t+i*.105,.13,.18,'sine')})}else if(kind==='cheer'){[523,659,784,1047].forEach(function(n,i){note(n,t+i*.09,.18,.24,'triangle')});[170,220,170,220].forEach(function(n,i){note(n,t+i*.12,.07,.13,'square')})}else if(kind==='sad'){[440,330,260,185].forEach(function(n,i){note(n,t+i*.14,.23,.18,'sawtooth')})}else if(kind==='reject'){[350,280].forEach(function(n,i){note(n,t+i*.13,.2,.14,'triangle')})}else if(kind==='purchase'){[392,523,659].forEach(function(n,i){note(n,t+i*.08,.2,.22,'triangle')})}else if(kind==='notify'){note(740,t,.14,.13,'sine');note(980,t+.16,.22,.15,'sine')}else if(kind==='sell'){[523,659,784,1047].forEach(function(n,i){note(n,t+i*.09,.28,.19,'triangle')})}else if(kind==='bloom'){[392,494,587,784,988].forEach(function(n,i){note(n,t+i*.13,.46,.16,'sine')})}else if(kind==='water'){[740,620,510].forEach(function(n,i){note(n,t+i*.07,.18,.12,'sine')})}else if(kind==='feed'){note(330,t,.16,.14,'triangle');note(440,t+.12,.26,.13,'triangle')}else if(kind==='sun'){note(587,t,.25,.13,'sine');note(784,t+.09,.35,.12,'sine')}else if(kind==='plant'){note(294,t,.16,.14,'triangle');note(392,t+.15,.3,.15,'triangle')}else if(kind==='pest'){note(240,t,.13,.11,'square');note(180,t+.15,.18,.10,'square')}else if(kind==='bee'){note(659,t,.18,.13,'sine');note(880,t+.13,.2,.12,'sine')}}
function updateAudioButtons(){var a=document.getElementById('sfxToggle'),b=document.getElementById('musicToggle');a.setAttribute('aria-checked',String(audioSettings.sfx));b.setAttribute('aria-checked',String(audioSettings.music));a.querySelector('b').textContent=audioSettings.sfx?'ON':'OFF';b.querySelector('b').textContent=audioSettings.music?'ON':'OFF';document.getElementById('sfxLabel').textContent=state.lang==='ar'?'🔊 المؤثرات':'🔊 Effects';document.getElementById('musicLabel').textContent=state.lang==='ar'?'🎹 موسيقى الجاز':'🎹 Jazz music';document.getElementById('sfxVolume').value=audioSettings.sfxVolume;document.getElementById('musicVolume').value=audioSettings.musicVolume}
function saveAudio(){try{localStorage.setItem('yasmine-audio-v1',JSON.stringify(audioSettings))}catch(e){}updateAudioButtons()}
function tryPlayMusic(){
  if(!audioSettings.music||document.hidden||!document.hasFocus())return;
  jazzTrack.volume=Math.max(0,Math.min(100,Number(audioSettings.musicVolume)||0))/100;
  var attempt=jazzTrack.play();
  if(attempt&&typeof attempt.catch==='function')attempt.catch(function(){/* Browser autoplay policy: preserve saved ON preference. */});
}
function pauseBackgroundAudio(){try{jazzTrack.pause()}catch(e){}if(audioCtx&&audioCtx.state==='running')audioCtx.suspend().catch(function(){})}
function resumeForegroundAudio(){if(document.hidden||!document.hasFocus())return;if(audioSettings.music)tryPlayMusic()}
document.addEventListener('visibilitychange',function(){if(document.hidden)pauseBackgroundAudio();else resumeForegroundAudio()});
window.addEventListener('blur',pauseBackgroundAudio);
window.addEventListener('focus',resumeForegroundAudio);
window.addEventListener('pagehide',pauseBackgroundAudio);
window.addEventListener('pageshow',resumeForegroundAudio);
function setMusic(on){
  audioSettings.music=!!on;
  if(audioSettings.music)tryPlayMusic();else try{jazzTrack.pause()}catch(e){}
  saveAudio();
}
document.addEventListener('pointerdown',function(){if(audioSettings.music&&jazzTrack.paused)tryPlayMusic()},{passive:true});
document.addEventListener('keydown',function(){if(audioSettings.music&&jazzTrack.paused)tryPlayMusic()});
document.getElementById('sfxToggle').onclick=function(){audioSettings.sfx=!audioSettings.sfx;if(audioSettings.sfx)sound('plant');saveAudio()};
document.getElementById('musicToggle').onclick=function(){setMusic(!audioSettings.music)};
['sfx','music'].forEach(function(k){
  document.getElementById(k+'Volume').oninput=function(){
    audioSettings[k+'Volume']=Number(this.value);
    if(k==='music')jazzTrack.volume=audioSettings.musicVolume/100;
    saveAudio();
  };
});
function freshCat(){return {away:false,graceMs:60000,fullness:60,mood:55,hydration:75,hydrationSeconds:0,moodSeconds:0,toy:false}}
var key='yasmine-nursery-preview-v1';var state={gameEpoch:Date.now(),dayMode:'auto',weatherMode:'auto',gardenName:'حديقة السعادة',dismissedEmpty:false,money:50,sales:0,kind:'jasmine',progress:0,quality:100,care:0,active:true,lang:'ar',cat:freshCat(),nurseryName:'مشتل الياسمينة',catName:'مشمش',namesSet:false,stock:{fertilizer:4,catfood:3},staff:{hired:false,mood:60,request:null,dialogue:''},emergencyFertilizerUsed:false};
function safeNumber(v,fallback,min,max){return typeof v==='number'&&Number.isFinite(v)?Math.min(max,Math.max(min,v)):fallback}
function normalizeGameState(s){
  if(!s||typeof s!=='object'||Array.isArray(s))return s;
  s.money=safeNumber(s.money,50,0,1000000000);s.sales=safeNumber(s.sales,0,0,100000000);
  s.progress=safeNumber(s.progress,0,0,100);s.quality=safeNumber(s.quality,100,0,100);
  s.care=safeNumber(s.care,0,0,100000000);
  if(!s.cat||typeof s.cat!=='object'||Array.isArray(s.cat))s.cat=freshCat();
  s.cat.away=s.cat.away===true;
  s.cat.graceMs=safeNumber(s.cat.graceMs,60000,0,60000);
  s.cat.aidBy=['yasmin','nana'].includes(s.cat.aidBy)?s.cat.aidBy:'';
  s.cat.fullness=safeNumber(s.cat.fullness,60,0,100);s.cat.mood=safeNumber(s.cat.mood,55,0,100);s.cat.hydration=safeNumber(s.cat.hydration,75,0,100);s.cat.hydrationSeconds=safeNumber(s.cat.hydrationSeconds,0,0,15);s.cat.moodSeconds=safeNumber(s.cat.moodSeconds,0,0,1.5);
  if(!s.stock||typeof s.stock!=='object'||Array.isArray(s.stock))s.stock={fertilizer:4,catfood:3};
  s.stock.fertilizer=safeNumber(s.stock.fertilizer,4,0,1000000);s.stock.catfood=safeNumber(s.stock.catfood,3,0,1000000);
  if(!s.staff||typeof s.staff!=='object'||Array.isArray(s.staff))s.staff={hired:false,mood:60,request:null,dialogue:''};
  if(!Number.isFinite(s.staff.nextBonusSale)){
    s.staff.nextBonusSale=s.sales+5;
    if(s.staff.request==='bonus')s.staff.request=null;
  }
  delete s.staff.nextRequest;
  s.staff.mood=safeNumber(s.staff.mood,60,0,100);s.catEmergencyBill=safeNumber(s.catEmergencyBill,0,0,1000000);s.catRescueCooldown=safeNumber(s.catRescueCooldown,0,0,Number.MAX_SAFE_INTEGER);s.catFoodEmergencyNotice=!!s.catFoodEmergencyNotice;
  if(!s.abu||typeof s.abu!=='object'||Array.isArray(s.abu))s.abu={hired:false,paidSales:0,paused:false,lastCare:0};
  if(!s.nana||typeof s.nana!=='object'||Array.isArray(s.nana))s.nana={hired:false,paidSales:0,paused:false,lastCare:0,lastWarn:0,dialogueIndex:0,action:''};
  s.nana.dialogueIndex=Math.floor(safeNumber(s.nana.dialogueIndex,0,0,9));
  s.nana.lastCare=safeNumber(s.nana.lastCare,0,0,Number.MAX_SAFE_INTEGER);
  if(!s.nana.reportKind&&typeof s.nana.action==='string'){
    var legacyReports=[['Feed',/^(نانا أطعمت |Nana fed )/],['Water',/^(نانا سقت |Nana gave water to )/],
      ['Brush',/^(نانا مشّطت |Nana brushed )/],['Play',/^(نانا لعبت مع |Nana played with )/],
      ['Purchase',/^🚨 (نانا اشترت|Nana bought)/],['Aid',/^❤️ (جمعية|Animal friends)/]];
    var previous=legacyReports.find(function(entry){return entry[1].test(s.nana.action)});
    if(previous)s.nana.reportKind=previous[0];
  }
  s.abu.paidSales=safeNumber(s.abu.paidSales,0,0,3);s.nana.paidSales=safeNumber(s.nana.paidSales,0,0,3);
  if(!Object.hasOwn(crops,s.kind))s.kind='jasmine';
  s.abu.level=s.abu.hired && s.abu.level===2 ? 2 : 1;
  if(s.abu.level===2){
    var p=Object.assign(freshPlot(),s.secondPot);
    if(!Object.hasOwn(crops,p.kind)){p.kind='jasmine';p.active=false}
    p.active=p.active===true;
    p.progress=safeNumber(p.progress,0,0,100);
    p.quality=safeNumber(p.quality,100,0,100);
    p.care=safeNumber(p.care,0,0,100000000);
    p.eventEarned=safeNumber(p.eventEarned,0,0,1000000);
    s.secondPot=p;
  }else delete s.secondPot;
  s.selectedPot=s.secondPot&&s.selectedPot===1?1:0;
  if(!['ar','en'].includes(s.lang))s.lang='ar';
  ['gardenName','nurseryName','catName'].forEach(function(k){if(typeof s[k]!=='string')s[k]=k==='catName'?'مشمش':k==='nurseryName'?'مشتل الياسمينة':'حديقة السعادة';s[k]=s[k].slice(0,24)});
  delete s.yasminFace; // Older saves stored the portrait reaction.
  s.emergencyFertilizerUsed=!!s.emergencyFertilizerUsed;
  s.yasminAidOpen=typeof s.yasminAidOpen==='boolean'?s.yasminAidOpen:s.money<20;
  return s;
}
try{var rawSave=localStorage.getItem(key);var old=rawSave?JSON.parse(rawSave):null;if(old&&typeof old==='object'&&!Array.isArray(old))state=Object.assign(state,old)}catch(e){console.warn('Garden save could not be read; keeping stored data unchanged',e)}
state=normalizeGameState(state);
if(!Number.isFinite(Number(state.gameEpoch)))state.gameEpoch=Date.now();else state.gameEpoch=Number(state.gameEpoch);if(!['auto','day','night'].includes(state.dayMode))state.dayMode='auto';if(!['auto','clear','rain','wind'].includes(state.weatherMode))state.weatherMode='auto';if(!state.qualityCause)state.qualityCause='';if(typeof state.gardenName!=='string')state.gardenName='حديقة السعادة';if(typeof state.dismissedEmpty!=='boolean')state.dismissedEmpty=false;if(new URLSearchParams(location.search).get('lang')==='en')state.lang='en';if(!state.stock)state.stock={fertilizer:4,catfood:3};if(typeof state.namesSet!=='boolean')state.namesSet=false;if(!state.cat||typeof state.cat!=='object')state.cat=freshCat();if(!state.staff||typeof state.staff!=='object')state.staff={hired:false,mood:60,request:null,dialogue:''};if(typeof state.nurseryName!=='string')state.nurseryName='مشتل الياسمينة';if(typeof state.catName!=='string')state.catName='مشمش';
if(!state.abu||typeof state.abu!=='object')state.abu={hired:false,paidSales:0,paused:false,lastCare:0};if(!state.nana||typeof state.nana!=='object')state.nana={hired:false,paidSales:0,paused:false,lastCare:0,lastWarn:0,dialogueIndex:0,action:''};
if(!Number.isFinite(state.eventEarned))state.eventEarned=0;if(!Number.isFinite(state.eventCycleSales))state.eventCycleSales=state.sales;if(!Number.isFinite(state.extraEarned))state.extraEarned=0;if(!Number.isFinite(state.catHuntLast))state.catHuntLast=0;if(!Array.isArray(state.catCoinTimes))state.catCoinTimes=[];
var $=function(id){return document.getElementById(id)},last={water:0,feed:0,sun:0},ev=null,evTimer=0,evTimeout=0;
var workersSection=document.getElementById('workersArea');document.getElementById('staffArea').after(workersSection);var jokeQueue=[];var yasminFace='neutral';
var graceSample=null;
document.addEventListener('visibilitychange',function(){graceSample=null});
window.addEventListener('pagehide',function(){graceSample=null});
var activeArea='nursery', catMessage=null, catLast={}, catSeconds=0, catAnimationTimer, catDrinking=false,catBusyUntil=0,catCareTimer=null;
var catTxt={
  ar:{
    nav:'التنقّل داخل اللعبة',nursery:'🌱 المشتل',ready:'🌼 النبتة جاهزة للبيع',cat:'🐱 القطة',
    title:'قطة المشتل',fullness:'الشبع',mood:'المزاج',feed:'🍲 طعميها',
    play:'🧶 العب معها',feather:'🪶 العب معها',brush:'🪮 مشّطها',
    buy:'🪶 اشتري لعبة ريشة · 💰 20',hello:'قطتك عم تستنّاك!',
    fed:'أكلت ورجعت تخرخر.',played:'ركضت ورا كرة الخيط ومسكِتها!',sleepy:'شدّت كرة الخيط لعندها ونامت فوقها.',
    brushed:'تمدّدت وخرخرت وإنت عم تمشّطها.',bought:'الريشة صارت جاهزة للعب!',caught:'نطّت ومسكت الريشة بكفّيها!'
  },
  en:{
    nav:'Game areas',nursery:'🌱 Nursery',ready:'🌼 Plant ready to sell',cat:'🐱 Cat',
    title:'Nursery cat',fullness:'Fullness',mood:'Mood',feed:'🍲 Feed',
    play:'🧶 Play',feather:'🪶 Play',brush:'🪮 Brush',
    buy:'🪶 Buy a feather toy · 💰 20',hello:'Your cat is waiting for you!',
    fed:'She ate and started purring.',played:'She chased the ball of yarn and caught it!',sleepy:'She pulled the yarn close and fell asleep on it.',
    brushed:'She stretched out and purred as you brushed her.',bought:'The feather toy is ready!',caught:'She pounced and caught the feather in her paws!'
  }
};
function renderCat(){
  if(activeArea!=='staff')yasminFace='neutral';
  var words=catTxt[state.lang], cat=state.cat;
  var nursery=activeArea==='nursery', ready=nurseryPots().some(isReady);
  $('gameNav').setAttribute('aria-label',words.nav);
  $('nurseryArea').hidden=!nursery;
  $('catArea').hidden=activeArea!=='cat';
  $('staffArea').hidden=activeArea!=='staff';
  $('workersArea').hidden=activeArea!=='workers';
  $('workersTab').setAttribute('aria-pressed',String(activeArea==='workers'));
  $('workersTab').firstChild.textContent=state.lang==='ar'?'👥 موظفين ':'👥 Staff ';
  $('workersBadge').hidden=!((!state.abu.hired&&state.sales>=ECONOMY_CONFIG.abuSales)||(!state.nana.hired&&state.sales>=12));
  $('staffTab').setAttribute('aria-pressed',String(activeArea==='staff'));
  $('staffTab').firstChild.textContent=state.lang==='ar'?'👩🏻‍🌾 ياسمين ':'👩🏻‍🌾 Yasmin ';
  $('nurseryTab').setAttribute('aria-pressed',String(nursery));
  $('catTab').setAttribute('aria-pressed',String(activeArea==='cat'));
  $('nurseryTab').textContent='🌱 '+(state.nurseryName||words.nursery);var nurseryAction=ready?'sell':nurseryPots().some(p=>!p.active)?'plant':null;$('nurseryBadge').hidden=!nurseryAction;$('abuNotice').hidden=!nurseryAction||activeArea!=='nursery';$('abuNotice').textContent=nurseryAction==='sell'?(state.lang==='ar'?'👨‍🌾 أبو وردة: النبتة جاهزة للبيع!':'👨‍🌾 John: Plant ready to sell!'):(state.lang==='ar'?'👨‍🌾 أبو وردة: في أصيص فاضي، ازرع بذرة جديدة!':'👨‍🌾 John: Plant a new seed!');
  $('catTab').textContent='🐱 '+(state.catName||words.cat);
  $('catTitle').textContent=state.lang==='ar'?'قطة المشتل: '+state.catName:'Nursery cat: '+state.catName;
  ['Fullness','Mood'].forEach(function(stat){
    var value=cat[stat.toLowerCase()];
    $('cat'+stat+'Label').textContent=words[stat.toLowerCase()];
    $('cat'+stat).textContent=value+'%';
    $('cat'+stat+'Bar').style.width=value+'%';
  });
  $('catHydration').textContent=Math.floor(cat.hydration)+'%';
  $('catHydrationBar').style.width=cat.hydration+'%';
  $('catWater').disabled=Date.now()<catBusyUntil||cat.hydration>=100;
  $('catHydrationLabel').textContent=state.lang==='ar'?'الارتواء':'Hydration';
  $('catMoodLabel').textContent=words.mood;
  $('catWater').textContent=state.lang==='ar'?'💧 اسقيها':'💧 Give water';
  var treatLabel=document.querySelector('#catTreatStat > span');
  if(treatLabel)treatLabel.textContent=state.lang==='ar'?'🍬 المكافآت':'🍬 Treats';
  $('catFeed').textContent=words.feed;
  $('catPlay').textContent=cat.toy?words.feather:words.play;
  $('catBrush').textContent=words.brush;
  $('catToy').textContent=words.buy;
  $('catToy').hidden=cat.toy;
  $('catToy').disabled=state.money<20;
  ['Feed','Play','Brush'].forEach(function(action){
    $('cat'+action).disabled=Date.now()<catBusyUntil||Date.now()<(catLast[action]||0)||(action==='Feed'&&state.stock.catfood<=0);
  });
  catEmergencyAlert();
  var message=words[catMessage||'hello'];
  if($('catMessage').textContent!==message)$('catMessage').textContent=message;
}
function visitCat(action){
  if(state.cat.away)return;
  var cat=state.cat;
  if(Date.now()<catBusyUntil||Date.now()<(catLast[action]||0))return;
  catLast[action]=Date.now()+5000;
  if(action==='Feed'){
    if(state.stock.catfood<=0)return;state.stock.catfood--;collectionData().feeds++;
    cat.fullness=Math.min(100,cat.fullness+25);
    catMessage='fed';
  }else if(action==='Play'){
    cat.mood=Math.min(100,cat.mood+(cat.toy?24:18));
    cat.fullness=Math.max(0,cat.fullness-4);
    catMessage=cat.toy?'caught':(Math.random()<.5?'played':'sleepy');
  }else{
    cat.mood=Math.min(100,cat.mood+12);
    catMessage='brushed';
  }
  catBusyUntil=Date.now()+4300;
  var scene=$('catScene');
  clearTimeout(catAnimationTimer);
  scene.dataset.toy=cat.toy?'feather':'yarn';
  scene.dataset.action=action;
  catAnimationTimer=setTimeout(function(){delete scene.dataset.action;render()},4300);
  render();
}
$('nurseryTab').onclick=function(){activeArea='nursery';renderCat();renderNurseryNotice()};
$('catTab').onclick=function(){activeArea='cat';renderCat();renderNurseryNotice()};
['Feed','Play','Brush'].forEach(function(action){
  $('cat'+action).onclick=function(){visitCat(action)};
});
$('catToy').onclick=function(){
  if(state.cat.away||state.cat.toy||state.money<20)return;
  state.money-=20;sound('purchase');
  state.cat.toy=true;
  catMessage='bought';
  render();
};
function giveCatWater(source){
  if(state.cat.away||Date.now()<catBusyUntil||catDrinking||state.cat.hydration>=100)return false;
  catBusyUntil=Date.now()+4100;
  catDrinking=true;
  if(source==='nana'){nanaWaterServed=false;nanaCareUntil=catBusyUntil}
  var scene=$('catScene');
  if(scene){scene.classList.remove('cat-drinking');void scene.offsetWidth;scene.classList.add('cat-drinking')}
  $('catWater').disabled=true;
  // Credit the sip immediately, including when the player leaves during the animation.
  state.cat.hydration=Math.min(100,state.cat.hydration+25);
  state.cat.graceMs=60000;graceSample=null;
  if(source==='nana'){nanaWaterServed=true;recordNanaCare('Water')}
  save();render();
  setTimeout(function(){
    catDrinking=false;
    if(scene)scene.classList.remove('cat-drinking');
    render();
  },4100);
  return true;
}
$('catWater').onclick=function(){giveCatWater('player')};
function tickCat(delta){
  if(state.cat.away)return;
  var nanaOn=state.nana.hired&&!state.nana.paused;
  state.cat.hydrationSeconds+=delta;
  if(state.cat.hydrationSeconds>=1.5){
    var steps=Math.floor(state.cat.hydrationSeconds/1.5);
    state.cat.hydrationSeconds-=steps*1.5;
    state.cat.hydration=Math.max(nanaOn?1:0,state.cat.hydration-steps);
    save();
  }
  catSeconds+=delta;
  if(catSeconds>=2.25){
    var foodSteps=Math.floor(catSeconds/2.25);catSeconds-=foodSteps*2.25;
    state.cat.fullness=Math.max(nanaOn?1:0,state.cat.fullness-foodSteps);
    save();
  }
  state.cat.moodSeconds=(state.cat.moodSeconds||0)+delta;
  if(state.cat.moodSeconds>=1.5){
    var moodSteps=Math.floor(state.cat.moodSeconds/1.5);
    state.cat.moodSeconds-=moodSteps*1.5;
    state.cat.mood=Math.max(nanaOn?1:0,state.cat.mood-moodSteps);
    save();
  }
}
// Five distinct Yasmin mini-games; reward is granted exactly once per completed round.
(function(){
const start=document.getElementById('miniGameStart'),board=document.getElementById('miniGameBoard'),info=document.getElementById('miniGameInstruction'),progress=document.getElementById('miniGameProgress');
if(!start||!board)return;
let previous=-1,finished=false,cleanup=()=>{},score=0;
const games=[
{name:'🍂 تنظيف المشتل',hint:'اجمع 12 ورقة يابسة قبل انتهاء 35 ثانية. انتبه من الزهور!',setup(){
board.style.gridTemplateColumns='repeat(4,minmax(0,1fr))';let count=0,errors=0,seconds=35;const status=document.createElement('div');status.style.cssText='grid-column:1/-1;text-align:center;color:white;font-size:19px;font-weight:800';board.append(status);
const items=Array.from({length:16},(_,i)=>i<12?'🍂':'🌷');for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}
function update(){status.textContent='🍂 '+count+'/12  |  ⏳ '+seconds+' ث  |  ❌ '+errors+'/3'}
items.forEach(item=>{const b=document.createElement('button');b.textContent=item;b.style.minHeight='66px';b.onclick=()=>{if(finished||b.disabled)return;if(item==='🍂'){b.disabled=true;b.textContent='🧺';count++;if(count===12){win();return}}else{errors++;b.disabled=true;b.textContent='❌';if(errors>=3){fail('لمست ثلاث زهور!');return}}update()};board.append(b)});
update();const timer=setInterval(()=>{if(finished)return;seconds--;update();if(seconds<=0)fail('خلص الوقت!')},1000);cleanup=()=>clearInterval(timer)
}},
{name:'🧠 لعبة الذاكرة',hint:'افتح 16 بطاقة وابحث عن 8 أزواج متطابقة.',setup(){
board.style.gridTemplateColumns='repeat(4,minmax(0,1fr))';const symbols=['🐱','🌷','🌻','🍓','🦋','🐝','🍀','🍎'],deck=[...symbols,...symbols];for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}
let first=null,locked=false,pairs=0,moves=0,pending=0;
deck.forEach(symbol=>{const b=document.createElement('button');b.textContent='❔';b.style.cssText='min-height:70px;aspect-ratio:1;font-size:29px';b.onclick=()=>{if(finished||locked||b.disabled||b===first)return;b.textContent=symbol;if(!first){first=b;return}const a=first;first=null;moves++;if(a.textContent===b.textContent){a.disabled=b.disabled=true;a.style.background=b.style.background='#b9e8c2';pairs++;progress.textContent='🧠 '+pairs+'/8 أزواج | '+moves+' محاولة';if(pairs===8)win()}else{locked=true;pending=setTimeout(()=>{a.textContent=b.textContent='❔';locked=false},900)}};board.append(b)});progress.textContent='🧠 0/8 أزواج';cleanup=()=>clearTimeout(pending)
}},
{name:'🐛 إنقاذ النباتات',hint:'اضغط على الديدان المتحركة قبل ما توصل للزهور! أنقذ 12 نبتة، وخسارتك الثالثة بتنهي الجولة.',setup(){
board.style.cssText='display:block;position:relative;height:310px;overflow:hidden;background:linear-gradient(#b9e3f7,#c9e8b4);border-radius:15px;touch-action:manipulation';let saved=0,lost=0,spawn=0;let bugs=[];const flowers=document.createElement('div');flowers.textContent='🌷 🌻 🌷 🌼 🌷';flowers.style.cssText='position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:29px;pointer-events:none';board.append(flowers);
function update(){progress.textContent='🐛 '+saved+'/12 | 🌷 خسائر '+lost+'/3'}
const timer=setInterval(()=>{if(finished)return;spawn++;if(spawn%5===0){const b=document.createElement('button');b.textContent='🐛';b.style.cssText='position:absolute;top:0;left:'+(4+Math.random()*76)+'%;width:54px;height:48px;min-height:48px;font-size:29px;z-index:2';const bug={el:b,y:0,speed:3+Math.random()*2};b.onclick=()=>{if(finished)return;bugs=bugs.filter(o=>o!==bug);b.remove();saved++;update();if(saved>=12)win()};board.append(b);bugs.push(bug)}bugs=bugs.filter(o=>{o.y+=o.speed;o.el.style.top=o.y+'px';if(o.y>250){o.el.remove();lost++;update();if(lost>=3)fail('الديدان وصلت للزهور!');return false}return true})},110);update();cleanup=()=>{clearInterval(timer);board.style.cssText=''}
}},
{name:'🚗 كراج السيارات',hint:'حرّك السيارات أفقياً أو عمودياً لتفتح الطريق للسيارة الحمراء نحو المخرج.',setup(){
board.style.cssText='display:block;direction:ltr;background:#273950;padding:6px;border-radius:14px';const vehicles=[
{id:'red',x:1,y:2,n:2,d:'h',icon:'🚘',color:'#e95656'},
{id:'a',x:0,y:0,n:3,d:'v',icon:'🚕',color:'#f2c65a'},
{id:'b',x:3,y:0,n:3,d:'v',icon:'🚙',color:'#6ebcde'},
{id:'c',x:4,y:1,n:2,d:'v',icon:'🚗',color:'#a995dd'},
{id:'d',x:2,y:3,n:2,d:'h',icon:'🚐',color:'#8ed2a6'},
{id:'e',x:5,y:3,n:3,d:'v',icon:'🚕',color:'#e6a169'},
{id:'f',x:0,y:4,n:2,d:'h',icon:'🚙',color:'#ce98cb'}
];let moves=0;const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(6,minmax(0,1fr));grid-template-rows:repeat(6,48px);gap:3px;touch-action:pan-y';board.append(grid);
for(let i=0;i<36;i++){const cell=document.createElement('div');cell.style.cssText='background:#52637a;border-radius:5px;grid-column:'+((i%6)+1)+';grid-row:'+(Math.floor(i/6)+1);grid.append(cell)}
function blocked(x,y,self){return vehicles.some(v=>v!==self&&x>=v.x&&x<v.x+(v.d==='h'?v.n:1)&&y>=v.y&&y<v.y+(v.d==='v'?v.n:1))}
function move(v,sign,steps){let changed=false;for(let s=0;s<steps;s++){const nx=v.x+(v.d==='h'?sign:0),ny=v.y+(v.d==='v'?sign:0);if(nx<0||ny<0||nx+(v.d==='h'?v.n:1)>6||ny+(v.d==='v'?v.n:1)>6)break;let free=true;for(let j=0;j<v.n;j++){if(blocked(nx+(v.d==='h'?j:0),ny+(v.d==='v'?j:0),v))free=false}if(!free)break;v.x=nx;v.y=ny;changed=true}if(changed){moves++;draw();if(vehicles[0].x===4)win()}}
function draw(){grid.querySelectorAll('button').forEach(b=>b.remove());vehicles.forEach(v=>{const b=document.createElement('button');b.textContent=v.icon;b.style.cssText='grid-column:'+(v.x+1)+'/span '+(v.d==='h'?v.n:1)+';grid-row:'+(v.y+1)+'/span '+(v.d==='v'?v.n:1)+';z-index:2;min-height:0;font-size:25px;padding:0;border-radius:9px;border:2px solid #fff8;background:'+v.color+';touch-action:none';let sx=0,sy=0;b.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY;b.setPointerCapture(e.pointerId)});b.addEventListener('pointerup',e=>{const delta=v.d==='h'?e.clientX-sx:e.clientY-sy;if(Math.abs(delta)<12)return;const cellWidth=grid.clientWidth/6;move(v,delta>0?1:-1,Math.max(1,Math.round(Math.abs(delta)/Math.max(38,cellWidth))))});grid.append(b)});progress.textContent='🚘 حرّر السيارة الحمراء | الحركات: '+moves}
const exit=document.createElement('div');exit.textContent='➡️ المخرج';exit.style.cssText='color:white;text-align:right;font-weight:800;margin:8px';board.append(exit);draw();cleanup=()=>{board.style.cssText=''}
}}
];
function fail(message){if(finished)return;finished=true;cleanup();board.replaceChildren();board.hidden=true;info.textContent='💡 '+message;progress.textContent='جرّب مرة تانية، بدون خسارة عملات';start.textContent='🎮 مهمة جديدة'}

function win(){if(finished)return;finished=true;cleanup();state.money+=5;save();render();board.replaceChildren();board.hidden=true;info.textContent='🎉 برافو! خلّصت المهمة وربحت 5 عملات!';progress.textContent='💰 +5 عملات';start.textContent='🎮 مهمة جديدة'}
start.addEventListener('click',()=>{if(!state.yasminAidOpen)return;cleanup();cleanup=()=>{};finished=false;let next=Math.floor(Math.random()*games.length);if(next===previous)next=(next+1)%games.length;previous=next;board.style.cssText='';board.hidden=false;board.replaceChildren();progress.textContent='0';start.textContent='🎮 غيّر المهمة';info.textContent=games[next].name+' — '+games[next].hint;games[next].setup()});
})();
function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch(e){}}
var requests=[{type:'fertilizer',cost:20},{type:'catfood',cost:15},{type:'bonus',cost:30}];
function stockRequests(){var st=state.staff;if(!st.rejectedStock||typeof st.rejectedStock!=='object')st.rejectedStock={};return ['fertilizer','catfood'].filter(function(type){if(type==='catfood'&&state.cat.away)return false;var quantity=state.stock[type];if(quantity>=5){delete st.rejectedStock[type];return false}return Date.now()>=(st.rejectedStock[type]||0)})}
function staffWords(lang=state.lang){return lang==='ar'?{nursery:'اسم المشتل',cat:'اسم القطة',hire:'وظّف ياسمين · 💰 50',hired:'موظفة دائمة',joke:'اسمع دعابة 😂',yes:'ادفع',no:'ارفض',mood:'مزاج ياسمين',hello:'أهلاً يا مدير! أنا جاهزة أراقب المشتل والقطة.',needWater:'يا مدير، النبتة عطشانة! لا تكون مفكرها صبّارة؟',needCat:'يا مدير، '+state.catName+' جاعت! بدنا نطعميها.',request:{fertilizer:'يا مدير، بدي 20 عملة أجيب سماد للنبتة!',catfood:'عطيني 15 عملة أجيب أكل لـ'+state.catName+'!',bonus:'أنا عم اشتغل من قلبي... ما في بونص 30 عملة؟'},jokes:['القطة شكلها ناوية تستلم الإدارة!','يا مدير، النباتات بدها مي مو خطابات تحفيزية!','أنا موظفة مش ساحرة، بس بونص صغير بيعمل عجايب!','قلت للقطة اشتغلي معي، قالت: أنا مديرة النوم!','السماد غلي يا مدير... حتى الوردة صارت بدها قرض!','زرعت نعنع، طلعلي طلب إجازة من الياسمينة!','القطة بتعرف تعدّ المصاري... بس كل العدّ بيخلص عند التونة!','طلبت من النبتة تكبر بسرعة، قالت: ادفعلي أوفر تايم!','أنا وياسمين النبتة نفس الاسم، بس هي بتاخد مي وأنا بدي بونص!','ليش الجزرة احمرّت؟ شافت فاتورة السماد!'],thanks:'يسلمو يا مدير! هيك الشغل الحلو.',refused:'طيب يا مدير... بس رح أتذمّر شوي! 😂',poor:'الخزنة فاضية يا مدير!',liked:'يا سلام! ضحكتك أحلى من البونص! 😂',disliked:'آخ يا مدير! خلص رح جرّب نكتة أحسن المرة الجاية.',postponed:'تمام يا مدير، منأجل الشراء شوي.'}:{nursery:'Nursery name',cat:'Cat name',hire:'Hire Yasmin · 💰 50',hired:'Permanent employee',joke:'Tell a joke 😂',yes:'Pay',no:'Decline',mood:'Yasmin’s mood',hello:'Hello boss! I am watching the plants and your cat.',needWater:'Boss, the plant needs water!',needCat:'Boss, '+state.catName+' is hungry!',request:{fertilizer:'Boss, I need 20 coins for fertilizer!',catfood:'Give me 15 coins to buy food for '+state.catName+'!',bonus:'I work so hard... could I get a 30-coin bonus?'},jokes:['The cat wants to become the manager!','Plants need water, not motivational speeches!','I am no magician, but a bonus works wonders!','I offered the cat a job. She said she already manages naps!','Fertilizer is so expensive even the flowers want a loan!','I planted mint, and the jasmine asked for vacation time!','The cat can count coins, but only until dinner!','I told the plant to grow faster. It asked for overtime pay!','The jasmine gets water, and I get bonus requests!','Why did the carrot blush? It saw the fertilizer bill!'],thanks:'Thanks, boss! I appreciate it.',refused:'Okay boss... but I will complain a little! 😂',poor:'Not enough coins, boss!',liked:'Yay! Your laugh is better than a bonus! 😂',disliked:'Ouch, boss! I’ll try a better joke next time.',postponed:'Okay boss, we can postpone this purchase.'}}
$('settingsNamesPanel').appendChild($('identityPanel'));var editingNames=false,settingsOpen=false,audioPanelOpen=false,jokeAwaitingRating=false;$('topEditNames').onclick=function(){settingsOpen=!settingsOpen;if(!settingsOpen){editingNames=false;audioPanelOpen=false}render();$('settingsPanel').hidden=!settingsOpen};$('settingsNames').onclick=function(){settingsOpen=true;editingNames=!editingNames;render();if(editingNames){$('settingsNamesPanel').hidden=false;$('identityPanel').hidden=false;$('gardenNameInput').focus()}};$('settingsAudio').onclick=function(){audioPanelOpen=!audioPanelOpen;render()};$('restartGame').onclick=function(){$('reset').click()};$('saveGardenName').onclick=function(){commitNames()};$('gardenNameInput').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();commitNames()}});function commitNames(){state.gardenName=($('gardenNameInput').value||'').trim().slice(0,24)||'حديقة السعادة';state.nurseryName=($('nurseryNameInput').value||'').trim().slice(0,12)||'مشتل الياسمينة';state.catName=($('catNameInput').value||'').trim().slice(0,10)||'مشمش';state.namesSet=true;editingNames=false;save();render()}
$('editNames').onclick=function(){editingNames=!editingNames;render();if(editingNames)$('nurseryNameInput').focus()};$('saveNurseryName').onclick=commitNames;$('saveCatName').onclick=commitNames;['nurseryNameInput','catNameInput'].forEach(function(id){$(id).addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();commitNames();this.blur()}})});
function notificationCount(){return state.staff.hired&&state.staff.request?1:0}
var yasminPortraits=document.querySelectorAll('[data-yasmin-portrait]');
function renderYasminExpression(){
  var face=yasminFace;
  var src='yasmine/images/yasmin-'+face+'.webp';
  var label=state.lang==='ar'
    ? {neutral:'ياسمين، مديرة المشتل',happy:'ياسمين فرحانة',sad:'ياسمين زعلانة'}[face]
    : {neutral:'Yasmin, nursery manager',happy:'Yasmin is delighted',sad:'Yasmin is disappointed'}[face];
  yasminPortraits.forEach(function(image){
    if(image.getAttribute('src')!==src)image.src=src;
    if(image.classList.contains('yasmin-main-art')&&image.alt!==label)image.alt=label;
  });
}
const yasminJokes={
  ar:staffWords('ar').jokes.concat(window.YASMIN_JOKES||[]),
  en:staffWords('en').jokes.concat(window.YASMIN_JOKES_EN||[])
};
function localizeDialogue(st,words){
  var key=st.dialogue;
  if(typeof key!=='string'||!key)return words.hello;
  if(key.startsWith('joke:'))return yasminJokes[state.lang][Number(key.slice(5))]||words.hello;
  if(Object.prototype.hasOwnProperty.call(words,key)&&typeof words[key]==='string')return words[key];
  // Older saves contain the displayed sentence rather than its translation key.
  for(const lang of ['ar','en']){
    const old=staffWords(lang), index=yasminJokes[lang].indexOf(key);
    if(index!==-1){st.dialogue='joke:'+index;return yasminJokes[state.lang][index]}
    for(const id of ['hello','thanks','refused','liked','disliked','postponed']){
      if(old[id]===key){st.dialogue=id;return words[id]}
    }
  }
  return words.hello;
}
function renderStaff(){var w=staffWords(),st=state.staff;var buyDirect=$('buyFertilizerDirect');buyDirect.hidden=!!st.hired;buyDirect.textContent=state.lang==='ar'?'🌱 شراء 5 سماد · 💰 10':'🌱 Buy 5 fertilizer · 💰 10';buyDirect.disabled=state.money<10;if(st.hired&&st.request&&st.request!=='bonus'&&state.stock[st.request]>=5){st.request=null;save()}renderYasminExpression();renderAbu();renderNana();$('settingsNamesPanel').hidden=!settingsOpen||!editingNames;$('identityPanel').hidden=!settingsOpen||!editingNames;$('gardenNameLabel').textContent=state.lang==='ar'?'اسم الحديقة':'Garden name';if(document.activeElement!==$('gardenNameInput'))$('gardenNameInput').value=state.gardenName;$('jokeRating').hidden=!jokeAwaitingRating;$('jokeGood').textContent=state.lang==='ar'?'😂 حلوة!':'😂 Funny!';$('jokeBad').textContent=state.lang==='ar'?'😐 مش كتير':'😐 Not really';$('nurseryAlert').hidden=true;$('nurseryAlertTitle').textContent=state.lang==='ar'?'🌱 تنبيه المشتل':'🌱 Nursery alert';$('nurseryAlertText').textContent=state.lang==='ar'?'المشتل فاضي! حان وقت زراعة بذرة جديدة.':'Your garden is empty! Time to plant a new seed.';$('nurseryAlertAction').textContent=state.lang==='ar'?'🌱 سأزرع':'🌱 I’ll plant';$('nurseryAlertDismiss').textContent=state.lang==='ar'?'تجاهل':'Dismiss';var n=notificationCount();$('staffBadge').hidden=!n;$('staffBadge').textContent=n;$('settingsPanel').hidden=!settingsOpen;$('settingsAudioPanel').hidden=!audioPanelOpen;$('topEditNames').setAttribute('aria-expanded',String(settingsOpen));$('identityPanel').hidden=!settingsOpen||!editingNames;$('editNames').textContent=state.lang==='ar'?(editingNames?'✕ إغلاق التعديل':'✏️ تعديل الأسماء'):(editingNames?'✕ Close editing':'✏️ Edit names');$('staffRole').textContent=state.lang==='ar'?'مديرة المشتل':'Nursery manager';$('nurseryNameLabel').textContent=w.nursery;$('catNameLabel').textContent=w.cat;$('nurseryEdit').hidden=state.namesSet&&!editingNames;$('catEdit').hidden=state.namesSet&&!editingNames;$('nurseryNameDone').hidden=!state.namesSet||editingNames;$('catNameDone').hidden=!state.namesSet||editingNames;$('nurseryNameDone').textContent=state.nurseryName;$('catNameDone').textContent=state.catName;if(document.activeElement!==$('nurseryNameInput'))$('nurseryNameInput').value=state.nurseryName;if(document.activeElement!==$('catNameInput'))$('catNameInput').value=state.catName;$('fertilizerStockLabel').textContent=state.lang==='ar'?'🌱 مخزون السماد':'🌱 Fertilizer stock';$('catFoodStockLabel').textContent=state.lang==='ar'?'🍲 مخزون أكل القطة':'🍲 Cat food stock';$('fertilizerStock').textContent=state.stock.fertilizer;$('catFoodStock').textContent=state.stock.catfood;$('stockHint').hidden=true;$('staffTitle').textContent=state.lang==='ar'?'ياسمين':'Yasmin';$('staffMood').textContent=w.mood+': '+st.mood+'%';$('staffDialogue').textContent=jokeAwaitingRating?localizeDialogue(st,w):(nurseryPots().every(p=>!p.active)&&!state.dismissedEmpty?(state.lang==='ar'?'يا مدير، المشتل فاضي! ازرع بذرة جديدة من دكّان البذور.':'Boss, the nursery is empty! Plant a new seed from the seed shop.'):st.request?w.request[st.request]:(state.stock.fertilizer<=1?(state.lang==='ar'?'يا مدير، السماد قرب يخلص! ضل '+state.stock.fertilizer+' بس.':'Boss, fertilizer is running low!') :state.stock.catfood<=1?(state.lang==='ar'?'يا مدير، أكل '+state.catName+' قرب يخلص!':'Boss, cat food is running low!'):state.cat.fullness<35&&(!state.nana.hired||state.nana.paused)?w.needCat:nurseryPots().some(p=>p.active&&p.quality<55)?w.needWater:(jokeAwaitingRating?localizeDialogue(st,w):localizeDialogue(st,w))));$('hireStaff').textContent=st.hired?(state.lang==='ar'?'✓ تم توظيف ياسمين':'✓ Yasmin hired'):w.hire;$('hireStaff').hidden=st.hired;$('hireStaff').disabled=st.hired||state.money<50;$('staffJoke').textContent=w.joke;$('staffJoke').disabled=!st.hired;$('staffRequest').hidden=!st.hired||!st.request;if(st.request){var req=requests.find(function(x){return x.type===st.request});if(req){$('requestTitle').textContent=state.lang==='ar'?'طلب من ياسمين':'Yasmin’s request';$('requestText').textContent=w.request[req.type];$('acceptRequest').textContent=w.yes+' 💰 '+req.cost;$('acceptRequest').disabled=state.money<req.cost;$('rejectRequest').textContent=w.no}}}
/* Names are confirmed with Enter or the check button, not on every keystroke. */
$('nurseryAlertDismiss').onclick=function(){state.dismissedEmpty=true;render()};$('nurseryAlertAction').onclick=function(){state.dismissedEmpty=true;activeArea='nursery';render();$('shop').scrollIntoView({behavior:'smooth',block:'center'})};$('staffTab').onclick=function(){
  if(activeArea!=='staff')yasminFace='neutral';
  activeArea='staff';
  render();
};$('workersTab').onclick=function(){activeArea='workers';render()};$('hireStaff').onclick=function(){if(state.staff.hired||state.money<50)return;state.money-=50;sound('purchase');state.staff.hired=true;state.staff.dialogue='hello';state.staff.nextBonusSale=state.sales+5;render()};$('staffJoke').onclick=function(){if(!state.staff.hired)return;var c=collectionData();if(!Number.isInteger(c.jokeNext))c.jokeNext=0;state.staff.dialogue='joke:'+(c.jokeNext%yasminJokes[state.lang].length);c.jokeNext=(c.jokeNext+1)%yasminJokes[state.lang].length;jokeAwaitingRating=true;yasminFace='neutral';sound('laugh');render()};$('jokeGood').onclick=function(){if(!jokeAwaitingRating)return;jokeAwaitingRating=false;state.staff.mood=Math.min(100,state.staff.mood+8);yasminFace='happy';state.staff.dialogue='liked';sound('cheer');save();render()};$('jokeClose').onclick=function(){jokeAwaitingRating=false;render()};$('jokeBad').onclick=function(){if(!jokeAwaitingRating)return;jokeAwaitingRating=false;state.staff.mood=Math.max(0,state.staff.mood-7);yasminFace='sad';state.staff.dialogue='disliked';sound('sad');save();render()};$('acceptRequest').onclick=function(){var st=state.staff,req=requests.find(function(x){return x.type===st.request});if(!st.hired||!req||state.money<req.cost)return;state.money-=req.cost;if(req.type==='bonus')yasminFace='happy';sound(req.type==='bonus'?'cheer':'purchase');st.mood=Math.min(100,st.mood+(req.type==='bonus'?20:7));if(req.type==='fertilizer')state.stock.fertilizer+=5;if(req.type==='catfood')state.stock.catfood+=5;if(req.type!=='bonus'&&st.rejectedStock)delete st.rejectedStock[req.type];if(!jokeAwaitingRating)st.dialogue='thanks';st.request=null;if(req.type==='bonus')st.nextBonusSale=state.sales+5;render()};$('rejectRequest').onclick=function(){var st=state.staff;if(!st.request)return;var isBonus=st.request==='bonus';sound(isBonus?'sad':'reject');if(isBonus){st.mood=Math.max(0,st.mood-8);yasminFace='sad'}else{if(!st.rejectedStock)st.rejectedStock={};st.rejectedStock[st.request]=Date.now()+65000}if(!jokeAwaitingRating)st.dialogue=isBonus?'refused':'postponed';st.request=null;if(isBonus)st.nextBonusSale=state.sales+5;render()};
function renderAbu(){var a=state.abu,en=state.lang==='en';$('message').style.display=a.hired?'none':'';$('abuPanel').hidden=false;var worker=$('abuWorker');$('abuWagePay').hidden=!a.hired||!a.paused;$('abuWorkStatus').hidden=!a.hired||(!a.paused&&!a.lastAction);$('abuWorkStatus').parentElement.style.padding=(!$('abuWorkStatus').hidden)?'0':'';$('abuWorkStatus').textContent=a.paused?(en?'John is waiting for wages':'أبو وردة متوقف بانتظار راتبه'):(a.lastAction?(en?({water:'John watered the plant',fertilize:'John fertilized the plant',pest:'John removed the worm'}[a.lastAction]||''):({water:'أبو وردة سقى النبتة',fertilize:'أبو وردة سمّد النبتة',pest:'أبو وردة كافح الدود'}[a.lastAction]||'')):'');if(hasSecondPot()&&a.lastAction&&!a.paused){
  if(Object.hasOwn(crops,a.tendedKind)){
    var action=en?{water:'Watered ',fertilize:'Fertilized ',pest:'Removed a worm from '}:{water:'أبو وردة سقى ',fertilize:'أبو وردة سمّد ',pest:'أبو وردة شال دودة عن '};
    $('abuWorkStatus').textContent=(action[a.lastAction]||'')+crops[a.tendedKind][state.lang];
  }
}if(worker){worker.hidden=!a.hired;worker.classList.toggle('paused',!!a.paused);worker.title=en?'John — nursery worker':'أبو وردة — عامل المشتل';}$('abuName').textContent=en?'John':'أبو وردة';$('abuStatus').textContent=!a.hired?(en?'Available after 6 sales':'بيفتح بعد 6 مبيعات'):a.paused?(en?'On break — wages due':'متوقف مؤقتاً — الراتب ناقص'):(en?'Working in the nursery':'عم يعتني بالنبتة');$('abuDialogue').textContent=!a.hired?(en?'Hire for 80 coins after 6 sales.':'بعد 6 مبيعات فيك توظفني بـ80 عملة، وبساعدك بالسقاية والحشرات.'):(a.paused?(en?'Pay 15 coins to resume work.':'يا مدير، في 15 عملة راتب مستحقة. ادفعلي وبرجع للشغل.'):(en?'I water the plant and remove harmful worms. I leave bees alone.':'أنا بسقي النبتة وبشيل الدود المؤذي، والنحل بخليه بحاله!'));$('hireAbu').hidden=a.hired&&!a.paused;$('hireAbu').disabled=state.money<(a.paused?15:80)||(!a.hired&&state.sales<ECONOMY_CONFIG.abuSales);$('hireAbu').textContent=a.paused?(en?'Pay wages · 15 coins':'💰 دفع الراتب · 15 عملة'):(en?'Hire John · 80 coins':'👨‍🌾 وظّف أبو وردة · 80 عملة');$('abuWage').textContent=en?'Wages: 15 coins every 3 sales after hiring.':'الراتب: 15 عملة كل 3 مبيعات بعد التوظيف. عدم الدفع بيوقف الشغل مؤقتاً.'}
$('hireAbu').onclick=function(){var a=state.abu;if(a.paused){if(state.money<15)return;state.money-=15;a.paused=false;render();return}if(a.hired||state.sales<ECONOMY_CONFIG.abuSales||state.money<80)return;state.money-=80;a.hired=true;a.paidSales=0;a.lastCare=Date.now();sound('purchase');render()};
var nanaHeartLines=[["حتى الورد بدّو أيام مطر لحتى يزهر.","Even flowers need rainy days to bloom."],["لا تقارن حالك بحدا، كل وردة إلها وقتها.","Every flower blooms in its own time."],["اهتم بحالك متل ما بتهتم بنباتاتك.","Care for yourself as you care for your plants."],["الراحة مو استسلام يا روحي.","Rest is not giving up, dear."],["افتخر بخطواتك الصغيرة.","Be proud of your small steps."],["مو كل تأخير يعني خسارة.","Not every delay is a loss."],["عامل حالك بحنية.","Treat yourself gently."],["من حقك تقول لا لما تتعب.","You can say no when you are tired."],["مو لازم تحل كل شي اليوم.","You need not solve everything today."],["طلب المساعدة شجاعة.","Asking for help takes courage."],["غلط اليوم ما بيلغي تعب مبارح.","Today's mistake does not erase yesterday's effort."],["خد وقتك، الحياة مو سباق.","Take your time; life is not a race."],["فيك تشتاق وتكمل طريقك بنفس الوقت.","You can miss someone and still move forward."],["مو لازم تكون مثالي لتستاهل المحبة.","You need not be perfect to deserve love."],["خلي مساحة صغيرة لشي بتحبو اليوم.","Make a little room for something you enjoy today."],["إذا الطريق طويل، قسمو لخطوات.","If the road is long, take it step by step."],["مشاعرك إلها مكان، حتى الصعبة منها.","Your feelings have a place, even the difficult ones."],["فيك تغيّر رأيك وتبلش من جديد.","You can change your mind and begin again."],["قيمتك مو بعدد الأشياء اللي أنجزتها.","Your worth is not measured by productivity."],["احكي مع حدا بترتاحلو إذا حبيت.","Talk to someone you trust if you wish."],["مو كل يوم لازم يكون يوم إنجاز.","Not every day needs to be productive."],["تذكّر شي صغير فرّحك اليوم.","Remember one little thing that pleased you today."],["خلي لنفسك وقت بلا واجبات.","Give yourself some time without obligations."],["حتى الشجرة الكبيرة كانت بذرة.","Even a great tree began as a seed."],["من حقك تحط حدود بتحمي راحتك.","You may set boundaries that protect your peace."]],nanaHeartStage=0,nanaHeartIndex=0;
function nextNanaHeart(){if(!state.nana.hired)return;var c=collectionData();if(!Number.isInteger(c.heartNext))c.heartNext=0;nanaHeartIndex=c.heartNext%nanaHeartLines.length;c.heartNext=(c.heartNext+1)%nanaHeartLines.length;c.lastHeart=nanaHeartIndex;c.heartCount=(c.heartCount||0)+1;nanaHeartStage=1;render()}
function renderNanaHeart(){var panel=$('nanaHeartPanel');if(!panel)return;panel.hidden=!state.nana.hired;if(!state.nana.hired){nanaHeartStage=0;return}var en=state.lang==='en';$('nanaHeartText').textContent=nanaHeartStage===1?nanaHeartLines[nanaHeartIndex][en?1:0]:nanaHeartStage===2?(en?'May your days hold a little more joy, dear.':'الله يريح قلبك يا روحي، ويزرع الفرح بأيامك.'):nanaHeartStage===3?(en?'Take your time, dear.':'ولا يهمك يا حبيبي، خد وقتك.'):(en?'I have a kind word for you whenever you need one.':'يا حبيبي، أنا هون إذا احتجت كلمة حلوة.');$('nanaHeartStart').hidden=nanaHeartStage===1;$('nanaHeartActions').hidden=nanaHeartStage!==1;$('nanaHeartStart').textContent=en?'💗 A word from the heart':'💗 كلمة من القلب';$('nanaHeartThanks').textContent=en?'❤️ That comforted me':'❤️ ريّحتي قلبي يا نانا';$('nanaHeartMore').textContent=en?'🌷 Tell me more':'🌷 احكيلي كمان';$('nanaHeartClose').textContent=en?'Thanks, enough for now':'شكراً نانا، بكفّي لهلق'}
$('nanaHeartStart').onclick=nextNanaHeart;$('nanaHeartMore').onclick=nextNanaHeart;$('nanaHeartThanks').onclick=function(){nanaHeartStage=2;renderNanaHeart()};$('nanaHeartClose').onclick=function(){nanaHeartStage=3;renderNanaHeart()};
function renderNana(){renderNanaHeart();var n=state.nana,en=state.lang==='en';$('nanaTitle').textContent=en?'Nana':'نانا';$('nanaRole').textContent=en?'Cat caretaker':'مربّية القطط';$('nanaStatus').textContent=!n.hired?(en?'Unlocks after 12 sales':'بيفتح بعد 12 مبيعة'):n.paused?(en?'Paused — wages due':'متوقفة بانتظار الراتب'):(en?'Caring for '+state.catName:'عم تهتم بـ'+state.catName);$('nanaDialogue').textContent=n.hired?(n.paused?(en?'Please pay my wages so I can help again.':'يا حبيبي، ادفعلي راتبي وبرجع دلّع القطة!'):(en?'I feed, brush and play with '+state.catName+'.':'أنا بطعمي '+state.catName+' وبمشّطها وبلعب معها.')):(en?'Hire me after 12 sales to care for your cat.':'بعد 12 مبيعة وظّفني، وأنا بدير بالي على القطة بحنية.');$('hireNana').hidden=n.hired&&!n.paused;$('hireNana').disabled=n.paused?state.money<20:n.hired||state.sales<12||state.money<120;$('hireNana').textContent=n.paused?(en?'Pay wages · 20 coins':'💰 دفع الراتب · 20 عملة'):(en?'Hire Nana · 120 coins':'👵 وظّف نانا · 120 عملة');$('nanaWage').textContent=en?'Wages: 20 coins every 3 sales. Unpaid wages pause her work.':'الراتب: 20 عملة كل 3 مبيعات، وعدم الدفع بيوقف شغلها مؤقتاً.'}
$('hireNana').onclick=function(){var n=state.nana;if(n.paused){if(state.money<20)return;state.money-=20;n.paused=false}else{if(n.hired||state.sales<12||state.money<120)return;state.money-=120;n.hired=true;n.paidSales=0;n.lastCare=0}sound('purchase');save();render()};
var nanaLinesAr=['يا حبيبتي يا {cat}، بدك تاكلي؟','تعالي لعندي يا {cat}، بدي مشّطلك فروك!','يا روحي يا {cat}، شو هالعيون الحلوة!','تعالي نلعب بالريشة يا {cat}!','يا عيوني، ما بدي ياكي تجوعي!','إيه يا {cat}، شو هالدلال كله!','يا قمر، تعالي لعند نانا!','حبيبتي، فروك بدّه شوية ترتيب!','يا {cat}، خلّينا نلعب شوي!','الله يحميكي يا روح نانا!'];var nanaLinesEn=['Sweet {cat}, are you hungry?','Come here, {cat}, let me brush your fur!','Look at those lovely eyes, {cat}!','Let’s play with the feather, {cat}!','My darling, I won’t let you go hungry!','Oh {cat}, you are so spoiled!','Come to Nana, little sweetheart!','Your fur needs a little brushing!','Let’s play a bit, {cat}!','Stay safe, Nana’s little darling!'];function catEmergencyAlert(){
  var en=state.lang==='en';
  renderWelfare();
  var bill=$('catEmergencyBill');bill.hidden=!(state.catEmergencyBill>0);
  if(state.catEmergencyBill>0){
    $('catEmergencyBillText').textContent=en?'Nana emergency invoice: 15 coins food + 5 transport = 20 coins.':'🧾 فاتورة نانا: 15 عملة للطعام + 5 أجرة نقل = 20 عملة.';
    $('catEmergencyPay').disabled=state.money<state.catEmergencyBill;
    $('catEmergencyPay').textContent=en?'Approve invoice payment · 20 coins':'💰 وافق على دفع الفاتورة · 20 عملة';
  }
}
function needsGrace(){
  return !state.cat.away && !state.nana.hired && state.cat.hydration === 0;
}
function graceCanRun(){
  return !document.hidden && Date.now()>=catBusyUntil && !$('catEmergencyPanel').hidden &&
    $('gameRulesDialog').hidden && !shopOpen &&
    !document.querySelector('dialog[open]');
}
function updateGrace(){
  if(!needsGrace()){
    graceSample=null;
    state.cat.graceMs=60000;
    return;
  }
  if(!graceCanRun()){graceSample=null;return}
  var now=performance.now();
  if(graceSample!==null)state.cat.graceMs=Math.max(0,state.cat.graceMs-Math.min(2000,now-graceSample));
  graceSample=now;
  if(state.cat.graceMs>0)return;
  state.cat.away=true;
  graceSample=null;
  state.cat.aidBy='';
  if(state.catSpy.status==='running')state.catSpy.status='idle';
  if(state.catHunt.status==='running')state.catHunt.status='idle';
  $('mouseChase').hidden=true;
  if(shopOpen)setShopOpen(false);
  save();
}
function restoreCat(){
  if(!state.cat.away||!state.nana.hired||state.nana.paused)return;
  Object.assign(state.cat,{away:false,graceMs:60000,fullness:85,hydration:85,mood:70,hydrationSeconds:0,moodSeconds:0});
  catSeconds=0;
  state.nana.reportKind='Return';
  activeArea='cat';
  save();render();
}
function renderWelfare(){
  var cat=state.cat,name=state.catName,en=state.lang==='en',on=state.nana.hired&&!state.nana.paused;
  var water=!cat.away&&!on&&cat.hydration<=25,food=!cat.away&&!on&&cat.fullness<=25;
  var mood=!cat.away&&!on&&cat.mood<=25;
  var empty=!cat.away&&state.stock.catfood===0&&cat.fullness<=10;
  var buy=empty&&state.money>=15&&(!on||state.catEmergencyBill>0);
  var panel=$('catEmergencyPanel'),urgent=(water&&cat.hydration<=10)||(food&&cat.fullness<=10)||buy;
  var words=[],busy=Date.now()<catBusyUntil;
  function button(id,show,ar,eng,disabled){
    var b=$(id),label=en?eng:ar;
    b.hidden=!show;b.disabled=!!disabled;if(b.textContent!==label)b.textContent=label;
  }
  $('catArea').classList.toggle('cat-in-shelter',!!cat.away);
  if(cat.away){
    words.push(en?'Yasmin: Animal Friends took '+name+' into care.':'ياسمين: جمعية أصدقاء الحيوانات أخدت '+name+' حتى تعتني فيها.');
    if(!state.nana.hired)words.push(en?'Hire Nana to bring your cat home.':'فيك تستردّها بس توظّف نانا.');
    if(!state.nana.hired&&activeArea==='workers'){
      var sales=Math.max(0,12-state.sales),coins=Math.max(0,120-state.money);
      if(sales)words.push(en?sales+' more sales needed.':'باقي '+sales+' مبيعات.');
      if(coins)words.push(en?coins+' more coins needed.':'ناقصك '+coins+' عملة.');
    }
  }else{
    if(water)words.push(needsGrace()?(en?'Give water before the charity takes '+name+' into care.':'اسقي '+name+' قبل ما تاخدها الجمعية.'):(en?name+' is thirsty.':name+' عطشانة.'));
    if(food||buy)words.push(empty?(en?'The food cupboard is empty.':'خلص أكل '+name+'.'):(en?name+' is hungry.':name+' جوعانة.'));
    if(mood)words.push(en?name+' needs playtime.':name+' بدها تلعب شوي.');
    if(cat.aidBy){var who=cat.aidBy==='nana'?(en?'Nana':'نانا'):(en?'Yasmin':'ياسمين');
      words.push(en?who+' got 3 portions from Animal Friends and fed '+name+' one.':who+' جابت 3 حصص من الجمعية وطعمت '+name+' حصّة.');}
  }
  panel.hidden=!words.length;
  panel.dataset.level=urgent?'danger':cat.away||water||food||mood?'warn':'news';
  var heading=cat.away?(en?name+' is at the shelter':name+' عند الجمعية'):urgent?(en?'🚨 Emergency · ':'🚨 طوارئ ')+name:(water||food||mood)?(en?'Care alert · ':'تنبيه عناية · ')+name:(en?'Cat care news':'أخبار العناية');
  if($('welfareTitle').textContent!==heading)$('welfareTitle').textContent=heading;
  if(!cat.away&&(water||food||mood||buy))words[0]=(en?'Yasmin: ':'ياسمين: ')+words[0];
  var text=words.join(' ');
  if($('catEmergencyText').textContent!==text)$('catEmergencyText').textContent=text;
  var time=$('welfareTime'),seconds=Math.ceil(cat.graceMs/1000);
  time.hidden=!needsGrace();if(!time.hidden)time.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
  button('welfareWater',water,'💧 اسقيها هلّق','💧 Give water',busy);
  button('welfareFeed',food&&state.stock.catfood>0,'🍲 طعميها','🍲 Feed',busy||Date.now()<(catLast.Feed||0));
  button('catEmergencyBuy',buy,'اشتري 5 حصص · 15 عملة','Buy 5 portions · 15 coins');
  button('welfarePlay',mood,'🧶 العب معها','🧶 Play',busy||Date.now()<(catLast.Play||0));
  button('welfareStaff',cat.away&&!on&&activeArea!=='workers','شوف توظيف نانا','See Nana in staff');
  button('welfareReturn',cat.away&&on,'استرجع '+name,'Bring '+name+' home');
  button('welfareAck',!cat.away&&!!cat.aidBy,'قرأت الخبر','Got it');
}
function rescueCatFood(){
  if(state.cat.away||state.stock.catfood!==0||state.cat.fullness>10||state.money>=15)return false;
  var withNana=state.nana.hired&&!state.nana.paused;
  state.stock.catfood=2; // Three donated, one served immediately.
  state.cat.fullness=Math.min(100,state.cat.fullness+25);
  state.cat.aidBy=withNana?'nana':'yasmin';
  if(withNana)state.nana.reportKind='Aid';
  state.catFoodEmergencyNotice=false;
  save();return true;
}
function tickCatEmergency(){
  rescueCatFood();
  updateGrace();
}
// Store the action separately from its wording so a rename or language change updates the report.
var nanaCareUntil=0,nanaWaterServed=false;
function recordNanaCare(kind){
  state.nana.reportKind=kind;
  nanaCareUntil=catBusyUntil;
}
function renderNanaNews(){
  var n=state.nana,ar=state.lang==='ar',name=state.catName;
  var portrait=$('nanaCatPortrait'),news=$('nanaCatNews');
  portrait.hidden=news.hidden=!n.hired;
  if(n.hired){
    if(!portrait.hasAttribute('src'))portrait.src=document.querySelector('#nanaPanel .nana-art').src;
    var label=ar?'أخبار نانا':'Nana’s updates';
    var text;
    if(n.paused)text=ar?'شغلي متوقف لحتى أقبض راتبي.':'I’m waiting for my wages.';
    else if(catDrinking&&Date.now()<nanaCareUntil&&!nanaWaterServed)
      text=ar?'حطّيت مي لـ'+name+' وعم تشرب.':'I set out water for '+name+' to drink.';
    else switch(n.reportKind){
      case 'Feed': text=ar?'طعميت '+name+' من صحنها.':'I fed '+name+'.';break;
      case 'Water': text=ar?'سقيت '+name+' مي.':'I gave '+name+' water.';break;
      case 'Brush': text=ar?'مشّطت فرو '+name+'.':'I brushed '+name+'.';break;
      case 'Play': text=ar?'لعبت مع '+name+' بالريشة.':'I played with '+name+' using the feather.';break;
      case 'Purchase': text=ar?'اشتريت 5 حصص طعام بالطوارئ. الفاتورة 20 عملة.':'I bought 5 emergency food portions for 20 coins.';break;
      case 'Aid': text=ar?'جبت 3 حصص من الجمعية وطعميت '+name+' وحدة.':'I got three portions from Animal Friends and fed '+name+' one.';break;
      case 'Return': text=ar?'رجعت '+name+' من الجمعية وأنا عم اهتمّ فيها.':name+' is back from the shelter and in my care.';break;
      default: text=ar?'عم انتبه على '+name+'.':'I’m looking after '+name+'.';
    }
    if($('nanaNewsLabel').textContent!==label)$('nanaNewsLabel').textContent=label;
    if($('nanaNewsText').textContent!==text)$('nanaNewsText').textContent=text;
  }
  var busy=n.hired&&Date.now()<nanaCareUntil;
  ['Feed','Water','Play','Brush'].forEach(function(kind){
    $('cat'+kind).classList.toggle('nana-care-busy',busy&&kind===(catDrinking?'Water':n.reportKind));
  });
}
function tickNana(){
  var n=state.nana;if(state.cat.away||!n.hired||n.paused)return;
  var now=Date.now();
  if(now<catBusyUntil)return;
  // Emergency purchases are ONLY allowed after the cat becomes severely hungry with zero stock.
  if(state.stock.catfood===0&&state.cat.fullness<=10){
    if(state.money<15){
      rescueCatFood();
    }else if(state.catEmergencyBill===0){
      state.stock.catfood+=5;state.catEmergencyBill=20;
      n.action=state.lang==='ar'?'🚨 نانا اشترت 5 حصص بالطوارئ، والفاتورة 20 عملة بانتظار موافقتك.':'🚨 Nana bought 5 emergency portions. Invoice: 20 coins, awaiting approval.';
      n.reportKind='Purchase';msg(n.action);save();
    }else if(!state.catFoodEmergencyNotice){
      state.catFoodEmergencyNotice=true;
      msg(state.lang==='ar'?'🚨 فاتورة نانا السابقة ما اندفعت! اشتري طعام للقطة.':'🚨 Nana invoice is unpaid! Buy cat food.');
    }
  }
  // Water takes priority when both needs are low; all care actions share one busy window.
  if(state.cat.hydration<=25){if(giveCatWater('nana')){n.lastWater=now;return}}
  if(state.cat.fullness<=25&&state.stock.catfood>0){
    state.stock.catfood--;state.cat.fullness=Math.min(100,state.cat.fullness+25);
    catBusyUntil=now+4300;
    var scene=$('catScene');scene.dataset.toy=state.cat.toy?'feather':'yarn';scene.dataset.action='Feed';
    clearTimeout(catAnimationTimer);catAnimationTimer=setTimeout(function(){delete scene.dataset.action;render()},4300);
    n.lastCare=now;recordNanaCare('Feed');
    save();return;
  }
  if(state.cat.mood>25||now-n.lastCare<4300)return;
  var action=state.cat.toy?'Play':'Brush';
  state.cat.mood=Math.min(100,state.cat.mood+(action==='Play'?24:12));
  catBusyUntil=now+4300;
  var scene=$('catScene');scene.dataset.toy=state.cat.toy?'feather':'yarn';scene.dataset.action=action;
  clearTimeout(catAnimationTimer);catAnimationTimer=setTimeout(function(){delete scene.dataset.action;render()},4300);
  n.lastCare=now;n.dialogueIndex=(n.dialogueIndex+1)%10;
  recordNanaCare(action);save();
}
function hasSecondPot(){return state.abu.hired && state.abu.level===2 && !!state.secondPot}
function potAt(index){return index===1 ? state.secondPot : state}
function selectedPot(){return potAt(hasSecondPot() ? state.selectedPot || 0 : 0)}
function nurseryPots(){return hasSecondPot() ? [state,state.secondPot] : [state]}
function isReady(p){return p.active && p.progress>=100}
function freshPlot(){return {kind:'jasmine',active:false,progress:0,quality:100,qualityCause:'',care:0,eventEarned:0}}
function selectPot(index){
  if(index===1 && !hasSecondPot())return;
  state.selectedPot=index;
  render();
}
function togglePotPanel(panel){
  if(nurseryOpenPanel!==panel && hasSecondPot()){
    var suitable=panel==='customer' ? isReady : p=>!p.active;
    if(!suitable(selectedPot())){
      var index=nurseryPots().findIndex(suitable);
      if(index!==-1)state.selectedPot=index;
    }
  }
  toggleNurseryPanel(panel);
  render();
}
function upgradeAbu(){
  var upgrade=window.YasmineGardenCore.upgrade;
  if(!state.abu.hired || hasSecondPot() || window.YasmineGardenCore.levelFor(state.sales)<upgrade.level || state.money<upgrade.cost)return;
  state.money-=upgrade.cost;
  state.abu.level=2;
  state.secondPot=freshPlot();
  state.selectedPot=1;
  sound('purchase');
  render();
}
function renderUpgrade(){
  var en=state.lang==='en', upgrade=window.YasmineGardenCore.upgrade, double=hasSecondPot();
  var enoughSales=window.YasmineGardenCore.levelFor(state.sales)>=upgrade.level;
  var button=$('upgradeAbu');
  button.hidden=!state.abu.hired||double;
  button.disabled=!enoughSales || state.money<upgrade.cost;
  button.textContent=en?'Upgrade to level 2 · 200 coins':'طوّر أبو وردة للمستوى ٢ · ٢٠٠ عملة';
  var hint=$('upgradeHint');
  hint.hidden=!state.abu.hired;
  if(double)hint.textContent=en?'Level 2 · Tends two pots':'المستوى ٢ · بيعتني بأصيصين';
  else if(!enoughSales)hint.textContent=en?'Second pot unlocks at nursery level 3 ('+state.sales+'/25 sales).':'الأصيص التاني بيفتح بمستوى المشتل ٣ ('+state.sales+'/25 مبيعة).';
  else hint.textContent=en?'Add a second pot for 200 coins.':'التطوير بيفتح أصيص تاني فاضي لتختار بذرته.';
}
function renderPlots(){
  var en=state.lang==='en', double=hasSecondPot(), scene=$('scene'), selected=state.selectedPot||0;
  scene.classList.toggle('two-pots',double);
  scene.dataset.tending=String(state.abu.lastPot||0);
  $('plot1').hidden=!double;
  nurseryPots().forEach(function(p,i){
    var button=$('plot'+i), sprite=button.querySelector('.foliage'), phase=window.YasmineGardenCore.stageFor(p.progress);
    button.dataset.kind=p.kind;
    sprite.hidden=!p.active;
    if(p.active && sprite.dataset.kind!==p.kind){
      sprite.style.backgroundImage='url("yasmine/images/plants/'+p.kind+'.webp")';
      sprite.dataset.kind=p.kind;
    }
    sprite.style.backgroundPositionX=(phase*100/3)+'%';
    var label=p.active?crops[p.kind][state.lang]:(en?'Empty pot':'أصيص فاضي');
    if(isReady(p))label+=en?' · Ready':' · جاهز للبيع';
    var chip=button.querySelector('.plot-label');
    if(chip.textContent!==label)chip.textContent=label;
    button.setAttribute('aria-pressed',String(selected===i));
    button.setAttribute('aria-label',(en?'Pot ':'الأصيص ')+(i+1)+' · '+label);
  });
  var p=selectedPot();
  $('clock').hidden=!p.active;
  if(double){
    $('shopInfo').textContent=(en?'Choose a seed for pot ':'اختار بذرة للأصيص ')+(selected+1)+(p.active?(en?' after selling its plant.':' بعد ما تبيع نبتته.'):'');
    $('buyerTitle').textContent=(en?'Nursery customer · Pot ':'زبون المشتل · الأصيص ')+(selected+1);
    if(isReady(p))$('sell').textContent=(en?'Sell ':'بيع ')+crops[p.kind][state.lang];
  }
}
function renderSeedShop(p){
  var level=window.YasmineGardenCore.levelFor(state.sales), en=state.lang==='en';
  var signature=[state.lang,level,p.active,...Object.values(crops).map(c=>state.money>=c.cost)].join('|');
  if($('shop').dataset.signature===signature)return;
  $('shop').replaceChildren();
  Object.entries(crops).forEach(function([kind,c]){
    var button=document.createElement('button'), locked=level<c.level;
    button.type='button';
    button.textContent=c[state.lang]+' · '+c.cost+(en?' coins':' عملة');
    if(locked)button.textContent+=' · '+(en?'Level ':'مستوى ')+c.level;
    button.disabled=locked||p.active||state.money<c.cost;
    button.onclick=()=>buy(kind);
    $('shop').appendChild(button);
  });
  $('shop').dataset.signature=signature;
}
function growPlants(delta){
  var bloomed=false;
  for(var p of nurseryPots()){
    if(!p.active||isReady(p))continue;
    p.progress=window.YasmineGardenCore.growth(p.progress,delta,crops[p.kind].time);
    if(isReady(p))bloomed=true;
  }
  if(bloomed)sound('bloom');
}
function tickAbu(){
  var a=state.abu,now=Date.now();
  if(!a.hired||a.paused)return;
  if(ev==='pest'){
    clearTimeout(evTimeout);ev=null;$('event').hidden=true;
    a.lastAction='pest';a.lastPot=eventPot;a.tendedKind=potAt(eventPot).kind;a.lastCare=now;return;
  }
  if(now-a.lastCare<5000)return;
  var preferred=hasSecondPot() && a.lastPot===0 ? 1 : 0;
  var target=[preferred,1-preferred].find(i=>potAt(i)?.active && !isReady(potAt(i)));
  if(target===undefined)return;
  var p=potAt(target);
  a.lastPot=target;a.tendedKind=p.kind;a.lastCare=now;
  p.progress=Math.min(100,p.progress+3.2);
  if(state.stock.fertilizer>0&&Math.random()<.45){
    state.stock.fertilizer--;p.progress=Math.min(100,p.progress+3);a.lastAction='fertilize';
  }else a.lastAction='water';
  p.quality=Math.min(100,p.quality+1);
  if(isReady(p))sound('bloom');
}
$('catEmergencyBuy').onclick=function(){if(state.cat.away||state.stock.catfood!==0||state.cat.fullness>10||state.money<15)return;state.money-=15;state.stock.catfood+=5;state.catFoodEmergencyNotice=false;save();render()};
$('welfareWater').onclick=function(){giveCatWater('player')};
$('welfareFeed').onclick=function(){visitCat('Feed')};
$('welfarePlay').onclick=function(){visitCat('Play')};
$('welfareStaff').onclick=function(){activeArea='workers';render();$('nanaPanel').scrollIntoView({block:'center'})};
$('welfareReturn').onclick=restoreCat;
$('welfareAck').onclick=function(){state.cat.aidBy='';save();render()};
$('catEmergencyPay').onclick=function(){if(!state.catEmergencyBill||state.money<state.catEmergencyBill)return;state.money-=state.catEmergencyBill;state.catEmergencyBill=0;state.catFoodEmergencyNotice=false;save();render()};
function tickStaff(){
  const st=state.staff;
  if(!st.hired)return;
  if(state.cat.away&&st.request==='catfood')st.request=null;
  if(st.request&&st.request!=='bonus'){
    if(state.stock[st.request]<5)return;
    st.request=null;
  }
  const needs=stockRequests();
  if(needs.length){
    st.request=needs[0];
  }else{
    if(st.request||state.sales<st.nextBonusSale)return;
    st.request='bonus';
  }
  if(!jokeAwaitingRating)st.dialogue='';
  save();
}

function updateSky(){var mode=state.dayMode||'auto',hour=gameHour(),phase=mode==='day'?'day':mode==='night'?'night':hour<5?'night':hour<6?'dawn':hour<8?'sunrise':hour<11?'morning':hour<17?'day':hour<19?'sunset':hour<21?'dusk':'night';$('scene').dataset.sky=phase;document.body.dataset.sky=phase;document.body.classList.toggle('night-ui',phase==='night'||phase==='dusk');var ar={night:'ليل',dawn:'فجر',sunrise:'شروق',morning:'ضحى',day:'نهار',sunset:'غروب',dusk:'غسق'},en={night:'Night',dawn:'Dawn',sunrise:'Sunrise',morning:'Morning',day:'Day',sunset:'Sunset',dusk:'Dusk'};$('skyPhase').textContent=(state.lang==='ar'?'السماء الآن: ':'Sky: ')+(state.lang==='ar'?ar[phase]:en[phase]);$('dayMode').value=mode;updateWeather();updateClock()}function tr(s){return txt[state.lang][s]}function msg(s){$('message').textContent=s}
function renderNurseryNotice(){$('abuNotice').hidden=activeArea!=='nursery'||!nurseryPots().some(p=>isReady(p)||!p.active)}function updateWeather(){var selected=state.weatherMode||'auto';var w=selected==='auto'?['clear','wind','rain','clear'][Math.floor((Date.now()-state.gameEpoch)/240000)%4]:selected;document.body.dataset.weather=w;$('scene').dataset.weather=w;$('weatherMode').value=selected;$('weatherStatus').textContent=(selected==='auto'?'🔄 ':'')+(w==='rain'?(state.lang==='ar'?'🌧️ مطر':'🌧️ Rain'):w==='wind'?(state.lang==='ar'?'💨 ريح':'💨 Wind'):(state.lang==='ar'?'☀️ صحو':'☀️ Clear'))}function gameHour(){if(!Number.isFinite(Number(state.gameEpoch)))state.gameEpoch=Date.now();return ((Math.floor((Date.now()-Number(state.gameEpoch))/120000)%24)+24)%24}function updateClock(){if(!Number.isFinite(Number(state.gameEpoch)))state.gameEpoch=Date.now();var elapsed=Math.floor((Date.now()-state.gameEpoch)/1000),minutes=Math.floor((elapsed%120)/2)%60,h=gameHour(),time=String(h%12||12).padStart(2,'0')+':'+String(minutes).padStart(2,'0')+' '+(h<12?'AM':'PM');$('gameTime').textContent=time;var dateEl=$('gameDate');if(!dateEl){dateEl=document.createElement('span');dateEl.id='gameDate';dateEl.dir='ltr';dateEl.style.cssText='flex:0 0 auto;min-width:0;text-align:center;white-space:nowrap;font-size:clamp(13px,3.5vw,21px);font-weight:800;font-variant-numeric:tabular-nums';$('gameTime').before(dateEl)}var gameDays=Math.max(0,Math.floor((Date.now()-Number(state.gameEpoch))/2880000)),calendar=new Date(Date.UTC(2020,0,1)+gameDays*86400000);dateEl.textContent=String(calendar.getUTCDate()).padStart(2,'0')+'/'+String(calendar.getUTCMonth()+1).padStart(2,'0')+'/'+calendar.getUTCFullYear();$('gameTime').setAttribute('dir','ltr');$('gameTime').style.direction='ltr';$('gameTime').style.unicodeBidi='isolate';$('skyClock').textContent=(state.lang==='ar'?'وقت اللعبة: ':'Game time: ')+time;$('skyClock').style.direction='ltr';$('skyClock').style.unicodeBidi='isolate'} function renderGoal(){var g=state.abu.hired?(state.nana.hired?null:{ar:'توظيف نانا',en:'Hire Nana',sales:12,cost:120}):{ar:'توظيف أبو وردة',en:'Hire John',sales:ECONOMY_CONFIG.abuSales,cost:80};var el=$('nextGoal');el.hidden=!g;if(!g)return;var en=state.lang==='en',ds=Math.max(0,g.sales-state.sales),dc=Math.max(0,g.cost-state.money);$('goalTitle').textContent=(en?'🎯 Next goal: ':'🎯 هدفك القادم: ')+g[en?'en':'ar'];$('goalSalesLabel').textContent=(en?'Sales: ':'المبيعات: ')+Math.min(state.sales,g.sales)+'/'+g.sales;$('goalCoinsLabel').textContent=(en?'Coins: ':'العملات: ')+Math.min(state.money,g.cost)+'/'+g.cost;$('goalSalesBar').value=Math.min(100,state.sales/g.sales*100);$('goalCoinsBar').value=Math.max(0,Math.min(100,state.money/g.cost*100));$('goalRemaining').textContent=en?ds+' more sales and '+dc+' coins needed':('باقي '+ds+' مبيعة و '+dc+' عملة لـ'+g.ar)}$('nextGoal').onclick=function(){activeArea='workers';render();$('workersArea').scrollIntoView({block:'start',behavior:'smooth'})};$('nextGoal').onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();$('nextGoal').click()}};
$('employeesToggle').onclick=function(){$('employeesPanel').hidden=!$('employeesPanel').hidden};$('employeesClose').onclick=function(){$('employeesPanel').hidden=true};$('dayMode').onchange=function(){state.dayMode=this.value;render()};$('weatherMode').onchange=function(){state.weatherMode=this.value;render()};$('qualityCard').onclick=function(){$('qualityReason').hidden=!$('qualityReason').hidden};$('qualityCard').onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();$('qualityCard').click()}};$('abuWagePay').onclick=function(){$('hireAbu').click()};
function runGardenRegressionChecks(){
 var errors=[],check=function(ok,label){if(!ok)errors.push(label)};
 var sample=normalizeGameState({money:-10,sales:-1,quality:200,progress:120,cat:{fullness:-5,mood:200},stock:{fertilizer:-2,catfood:3},abu:{hired:true,paidSales:0},nana:{hired:true,paidSales:0}});
 check(sample.money===0&&sample.sales===0&&sample.quality===100&&sample.progress===100,'numeric bounds');
 check(sample.cat.fullness===0&&sample.cat.mood===100,'cat bounds');
 check(sample.abu.hired===true&&sample.nana.hired===true,'existing hires preserved');
 check(normalizeGameState({money:100}).money===100,'legacy partial save');
 check(!!$('topEditNames').onclick&&!!$('settingsNames').onclick,'settings handlers');
 check(!!$('qualityCard').onclick&&!!$('employeesToggle').onclick,'controls handlers');
 check(!!$('identityPanel')&&!!$('settingsNamesPanel'),'name editing elements');
 if(errors.length)console.error('Garden regression checks failed:',errors);else console.info('Garden regression checks passed (7 checks)');
 return {passed:errors.length===0,errors:errors};
}
if(new URLSearchParams(location.search).get('selftest')==='1')setTimeout(runGardenRegressionChecks,0);
function updateYasminFinancialAid(){
  const before=!!state.yasminAidOpen;
  if(state.money<20)state.yasminAidOpen=true;
  else if(state.money>=30)state.yasminAidOpen=false;
  if(before!==state.yasminAidOpen)save();
  const section=document.getElementById('yasminMiniGames');
  if(section){section.hidden=!state.yasminAidOpen;section.style.display=state.yasminAidOpen?'':'none';}
  const host=document.getElementById('staffArea');
  if(!host)return;
  let notice=document.getElementById('yasminAidNotice');
  if(!notice){notice=document.createElement('div');notice.id='yasminAidNotice';notice.setAttribute('role','status');notice.style.cssText='background:#b91c1c;color:#fff;border:2px solid #fca5a5;border-radius:15px;padding:14px;margin:12px 0;font-size:19px;font-weight:900;text-align:center;line-height:1.6';host.insertBefore(notice,section||host.firstChild)}
  notice.hidden=!state.yasminAidOpen;
  if(state.yasminAidOpen)notice.textContent=state.lang==='en'?'🔴 Low on coins! Yasmin can help you earn 5 coins per completed mission until you reach 30.':'🔴 مصاريك قليلة! ياسمين جاهزة تساعدك. اربح 5 عملات بكل مهمة لحتى توصل لـ30 عملة.';
}
var nurseryOpenPanel='';
function toggleNurseryPanel(panel){nurseryOpenPanel=nurseryOpenPanel===panel?'':panel;updateNurseryQuickActions()}
function updateNurseryQuickActions(){
 var ready=nurseryPots().some(isReady),needsSeed=nurseryPots().some(p=>!p.active),en=state.lang==='en';
 $('customerToggleLabel').textContent=en?'Nursery customer':'زبون المشتل';
 $('seedToggleLabel').textContent=en?'Seed shop':'متجر البذور';
 $('customerAlert').hidden=!ready;
 $('seedAlert').hidden=!needsSeed;
 $('sellPanel').hidden=nurseryOpenPanel!=='customer';
 $('seedPanel').hidden=nurseryOpenPanel!=='seeds';
 $('customerToggle').setAttribute('aria-expanded',String(nurseryOpenPanel==='customer'));
 $('seedToggle').setAttribute('aria-expanded',String(nurseryOpenPanel==='seeds'));
}
$('customerToggle').addEventListener('click',function(){togglePotPanel('customer')});
$('seedToggle').addEventListener('click',function(){togglePotPanel('seeds')});
$('plot0').onclick=()=>selectPot(0);
$('plot1').onclick=()=>selectPot(1);
$('upgradeAbu').onclick=upgradeAbu;
function collectionDate(){return new Date(Date.UTC(2020,0,1)+Math.max(0,Math.floor((Date.now()-state.gameEpoch)/2880000))*86400000).toISOString().slice(0,10).split('-').reverse().join('/')}
function collectionData(){return state.collection||(state.collection={plants:{},awards:{},feeds:0})}
function recordCollections(){var c=collectionData();nurseryPots().forEach(function(p){if(!isReady(p)){p.collectionRecorded=false;return}if(!p.collectionRecorded){var v=c.plants[p.kind]||(c.plants[p.kind]={count:0,best:0,date:collectionDate()});v.count++;if(v.count===1){v.unread=true;v.announced=false;}v.best=Math.max(v.best,Math.round(p.quality));p.collectionRecorded=true}else if(c.plants[p.kind])c.plants[p.kind].best=Math.max(c.plants[p.kind].best,Math.round(p.quality))});var en=state.lang==='en',n=Object.keys(c.plants).length;var rows=[['sales50','🥉','التاجر الصغير','Junior merchant',state.sales,50,25],['sales100','🥈','التاجر المحترف','Expert merchant',state.sales,100,50],['sales500','🥇','ملك المشاتل','Nursery king',state.sales,500,150],['level5','🏅','مشتل مزدهر','Thriving nursery',window.YasmineGardenCore.levelFor(state.sales),5,30],['team','👥','فريق متكامل','Full team',[state.staff,state.abu,state.nana].filter(x=>x.hired).length,3,30],['cat50','🐱','صديق القطط','Cat friend',c.feeds,50,30],['heart50','💖','حديقة الأمل','Garden of hope',c.heartCount||0,50,30],['geo25','🥉','الرحّالة الصغير','Junior traveler',c.geoCorrect||0,25,25],['geo100','🥈','مستكشف العالم','World explorer',c.geoCorrect||0,100,75],['geo200','🥇','خبير الجغرافيا','Geography expert',c.geoCorrect||0,200,150],['plants','🌻','عاشق النباتات','Plant lover',n,Object.keys(crops).length,50]];rows.forEach(function(a){if(a[4]>=a[5]&&!c.awards[a[0]]){c.awards[a[0]]={date:collectionDate(),unread:true,announced:false};state.money+=a[6]}});return rows}
function renderCollections(){var rows=recordCollections(),c=collectionData(),en=state.lang==='en';var a=$('achievementsArea'),b=$('encyclopediaArea');if(!a||!b)return;a.hidden=activeArea!=='achievements';b.hidden=activeArea!=='encyclopedia';$('achievementsTab').textContent=en?'🏆 Achievements':'🏆 الإنجازات';$('encyclopediaTab').textContent=en?'📖 Encyclopedia':'📖 الموسوعة';if(!c.itemNoticeVersion){[ [c.awards,c.unreadAwards],[c.plants,c.unreadPlants] ].forEach(function(pair){Object.values(pair[0]).slice(-Math.max(0,pair[1]||0)).forEach(function(v){if(pair[1]>0){v.unread=true;v.announced=false}})});c.itemNoticeVersion=1}if(!a.hidden)Object.values(c.awards).forEach(v=>v.announced=true);if(!b.hidden)Object.values(c.plants).forEach(v=>v.announced=true);[['achievementsTab',Object.values(c.awards).filter(v=>v.unread&&!v.announced).length],['encyclopediaTab',Object.values(c.plants).filter(v=>v.unread&&!v.announced).length]].forEach(function(pair){if(pair[1]>0){var badge=document.createElement('span');badge.className='collection-unread';badge.textContent=pair[1];$(pair[0]).appendChild(badge)}});$('achievementsTab').setAttribute('aria-pressed',String(!a.hidden));$('encyclopediaTab').setAttribute('aria-pressed',String(!b.hidden));if(!a.hidden)a.innerHTML='<h2>'+(en?'Achievements':'قاعة الإنجازات')+'</h2>'+rows.map(function(x){var won=c.awards[x[0]];return '<article class="collection-card" '+(won&&won.unread?'data-unread-award="'+x[0]+'" tabindex="0" role="button"><span class="collection-unread">1</span>':'>')+'<strong>'+x[1]+' '+x[en?3:2]+'</strong><div>'+Math.min(x[4],x[5])+' / '+x[5]+' · 💰 '+x[6]+'</div><progress max="'+x[5]+'" value="'+Math.min(x[4],x[5])+'"></progress><small>'+(won?'✓ '+won.date:(en?'Locked':'مقفل'))+'</small></article>'}).join('');if(!b.hidden)b.innerHTML='<h2>'+(en?'Plant encyclopedia':'موسوعة النباتات')+'</h2><p dir="ltr" style="text-align:start">'+Object.keys(c.plants).length+' / '+Object.keys(crops).length+'</p><div class="collection-grid">'+Object.keys(crops).map(function(k){var v=c.plants[k],p=crops[k];return '<article class="collection-card" '+(v&&v.unread?'data-unread-plant="'+k+'" tabindex="0" role="button"><span class="collection-unread">1</span>':'>')+'<strong>'+(v?'🌱 '+p[state.lang]:'🔒 ؟؟؟')+'</strong><small>'+(v?(en?'Mature plants: ':'نباتات ناضجة: ')+v.count+'<br>'+(en?'Best quality: ':'أفضل جودة: ')+v.best+'%<br>'+v.date:(en?'Grow to maturity · Level ':'ازرعها حتى النضج · المستوى ')+p.level)+'</small></article>'}).join('')+'</div>'}
function acknowledgeCollection(e){if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;var card=e.target.closest('[data-unread-award],[data-unread-plant]');if(!card)return;e.preventDefault();var c=collectionData(),v=card.dataset.unreadAward?c.awards[card.dataset.unreadAward]:c.plants[card.dataset.unreadPlant];if(v){v.unread=false;v.announced=true;save();renderCollections()}}
['achievementsArea','encyclopediaArea'].forEach(function(id){$(id).addEventListener('click',acknowledgeCollection);$(id).addEventListener('keydown',acknowledgeCollection)});
$('achievementsTab').onclick=function(){activeArea='achievements';render()};$('encyclopediaTab').onclick=function(){activeArea='encyclopedia';render()};
var abuGeoCountries=[["ألبانيا","Albania","تيرانا","Tirana"],["فرنسا","France","باريس","Paris"],["إيطاليا","Italy","روما","Rome"],["ألمانيا","Germany","برلين","Berlin"],["كندا","Canada","أوتاوا","Ottawa"],["سوريا","Syria","دمشق","Damascus"],["لبنان","Lebanon","بيروت","Beirut"],["الأردن","Jordan","عمّان","Amman"],["العراق","Iraq","بغداد","Baghdad"],["مصر","Egypt","القاهرة","Cairo"],["المغرب","Morocco","الرباط","Rabat"],["تونس","Tunisia","تونس","Tunis"],["الجزائر","Algeria","الجزائر","Algiers"],["ليبيا","Libya","طرابلس","Tripoli"],["السعودية","Saudi Arabia","الرياض","Riyadh"],["قطر","Qatar","الدوحة","Doha"],["البحرين","Bahrain","المنامة","Manama"],["عُمان","Oman","مسقط","Muscat"],["الإمارات","United Arab Emirates","أبو ظبي","Abu Dhabi"],["الكويت","Kuwait","مدينة الكويت","Kuwait City"],["تركيا","Türkiye","أنقرة","Ankara"],["اليونان","Greece","أثينا","Athens"],["بلغاريا","Bulgaria","صوفيا","Sofia"],["رومانيا","Romania","بوخارست","Bucharest"],["صربيا","Serbia","بلغراد","Belgrade"],["كرواتيا","Croatia","زغرب","Zagreb"],["سلوفينيا","Slovenia","ليوبليانا","Ljubljana"],["البوسنة والهرسك","Bosnia and Herzegovina","سراييفو","Sarajevo"],["الجبل الأسود","Montenegro","بودغوريتسا","Podgorica"],["مقدونيا الشمالية","North Macedonia","سكوبيه","Skopje"],["النمسا","Austria","فيينا","Vienna"],["المجر","Hungary","بودابست","Budapest"],["التشيك","Czechia","براغ","Prague"],["سلوفاكيا","Slovakia","براتيسلافا","Bratislava"],["بولندا","Poland","وارسو","Warsaw"],["إسبانيا","Spain","مدريد","Madrid"],["البرتغال","Portugal","لشبونة","Lisbon"],["بلجيكا","Belgium","بروكسل","Brussels"],["هولندا","Netherlands","أمستردام","Amsterdam"],["أيرلندا","Ireland","دبلن","Dublin"],["المملكة المتحدة","United Kingdom","لندن","London"],["النرويج","Norway","أوسلو","Oslo"],["السويد","Sweden","ستوكهولم","Stockholm"],["فنلندا","Finland","هلسنكي","Helsinki"],["الدنمارك","Denmark","كوبنهاغن","Copenhagen"],["آيسلندا","Iceland","ريكيافيك","Reykjavik"],["إستونيا","Estonia","تالين","Tallinn"],["لاتفيا","Latvia","ريغا","Riga"],["ليتوانيا","Lithuania","فيلنيوس","Vilnius"],["أوكرانيا","Ukraine","كييف","Kyiv"],["مولدوفا","Moldova","كيشيناو","Chisinau"],["بيلاروس","Belarus","مينسك","Minsk"],["روسيا","Russia","موسكو","Moscow"],["جورجيا","Georgia","تبليسي","Tbilisi"],["أرمينيا","Armenia","يريفان","Yerevan"],["أذربيجان","Azerbaijan","باكو","Baku"],["إيران","Iran","طهران","Tehran"],["باكستان","Pakistan","إسلام آباد","Islamabad"],["الهند","India","نيودلهي","New Delhi"],["نيبال","Nepal","كاتماندو","Kathmandu"],["بنغلاديش","Bangladesh","دكا","Dhaka"],["بوتان","Bhutan","تيمفو","Thimphu"],["الصين","China","بكين","Beijing"],["اليابان","Japan","طوكيو","Tokyo"],["كوريا الجنوبية","South Korea","سيول","Seoul"],["منغوليا","Mongolia","أولان باتور","Ulaanbaatar"],["تايلاند","Thailand","بانكوك","Bangkok"],["فيتنام","Vietnam","هانوي","Hanoi"],["كمبوديا","Cambodia","بنوم بنه","Phnom Penh"],["لاوس","Laos","فيينتيان","Vientiane"],["الفلبين","Philippines","مانيلا","Manila"],["ماليزيا","Malaysia","كوالالمبور","Kuala Lumpur"],["أستراليا","Australia","كانبيرا","Canberra"],["نيوزيلندا","New Zealand","ويلينغتون","Wellington"],["الولايات المتحدة","United States","واشنطن","Washington, D.C."],["المكسيك","Mexico","مكسيكو سيتي","Mexico City"],["كوبا","Cuba","هافانا","Havana"],["جامايكا","Jamaica","كينغستون","Kingston"],["البرازيل","Brazil","برازيليا","Brasilia"],["الأرجنتين","Argentina","بوينس آيرس","Buenos Aires"],["تشيلي","Chile","سانتياغو","Santiago"],["بيرو","Peru","ليما","Lima"],["كولومبيا","Colombia","بوغوتا","Bogota"],["الإكوادور","Ecuador","كيتو","Quito"],["أوروغواي","Uruguay","مونتيفيديو","Montevideo"],["باراغواي","Paraguay","أسونسيون","Asuncion"],["فنزويلا","Venezuela","كاراكاس","Caracas"],["كينيا","Kenya","نيروبي","Nairobi"],["إثيوبيا","Ethiopia","أديس أبابا","Addis Ababa"],["غانا","Ghana","أكرا","Accra"],["نيجيريا","Nigeria","أبوجا","Abuja"],["السنغال","Senegal","داكار","Dakar"],["أوغندا","Uganda","كمبالا","Kampala"],["رواندا","Rwanda","كيغالي","Kigali"],["تنزانيا","Tanzania","دودوما","Dodoma"],["زامبيا","Zambia","لوساكا","Lusaka"],["زيمبابوي","Zimbabwe","هراري","Harare"],["بوتسوانا","Botswana","غابورون","Gaborone"],["ناميبيا","Namibia","ويندهوك","Windhoek"],["مدغشقر","Madagascar","أنتاناناريفو","Antananarivo"]],abuGeoExtra=[["في أي بلد يقع نهر السين؟","In which country is the Seine River?","فرنسا","France","إيطاليا","Italy","ألمانيا","Germany","بيمر بمدينة باريس.","It flows through Paris."],["في أي دولة تقع البتراء؟","Which country contains Petra?","الأردن","Jordan","مصر","Egypt","العراق","Iraq","مدينة أثرية منحوتة بالصخر.","An ancient city carved into rock."],["ما أكبر جزيرة في العالم؟","What is the world's largest island?","غرينلاند","Greenland","مدغشقر","Madagascar","آيسلندا","Iceland","أستراليا تُعد قارة.","Australia is classified as a continent."],["أي محيط هو الأكبر؟","Which ocean is largest?","الهادئ","Pacific","الأطلسي","Atlantic","الهندي","Indian","يغطي مساحة أكبر من أي محيط آخر.","It covers more area than any other ocean."]];
var abuGeoQuestions=abuGeoCountries.flatMap(function(x,i){var y=abuGeoCountries[(i+17)%abuGeoCountries.length],z=abuGeoCountries[(i+39)%abuGeoCountries.length];return [['ما عاصمة '+x[0]+'؟','What is the capital of '+x[1]+'?',x[2],x[3],y[2],y[3],z[2],z[3],x[2]+' هي عاصمة '+x[0]+'.',x[3]+' is the capital of '+x[1]+'.'],['أي دولة عاصمتها '+x[2]+'؟','Which country has '+x[3]+' as its capital?',x[0],x[1],y[0],y[1],z[0],z[1],x[2]+' هي عاصمة '+x[0]+'.',x[3]+' is the capital of '+x[1]+'.']] }).concat(abuGeoExtra);
function geoShuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function geoNext(){if(!state.abu.hired)return;var c=collectionData();if(!Number.isInteger(c.geoNextIndex))c.geoNextIndex=0;c.geoCurrent={id:c.geoNextIndex%abuGeoQuestions.length,order:geoShuffle([0,1,2]),answer:null};c.geoNextIndex=(c.geoNextIndex+1)%abuGeoQuestions.length;render()}
function geoAnswer(i){var c=collectionData(),g=c.geoCurrent;if(!state.abu.hired||!g||g.answer!==null)return;g.answer=i;c.geoTotal=(c.geoTotal||0)+1;if(i===0)c.geoCorrect=(c.geoCorrect||0)+1;render()}
function renderAbuGeo(){var panel=$('abuGeoPanel');if(!panel)return;panel.hidden=!state.abu.hired;if(panel.hidden)return;var c=collectionData(),g=c.geoCurrent,en=state.lang==='en',l=en?1:0;$('abuGeoTitle').textContent=en?'🌍 Around the world with John':'🌍 حول العالم مع أبو وردة';$('abuGeoScore').textContent=(en?'Correct answers: ':'الإجابات الصحيحة: ')+(c.geoCorrect||0)+' / '+(c.geoTotal||0);$('abuGeoNext').hidden=!!g&&g.answer===null;$('abuGeoNext').textContent=g?(en?'Next question':'السؤال التالي'):(en?'Start quiz':'ابدأ المسابقة');$('abuGeoQuestion').textContent=g?abuGeoQuestions[g.id][l]:(en?'Ready to explore the world?':'لشوف معلوماتك بالجغرافيا يا ابني!');var opts=$('abuGeoOptions');opts.hidden=!g;if(g){var q=abuGeoQuestions[g.id];g.order.forEach(function(k,i){var b=opts.children[i];b.textContent=q[2+k*2+l];b.disabled=g.answer!==null;b.dataset.result=g.answer===null?'':k===0?'correct':g.answer===k?'wrong':'';b.onclick=function(){geoAnswer(k)}})}$('abuGeoFeedback').hidden=!g||g.answer===null;if(g&&g.answer!==null)$('abuGeoFeedback').textContent=(g.answer===0?(en?'Well done! ':'برافو يا ابني! '):(en?'Every day we learn something new. ':'مو مشكلة يا ابني، كل يوم منتعلّم شي جديد. '))+abuGeoQuestions[g.id][8+l]}
$('abuGeoNext').onclick=geoNext;
function render(){renderCollections();renderAbuGeo();var pot=selectedPot();updateNurseryQuickActions();updateYasminFinancialAid();renderGoal();$('emergencyFertilizer').hidden=state.stock.fertilizer>0||!!state.emergencyFertilizerUsed;updateSky();$('employeesClose').textContent=state.lang==='ar'?'إغلاق':'Close';$('siteBack').textContent=state.lang==='ar'?'رجوع ←':'Back ←';$('daySettings').querySelector('label[for="dayMode"]').textContent=state.lang==='ar'?'🌤️ الوقت والسماء':'🌤️ Time & sky';$('daySettings').querySelector('label[for="weatherMode"]').textContent=state.lang==='ar'?'🌦️ الطقس':'🌦️ Weather';[['dayMode',['Automatic — day cycle','Always day','Always night']],['weatherMode',['Automatic — changing weather','Clear','Rain','Wind']]].forEach(function(x){var labels=state.lang==='en'?x[1]:x[0]==='dayMode'?['تلقائي — دورة اليوم','نهار دائم','ليل دائم']:['تلقائي — طقس متغير','صحو','مطر','ريح'];Array.from($(x[0]).options).forEach(function(o,i){o.textContent=labels[i]})});$('manualCare').hidden=!!state.abu.hired;$('careInfo').hidden=!!state.abu.hired;$('missionPanel').hidden=true;document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==='ar'?'rtl':'ltr';document.title=tr('title');['title','subtitle','moneyLabel','salesLabel','qualityLabel','water','feed','sun','careInfo','buyerTitle','buyerText','sell','shopTitle','shopInfo','missionTitle','missionInfo'].forEach(function(k){$(k).textContent=tr(k)});$('lang').textContent=state.lang==='ar'?'English':'العربية';$('gameFooter').textContent=state.lang==='ar'?'التقدم محفوظ على جهازك · النمو خلال اللعب فقط':'Progress saved on your device · Plants grow while playing';$('topEditNames').textContent=state.lang==='ar'?'⚙️ الإعدادات':'⚙️ Settings';$('settingsNames').textContent=state.lang==='ar'?'✏️ تعديل الأسماء':'✏️ Edit names';$('title').textContent='🌿 '+state.gardenName;$('settingsAudio').textContent=state.lang==='ar'?'🔊 تعديل الصوت':'🔊 Audio settings';$('employeesToggle').textContent=state.lang==='ar'?'👥 الموظفين':'👥 Employees';$('employeesTitle').textContent=state.lang==='ar'?'👥 الموظفين':'👥 Employees';$('yasminSalary').textContent=state.lang==='ar'?'👩🏻‍🌾 المديرة ياسمين — الراتب: لا يوجد راتب دوري؛ تطلب مبالغ للمشتريات أو المكافآت.':'👩🏻‍🌾 Manager Yasmin — no recurring salary; requests funds for supplies or bonuses.';$('yasminEmployeeName').textContent=state.lang==='ar'?'ياسمين':'Yasmin';$('yasminEmployeeDescription').textContent=state.lang==='ar'?'مديرة المشتل':'Nursery manager';$('yasminEmployeeDuty').textContent=state.lang==='ar'?'مسؤولة عن المشتل والمخزون وطلبات الشراء والدعابات':'Manages the nursery, supplies, purchase requests and jokes';$('yasminEmployeeState').textContent=state.lang==='ar'?'● تعمل':'● Working';$('abuEmployeeName').textContent=state.lang==='ar'?'أبو وردة':'John';$('abuEmployeeRole').textContent=state.lang==='ar'?'مسؤول العناية بالنباتات':'Plant caretaker';$('abuEmployeeDuty').textContent=state.lang==='ar'?'يسقي النبتة ويسمّدها ويكافح الدود تلقائياً':'Automatically waters, fertilizes and treats pests';$('nanaEmployeeName').textContent=state.lang==='ar'?'نانا':'Nana';$('nanaEmployeeRole').textContent=state.lang==='ar'?'مربّية القطط':'Cat caretaker';$('nanaEmployeeDuty').textContent=state.lang==='ar'?'بتطعم القطة وبتسقيها وبتساعد بتمشيطها واللعب معها':'Feeds and waters the cat, and helps with grooming and play';$('nanaEmployeeSalary').textContent=state.lang==='ar'?'20 عملة كل 3 مبيعات':'20 coins every 3 sales';$('nanaEmployeeState').textContent=state.lang==='ar'?(state.nana.hired?(state.nana.paused?'● متوقفة مؤقتاً':'● تعمل'):'○ غير موظفة'):(state.nana.hired?(state.nana.paused?'● Paused':'● Working'):'○ Not hired');$('abuSalary').textContent=state.lang==='ar'?'👨‍🌾 مسؤول المشتل أبو وردة — الراتب: 15 عملة كل 3 مبيعات. الحالة: '+(state.abu.hired?(state.abu.paused?'متوقف':'يعمل'):'غير موظف'):'👨‍🌾 Nursery manager John — 15 coins every 3 sales. Status: '+(state.abu.hired?(state.abu.paused?'paused':'working'):'not hired');$('restartGame').textContent=state.lang==='ar'?'🔄 إعادة اللعبة من البداية':'🔄 Restart game';$('money').textContent='💰 '+state.money;$('sales').textContent=state.sales;$('quality').textContent=pot.quality+'%';$('qualityReason').textContent=pot.qualityCause||(state.lang==='ar'?'الجودة ممتازة، ما في ضرر مسجّل.':'Excellent quality; no recorded damage.');var crop=crops[pot.kind];$('cropName').textContent=pot.active?crop[state.lang]:'—';$('growth').style.width=pot.progress+'%';$('pct').textContent=Math.floor(pot.progress)+'%';$('stage').textContent=pot.active?crop.stages[state.lang][window.YasmineGardenCore.stageFor(pot.progress)]:'—';var remaining=Math.max(0,Math.ceil(crop.time*(100-pot.progress)/100));$('clock').textContent='⏱ '+String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');var ready=pot.active&&pot.progress>=100;$('sell').disabled=!ready;var price=Math.round(crop.price*(.5+pot.quality/200)*(state.sales<ECONOMY_CONFIG.starterSales?1+ECONOMY_CONFIG.starterBonus:1));$('offer').hidden=!ready;$('offer').textContent=ready?'💰 '+price:'';$('buyerText').textContent=ready?tr('ready'):tr('buyerText');['water','feed','sun'].forEach(function(k){$(k).disabled=!pot.active||ready||Date.now()-last[k]<5000});$('mission').textContent=state.sales>=3?tr('won'):tr('mission')+' ('+state.sales+'/3)';renderSeedShop(pot);renderPlots();renderUpgrade();renderCat();renderStaff();renderNurseryNotice();updateAudioButtons();save()}
function buy(k){var c=crops[k],pot=selectedPot();if(!c || window.YasmineGardenCore.levelFor(state.sales)<c.level)return;if(pot.active){msg(tr('busy'));return}if(state.money<c.cost){msg(tr('need'));return}state.money-=c.cost;state.dismissedEmpty=false;pot.kind=k;pot.progress=0;pot.quality=100;pot.qualityCause='';pot.care=0;pot.active=true;msg(tr('plant')+c[state.lang]);sound('plant');render()}
$('buyFertilizerDirect').onclick=function(){if(state.money<10)return;state.money-=10;state.stock.fertilizer+=5;save();render();msg(state.lang==='ar'?'اشتريت 5 وحدات سماد.':'Bought 5 fertilizer portions.');sound('purchase')};$('emergencyFertilizer').onclick=function(){if(state.stock.fertilizer>0||state.emergencyFertilizerUsed)return;state.stock.fertilizer=2;state.emergencyFertilizerUsed=true;save();render();msg(state.lang==='ar'?'حصلت على وحدتين سماد مجاناً!':'You received two free fertilizer portions!')};function care(k){if(state.abu.hired){msg(state.lang==='ar'?'أبو وردة مسؤول عن السقاية والتسميد تلقائياً.':'John handles watering and fertilizer automatically.');return}if(!state.active||state.progress>=100||Date.now()-last[k]<5000)return;if(k==='feed'){if(state.stock.fertilizer<=0){msg(state.lang==='ar'?'السماد خلص! اشتري سماد من زر الشراء بقسم ياسمين، حتى قبل توظيفها.':'Fertilizer is empty! Ask Yasmin to restock.');if(state.staff.hired){state.staff.rejectedStock={};state.staff.request='fertilizer'}render();return}state.stock.fertilizer--}last[k]=Date.now();state.care++;state.progress=Math.min(100,state.progress+3.2);if(state.care%7===0){state.quality=Math.max(30,state.quality-3);state.qualityCause=state.lang==='ar'?'عناية زائدة بالنبتة: ناقص 3%':'Excessive care: -3%';msg(tr('over'))}else msg(tr(k==='water'?'waterMsg':k==='feed'?'feedMsg':'sunMsg'));sound(k);render()}
function sell(){var pot=selectedPot();if(!pot.active||pot.progress<100)return;recordCollections();var amount=Math.round(crops[pot.kind].price*(.5+pot.quality/200)*(state.sales<ECONOMY_CONFIG.starterSales?1+ECONOMY_CONFIG.starterBonus:1));state.money+=amount;state.sales++;pot.eventEarned=0;state.eventCycleSales=state.sales;if(state.abu.hired){state.abu.paidSales++;if(state.abu.paidSales>=3){state.abu.paidSales=0;if(state.money>=15)state.money-=15;else state.abu.paused=true}}if(state.nana.hired){state.nana.paidSales++;if(state.nana.paidSales>=3){state.nana.paidSales=0;if(state.money>=20)state.money-=20;else state.nana.paused=true}}if(ev&&eventPot===(state.selectedPot||0)){clearTimeout(evTimeout);ev=null;$('event').hidden=true}pot.active=false;pot.collectionRecorded=false;pot.progress=0;msg(tr('sold')+'💰 '+amount);sound('sell');render()}
function eventBudget(pot){var price=crops[pot.kind].price*(.5+pot.quality/200);return Math.max(0,Math.floor(price*ECONOMY_CONFIG.eventSaleCap)-pot.eventEarned)}
function awardEvent(amount){var pot=potAt(eventPot);var n=Math.min(amount,eventBudget(pot));if(n>0){state.money+=n;pot.eventEarned+=n;state.extraEarned+=n}return n}
var eventPot=0,eventNext=Date.now()+ECONOMY_CONFIG.eventMinMs,eventTaps=0;
function scheduleEvent(){eventNext=Date.now()+ECONOMY_CONFIG.eventMinMs+Math.random()*(ECONOMY_CONFIG.eventMaxMs-ECONOMY_CONFIG.eventMinMs)}
function eventSpawn(){var pot=selectedPot();if(!pot.active||pot.progress>=100||ev||activeArea!=='nursery'||document.hidden||document.querySelector('dialog[open],#catSheetOverlay:not([hidden])')||settingsOpen)return;eventPot=state.selectedPot||0;ev=['bee','dew','pest'][Math.floor(Math.random()*3)];eventTaps=0;var b=$('event');b.hidden=false;b.textContent=ev==='bee'?'🐝':ev==='dew'?'💧':'🐛';b.setAttribute('aria-label',ev==='bee'?'Bee':ev==='dew'?'Dew':'Worm');b.style.left=hasSecondPot()?(eventPot?'74%':'34%'):(ev==='dew'?'54%':'15%');b.style.top=ev==='dew'?'48%':'32%';evTimeout=setTimeout(function(){if(!ev)return;if(ev==='pest'){pot.quality=Math.max(30,pot.quality-ECONOMY_CONFIG.pestQualityLoss);pot.qualityCause=state.lang==='ar'?'دودة: ناقص 2%':'Worm: -2%'}ev=null;b.hidden=true;render()},ECONOMY_CONFIG.eventDurationMs)}
$('event').onclick=function(){if(!ev)return;var type=ev;if(type==='pest'&&++eventTaps<ECONOMY_CONFIG.pestTaps){$('event').textContent='🐛 '+(ECONOMY_CONFIG.pestTaps-eventTaps);return}clearTimeout(evTimeout);var reward=awardEvent(ECONOMY_CONFIG.eventRewards[type]);msg((state.lang==='ar'?'مكافأة الحدث: +':'Event reward: +')+reward);sound(type==='pest'?'pest':'bee');ev=null;$('event').hidden=true;render()};
['water','feed','sun'].forEach(function(k){$(k).onclick=function(){care(k)}});$('sell').onclick=sell;$('lang').onclick=function(){state.lang=state.lang==='ar'?'en':'ar';history.replaceState(null,'',location.pathname+(state.lang==='en'?'?lang=en':''));render()};$('reset').onclick=function(){if(confirm(state.lang==='ar'?'متأكد بدك تعيد اللعبة من البداية؟ رح تنمسح كل المصاري والمبيعات والأسماء والقطة وتوظيف ياسمين.':'Restart from scratch? All coins, sales, names, cat and Yasmin progress will be erased.')){state={gameEpoch:Date.now(),dayMode:'auto',weatherMode:'auto',catTreats:0,catSpy:{status:'idle',report:'',end:0},catHunt:{status:'idle',end:0},catItems:{},catEquipped:{},gardenName:'حديقة السعادة',dismissedEmpty:false,money:50,sales:0,kind:'jasmine',progress:0,quality:100,care:0,active:true,lang:state.lang,cat:freshCat(),nurseryName:'مشتل الياسمينة',catName:'مشمش',namesSet:false,stock:{fertilizer:4,catfood:3},staff:{hired:false,mood:60,request:null,dialogue:''},abu:{hired:false,paidSales:0,paused:false,lastCare:0},nana:{hired:false,paidSales:0,paused:false,lastCare:0,lastWarn:0,dialogueIndex:0,action:''},eventEarned:0,eventCycleSales:0,extraEarned:0,catHuntLast:0,catCoinTimes:[],catEmergencyBill:0,catFoodEmergencyNotice:false};catLast={};catMessage=null;catSeconds=0;catBusyUntil=0;nanaCareUntil=0;catDrinking=false;graceSample=null;clearTimeout(catCareTimer);editingNames=false;settingsOpen=false;audioPanelOpen=false;jokeAwaitingRating=false;activeArea='nursery';lastNotificationCount=0;lastTick=Date.now();last={water:0,feed:0,sun:0};clearTimeout(catAnimationTimer);clearTimeout(evTimeout);ev=null;$('event').hidden=true;delete $('catScene').dataset.action;$('catScene').classList.remove('is-napping');try{localStorage.removeItem(key)}catch(e){}msg('');render()}};

/* Mimi: petting, treats and playful inspection of John's nursery work. */
if(typeof state.catTreats!=='number')state.catTreats=0;
if(!state.catSpy||typeof state.catSpy!=='object')state.catSpy={status:'idle',report:'',end:0};
function purrCat(){
 if(state.cat.away)return;
 if(activeArea!=='cat')return;
 state.cat.mood=Math.min(100,state.cat.mood+2);
 catMessage=null;
 var ctx=audio();
 if(ctx&&audioSettings.sfx){
  sound('meow');
  var t=ctx.currentTime,osc=ctx.createOscillator(),gain=ctx.createGain(),lfo=ctx.createOscillator(),mod=ctx.createGain();
  osc.type='sine';osc.frequency.value=58;lfo.frequency.value=18;mod.gain.value=6;lfo.connect(mod);mod.connect(osc.frequency);
  gain.gain.setValueAtTime(.0001,t);gain.gain.linearRampToValueAtTime(.018*audioSettings.sfxVolume/100,t+.15);gain.gain.setValueAtTime(.018*audioSettings.sfxVolume/100,t+.65);gain.gain.linearRampToValueAtTime(.0001,t+1.05);
  osc.connect(gain);gain.connect(ctx.destination);osc.start(t);lfo.start(t);osc.stop(t+1.07);lfo.stop(t+1.07);
 }
 $('catMessage').textContent=state.lang==='ar'?'🐱 خرررر... '+state.catName+' مبسوطة بالدلع!':'🐱 Purrrr... '+state.catName+' loves being petted!';
 save();
}
$('catScene').style.cursor='pointer';
$('catScene').setAttribute('role','button');
$('catScene').setAttribute('tabindex','0');
$('catScene').addEventListener('click',purrCat);
$('catScene').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();purrCat()}});
$('catTreatBuy').onclick=function(){
 if(state.money<10)return;
 state.money-=10;state.catTreats+=3;sound('purchase');save();render();
};
$('catSpy').onclick=function(){
 if(state.cat.away||state.catSpy.status==='running'||!state.abu.hired||Date.now()<(Number(state.catSpy.cooldownUntil)||0))return;
 $('catMissions').open=false;
 state.catSpy={status:'running',report:'',end:Date.now()+8000,cooldownUntil:Date.now()+8000+120000};
 activeArea='nursery';sound('notify');save();render();
 $('nurseryArea').scrollIntoView({behavior:'smooth',block:'center'});
};
$('catTreatReward').onclick=function(){
 if(state.cat.away||state.catTreats<1||state.catSpy.status!=='done')return;
 state.catTreats--;state.cat.mood=Math.min(100,state.cat.mood+18);
 state.catSpy.status='rewarded';sound('feed');save();render();
};
function updateCatMissionTime(){
 var ar=state.lang==='ar', now=Date.now(), parts=[];
 function add(mission,label){
  if(!mission||mission.status!=='running'||mission.end<=now)return;
  var seconds=Math.ceil((mission.end-now)/1000);
  parts.push(label+' '+Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0'));
 }
 add(state.catSpy,ar?'التجسّس':'Spying');
 if(activeHuntRound()){
   const seconds=mouseChase.secondsLeft();
   parts.push((ar?'الصيد':'Hunting')+(seconds?' 0:'+String(seconds).padStart(2,'0'):''));
 }
 var timer=$('catMissionTime'),text=parts.join(' · ');
 if(timer.textContent!==text)timer.textContent=text;
}
function renderCatExtras(){
 $('catMissionsLabel').textContent=state.lang==='ar'?'مهمّات القطة':'Cat missions';
 updateCatMissionTime();
 var ar=state.lang==='ar',spy=state.catSpy;
 $('catTreatBuy').textContent=ar?'🍬 اشتري 3 حبة مكافأة لـ'+state.catName+' · 💰 10':'🍬 Buy 3 treats · 💰 10';
 $('catTreatBuy').disabled=state.money<10;
 $('catTreatCount').textContent=(ar?'🍬 الحبة مكافأة المتوفرة: ':'🍬 Treats available: ')+state.catTreats;
 if(spy.status==='running'&&Date.now()>=spy.end){
  var sleeping=state.abu.paused||(nurseryPots().every(p=>!p.active)&&Math.random()<.45);
  spy.status='done';spy.report=sleeping?'sleeping':'working';sound('notify');save();
 }
 $('catSpy').textContent=spy.status==='running'?(ar?'🐾 '+state.catName+' عم تتجسس...':'🐾 '+state.catName+' is spying...'):(ar?'🕵️ ابعت '+state.catName+' تتجسس على أبو وردة':'🕵️ Send '+state.catName+' to spy on John');
 var spyCooldown=Math.max(0,(Number(spy.cooldownUntil)||0)-Date.now());
 if(spy.status!=='running'&&spyCooldown>0){var secs=Math.ceil(spyCooldown/1000);$('catSpy').textContent=(ar?'🕵️ التجسس متاح بعد ':'🕵️ Spy available in ')+String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0');}
 $('catSpy').disabled=spy.status==='running'||spyCooldown>0||!state.abu.hired;
 $('catSpy').style.opacity=$('catSpy').disabled?'0.55':'';
 $('catSpy').style.filter=$('catSpy').disabled?'grayscale(1)':'';
 $('catSpyReport').textContent=spy.status==='running'?(ar?state.catName+' رايحة تتفقد المشتل، استناها شوي...':''+state.catName+' is checking the nursery...'):spy.report?(spy.report==='sleeping'?(ar?'🐱 '+state.catName+': كمشتو نايم! 😴':'🐱 '+state.catName+': Caught John napping! 😴'):(ar?'🐱 '+state.catName+': أبو وردة عم يكدح بالمشتل! 💪':'🐱 '+state.catName+': John is working hard! 💪')):(ar?'دلّع '+state.catName+' بلمسة، وابعتها بمهمة تجسس!':'Tap '+state.catName+' to pet her, or send her on a spy mission!');
 $('catTreatReward').hidden=spy.status!=='done';
 $('catTreatReward').textContent=ar?'🍬 كافئ '+state.catName+' بحبة مكافأة':'🍬 Reward '+state.catName+' with a treat';
 $('catTreatReward').disabled=state.catTreats<1;
}

/* Visible spy mission: Mimi sneaks into the nursery and watches John. */
var spyStyle=document.createElement('style');
spyStyle.textContent='#spyMimi{position:absolute;bottom:6%;right:-24%;width:100px;height:75px;z-index:15;pointer-events:none;transition:right 2s ease-in-out;filter:drop-shadow(0 5px 4px #0004)}#spyMimi.spy-in{right:5%}#spyMimi.spy-out{right:-24%}#spyMimi svg{width:100%;height:100%}#spyCaption{position:absolute;left:8%;right:8%;top:2%;bottom:auto;z-index:17;background:#fff9e6e8;color:#27442d;border-radius:15px;padding:8px;text-align:center;font-weight:bold;pointer-events:none}';
document.head.appendChild(spyStyle);
var spyMimi=document.createElement('div');spyMimi.id='spyMimi';spyMimi.hidden=true;
spyMimi.innerHTML='<svg viewBox="0 0 120 95" aria-hidden="true"><path d="M19 47L16 13L43 29Q60 20 78 28L104 12L102 48Q109 71 84 83Q57 94 32 80Q12 69 19 47Z" fill="#edab61" stroke="#a76234" stroke-width="3"/><path d="M24 34L22 23L40 34M82 34L99 22L96 37" fill="#f3a6a0"/><ellipse cx="45" cy="54" rx="5" ry="7" fill="#322b25"/><ellipse cx="78" cy="54" rx="5" ry="7" fill="#322b25"/><path d="M55 66L66 66L60 72Z" fill="#bc7073"/><path d="M60 72Q51 80 45 73M60 72Q69 80 75 73" stroke="#8a5236" stroke-width="2.5" fill="none"/><path d="M35 69L12 66M35 75L13 79M85 69L108 66M85 75L109 79" stroke="#8a5236" stroke-width="2"/></svg>';
$('scene').appendChild(spyMimi);
var spyCover=document.createElement('div');spyCover.id='spyCover';spyCover.hidden=true;spyCover.setAttribute('aria-hidden','true');spyCover.innerHTML='<svg viewBox="0 0 130 90" aria-hidden="true"><rect x="15" y="38" width="104" height="45" rx="8" fill="#a7764b" stroke="#795335" stroke-width="3"/><path d="M15 51H119M37 38V83M96 38V83" stroke="#d2a477" stroke-width="4"/><path d="M17 37Q22 12 42 25Q54 0 70 23Q94 5 111 32" fill="#428d57" stroke="#27653d" stroke-width="3"/><path d="M34 26Q23 10 17 16M69 22Q76 8 88 12M103 27Q114 15 123 22" fill="none" stroke="#428d57" stroke-width="9" stroke-linecap="round"/></svg>';$('scene').appendChild(spyCover);
var spyCaption=document.createElement('div');spyCaption.id='spyCaption';spyCaption.hidden=true;$('scene').appendChild(spyCaption);
var spyVisualStarted=0;
function updateSpyScene(){
 var spy=state.catSpy, running=spy.status==='running',ar=state.lang==='ar';
 if(!running){spyMimi.hidden=true;spyCaption.hidden=true;spyCover.hidden=true;spyVisualStarted=0;return}
 spyMimi.hidden=false;spyCaption.hidden=false;spyCover.hidden=false;
 var remain=spy.end-Date.now();
 var spyButton=$('catSpy');
 if(spyButton)spyButton.textContent=(ar?'🐾 '+state.catName+' عم تتجسس... ':'🐾 '+state.catName+' is spying... ')+Math.max(0,Math.ceil(remain/1000))+' '+(ar?'ثانية':'s');
 spyCaption.textContent=remain>4000?(ar?'🐾 '+state.catName+' عم تتسلّل لتراقب أبو وردة...':'🐾 '+state.catName+' is sneaking up on John...'):(ar?'🤫 ششش... '+state.catName+' عم تتلصّص!':'🤫 Shhh... '+state.catName+' is spying!');
 if(!spyVisualStarted){spyVisualStarted=Date.now();spyMimi.className='';requestAnimationFrame(function(){spyMimi.className='spy-in spy-peek'})}
 if(remain<2200)spyMimi.className='spy-out';
}
setInterval(function(){
 if(document.hidden)return;
 var spy=state.catSpy;
 if(spy.status!=='running'&&activeArea!=='cat')return;
 updateSpyScene();
 if(spy.status!=='running'&&activeArea==='cat'&&Date.now()<(Number(spy.cooldownUntil)||0)){
  var remaining=Math.ceil((spy.cooldownUntil-Date.now())/1000),button=$('catSpy');
  if(button){button.textContent=(state.lang==='ar'?'🕵️ التجسس متاح بعد ':'🕵️ Spy available in ')+String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');button.disabled=true;button.style.opacity='0.55';button.style.filter='grayscale(1)';}
 }else if(spy.status!=='running'&&activeArea==='cat'&&$('catSpy').disabled&&state.abu.hired){renderCatExtras()}
 if(spy.status==='running'&&Date.now()>=spy.end){
  spy.status='done';spy.report=state.abu.paused?'sleeping':'working';sound('notify');save();
  activeArea='cat';render();$('catArea').scrollIntoView({behavior:'smooth',block:'start'});
 }
},250);


/* Mimi boutique and occasional naps */
if(!state.catItems)state.catItems={};
var catBoutiqueCatalog=[{id:'bed',ar:'🛏️ تخت {cat}',en:'🛏️ {cat} bed',cost:25},{id:'glasses',ar:'🕶️ نظارات شمسية',en:'🕶️ Sunglasses',cost:15},{id:'hat',ar:'👒 طاقية',en:'👒 Hat',cost:15}];
var shopOpen=false;var shopButton=document.createElement('button');shopButton.id='catBoutiqueTitle';shopButton.type='button';shopButton.setAttribute('aria-expanded','false');$('catShopMount').appendChild(shopButton);
var sheetOverlay=document.createElement('div');sheetOverlay.id='catSheetOverlay';sheetOverlay.hidden=true;sheetOverlay.innerHTML='<div id="catSheet" role="dialog" aria-modal="true" aria-labelledby="catSheetHeading"><div class="sheet-grip"></div><div class="sheet-head"><b id="catSheetHeading"></b><button type="button" id="catSheetClose" aria-label="Close">✕</button></div><p id="catSheetBalance"></p></div>';document.body.appendChild(sheetOverlay);$('catSheet').appendChild($('catBoutique'));function setShopOpen(open){shopOpen=open;sheetOverlay.hidden=!open;$('catBoutiqueItems').hidden=!open;$('catBoutiqueItems').style.display=open?'grid':'none';$('catBoutiqueTitle').setAttribute('aria-expanded',String(open));document.body.classList.toggle('cat-shop-open',open);if(open){$('catSheetClose').focus();renderBoutique()}}$('catBoutiqueTitle').onclick=function(){setShopOpen(!shopOpen)};$('catSheetClose').onclick=function(){setShopOpen(false);$('catBoutiqueTitle').focus()};sheetOverlay.addEventListener('click',function(e){if(e.target===sheetOverlay)setShopOpen(false)});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&shopOpen)setShopOpen(false)});
var boutiqueStyle=document.createElement('style');boutiqueStyle.textContent='.cat-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.cat-heading{margin-bottom:16px!important}.cat-heading h2{margin:0!important}.cat-heading button{width:auto!important;flex-shrink:0;padding:10px 13px;font-size:clamp(13px,3vw,18px)}#catBoutique{padding:0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important}#catBoutiqueItems:not([hidden]){margin:12px 0;padding:12px;border:1px solid #8295a4;border-radius:18px}#catScene{position:relative}#catAccessories{position:absolute;inset:0;pointer-events:none;z-index:4}#catAccessories svg{width:100%;height:100%}#catBed{position:absolute;inset:0;pointer-events:none;z-index:2;opacity:.95}#catScene:not(.is-napping) #catBed{transform:none;opacity:1}#catScene:not(.is-napping) .mimi-sleeping-cat{display:none}#catScene.is-napping #catBed{z-index:3}#catBed svg{width:100%;height:100%}#catSleep{position:absolute;left:58%;top:16%;font-size:28px;pointer-events:none;z-index:5;animation:cat-snooze 2s ease-in-out infinite alternate}@keyframes cat-snooze{to{transform:translateY(-12px);opacity:.3}}#catScene.is-napping>svg{visibility:hidden}#catScene.is-napping #catBed{z-index:3}#catScene.is-napping #catAccessories{display:none}#catBoutiqueItems[hidden]{display:none!important} #catBed .mimi-sleeping-cat{transform-box:fill-box;transform-origin:center 65%;animation:mimi-breathe 3.8s ease-in-out infinite alternate}@keyframes mimi-breathe{from{transform:scale(1)}to{transform:scale(1.03)}}@media(prefers-reduced-motion:reduce){#catBed .mimi-sleeping-cat,#catSleep{animation:none!important}}';document.head.appendChild(boutiqueStyle);
var catAccessories=document.createElement('div');catAccessories.id='catAccessories';$('catScene').appendChild(catAccessories);
var catBed=document.createElement('div');catBed.id='catBed';$('catScene').appendChild(catBed);
var catSleep=document.createElement('div');catSleep.id='catSleep';catSleep.textContent='💤';$('catScene').appendChild(catSleep);
function renderBoutique(){
 var ar=state.lang==='ar';$('catSheetHeading').textContent=ar?'متجر '+state.catName:state.catName+' shop';$('catSheetBalance').textContent=(ar?'رصيدك: ':'Balance: ')+state.money+' 💰';$('catBoutiqueTitle').textContent=(ar?'🛍️ متجر '+state.catName:'🛍️ '+state.catName+' shop')+(shopOpen?' ▴':' ▾');
 var root=$('catBoutiqueItems');root.replaceChildren();
 catBoutiqueCatalog.concat([{id:'treat',ar:'🍬 3 حبات مكافأة',en:'🍬 3 reward treats',cost:10}]).forEach(function(item){
  var owned=item.id!=='treat'&&!!state.catItems[item.id],b=document.createElement('button');
  b.textContent=(ar?item.ar:item.en).replace('{cat}',state.catName)+(owned?(item.id==='bed'?(ar?' ✓ موجود':' ✓ Owned'):((!state.catEquipped||state.catEquipped[item.id]!==false)?(ar?' ✓ لابستها — اضغط لتشيلها':' ✓ Wearing — tap to remove'):(ar?' — اضغط لتلبسها':' — Tap to wear'))):' · 💰 '+item.cost);
  b.disabled=!owned&&state.money<item.cost;
  b.onclick=function(){if(owned){if(item.id!=='bed'){state.catEquipped=state.catEquipped||{};state.catEquipped[item.id]=state.catEquipped[item.id]===false;save();render()}return}if(state.money<item.cost)return;state.money-=item.cost;if(item.id==='treat')state.catTreats+=3;else state.catItems[item.id]=true;sound('purchase');save();render()};
  root.appendChild(b);
 });

 var napping=!!state.catItems.bed&&Math.floor(Date.now()/45000)%5===0;
 var scene=$('catScene');
 var ownsBed=String(!!state.catItems.bed);
 if(scene.dataset.bed!==ownsBed)scene.dataset.bed=ownsBed;
 var equipped=state.catEquipped||{};
 var outfit=['hat','glasses'].filter(function(id){return state.catItems[id]&&equipped[id]!==false}).join(' ');
 if(scene.dataset.outfit!==outfit)scene.dataset.outfit=outfit;
 var worn='';
 if(state.catItems.hat&&(!state.catEquipped||state.catEquipped.hat!==false))worn+='<g><path d="M88 18Q89 -10 114 -12Q139 -10 140 18Z" fill="#dfc49a" stroke="#9d7452" stroke-width="2"/><path d="M80 18Q113 27 148 18" stroke="#d0ae7c" stroke-width="8" fill="none"/><path d="M108 -1q-16 -16 -15 -3q3 10 15 3m0 0q16 -16 15 -3q-3 10 -15 3" fill="#4b9b50"/><circle cx="108" cy="-2" r="6" fill="#e84e65"/></g>';
 if(state.catItems.glasses&&(!state.catEquipped||state.catEquipped.glasses!==false))worn+='<g stroke="#46372d" stroke-width="2"><ellipse cx="104" cy="45" rx="12" ry="8" fill="#303b4a"/><ellipse cx="124" cy="45" rx="12" ry="8" fill="#303b4a"/><path d="M114 43h1M92 43l-8 -4M136 43l8 -4" fill="none"/></g>';
 $('catWornAccessories').innerHTML=worn;catAccessories.innerHTML='';
 catBed.innerHTML=state.catItems.bed?`<svg viewBox="0 0 360 180" preserveAspectRatio="xMidYMid meet" aria-label="Mimi sleeping curled up in her cozy bed">
<ellipse cx="125" cy="151" rx="87" ry="13" fill="#765238" opacity=".15"/>
<path d="M44 118 C44 73 75 61 125 61 C180 61 209 78 209 118 L202 139 Q125 160 49 139Z" fill="#9d704a" stroke="#835b3d" stroke-width="3"/>
<ellipse cx="126" cy="120" rx="73" ry="37" fill="#b98a5e"/>
<ellipse cx="126" cy="117" rx="64" ry="30" fill="#f7ead2"/>
<g class="mimi-sleeping-cat" transform="translate(0 0)">
<ellipse cx="139" cy="119" rx="48" ry="29" fill="#eba35d" stroke="#d9863f" stroke-width="2.5"/>
<ellipse cx="136" cy="132" rx="35" ry="13" fill="#f5c78d"/>
<path d="M124 96 Q118 106 123 113 M142 92 Q136 103 142 111 M159 96 Q155 105 161 111" fill="none" stroke="#d9863f" stroke-width="4" stroke-linecap="round"/>
<path d="M177 114 Q191 130 171 142 Q153 151 132 140" fill="none" stroke="#d9863f" stroke-width="12" stroke-linecap="round"/>
<path d="M176 126l-7 4 M167 139l-8 2" stroke="#f3bd7e" stroke-width="3.5" stroke-linecap="round"/>
<ellipse cx="106" cy="134" rx="17" ry="9" fill="#eba35d"/>
<path d="M93 127Q84 117 88 102L91 91Q95 86 101 94Q111 89 121 95Q129 86 133 94L136 106Q138 127 120 135Q104 141 93 127Z" fill="#eba35d" stroke="#d9863f" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M92 105Q90 98 94 96Q98 94 103 101Z M120 101Q127 94 131 97Q134 99 133 106Z" fill="#f6b9a8"/>
<path d="M98 116Q104 122 110 116 M116 116Q122 122 128 116" fill="none" stroke="#855334" stroke-width="2.3" stroke-linecap="round"/>
<path d="M110 123Q113 120 116 123L113 126Z" fill="#e88c91"/>
<path d="M113 126q-3 4-6 1 M113 126q3 4 6 1" fill="none" stroke="#855334" stroke-width="1.5" stroke-linecap="round"/>
<path d="M98 108l-3-4 M111 105v-5 M123 108l3-4" stroke="#d9863f" stroke-width="2.4" stroke-linecap="round"/>
</g>
<path d="M46 125Q47 148 76 151Q125 163 177 151Q206 145 207 125Q198 137 183 140Q126 153 69 139Q53 135 46 125Z" fill="#c99c70" stroke="#a57750" stroke-width="3" stroke-linejoin="round"/>
<path d="M59 140Q124 161 193 140" fill="none" stroke="#e0b78d" stroke-width="4" stroke-linecap="round"/>
</svg>`:'';
 catBed.hidden=!state.catItems.bed;catSleep.hidden=!napping;$('catScene').classList.toggle('is-napping',napping);
}
/* Interactive mouse hunt. A running round is saved with the rest of the game. */
if(!state.catHunt||typeof state.catHunt!=='object')state.catHunt={status:'idle'};
if(state.catHunt.status==='running'&&!state.catHunt.round)state.catHunt.round={};
function activeHuntRound(){
  return state.catHunt.status==='running'&&!state.cat.away?state.catHunt.round:null;
}
const mouseChase=window.createNurseryMouseHunt({
  round:activeHuntRound,language:()=>state.lang,name:()=>state.catName,
  visible:()=>activeArea==='cat'&&!shopOpen&&$('gameRulesDialog').hidden,
  outfit:()=>($('catScene').dataset.outfit||'').split(' '),
  save:save,finish:finishMouseHunt
});
function finishMouseHunt(won){
  const hunt=state.catHunt;
  if(!activeHuntRound())return;
  hunt.status=won?'done':'escaped';
  hunt.cooldownUntil=Date.now()+120000;
  delete hunt.round;
  if(won&&hunt.coinEligible&&Math.random()<ECONOMY_CONFIG.catChance){
    const now=Date.now();
    state.catCoinTimes=state.catCoinTimes.filter(time=>now-time<3600000);
    const room=Math.max(0,ECONOMY_CONFIG.catHourlyCap-state.catCoinTimes.length);
    hunt.coins=Math.min(room,ECONOMY_CONFIG.catRewards[Math.floor(Math.random()*ECONOMY_CONFIG.catRewards.length)]);
    state.money+=hunt.coins;state.extraEarned+=hunt.coins;
    for(let i=0;i<hunt.coins;i++)state.catCoinTimes.push(now);
  }
  sound(won?'cheer':'notify');save();render();
}
$('catMouseHunt').onclick=function(){
  if(state.cat.away||activeHuntRound()||Date.now()<Number(state.catHunt.cooldownUntil||0))return;
  const now=Date.now();
  const eligible=state.cat.fullness>ECONOMY_CONFIG.catMinFullness&&state.cat.mood>ECONOMY_CONFIG.catMinMood;
  state.cat.fullness=Math.max(0,state.cat.fullness-ECONOMY_CONFIG.catFullnessCost);
  state.catHuntLast=now;state.catHunt={status:'running',round:{},coinEligible:eligible};
  $('catMissions').open=false;activeArea='cat';save();render();
  $('mouseChase').scrollIntoView({block:'center'});
};
$('closeMouseResult').onclick=function(){state.catHunt.dismissed=true;save();render()};
$('catMouseReward').onclick=function(){
 if(state.cat.away||state.catHunt.status!=='done'||state.catTreats<1)return;
 state.catTreats--;state.cat.mood=Math.min(100,state.cat.mood+20);
 state.catHunt.status='rewarded';sound('feed');save();render();
};
var previousRenderCatExtras=renderCatExtras;
renderCatExtras=function(){
 previousRenderCatExtras();renderBoutique();
 var ar=state.lang==='ar',hunt=state.catHunt;
 $('catMouseHunt').textContent=ar?'🐭 ابعت '+state.catName+' جولة بالمشتل لتصيد فأرة':'🐭 Send '+state.catName+' on a mouse patrol';
 var mouseCooldown=Math.max(0,(Number(hunt.cooldownUntil)||0)-Date.now());
 if(mouseCooldown>0&&hunt.status!=='running'){var mouseSeconds=Math.ceil(mouseCooldown/1000);$('catMouseHunt').textContent=(ar?'🐭 صيد الفأرة متاح بعد ':'🐭 Mouse patrol in ')+String(Math.floor(mouseSeconds/60)).padStart(2,'0')+':'+String(mouseSeconds%60).padStart(2,'0');}
 $('catMouseHunt').disabled=hunt.status==='running'||mouseCooldown>0;
 $('catMouseHunt').style.opacity=$('catMouseHunt').disabled?'0.55':'';
 $('catMouseHunt').style.filter=$('catMouseHunt').disabled?'grayscale(1)':'';
 const report=hunt.status==='escaped'?(ar?'الفارة هربت هالمرة!':'The mouse escaped this time!'):hunt.status==='running'?'':(hunt.status==='done'||hunt.status==='rewarded')?(ar?'🐱 '+state.catName+' كمشت الفأرة وطردتها من المشتل!':'🐱 '+state.catName+' caught the mouse and chased it away!'):'';
 const reportText=report+(hunt.coins?(ar?' · عملات: ':' · Coins: ')+hunt.coins:'');
 $('mouseChaseResult').hidden=!reportText||!!hunt.dismissed||state.cat.away;
 $('closeMouseResult').setAttribute('aria-label',ar?'إغلاق نتيجة الصيد':'Dismiss hunt result');
 if($('catMouseReport').textContent!==reportText)$('catMouseReport').textContent=reportText;
 mouseChase.sync(activeHuntRound());
 $('catMouseReward').hidden=hunt.status!=='done';
 $('catMouseReward').textContent=ar?'🍬 كافئ '+state.catName+' بحبة مكافأة على شطارتها':'🍬 Reward '+state.catName+' with a treat';
 $('catMouseReward').disabled=state.catTreats<1;
};
var previousRenderCat=renderCat;
renderCat=function(){previousRenderCat();renderCatExtras();var n=state.nana;renderNanaNews();if(n.hired&&!n.paused){$('nanaDialogue').textContent=(state.lang==='ar'?nanaLinesAr:nanaLinesEn)[n.dialogueIndex%10].replace('{cat}',state.catName)}};

var lastNotificationCount=notificationCount();var lastTick=Date.now();setInterval(function(){var now=Date.now(),delta=Math.min(2,(now-lastTick)/1000);lastTick=now;if(document.hidden)return;updateClock();updateSky();if(state.weatherMode==='auto')updateWeather();tickCat(delta);tickStaff();tickAbu();tickNana();tickCatEmergency();var n=notificationCount();if(n>lastNotificationCount&&state.staff.hired)sound('notify');lastNotificationCount=n;growPlants(delta);render()},1000);setInterval(function(){if(Date.now()>=eventNext){scheduleEvent();if(!document.hidden&&activeArea==='nursery')eventSpawn()}},1000);render();msg(state.lang==='ar'?'بلّش اعتني بالياسمينة!':'Start caring for your jasmine!');
if(audioSettings.music)tryPlayMusic();
})();
