
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
function displayName(field){
 const original=state[field];
 const defaults={gardenName:['حديقة السعادة','Happy Garden'],catName:['مشمش','Mishmish'],nurseryName:['مشتل الياسمينة','Jasmine Nursery']};
 const names=defaults[field];
 return state.lang==='en' && original===names[0]?names[1]:original;
}
function freshCat(){return {energy:100,sleeping:false,sleepUpdated:0,walkNext:0,away:false,graceMs:60000,fullness:60,mood:55,hydration:75,hydrationSeconds:0,moodSeconds:0,toy:false}}
var key='yasmine-nursery-preview-v1';var state={gameEpoch:Date.now(),dayMode:'auto',weatherMode:'auto',gardenName:'حديقة السعادة',dismissedEmpty:false,money:50,sales:0,kind:'jasmine',progress:0,quality:100,care:0,active:true,lang:'ar',cat:freshCat(),nurseryName:'مشتل الياسمينة',catName:'مشمش',namesSet:false,stock:{fertilizer:4,catfood:3},staff:{hired:false,mood:60,request:null,dialogue:''},emergencyFertilizerUsed:false};
function safeNumber(v,fallback,min,max){return typeof v==='number'&&Number.isFinite(v)?Math.min(max,Math.max(min,v)):fallback}
function normalizeGameState(s){
  if(!s||typeof s!=='object'||Array.isArray(s))return s;
  s.money=safeNumber(s.money,50,0,1000000000);s.sales=safeNumber(s.sales,0,0,100000000);
  s.progress=safeNumber(s.progress,0,0,100);s.quality=safeNumber(s.quality,100,0,100);
  s.care=safeNumber(s.care,0,0,100000000);
  if(!s.cat||typeof s.cat!=='object'||Array.isArray(s.cat))s.cat=freshCat();
  s.cat.energy=safeNumber(s.cat.energy,100,0,100);
  s.cat.sleeping=s.cat.sleeping===true;
  s.cat.sleepUpdated=safeNumber(s.cat.sleepUpdated,Date.now(),0,Date.now());
  s.cat.walkNext=safeNumber(s.cat.walkNext,0,0,Date.now()+120000);
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
  $('workersTab').setAttribute('aria-expanded',String(activeArea==='workers'));
  $('workersTab').firstChild.textContent=(activeArea==='workers'?'▾ ':state.lang==='ar'?'◂ ':'▸ ')+(state.lang==='ar'?'موظفين ':'Staff ');
  const openings=Number(!state.abu.hired&&state.sales>=ECONOMY_CONFIG.abuSales)+Number(!state.nana.hired&&state.sales>=12);
  $('workersBadge').hidden=openings===0;
  $('workersBadge').textContent=openings;
  $('staffTab').setAttribute('aria-pressed',String(activeArea==='staff'));
  $('staffTab').firstChild.textContent=state.lang==='ar'?'ياسمين ':'Yasmin ';
  $('nurseryTab').setAttribute('aria-pressed',String(nursery));
  $('catTab').setAttribute('aria-pressed',String(activeArea==='cat'));
  $('nurseryTab').textContent=(displayName("nurseryName")||words.nursery);var nurseryAction=ready?'sell':nurseryPots().some(p=>!p.active)?'plant':null;$('nurseryBadge').hidden=!nurseryAction;$('abuNotice').hidden=!nurseryAction||activeArea!=='nursery';$('abuNotice').textContent=nurseryAction==='sell'?(state.lang==='ar'?'👨‍🌾 أبو وردة: النبتة جاهزة للبيع!':'👨‍🌾 John: Plant ready to sell!'):(state.lang==='ar'?'👨‍🌾 أبو وردة: في أصيص فاضي، ازرع بذرة جديدة!':'👨‍🌾 John: Plant a new seed!');
  $('catTab').textContent=(displayName("catName")||words.cat);
  $('catTitle').textContent=state.lang==='ar'?'قطة المشتل: '+displayName("catName"):'Nursery cat: '+displayName("catName");
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
  renderCatEnergy();
}
function visitCat(action){
  if(state.cat.away||state.cat.sleeping)return;
  var cat=state.cat;
  if(action==='Play'&&cat.energy<8)return;
  if(Date.now()<catBusyUntil||Date.now()<(catLast[action]||0))return;
  catLast[action]=Date.now()+5000;
  if(action==='Feed'){
    if(state.stock.catfood<=0)return;state.stock.catfood--;collectionData().feeds++;
    cat.fullness=Math.min(100,cat.fullness+25);
    catMessage='fed';
  }else if(action==='Play'){
    cat.energy=Math.max(0,cat.energy-8);
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
  financeMove(-20,'catfood');sound('purchase');
  state.cat.toy=true;
  catMessage='bought';
  render();
};
function giveCatWater(source){
  if(state.cat.away||state.cat.sleeping||Date.now()<catBusyUntil||catDrinking||state.cat.hydration>=100)return false;
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
  tickCatEnergy(delta);
  if(state.cat.away||state.cat.sleeping)return;
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

function win(){if(finished)return;finished=true;cleanup();financeMove(5,'missions');save();render();board.replaceChildren();board.hidden=true;info.textContent='🎉 برافو! خلّصت المهمة وربحت 5 عملات!';progress.textContent='💰 +5 عملات';start.textContent='🎮 مهمة جديدة'}
start.addEventListener('click',()=>{if(!state.yasminAidOpen)return;cleanup();cleanup=()=>{};finished=false;let next=Math.floor(Math.random()*games.length);if(next===previous)next=(next+1)%games.length;previous=next;board.style.cssText='';board.hidden=false;board.replaceChildren();progress.textContent='0';start.textContent='🎮 غيّر المهمة';info.textContent=games[next].name+' — '+games[next].hint;games[next].setup()});
})();

function financeData(){return state.finance||(state.finance={started:Date.now(),opening:state.money,hired:false,count:0,due:false,rows:[]})}
function financeMove(amount,category){var f=financeData();state.money+=amount;if(amount)f.rows.push({at:Date.now(),amount:amount,category:category});}
function financeWage(){var f=financeData();if(!f.hired||f.due)return;if(++f.count>=10){f.count=0;if(state.money>=20)financeMove(-20,'accountant');else f.due=true}}
var financePeriod='all',financeJoke=0;
function financeCategory(row){
 if(row.category==='compostUpgrade'){
   if(row.amount===-200)return 'compostUpgrade2';
   if(row.amount===-350)return 'compostUpgrade3';
 }
 return row.category;
}
function renderFinance(){
 var f=financeData(),en=state.lang==='en',panel=document.getElementById('financePanel');
 if(!panel){panel=document.createElement('details');panel.id='financePanel';panel.className='panel';panel.style.cssText='background:#f4ead8;color:#382c20;padding:14px;border-radius:16px';panel.innerHTML='<summary style="cursor:pointer;font-weight:bold"></summary><p id="financeIntro"></p><button type="button" id="financeHire"></button><div id="financeBook" hidden><div id="financePeriods" style="display:flex;flex-wrap:wrap;gap:6px"></div><p id="financeTotals"></p><details><summary id="compostLedgerTitle"></summary><p id="compostLedgerStats"></p></details><div id="financeCategories"></div><details><summary id="financeHistoryTitle"></summary><div id="financeHistory" style="max-height:260px;overflow:auto"></div></details><p id="financeNote"></p><button type="button" id="financeTalk"></button><p id="financeAdvice"></p></div>';document.getElementById('workersArea').appendChild(panel);
 document.getElementById('financeHire').onclick=function(){var f=financeData();if(f.due&&state.money>=20){financeMove(-20,'accountant');f.due=false}else if(!f.hired&&window.YasmineGardenCore.levelFor(state.sales)>=10&&state.money>=400){financeMove(-400,'hire');f.hired=true}else return;save();render()};
 document.getElementById('financeTalk').onclick=function(){financeJoke++;renderFinance()};
 ['today','week','all'].forEach(function(k){var b=document.createElement('button');b.type='button';b.dataset.period=k;b.onclick=function(){financePeriod=k;renderFinance()};document.getElementById('financePeriods').appendChild(b)});
 }
 var put=function(id,t){var el=document.getElementById(id);if(el.textContent!==t)el.textContent=t};
 panel.style.setProperty('color','#382c20','important');panel.querySelectorAll('p,summary,div').forEach(function(el){el.style.setProperty('color','#382c20','important')});
 panel.firstElementChild.textContent=en?'📒 Accountant':'📒 أبو حسبة · محاسب المشتل';
 put('financeIntro',en?'Level 10 · Hire: 400 coins · Wage: 20 per 10 sales':'المستوى 10 · التوظيف 400 عملة · الراتب 20 كل 10 مبيعات');
 var hire=document.getElementById('financeHire');hire.hidden=f.hired&&!f.due;hire.disabled=f.due?state.money<20:window.YasmineGardenCore.levelFor(state.sales)<10||state.money<400;hire.textContent=f.due?(en?'Pay outstanding wage · 20':'ادفع الراتب المستحق · 20'):(en?'Hire accountant':'وظّف أبو حسبة');
 document.getElementById('financeBook').hidden=!f.hired||f.due;
 if(!f.hired||f.due||!panel.open)return;
 var labels={compostBuy:['شراء محطة السماد','Compost station purchase'],compostUpgrade:['تطوير محطة السماد','Compost station upgrade'],compostUpgrade2:['تطوير محطة السماد للمستوى 2','Compost station upgrade to tier 2'],compostUpgrade3:['تطوير محطة السماد للمستوى 3','Compost station upgrade to tier 3'],sales:['المبيعات','Sales'],salary:['الرواتب','Wages'],accountant:['راتب المحاسب','Accountant wage'],hire:['التوظيف','Hiring'],upgrade:['التطوير','Upgrades'],seeds:['البذور','Seeds'],fertilizer:['شراء سماد تجاري','Commercial fertilizer purchase'],catfood:['طعام القطة','Cat food'],bonus:['البونص','Bonuses'],invoice:['الفواتير','Invoices'],catshop:['متجر القطة','Cat shop'],awards:['الميداليات','Medals'],missions:['المهمات','Missions'],events:['الأحداث','Events'],catreward:['مكافآت القطة','Cat rewards']};
 var start=new Date();start.setHours(0,0,0,0);if(financePeriod==='week')start.setDate(start.getDate()-6);var rows=f.rows.filter(function(x){return financePeriod==='all'||x.at>=+start}),income=0,expense=0,groups={};rows.forEach(function(x){if(x.amount>0)income+=x.amount;else expense-=x.amount;var category=financeCategory(x);groups[category]=(groups[category]||0)+x.amount});
 document.querySelectorAll('#financePeriods button').forEach(function(b){b.textContent=({today:en?'Today':'اليوم',week:en?'7 days':'7 أيام',all:en?'All':'من البداية'})[b.dataset.period];b.setAttribute('aria-pressed',String(b.dataset.period===financePeriod))});
 put('financeTotals',(en?'Income: ':'الإيرادات: ')+income+' 🪙 | '+(en?'Expenses: ':'المصاريف: ')+expense+' 🪙 | '+(en?'Net: ':'الصافي: ')+(income-expense)+' 🪙');
 var list=function(id,items){var el=document.getElementById(id),str=items.join('\n');if(el.textContent!==str){el.textContent=str;el.style.whiteSpace='pre-line';el.style.lineHeight='1.8'}};
 var label=function(k){return (labels[k]||[k,k])[en?1:0]};
 list('financeCategories',Object.entries(groups).map(function(x){return label(x[0])+': '+(x[1]>0?'+':'')+x[1]+' 🪙'}));
 put('financeHistoryTitle',en?'Transaction ledger':'دفتر الحركات المالية');
 list('financeHistory',rows.slice(-100).reverse().map(function(x){return new Date(x.at).toLocaleString(en?'en-CA':'ar')+' · '+label(financeCategory(x))+' · '+(x.amount>0?'+':'')+x.amount+' 🪙'}));
 put('financeNote',(en?'Recorded since ':'التسجيل من تاريخ ')+new Date(f.started).toLocaleDateString()+(en?' · Opening balance: ':' · الرصيد الافتتاحي: ')+f.opening+(en?' · Latest 100 transactions shown.':' · آخر 100 حركة معروضة.'));
 put('financeTalk',en?'Ask the accountant':'اسأل أبو حسبة');
 var jokes=en?['My salary is an investment!','The cat has expensive taste!','Keep an eye on expenses.']:['راتبي مو مصروف يا معلم، راتبي استثمار!','مشمش شكلو فاتح مطعم لحالو!','راقب المصاريف يا معلم، المصاري ما إلها جناحات!'];if(state.compost&&state.compost.tier)jokes.push(en?'Those dry leaves finally earned their keep!':'أول مرة بشوف ورق يابس عم يوفّر علينا مصاري!',en?'If the bin keeps this up, I might ask for a bonus.':'إذا الصندوق ضلّ هيك، شكلي رح طالب ببونص.');
 put('financeAdvice',jokes[financeJoke%jokes.length]);
}

function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch(e){}}
var requests=[{type:'fertilizer',cost:20},{type:'catfood',cost:15},{type:'bonus',cost:30}];
function stockRequests(){var st=state.staff;if(!st.rejectedStock||typeof st.rejectedStock!=='object')st.rejectedStock={};return ['fertilizer','catfood'].filter(function(type){if(type==='catfood'&&state.cat.away)return false;var quantity=state.stock[type];if(quantity>=5){delete st.rejectedStock[type];return false}return Date.now()>=(st.rejectedStock[type]||0)})}
function staffWords(lang=state.lang){return lang==='ar'?{nursery:'اسم المشتل',cat:'اسم القطة',hire:'وظّف ياسمين · 💰 50',hired:'موظفة دائمة',joke:'اسمع دعابة 😂',yes:'ادفع',no:'ارفض',mood:'مزاج ياسمين',hello:'أهلاً يا مدير! أنا جاهزة أراقب المشتل والقطة.',needWater:'يا مدير، النبتة عطشانة! لا تكون مفكرها صبّارة؟',needCat:'يا مدير، '+displayName("catName")+' جاعت! بدنا نطعميها.',request:{fertilizer:'يا مدير، بدي 20 عملة أجيب سماد للنبتة!',catfood:'عطيني 15 عملة أجيب أكل لـ'+displayName("catName")+'!',bonus:'أنا عم اشتغل من قلبي... ما في بونص 30 عملة؟'},jokes:['القطة شكلها ناوية تستلم الإدارة!','يا مدير، النباتات بدها مي مو خطابات تحفيزية!','أنا موظفة مش ساحرة، بس بونص صغير بيعمل عجايب!','قلت للقطة اشتغلي معي، قالت: أنا مديرة النوم!','السماد غلي يا مدير... حتى الوردة صارت بدها قرض!','زرعت نعنع، طلعلي طلب إجازة من الياسمينة!','القطة بتعرف تعدّ المصاري... بس كل العدّ بيخلص عند التونة!','طلبت من النبتة تكبر بسرعة، قالت: ادفعلي أوفر تايم!','أنا وياسمين النبتة نفس الاسم، بس هي بتاخد مي وأنا بدي بونص!','ليش الجزرة احمرّت؟ شافت فاتورة السماد!'],thanks:'يسلمو يا مدير! هيك الشغل الحلو.',refused:'طيب يا مدير... بس رح أتذمّر شوي! 😂',poor:'الخزنة فاضية يا مدير!',liked:'يا سلام! ضحكتك أحلى من البونص! 😂',disliked:'آخ يا مدير! خلص رح جرّب نكتة أحسن المرة الجاية.',postponed:'تمام يا مدير، منأجل الشراء شوي.'}:{nursery:'Nursery name',cat:'Cat name',hire:'Hire Yasmin · 💰 50',hired:'Permanent employee',joke:'Tell a joke 😂',yes:'Pay',no:'Decline',mood:'Yasmin’s mood',hello:'Hello boss! I am watching the plants and your cat.',needWater:'Boss, the plant needs water!',needCat:'Boss, '+displayName("catName")+' is hungry!',request:{fertilizer:'Boss, I need 20 coins for fertilizer!',catfood:'Give me 15 coins to buy food for '+displayName("catName")+'!',bonus:'I work so hard... could I get a 30-coin bonus?'},jokes:['The cat wants to become the manager!','Plants need water, not motivational speeches!','I am no magician, but a bonus works wonders!','I offered the cat a job. She said she already manages naps!','Fertilizer is so expensive even the flowers want a loan!','I planted mint, and the jasmine asked for vacation time!','The cat can count coins, but only until dinner!','I told the plant to grow faster. It asked for overtime pay!','The jasmine gets water, and I get bonus requests!','Why did the carrot blush? It saw the fertilizer bill!'],thanks:'Thanks, boss! I appreciate it.',refused:'Okay boss... but I will complain a little! 😂',poor:'Not enough coins, boss!',liked:'Yay! Your laugh is better than a bonus! 😂',disliked:'Ouch, boss! I’ll try a better joke next time.',postponed:'Okay boss, we can postpone this purchase.'}}
$('levelHeader').after($('settingsPanel'));
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
function renderStaff(){
 const english=state.lang==='en';
 $('workersYasminName').textContent=english?'Yasmin':'ياسمين';
 $('workersYasminRole').textContent=english?'Nursery manager':'مديرة المشتل';
 $('workersYasminInfo').textContent=english?'Yasmin looks after the nursery and the cats. She requests coins for supplies and bonuses and has no regular salary.':'مسؤولة عن المشتل والقطط، وما إلها راتب دوري. بتطلب مصاري للمشتريات والمكافآت فقط.';
var w=staffWords(),st=state.staff;var buyDirect=$('buyFertilizerDirect');buyDirect.hidden=!!st.hired;buyDirect.textContent=state.lang==='ar'?'🌱 شراء 5 سماد · 💰 10':'🌱 Buy 5 fertilizer · 💰 10';buyDirect.disabled=state.money<10;if(st.hired&&st.request&&st.request!=='bonus'&&state.stock[st.request]>=5){st.request=null;save()}renderYasminExpression();renderAbu();renderNana();$('settingsNamesPanel').hidden=!settingsOpen||!editingNames;$('identityPanel').hidden=!settingsOpen||!editingNames;$('gardenNameLabel').textContent=state.lang==='ar'?'اسم الحديقة':'Garden name';if(document.activeElement!==$('gardenNameInput'))$('gardenNameInput').value=state.gardenName;$('jokeRating').hidden=!jokeAwaitingRating;$('jokeGood').textContent=state.lang==='ar'?'😂 حلوة!':'😂 Funny!';$('jokeBad').textContent=state.lang==='ar'?'😐 مش كتير':'😐 Not really';$('nurseryAlert').hidden=true;$('nurseryAlertTitle').textContent=state.lang==='ar'?'🌱 تنبيه المشتل':'🌱 Nursery alert';$('nurseryAlertText').textContent=state.lang==='ar'?'المشتل فاضي! حان وقت زراعة بذرة جديدة.':'Your garden is empty! Time to plant a new seed.';$('nurseryAlertAction').textContent=state.lang==='ar'?'🌱 سأزرع':'🌱 I’ll plant';$('nurseryAlertDismiss').textContent=state.lang==='ar'?'تجاهل':'Dismiss';var n=notificationCount();$('staffBadge').hidden=!n;$('staffBadge').textContent=n;$('settingsPanel').hidden=!settingsOpen;$('settingsAudioPanel').hidden=!audioPanelOpen;$('settingsAudio').setAttribute('aria-expanded',String(audioPanelOpen));$('settingsNames').setAttribute('aria-expanded',String(editingNames));$('topEditNames').setAttribute('aria-expanded',String(settingsOpen));$('identityPanel').hidden=!settingsOpen||!editingNames;$('editNames').textContent=state.lang==='ar'?(editingNames?'✕ إغلاق التعديل':'✏️ تعديل الأسماء'):(editingNames?'✕ Close editing':'✏️ Edit names');$('staffRole').textContent=state.lang==='ar'?'مديرة المشتل':'Nursery manager';$('nurseryNameLabel').textContent=w.nursery;$('catNameLabel').textContent=w.cat;$('nurseryEdit').hidden=state.namesSet&&!editingNames;$('catEdit').hidden=state.namesSet&&!editingNames;$('nurseryNameDone').hidden=!state.namesSet||editingNames;$('catNameDone').hidden=!state.namesSet||editingNames;$('nurseryNameDone').textContent=displayName("nurseryName");$('catNameDone').textContent=displayName("catName");if(document.activeElement!==$('nurseryNameInput'))$('nurseryNameInput').value=state.nurseryName;if(document.activeElement!==$('catNameInput'))$('catNameInput').value=state.catName;$('fertilizerStockLabel').textContent=state.lang==='ar'?'🌱 مخزون السماد':'🌱 Fertilizer stock';$('catFoodStockLabel').textContent=state.lang==='ar'?'🍲 مخزون أكل القطة':'🍲 Cat food stock';$('fertilizerStock').textContent=state.stock.fertilizer;$('catFoodStock').textContent=state.stock.catfood;$('stockHint').hidden=true;$('staffTitle').textContent=state.lang==='ar'?'ياسمين':'Yasmin';$('staffMood').textContent=w.mood+': '+st.mood+'%';$('staffDialogue').textContent=jokeAwaitingRating?localizeDialogue(st,w):(nurseryPots().every(p=>!p.active)&&!state.dismissedEmpty?(state.lang==='ar'?'يا مدير، المشتل فاضي! ازرع بذرة جديدة من دكّان البذور.':'Boss, the nursery is empty! Plant a new seed from the seed shop.'):st.request?w.request[st.request]:(state.stock.fertilizer<=1?(state.lang==='ar'?'يا مدير، السماد قرب يخلص! ضل '+state.stock.fertilizer+' بس.':'Boss, fertilizer is running low!') :state.stock.catfood<=1?(state.lang==='ar'?'يا مدير، أكل '+displayName("catName")+' قرب يخلص!':'Boss, cat food is running low!'):state.cat.fullness<35&&(!state.nana.hired||state.nana.paused)?w.needCat:nurseryPots().some(p=>p.active&&p.quality<55)?w.needWater:(jokeAwaitingRating?localizeDialogue(st,w):localizeDialogue(st,w))));$('hireStaff').textContent=st.hired?(state.lang==='ar'?'✓ تم توظيف ياسمين':'✓ Yasmin hired'):w.hire;$('hireStaff').hidden=st.hired;$('hireStaff').disabled=st.hired||state.money<50;$('staffJoke').textContent=w.joke;$('staffJoke').disabled=!st.hired;$('staffRequest').hidden=!st.hired||!st.request;if(st.request){var req=requests.find(function(x){return x.type===st.request});if(req){$('requestTitle').textContent=state.lang==='ar'?'طلب من ياسمين':'Yasmin’s request';$('requestText').textContent=w.request[req.type];$('acceptRequest').textContent=w.yes+' 💰 '+req.cost;$('acceptRequest').disabled=state.money<req.cost;$('rejectRequest').textContent=w.no}}}
/* Names are confirmed with Enter or the check button, not on every keystroke. */
$('nurseryAlertDismiss').onclick=function(){state.dismissedEmpty=true;render()};$('nurseryAlertAction').onclick=function(){state.dismissedEmpty=true;activeArea='nursery';render();$('shop').scrollIntoView({behavior:'smooth',block:'center'})};$('staffTab').onclick=function(){
  if(activeArea!=='staff')yasminFace='neutral';
  activeArea='staff';
  render();
};$('workersTab').onclick=function(){activeArea=activeArea==='workers'?'overview':'workers';render()};$('hireStaff').onclick=function(){if(state.staff.hired||state.money<50)return;financeMove(-50,'hire');sound('purchase');state.staff.hired=true;state.staff.dialogue='hello';state.staff.nextBonusSale=state.sales+5;render()};$('staffJoke').onclick=function(){if(!state.staff.hired)return;var c=collectionData();if(!Number.isInteger(c.jokeNext))c.jokeNext=0;state.staff.dialogue='joke:'+(c.jokeNext%yasminJokes[state.lang].length);c.jokeNext=(c.jokeNext+1)%yasminJokes[state.lang].length;jokeAwaitingRating=true;yasminFace='neutral';sound('laugh');render()};$('jokeGood').onclick=function(){if(!jokeAwaitingRating)return;jokeAwaitingRating=false;state.staff.mood=Math.min(100,state.staff.mood+8);yasminFace='happy';state.staff.dialogue='liked';sound('cheer');save();render()};$('jokeClose').onclick=function(){jokeAwaitingRating=false;render()};$('jokeBad').onclick=function(){if(!jokeAwaitingRating)return;jokeAwaitingRating=false;state.staff.mood=Math.max(0,state.staff.mood-7);yasminFace='sad';state.staff.dialogue='disliked';sound('sad');save();render()};$('acceptRequest').onclick=function(){var st=state.staff,req=requests.find(function(x){return x.type===st.request});if(!st.hired||!req||state.money<req.cost)return;financeMove(-req.cost,req.type);if(req.type==='bonus')yasminFace='happy';sound(req.type==='bonus'?'cheer':'purchase');st.mood=Math.min(100,st.mood+(req.type==='bonus'?20:7));if(req.type==='fertilizer')state.stock.fertilizer+=5;if(req.type==='catfood')state.stock.catfood+=5;if(req.type!=='bonus'&&st.rejectedStock)delete st.rejectedStock[req.type];if(!jokeAwaitingRating)st.dialogue='thanks';st.request=null;if(req.type==='bonus')st.nextBonusSale=state.sales+5;render()};$('rejectRequest').onclick=function(){var st=state.staff;if(!st.request)return;var isBonus=st.request==='bonus';sound(isBonus?'sad':'reject');if(isBonus){st.mood=Math.max(0,st.mood-8);yasminFace='sad'}else{if(!st.rejectedStock)st.rejectedStock={};st.rejectedStock[st.request]=Date.now()+65000}if(!jokeAwaitingRating)st.dialogue=isBonus?'refused':'postponed';st.request=null;if(isBonus)st.nextBonusSale=state.sales+5;render()};
function renderAbu(){var a=state.abu,en=state.lang==='en';$('message').style.display=a.hired?'none':'';$('abuPanel').hidden=false;var worker=$('abuWorker');$('abuWagePay').hidden=!a.hired||!a.paused;$('abuWorkStatus').hidden=!a.hired||(!a.paused&&!a.lastAction);$('abuWorkStatus').parentElement.style.padding=(!$('abuWorkStatus').hidden)?'0':'';$('abuWorkStatus').textContent=a.paused?(en?'John is waiting for wages':'أبو وردة متوقف بانتظار راتبه'):(a.lastAction?(en?({water:'John watered the plant',fertilize:'John fertilized the plant',pest:'John removed the worm'}[a.lastAction]||''):({water:'أبو وردة سقى النبتة',fertilize:'أبو وردة سمّد النبتة',pest:'أبو وردة كافح الدود'}[a.lastAction]||'')):'');if(hasSecondPot()&&a.lastAction&&!a.paused){
  if(Object.hasOwn(crops,a.tendedKind)){
    var action=en?{water:'Watered ',fertilize:'Fertilized ',pest:'Removed a worm from '}:{water:'أبو وردة سقى ',fertilize:'أبو وردة سمّد ',pest:'أبو وردة شال دودة عن '};
    $('abuWorkStatus').textContent=(action[a.lastAction]||'')+crops[a.tendedKind][state.lang];
  }
}if(worker){worker.hidden=!a.hired;worker.classList.toggle('paused',!!a.paused);worker.title=en?'John — nursery worker':'أبو وردة — عامل المشتل';}$('abuName').textContent=en?'John':'أبو وردة';$('abuStatus').textContent=!a.hired?(en?'Available after 6 sales':'بيفتح بعد 6 مبيعات'):a.paused?(en?'On break — wages due':'متوقف مؤقتاً — الراتب ناقص'):(en?'Working in the nursery':'عم يعتني بالنبتة');$('abuDialogue').textContent=!a.hired?(en?'Hire for 80 coins after 6 sales.':'بعد 6 مبيعات فيك توظفني بـ80 عملة، وبساعدك بالسقاية والحشرات.'):(a.paused?(en?'Pay 15 coins to resume work.':'يا مدير، في 15 عملة راتب مستحقة. ادفعلي وبرجع للشغل.'):(en?'I water the plant and remove harmful worms. I leave bees alone.':'أنا بسقي النبتة وبشيل الدود المؤذي، والنحل بخليه بحاله!'));$('hireAbu').hidden=a.hired&&!a.paused;$('hireAbu').disabled=state.money<(a.paused?15:80)||(!a.hired&&state.sales<ECONOMY_CONFIG.abuSales);$('hireAbu').textContent=a.paused?(en?'Pay wages · 15 coins':'💰 دفع الراتب · 15 عملة'):(en?'Hire John · 80 coins':'👨‍🌾 وظّف أبو وردة · 80 عملة');$('abuWage').textContent=en?'Wages: 15 coins every 3 sales after hiring.':'الراتب: 15 عملة كل 3 مبيعات بعد التوظيف. عدم الدفع بيوقف الشغل مؤقتاً.'}
$('hireAbu').onclick=function(){var a=state.abu;if(a.paused){if(state.money<15)return;financeMove(-15,'salary');a.paused=false;render();return}if(a.hired||state.sales<ECONOMY_CONFIG.abuSales||state.money<80)return;financeMove(-80,'hire');a.hired=true;a.paidSales=0;a.lastCare=Date.now();sound('purchase');render()};
var nanaHeartLines=[["يا حبيبي، مو كل يوم صعب يعني إنو الحياة صعبة.","One difficult day does not make a difficult life, dear."],["بكرا فيه أشياء حلوة لسا ما بتعرف عنها شي.","Tomorrow holds lovely things you do not know about yet."],["لا تحكم على كل حياتك من يوم ما كان على خاطرك.","Do not judge your whole life by one disappointing day."],["أوقات أحلى البدايات بتجي بعد أصعب النهايات.","Sometimes beautiful beginnings follow difficult endings."],["خلي بقلبك مطرح للفرح، حتى لو الدنيا شاغلتك.","Leave room for joy even when life keeps you busy."],["أنا فخورة فيك، مو بس باللي حققتو، باللي عم تحاول تحققو كمان.","I am proud of what you have achieved and what you are trying to achieve."],["لا تصغّر من قيمة حالك بس لأنك لسا ما وصلت.","Do not diminish your worth because you have not arrived yet."],["مو ضروري تكون أحسن من حدا، المهم تحب الإنسان اللي عم تصير عليه.","You need not surpass anyone; what matters is liking who you are becoming."],["إنت بتستاهل المحبة من دون إذن من حدا.","You deserve love without anyone's permission."],["تذكّر قديش قطعت طريق، قبل ما تزعل على الطريق اللي ضل.","Remember how far you have come before worrying about the road ahead."],["حتى الورد ما بيفتح كلّه بنفس اليوم، كل شي إلو وقتو.","Even roses bloom at different times."],["لا تستعجل الثمرة وتنسى تستمتع بالشجرة.","Do not rush the harvest and forget to enjoy the tree."],["كل خطوة صغيرة ممكن تقرّبك من حلم كبير.","Each little step can bring a big dream closer."],["إذا تعبت، ارتاح شوي، مو ضروري تتخلى عن حلمك.","Rest when tired; you need not abandon your dream."],["نجاح غيرك ما بينقص من فرص نجاحك يا ابني.","Someone else's success does not diminish your chances, dear."],["مو كل معركة بتستاهل تخسر راحتك كرمالها.","Not every battle is worth sacrificing your peace."],["من حقك ترتاح من دون ما تبرّر تعبك لحدا.","You may rest without explaining your exhaustion."],["لا تحمل هم بكرا وتنسى تعيش اليوم.","Do not let tomorrow's worries steal today."],["مو لازم تحل كل مشاكل الدنيا بليلة وحدة.","You need not solve every problem in one night."],["العمر مو بس شغل ومسؤوليات، العمر كمان ضحكة وراحة بال.","Life is more than work and duties; it is laughter and peace too."],["خليك قريب من الناس اللي بتحس معهم إنك على طبيعتك.","Stay close to people with whom you can be yourself."],["القلب الطيب نعمة، بس لا تنسى تكون طيب مع حالك كمان.","A kind heart is a blessing; be kind to yourself too."],["مو كل حدا بيروح من حياتك بيكون خسارة.","Not everyone who leaves your life is a loss."],["لا تغيّر طيبتك بسبب حدا ما عرف قيمتها.","Do not abandon your kindness because someone failed to appreciate it."],["المحبة الحقيقية فيها احترام وطمأنينة.","Real affection includes respect and reassurance."],["بتمنالك فرحة كبيرة تنسّيك قديش نطرتها.","I wish you a joy so great you forget how long you waited."],["لا تأجّل فرحتك لحتى تصير حياتك كاملة.","Do not postpone joy until life is perfect."],["أوقات فنجان قهوة مع شخص بتحبو بيسوى الدنيا كلها.","Sometimes coffee with someone you love is worth the world."],["الله يبعتلك أيام تضحك فيها من قلبك، مو بس كرمال الناس.","May you have days when you laugh from the heart."],["بتمنالك حياة بتحب تعيشها، مو حياة بتعدّ أيامها.","I wish you a life you love living, not one whose days you merely count."],["اللي تعلمتو من غلطة اليوم ممكن يفيدك سنين.","What you learn from today's mistake may help for years."],["فيك تبلّش من جديد من دون ما تنكر تعب الماضي.","You can begin again without denying your past efforts."],["الشجاعة أوقات إنك تعترف إنك بحاجة لحدا يساعدك.","Sometimes courage means admitting you need help."],["ما في عمر محدد للأحلام الجديدة.","There is no age limit on new dreams."],["إذا تغيّر حلمك، مو معناتا إنك فشلت.","Changing your dream does not mean you failed."],["الإنسان بيتعلم طول عمرو، وأنا لهلق عم اتعلم منك.","We learn throughout life; I am still learning from you."],["مو كل فرصة ضاعت كانت آخر فرصة.","A missed opportunity is not necessarily the last one."],["خلي عندك فضول تعرف شو ممكن تصير، بدل الخوف من شو ممكن يصير.","Be curious about who you could become instead of fearing what might happen."],["في أيام بيكون فيها مجرد المحاولة إنجاز كبير.","Some days simply trying is a great achievement."],["الحكمة مو إنك تعرف كل الأجوبة، الحكمة إنك تعرف إمتى تسأل.","Wisdom is not knowing every answer, but knowing when to ask."],["لا تخلي كلمة قاسية من حدا تصير صوتك الداخلي.","Do not let someone's harsh words become your inner voice."],["مو مطلوب منك ترضي كل الناس حتى تكون إنسان منيح.","You need not please everyone to be a good person."],["إلك حق تختار الطريق اللي بناسبك، حتى لو غيرك اختار غيرو.","You may choose the road that suits you, even if others choose differently."],["احترم تعبك متل ما بتحترم تعب الناس اللي بتحبهن.","Respect your own efforts as you respect those of loved ones."],["في فرق بين إنك تطمح للأحسن وإنك ما ترضى عن حالك أبداً.","Aspiring to improve is different from never accepting yourself."],["خلي ذكرياتك الحلوة سند إلك، مو سبب لتوقف حياتك عندها.","Let good memories support you rather than keep you stuck."],["يا عيني، مو كل سكوت ضعف، أوقات السكوت حكمة.","Silence is not always weakness; sometimes it is wisdom."],["الاعتذار الصادق بيكبر الإنسان، ما بيصغرو.","A sincere apology makes a person greater, not smaller."],["الكرم مو بس بالمصاري، أوقات وقتك واهتمامك أغلى هدية.","Generosity is not just money; your time and care can be the greatest gift."],["في ناس بتتذكر كلمة حلوة قلتلها ياها وإنت ناسيها.","People may remember a kind word you have long forgotten."],["ما في داعي تخبي فرحتك خوفاً من إنها تخلص.","You need not hide your joy for fear it might end."],["الضحكة اللي بتطلع من القلب ما بدها مناسبة.","Heartfelt laughter needs no special occasion."],["يا رب تلاقي رفقة تحبك بأيامك العادية قبل أيام نجاحك.","May you find friends who love you on ordinary days as much as successful ones."],["الحياة فيها فسحة للدهشة مهما كبرنا.","Life has room for wonder no matter how old we grow."],["لا تخلي انتظار الشي الكبير يحرمك من الأشياء الحلوة اللي بين إيديك.","Do not let waiting for something big deprive you of the good things you already have."],["أحلى هدية ممكن تقدمها لحالك إنك تعيش على طريقتك باحترام ومحبة.","A lovely gift to yourself is living your own way with respect and kindness."],["في أحلام بتكبر معنا، وفي أحلام بتعلّمنا نختار غيرها.","Some dreams grow with us; others teach us to choose differently."],["لما تفرح لغيرك، عم توسّع مطرح الفرح بقلبك.","Celebrating others makes more room for joy in your heart."],["مو كل شي إلو سعر، في أشياء قيمتها ما بتنحسب.","Not everything has a price; some things are beyond measure."],["الله يعطيك راحة بال تسوى كل التعب اللي مرق عليك.","May you find peace worth all the effort you have made."]],nanaHeartStage=0,nanaHeartIndex=0;
function nextNanaHeart(){if(!state.nana.hired)return;var c=collectionData();if(c.heartVersion!==2){c.heartVersion=2;c.heartNext=0}if(!Number.isInteger(c.heartNext))c.heartNext=0;nanaHeartIndex=c.heartNext%nanaHeartLines.length;c.heartNext=(c.heartNext+1)%nanaHeartLines.length;c.lastHeart=nanaHeartIndex;c.heartCount=(c.heartCount||0)+1;nanaHeartStage=1;save();render()}
$('heartPortrait').src=document.querySelector('img.nana-art').src;
$('workersTab').style.setProperty('--nana-art','url('+$('heartPortrait').src+')');
function renderNanaHeart(){var panel=$('nanaHeartPanel');if(!panel)return;panel.hidden=!state.nana.hired;$('heartTitle').textContent=state.lang==='en'?'Nana · A word from the heart':'نانا · كلمة من القلب';if(!state.nana.hired){nanaHeartStage=0;return}var en=state.lang==='en';$('nanaHeartText').textContent=nanaHeartStage===1?nanaHeartLines[nanaHeartIndex][en?1:0]:nanaHeartStage===2?([['الله يسعد قلبك يا حبيبي.','May your heart be happy, dear.'],['فرحتني بكلامك، يا عيني.','Your words made me happy.'],['يا رب تكون أيامك مليانة خير.','May your days be full of goodness.'],['إلك معزة كبيرة عندي.','You are dear to me.']][nanaHeartIndex%4][en?1:0]):nanaHeartStage===3?([['دير بالك على حالك يا ابني.','Take good care of yourself.'],['بشوفك على خير يا روحي.','See you soon, dear.'],['الله معك وين ما رحت.','May goodness follow you wherever you go.']][nanaHeartIndex%3][en?1:0]):(en?'I have a kind word for you whenever you need one.':'يا حبيبي، أنا هون إذا احتجت كلمة حلوة.');$('nanaHeartStart').hidden=nanaHeartStage===1;$('nanaHeartActions').hidden=nanaHeartStage!==1;$('nanaHeartStart').textContent=en?'A word from the heart 💗':'💗 كلمة من القلب';$('nanaHeartThanks').textContent=en?'That comforted me ❤️':'❤️ ريّحتي قلبي يا نانا';$('nanaHeartMore').textContent=en?'Tell me more 🌷':'🌷 احكيلي كمان';$('nanaHeartClose').textContent=en?'Thanks, enough for now':'شكراً نانا، بكفّي لهلق'}
$('nanaHeartStart').onclick=nextNanaHeart;$('nanaHeartMore').onclick=nextNanaHeart;$('nanaHeartThanks').onclick=function(){nanaHeartStage=2;renderNanaHeart()};$('nanaHeartClose').onclick=function(){nanaHeartStage=3;renderNanaHeart()};
function renderNana(){renderNanaHeart();var n=state.nana,en=state.lang==='en';$('nanaTitle').textContent=en?'Nana':'نانا';$('nanaRole').textContent=en?'Cat caretaker':'مربّية القطط';$('nanaStatus').textContent=!n.hired?(en?'Unlocks after 12 sales':'بيفتح بعد 12 مبيعة'):n.paused?(en?'Paused — wages due':'متوقفة بانتظار الراتب'):(en?'Caring for '+displayName("catName"):'عم تهتم بـ'+displayName("catName"));$('nanaDialogue').textContent=n.hired?(n.paused?(en?'Please pay my wages so I can help again.':'يا حبيبي، ادفعلي راتبي وبرجع دلّع القطة!'):(en?'I feed, brush and play with '+displayName("catName")+'.':'أنا بطعمي '+displayName("catName")+' وبمشّطها وبلعب معها.')):(en?'Hire me after 12 sales to care for your cat.':'بعد 12 مبيعة وظّفني، وأنا بدير بالي على القطة بحنية.');$('hireNana').hidden=n.hired&&!n.paused;$('hireNana').disabled=n.paused?state.money<20:n.hired||state.sales<12||state.money<120;$('hireNana').textContent=n.paused?(en?'Pay wages · 20 coins':'💰 دفع الراتب · 20 عملة'):(en?'Hire Nana · 120 coins':'👵 وظّف نانا · 120 عملة');$('nanaWage').textContent=en?'Wages: 20 coins every 3 sales. Unpaid wages pause her work.':'الراتب: 20 عملة كل 3 مبيعات، وعدم الدفع بيوقف شغلها مؤقتاً.'}
$('hireNana').onclick=function(){var n=state.nana;if(n.paused){if(state.money<20)return;financeMove(-20,'salary');n.paused=false}else{if(n.hired||state.sales<12||state.money<120)return;financeMove(-120,'hire');n.hired=true;n.paidSales=0;n.lastCare=0}sound('purchase');save();render()};
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
  return !state.cat.away && !state.cat.sleeping && !state.nana.hired && state.cat.hydration === 0;
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
  var cat=state.cat,name=displayName("catName"),en=state.lang==='en',on=state.nana.hired&&!state.nana.paused;
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
  var n=state.nana,ar=state.lang==='ar',name=displayName("catName");
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
  var n=state.nana;if(state.cat.away||state.cat.sleeping||!n.hired||n.paused)return;
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
  var action=state.cat.toy&&state.cat.energy>=8?'Play':'Brush';
  if(action==='Play')state.cat.energy-=8;
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
  financeMove(-upgrade.cost,'upgrade');
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
function plotClock(seconds){
  return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
}
function updatePairCards(){
  const double=hasSecondPot(), en=state.lang==='en';
  $('singleGrowth').hidden=double;
  $('pairGrowth').hidden=!double;
  $('sell').parentElement.hidden=double;
  $('pairSales').hidden=!double;
  if(!double)return;
  $('offer').hidden=true;
  $('buyerTitle').textContent=en?'Nursery customer':'زبون المشتل';
  $('buyerText').textContent=nurseryPots().some(isReady)?(en?'Choose a plant to sell':'اختار النبتة اللي بدك تبيعها'):tr('buyerText');
  nurseryPots().forEach((pot,index)=>{
    const name=(en?'Pot ':'أصيص ')+(index+1);
    let card=$('growthCard'+index),sale=$('saleCard'+index);
    if(!card){
      card=document.createElement('button');card.id='growthCard'+index;
      card.innerHTML='<b></b><small></small>';
      card.onclick=()=>selectPot(index);$('pairGrowth').append(card);
      sale=document.createElement('button');sale.id='saleCard'+index;
      sale.onclick=()=>{if(isReady(potAt(index))){state.selectedPot=index;sell();}};
      $('pairSales').append(sale);
    }
    const crop=crops[pot.kind],ready=isReady(pot);
    card.firstChild.textContent=name+(pot.active?' · '+crop[state.lang]:'');
    card.lastChild.textContent=!pot.active?(en?'Ready to plant':'جاهز للزراعة'):ready?(en?'✓ Ready to sell':'✓ جاهز للبيع'):'⏱ '+plotClock(Math.ceil(crop.time*(100-pot.progress)/100))+' · '+Math.floor(pot.progress)+'%';
    sale.hidden=!ready;sale.disabled=!ready;
    sale.textContent=(en?'Sell ':'بيع ')+crop[state.lang]+' · '+name+' · 💰 '+salePrice(pot);
  });
}
function salePrice(pot){
  return Math.round(crops[pot.kind].price*(.5+pot.quality/200)*(state.sales<ECONOMY_CONFIG.starterSales?1+ECONOMY_CONFIG.starterBonus:1));
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
    $('shopInfo').textContent=nurseryPots().every(plot=>plot.active)?(en?'Both pots are planted. Sell a plant to make room.':'الأصيصين مزروعين. بيع نبتة حتى تقدر تزرع من جديد.'):(en?'Choose a seed for pot ':'اختار بذرة للأصيص ')+(selected+1)+(p.active?(en?' after selling its plant.':' بعد ما تبيع نبتته.'):'');
    $('buyerTitle').textContent=(en?'Nursery customer · Pot ':'زبون المشتل · الأصيص ')+(selected+1);
    if(isReady(p))$('sell').textContent=(en?'Sell ':'بيع ')+crops[p.kind][state.lang];
  }
  updatePairCards();
}
function renderSeedShop(p){
  var level=window.YasmineGardenCore.levelFor(state.sales), en=state.lang==='en';
  var signature=[state.lang,level,p.active,...Object.values(crops).map(c=>state.money>=c.cost)].join('|');
  if($('shop').dataset.signature===signature)return;
  $('shop').replaceChildren();
  Object.entries(crops).forEach(function([kind,c]){
    var button=document.createElement('button'), locked=level<c.level;
    button.type='button';
    button.className='seed-card';
    const art=document.createElement('span');
    art.className='seed-art';
    art.setAttribute('aria-hidden','true');
    art.style.backgroundImage='url("yasmine/images/plants/'+kind+'.webp")';
    const copy=document.createElement('span');
    copy.className='seed-copy';
    const name=document.createElement('strong'), price=document.createElement('small');
    name.textContent=c[state.lang];
    price.textContent=c.cost+(en?' coins':' عملة');
    if(locked)price.textContent+=' · 🔒 '+(en?'Level ':'تفتح بالمستوى ')+c.level;
    copy.append(name,price);
    button.append(art,copy);
    button.disabled=locked||p.active||state.money<c.cost;
    button.onclick=()=>buy(kind);
    $('shop').appendChild(button);
  });
  $('shop').dataset.signature=signature;
}
function advancePlantClock(now){
  const previous=state.plantClock;
  state.plantClock=now;
  if(Number.isFinite(previous) && now>previous)growPlants((now-previous)/1000);
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
$('catEmergencyBuy').onclick=function(){if(state.cat.away||state.stock.catfood!==0||state.cat.fullness>10||state.money<15)return;financeMove(-15,'catfood');state.stock.catfood+=5;state.catFoodEmergencyNotice=false;save();render()};
$('welfareWater').onclick=function(){giveCatWater('player')};
$('welfareFeed').onclick=function(){visitCat('Feed')};
$('welfarePlay').onclick=function(){visitCat('Play')};
$('welfareStaff').onclick=function(){activeArea='workers';render();$('nanaPanel').scrollIntoView({block:'center'})};
$('welfareReturn').onclick=restoreCat;
$('welfareAck').onclick=function(){state.cat.aidBy='';save();render()};
$('catEmergencyPay').onclick=function(){if(!state.catEmergencyBill||state.money<state.catEmergencyBill)return;financeMove(-state.catEmergencyBill,'invoice');state.catEmergencyBill=0;state.catFoodEmergencyNotice=false;save();render()};
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

// Palette stops use the same two-real-seconds-per-game-minute clock as the HUD.
// The repeated midnight stop makes the last hour blend into the next day.
var daylightStops = [
  // Hour, phase, upper sky, horizon, page, panels, celestial disc, scene exposure
  [0,  'night',     '#101b45','#35456b','#1d2b40','#293d51','#fff3cf',0.71],
  [4,  'dawn',      '#38365e','#8e728b','#323449','#485062','#f2dfd2',0.78],
  [6,  'sunrise',   '#ab99b2','#ffc392','#b5a29f','#dcc8b9','#ffe6ac',0.90],
  [8,  'morning',   '#8ac9e9','#ffe9bd','#f4efd9','#fcf7e9','#ffe19a',1.00],
  [12, 'day',       '#72c3f0','#d8eee2','#ecf3df','#f9fcf5','#fff2b7',1.00],
  [16, 'afternoon', '#84b8d8','#f8d597','#f1e6d1','#fbf1de','#ffdc90',0.98],
  [18, 'sunset',    '#b486a4','#ffab79','#dac0ac','#f2d8be','#ffc781',0.93],
  [20, 'dusk',      '#524e80','#ae829c','#5c566e','#716b7d','#f4d5bc',0.83],
  [22, 'night',     '#1c294f','#495575','#243247','#304257','#fff1cc',0.74],
  [24, 'night',     '#101b45','#35456b','#1d2b40','#293d51','#fff3cf',0.71]
];
var skyLabels = {
  ar:{night:'ليل', dawn:'فجر', sunrise:'شروق', morning:'صباح', day:'نهار', afternoon:'عصر', sunset:'غروب', dusk:'غسق'},
  en:{night:'Night', dawn:'Dawn', sunrise:'Sunrise', morning:'Morning', day:'Day', afternoon:'Afternoon', sunset:'Sunset', dusk:'Dusk'}
};
var lastSkyMinute;
function blendSkyColor(from,to,amount){
  var rgb=[1,3,5].map(function(i){
    var a=parseInt(from.slice(i,i+2),16), b=parseInt(to.slice(i,i+2),16);
    return Math.round(a+(b-a)*amount);
  });
  return 'rgb('+rgb.join(',')+')';
}
function updateSky(){
  var mode=state.dayMode||'auto';
  if(!Number.isFinite(Number(state.gameEpoch)))state.gameEpoch=Date.now();
  var elapsed=Math.floor((Date.now()-Number(state.gameEpoch))/2000);
  var minute=mode==='day'?720:mode==='night'?0:((elapsed%1440)+1440)%1440;
  if(lastSkyMinute!==minute){
    var hour=minute/60;
    var next=daylightStops.findIndex(function(stop){return stop[0]>hour});
    var a=daylightStops[next-1], b=daylightStops[next];
    var mix=(hour-a[0])/(b[0]-a[0]);
    var body=document.body;
    ['--sky-top','--sky-horizon','--cycle-page','--cycle-panel','--cycle-disc'].forEach(function(name,index){
      body.style.setProperty(name,blendSkyColor(a[index+2],b[index+2],mix));
    });
    body.style.setProperty('--cycle-light',(a[7]+(b[7]-a[7])*mix).toFixed(3));
    body.dataset.sky=a[1];
    $('scene').dataset.sky=a[1];
    body.classList.toggle('night-ui',minute<312||minute>=1200);
    lastSkyMinute=minute;
  }
  $('skyPhase').textContent=(state.lang==='ar'?'السماء الآن: ':'Sky: ')+skyLabels[state.lang][document.body.dataset.sky];
  $('dayMode').value=mode;
  updateWeather();
  updateClock();
}
function tr(s){return txt[state.lang][s]}function msg(s){$('message').textContent=s}
function renderNurseryNotice(){$('abuNotice').hidden=activeArea!=='nursery'||!nurseryPots().some(p=>isReady(p)||!p.active)}function updateWeather(){var selected=state.weatherMode||'auto';var w=selected==='auto'?['clear','wind','rain','clear'][Math.floor((Date.now()-state.gameEpoch)/240000)%4]:selected;document.body.dataset.weather=w;$('scene').dataset.weather=w;$('weatherMode').value=selected;$('weatherStatus').textContent=(selected==='auto'?'🔄 ':'')+(w==='rain'?(state.lang==='ar'?'🌧️ مطر':'🌧️ Rain'):w==='wind'?(state.lang==='ar'?'💨 ريح':'💨 Wind'):(state.lang==='ar'?'☀️ صحو':'☀️ Clear'));$('cfgWeather').textContent=$('dayMode').selectedOptions[0].textContent.split('—')[0].trim()+' · '+$('weatherStatus').textContent}function gameHour(){if(!Number.isFinite(Number(state.gameEpoch)))state.gameEpoch=Date.now();return ((Math.floor((Date.now()-Number(state.gameEpoch))/120000)%24)+24)%24}function updateClock(){if(!Number.isFinite(Number(state.gameEpoch)))state.gameEpoch=Date.now();var elapsed=Math.floor((Date.now()-state.gameEpoch)/1000),minutes=Math.floor((elapsed%120)/2)%60,h=gameHour(),time=String(h%12||12).padStart(2,'0')+':'+String(minutes).padStart(2,'0')+' '+(h<12?'AM':'PM');$('gameTime').textContent=time;var dateEl=$('gameDate');if(!dateEl){dateEl=document.createElement('span');dateEl.id='gameDate';dateEl.dir='ltr';dateEl.style.cssText='flex:0 0 auto;min-width:0;text-align:center;white-space:nowrap;font-size:clamp(13px,3.5vw,21px);font-weight:800;font-variant-numeric:tabular-nums';$('gameTime').before(dateEl)}var gameDays=Math.max(0,Math.floor((Date.now()-Number(state.gameEpoch))/2880000)),calendar=new Date(Date.UTC(2020,0,1)+gameDays*86400000);dateEl.textContent=String(calendar.getUTCDate()).padStart(2,'0')+'/'+String(calendar.getUTCMonth()+1).padStart(2,'0')+'/'+calendar.getUTCFullYear();$('gameTime').setAttribute('dir','ltr');$('gameTime').style.direction='ltr';$('gameTime').style.unicodeBidi='isolate';$('skyClock').textContent=(state.lang==='ar'?'وقت اللعبة: ':'Game time: ')+time;$('skyClock').style.direction='ltr';$('skyClock').style.unicodeBidi='isolate'} function renderGoal(){var g=state.abu.hired?(state.nana.hired?null:{ar:'توظيف نانا',en:'Hire Nana',sales:12,cost:120}):{ar:'توظيف أبو وردة',en:'Hire John',sales:ECONOMY_CONFIG.abuSales,cost:80};var el=$('nextGoal');el.hidden=!g;if(!g)return;var en=state.lang==='en',ds=Math.max(0,g.sales-state.sales),dc=Math.max(0,g.cost-state.money);$('goalTitle').textContent=(en?'🎯 Next goal: ':'🎯 هدفك القادم: ')+g[en?'en':'ar'];$('goalSalesLabel').textContent=(en?'Sales: ':'المبيعات: ')+Math.min(state.sales,g.sales)+'/'+g.sales;$('goalCoinsLabel').textContent=(en?'Coins: ':'العملات: ')+Math.min(state.money,g.cost)+'/'+g.cost;$('goalSalesBar').value=Math.min(100,state.sales/g.sales*100);$('goalCoinsBar').value=Math.max(0,Math.min(100,state.money/g.cost*100));$('goalRemaining').textContent=en?ds+' more sales and '+dc+' coins needed':('باقي '+ds+' مبيعة و '+dc+' عملة لـ'+g.ar)}$('nextGoal').onclick=function(){activeArea='workers';render();$('workersArea').scrollIntoView({block:'start',behavior:'smooth'})};$('nextGoal').onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();$('nextGoal').click()}};
$('employeesToggle').onclick=function(){$('employeesPanel').hidden=!$('employeesPanel').hidden;$('employeesToggle').setAttribute('aria-expanded',String(!$('employeesPanel').hidden))};$('employeesClose').onclick=function(){$('employeesPanel').hidden=true;$('employeesToggle').setAttribute('aria-expanded','false');$('employeesToggle').focus()};$('dayMode').onchange=function(){state.dayMode=this.value;render()};$('weatherMode').onchange=function(){state.weatherMode=this.value;render()};$('qualityCard').onclick=function(){$('qualityReason').hidden=!$('qualityReason').hidden};$('qualityCard').onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();$('qualityCard').click()}};$('abuWagePay').onclick=function(){$('hireAbu').click()};
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
 $('customerToggleLabel').textContent=en?'Sell plants':'زبون المشتل';
 $('seedToggleLabel').textContent=en?'Seed shop':'متجر البذور';
 const ripeCount=nurseryPots().filter(isReady).length;
 const emptyCount=nurseryPots().filter(p=>!p.active).length;
 $('customerAlert').textContent=ripeCount;
 $('seedAlert').textContent=emptyCount;
 $('nurseryBadge').textContent=ripeCount+emptyCount;
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
function recordCollections(){var c=collectionData();nurseryPots().forEach(function(p){if(!isReady(p)){p.collectionRecorded=false;return}if(!p.collectionRecorded){var v=c.plants[p.kind]||(c.plants[p.kind]={count:0,best:0,date:collectionDate()});v.count++;if(v.count===1){v.unread=true;v.announced=false;}v.best=Math.max(v.best,Math.round(p.quality));p.collectionRecorded=true}else if(c.plants[p.kind])c.plants[p.kind].best=Math.max(c.plants[p.kind].best,Math.round(p.quality))});var en=state.lang==='en',n=Object.keys(c.plants).length;var rows=[['sales50','🥉','التاجر الصغير','Junior merchant',state.sales,50,25],['sales100','🥈','التاجر المحترف','Expert merchant',state.sales,100,50],['sales500','🥇','ملك المشاتل','Nursery king',state.sales,500,150],['level5','🏅','مشتل مزدهر','Thriving nursery',window.YasmineGardenCore.levelFor(state.sales),5,30],['team','👥','فريق متكامل','Full team',[state.staff,state.abu,state.nana].filter(x=>x.hired).length,3,30],['cat50','🐱','صديق القطط','Cat friend',c.feeds,50,30],['heart50','💖','حديقة الأمل','Garden of hope',c.heartCount||0,50,30],['geo25','🥉','الرحّالة الصغير','Junior traveler',c.geoCorrect||0,25,25],['geo100','🥈','مستكشف العالم','World explorer',c.geoCorrect||0,100,75],['geo200','🥇','خبير الجغرافيا','Geography expert',c.geoCorrect||0,200,150],['plants','🌻','عاشق النباتات','Plant lover',n,Object.keys(crops).length,50]];rows.forEach(function(a){if(a[4]>=a[5]&&!c.awards[a[0]]){c.awards[a[0]]={date:collectionDate(),unread:true,announced:false};financeMove(a[6],'awards');window.YasmineMedals.celebrate(a,en,function(){activeArea='achievements';render()})}});return rows}
function renderCollections(){var rows=recordCollections(),c=collectionData(),en=state.lang==='en';var a=$('achievementsArea'),b=$('encyclopediaArea');if(!a||!b)return;a.hidden=activeArea!=='achievements';b.hidden=activeArea!=='encyclopedia';$('achievementsTab').textContent=en?'Achievements':'الإنجازات';$('encyclopediaTab').textContent=en?'Encyclopedia':'الموسوعة';if(!c.itemNoticeVersion){[ [c.awards,c.unreadAwards],[c.plants,c.unreadPlants] ].forEach(function(pair){Object.values(pair[0]).slice(-Math.max(0,pair[1]||0)).forEach(function(v){if(pair[1]>0){v.unread=true;v.announced=false}})});c.itemNoticeVersion=1}if(!a.hidden)Object.values(c.awards).forEach(v=>v.announced=true);if(!b.hidden)Object.values(c.plants).forEach(v=>v.announced=true);[['achievementsTab',Object.values(c.awards).filter(v=>v.unread&&!v.announced).length],['encyclopediaTab',Object.values(c.plants).filter(v=>v.unread&&!v.announced).length]].forEach(function(pair){if(pair[1]>0){var badge=document.createElement('span');badge.className='collection-unread';badge.textContent=pair[1];$(pair[0]).appendChild(badge)}});$('achievementsTab').setAttribute('aria-pressed',String(!a.hidden));$('encyclopediaTab').setAttribute('aria-pressed',String(!b.hidden));if(!a.hidden)window.YasmineMedals.render(a,rows,c.awards,en,function(id){c.awards[id].unread=false;save();renderCollections()});if(!b.hidden)window.YasmineFieldGuide.render(b,crops,c.plants,en,function(id){c.plants[id].unread=false;c.plants[id].announced=true;save();renderCollections()},function(){activeArea='achievements';render();window.YasmineMedals.open('plants')})}
function acknowledgeCollection(e){if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;var card=e.target.closest('[data-unread-award],[data-unread-plant]');if(!card)return;e.preventDefault();var c=collectionData(),v=card.dataset.unreadAward?c.awards[card.dataset.unreadAward]:c.plants[card.dataset.unreadPlant];if(v){v.unread=false;v.announced=true;save();renderCollections()}}
['achievementsArea','encyclopediaArea'].forEach(function(id){$(id).addEventListener('click',acknowledgeCollection);$(id).addEventListener('keydown',acknowledgeCollection)});
$('achievementsTab').onclick=function(){activeArea='achievements';render()};$('encyclopediaTab').onclick=function(){activeArea='encyclopedia';render()};
var abuGeoQuestions=[
  ["ما عاصمة ألبانيا؟","What is the capital of Albania?","تيرانا","Tirana","مسقط","Muscat","دبلن","Dublin","تيرانا هي عاصمة ألبانيا.","Tirana is the capital of Albania."],
  ["في أي بلد ينبع نهر الرون؟","In which country does the Rhône originate?","سويسرا","Switzerland","فرنسا","France","إيطاليا","Italy","ينبع نهر الرون في سويسرا.","The Rhône originates in Switzerland."],
  ["في أي دولة تقع البتراء؟","Which country contains Petra?","الأردن","Jordan","مصر","Egypt","العراق","Iraq","مدينة أثرية منحوتة بالصخر.","An ancient city carved into rock."],
  ["ما عاصمة فرنسا؟","What is the capital of France?","باريس","Paris","أبو ظبي","Abu Dhabi","لندن","London","باريس هي عاصمة فرنسا.","Paris is the capital of France."],
  ["في أي بلد يقع جبل فوجي؟","In which country is Mount Fuji?","اليابان","Japan","تنزانيا","Tanzania","كينيا","Kenya","جبل فوجي يقع في اليابان.","Mount Fuji is in Japan."],
  ["ما أكبر جزيرة في العالم؟","What is the world's largest island?","غرينلاند","Greenland","مدغشقر","Madagascar","آيسلندا","Iceland","أستراليا تُعد قارة.","Australia is classified as a continent."],
  ["ما عاصمة إيطاليا؟","What is the capital of Italy?","روما","Rome","مدينة الكويت","Kuwait City","أوسلو","Oslo","روما هي عاصمة إيطاليا.","Rome is the capital of Italy."],
  ["أي محيط هو الأكبر؟","Which ocean is largest?","الهادئ","Pacific","الأطلسي","Atlantic","الهندي","Indian","يغطي مساحة أكبر من أي محيط آخر.","It covers more area than any other ocean."],
  ["ما عاصمة ألمانيا؟","What is the capital of Germany?","برلين","Berlin","أنقرة","Ankara","ستوكهولم","Stockholm","برلين هي عاصمة ألمانيا.","Berlin is the capital of Germany."],
  ["في أي بلد يقع نهر السين؟","In which country is the Seine River?","فرنسا","France","إيطاليا","Italy","ألمانيا","Germany","بيمر بمدينة باريس.","It flows through Paris."],
  ["في أي بلد يقع برج إيفل؟","In which country is Eiffel Tower?","فرنسا","France","العراق","Iraq","الدنمارك","Denmark","برج إيفل يقع في فرنسا.","Eiffel Tower is in France."],
  ["ما عاصمة كندا؟","What is the capital of Canada?","أوتاوا","Ottawa","أثينا","Athens","هلسنكي","Helsinki","أوتاوا هي عاصمة كندا.","Ottawa is the capital of Canada."],
  ["في أي بلد يقع جبل كليمنجارو؟","In which country is Kilimanjaro?","تنزانيا","Tanzania","إيطاليا","Italy","الأرجنتين","Argentina","جبل كليمنجارو يقع في تنزانيا.","Kilimanjaro is in Tanzania."],
  ["ما عاصمة سوريا؟","What is the capital of Syria?","دمشق","Damascus","صوفيا","Sofia","كوبنهاغن","Copenhagen","دمشق هي عاصمة سوريا.","Damascus is the capital of Syria."],
  ["في أي بلد تقع جزيرة صقلية؟","In which country is Sicily?","إيطاليا","Italy","إسبانيا","Spain","كندا","Canada","جزيرة صقلية تقع في إيطاليا.","Sicily is in Italy."],
  ["في أي بلد تقع بحيرة بليد؟","In which country is Lake Bled?","سلوفينيا","Slovenia","كندا","Canada","تركيا","Türkiye","بحيرة بليد تقع في سلوفينيا.","Lake Bled is in Slovenia."],
  ["ما عاصمة لبنان؟","What is the capital of Lebanon?","بيروت","Beirut","بوخارست","Bucharest","ريكيافيك","Reykjavik","بيروت هي عاصمة لبنان.","Beirut is the capital of Lebanon."],
  ["في أي بلد يقع نهر التايمز؟","In which country is Thames?","المملكة المتحدة","United Kingdom","إيطاليا","Italy","فرنسا","France","نهر التايمز يقع في المملكة المتحدة.","Thames is in United Kingdom."],
  ["ما عاصمة الأردن؟","What is the capital of Jordan?","عمّان","Amman","بلغراد","Belgrade","تالين","Tallinn","عمّان هي عاصمة الأردن.","Amman is the capital of Jordan."],
  ["في أي بلد يقع الكولوسيوم؟","In which country is Colosseum?","إيطاليا","Italy","التشيك","Czechia","الولايات المتحدة","United States","الكولوسيوم يقع في إيطاليا.","Colosseum is in Italy."],
  ["في أي بلد يقع جبل كينيا؟","In which country is Mount Kenya?","كينيا","Kenya","الولايات المتحدة","United States","إندونيسيا","Indonesia","جبل كينيا يقع في كينيا.","Mount Kenya is in Kenya."],
  ["ما عاصمة العراق؟","What is the capital of Iraq?","بغداد","Baghdad","زغرب","Zagreb","ريغا","Riga","بغداد هي عاصمة العراق.","Baghdad is the capital of Iraq."],
  ["في أي بلد تقع جزيرة سردينيا؟","In which country is Sardinia?","إيطاليا","Italy","البرتغال","Portugal","إندونيسيا","Indonesia","جزيرة سردينيا تقع في إيطاليا.","Sardinia is in Italy."],
  ["في أي بلد تقع بحيرة بايكال؟","In which country is Lake Baikal?","روسيا","Russia","إيطاليا","Italy","كندا","Canada","بحيرة بايكال تقع في روسيا.","Lake Baikal is in Russia."],
  ["ما عاصمة مصر؟","What is the capital of Egypt?","القاهرة","Cairo","ليوبليانا","Ljubljana","فيلنيوس","Vilnius","القاهرة هي عاصمة مصر.","Cairo is the capital of Egypt."],
  ["في أي بلد يقع نهر بو؟","In which country is Po?","إيطاليا","Italy","روسيا","Russia","كوريا الجنوبية","South Korea","نهر بو يقع في إيطاليا.","Po is in Italy."],
  ["ما عاصمة المغرب؟","What is the capital of Morocco?","الرباط","Rabat","سراييفو","Sarajevo","كييف","Kyiv","الرباط هي عاصمة المغرب.","Rabat is the capital of Morocco."],
  ["في أي بلد يقع تاج محل؟","In which country is Taj Mahal?","الهند","India","إندونيسيا","Indonesia","سلوفاكيا","Slovakia","تاج محل يقع في الهند.","Taj Mahal is in India."],
  ["في أي بلد يقع جبل أوليمبوس؟","In which country is Mount Olympus?","اليونان","Greece","نيوزيلندا","New Zealand","الولايات المتحدة","United States","جبل أوليمبوس يقع في اليونان.","Mount Olympus is in Greece."],
  ["ما عاصمة تونس؟","What is the capital of Tunisia?","تونس","Tunis","بودغوريتسا","Podgorica","كيشيناو","Chisinau","تونس هي عاصمة تونس.","Tunis is the capital of Tunisia."],
  ["في أي بلد تقع جزيرة كورسيكا؟","In which country is Corsica?","فرنسا","France","اليونان","Greece","البرتغال","Portugal","جزيرة كورسيكا تقع في فرنسا.","Corsica is in France."],
  ["ما عاصمة الجزائر؟","What is the capital of Algeria?","الجزائر","Algiers","سكوبيه","Skopje","مينسك","Minsk","الجزائر هي عاصمة الجزائر.","Algiers is the capital of Algeria."],
  ["في أي بلد تقع بحيرة بالاتون؟","In which country is Lake Balaton?","المجر","Hungary","السويد","Sweden","النرويج","Norway","بحيرة بالاتون تقع في المجر.","Lake Balaton is in Hungary."],
  ["في أي بلد ينبع نهر الأمازون؟","In which country does the Amazon originate?","بيرو","Peru","البرازيل","Brazil","كولومبيا","Colombia","ينبع نهر الأمازون في بيرو.","The Amazon originates in Peru."],
  ["ما عاصمة ليبيا؟","What is the capital of Libya?","طرابلس","Tripoli","فيينا","Vienna","موسكو","Moscow","طرابلس هي عاصمة ليبيا.","Tripoli is the capital of Libya."],
  ["في أي بلد يقع سور الصين العظيم؟","In which country is Great Wall?","الصين","China","التشيك","Czechia","كندا","Canada","سور الصين العظيم يقع في الصين.","Great Wall is in China."],
  ["ما عاصمة السعودية؟","What is the capital of Saudi Arabia?","الرياض","Riyadh","بودابست","Budapest","تبليسي","Tbilisi","الرياض هي عاصمة السعودية.","Riyadh is the capital of Saudi Arabia."],
  ["في أي بلد يقع جبل إتنا؟","In which country is Mount Etna?","إيطاليا","Italy","ماليزيا","Malaysia","نيوزيلندا","New Zealand","جبل إتنا يقع في إيطاليا.","Mount Etna is in Italy."],
  ["في أي بلد تقع جزيرة كريت؟","In which country is Crete?","اليونان","Greece","أستراليا","Australia","إيطاليا","Italy","جزيرة كريت تقع في اليونان.","Crete is in Greece."],
  ["ما عاصمة قطر؟","What is the capital of Qatar?","الدوحة","Doha","براغ","Prague","يريفان","Yerevan","الدوحة هي عاصمة قطر.","Doha is the capital of Qatar."],
  ["في أي بلد تقع بحيرة فان؟","In which country is Lake Van?","تركيا","Türkiye","كينيا","Kenya","إندونيسيا","Indonesia","بحيرة فان تقع في تركيا.","Lake Van is in Türkiye."],
  ["ما عاصمة البحرين؟","What is the capital of Bahrain?","المنامة","Manama","براتيسلافا","Bratislava","باكو","Baku","المنامة هي عاصمة البحرين.","Manama is the capital of Bahrain."],
  ["في أي بلد يقع نهر اللوار؟","In which country is Loire?","فرنسا","France","اليابان","Japan","المغرب","Morocco","نهر اللوار يقع في فرنسا.","Loire is in France."],
  ["في أي بلد يقع ماتشو بيتشو؟","In which country is Machu Picchu?","بيرو","Peru","الدنمارك","Denmark","المملكة المتحدة","United Kingdom","ماتشو بيتشو يقع في بيرو.","Machu Picchu is in Peru."],
  ["ما عاصمة عُمان؟","What is the capital of Oman?","مسقط","Muscat","وارسو","Warsaw","طهران","Tehran","مسقط هي عاصمة عُمان.","Muscat is the capital of Oman."],
  ["في أي بلد يقع جبل فيزوف؟","In which country is Vesuvius?","إيطاليا","Italy","بيرو","Peru","ماليزيا","Malaysia","جبل فيزوف يقع في إيطاليا.","Vesuvius is in Italy."],
  ["في أي بلد تقع جزيرة رودس؟","In which country is Rhodes?","اليونان","Greece","إندونيسيا","Indonesia","كندا","Canada","جزيرة رودس تقع في اليونان.","Rhodes is in Greece."],
  ["ما عاصمة الإمارات؟","What is the capital of United Arab Emirates?","أبو ظبي","Abu Dhabi","مدريد","Madrid","إسلام آباد","Islamabad","أبو ظبي هي عاصمة الإمارات.","Abu Dhabi is the capital of United Arab Emirates."],
  ["في أي بلد تقع بحيرة سيفان؟","In which country is Lake Sevan?","أرمينيا","Armenia","المجر","Hungary","الولايات المتحدة","United States","بحيرة سيفان تقع في أرمينيا.","Lake Sevan is in Armenia."],
  ["ما عاصمة الكويت؟","What is the capital of Kuwait?","مدينة الكويت","Kuwait City","لشبونة","Lisbon","نيودلهي","New Delhi","مدينة الكويت هي عاصمة الكويت.","Kuwait City is the capital of Kuwait."],
  ["في أي بلد يقع نهر إيبرو؟","In which country is Ebro?","إسبانيا","Spain","ميانمار","Myanmar","البرازيل","Brazil","نهر إيبرو يقع في إسبانيا.","Ebro is in Spain."],
  ["في أي بلد يقع أهرامات الجيزة؟","In which country is Pyramids of Giza?","مصر","Egypt","فنلندا","Finland","لبنان","Lebanon","أهرامات الجيزة يقع في مصر.","Pyramids of Giza is in Egypt."],
  ["ما عاصمة تركيا؟","What is the capital of Türkiye?","أنقرة","Ankara","بروكسل","Brussels","كاتماندو","Kathmandu","أنقرة هي عاصمة تركيا.","Ankara is the capital of Türkiye."],
  ["في أي بلد يقع جبل توبقال؟","In which country is Toubkal?","المغرب","Morocco","الإكوادور","Ecuador","إندونيسيا","Indonesia","جبل توبقال يقع في المغرب.","Toubkal is in Morocco."],
  ["ما عاصمة اليونان؟","What is the capital of Greece?","أثينا","Athens","أمستردام","Amsterdam","دكا","Dhaka","أثينا هي عاصمة اليونان.","Athens is the capital of Greece."],
  ["في أي بلد تقع جزيرة مايوركا؟","In which country is Mallorca?","إسبانيا","Spain","الفلبين","Philippines","إندونيسيا","Indonesia","جزيرة مايوركا تقع في إسبانيا.","Mallorca is in Spain."],
  ["في أي بلد تقع بحيرة توبا؟","In which country is Lake Toba?","إندونيسيا","Indonesia","اليابان","Japan","كينيا","Kenya","بحيرة توبا تقع في إندونيسيا.","Lake Toba is in Indonesia."],
  ["ما عاصمة بلغاريا؟","What is the capital of Bulgaria?","صوفيا","Sofia","دبلن","Dublin","تيمفو","Thimphu","صوفيا هي عاصمة بلغاريا.","Sofia is the capital of Bulgaria."],
  ["في أي بلد يقع نهر الفولغا؟","In which country is Volga?","روسيا","Russia","لبنان","Lebanon","إيطاليا","Italy","نهر الفولغا يقع في روسيا.","Volga is in Russia."],
  ["ما عاصمة رومانيا؟","What is the capital of Romania?","بوخارست","Bucharest","لندن","London","بكين","Beijing","بوخارست هي عاصمة رومانيا.","Bucharest is the capital of Romania."],
  ["في أي بلد يقع تمثال الحرية؟","In which country is Statue of Liberty?","الولايات المتحدة","United States","هولندا","Netherlands","إندونيسيا","Indonesia","تمثال الحرية يقع في الولايات المتحدة.","Statue of Liberty is in United States."],
  ["في أي بلد يقع جبل دينالي؟","In which country is Denali?","الولايات المتحدة","United States","إيطاليا","Italy","كوريا الجنوبية","South Korea","جبل دينالي يقع في الولايات المتحدة.","Denali is in United States."],
  ["ما عاصمة صربيا؟","What is the capital of Serbia?","بلغراد","Belgrade","أوسلو","Oslo","طوكيو","Tokyo","بلغراد هي عاصمة صربيا.","Belgrade is the capital of Serbia."],
  ["في أي بلد تقع جزيرة تينيريفي؟","In which country is Tenerife?","إسبانيا","Spain","كوريا الجنوبية","South Korea","اليمن","Yemen","جزيرة تينيريفي تقع في إسبانيا.","Tenerife is in Spain."],
  ["ما عاصمة كرواتيا؟","What is the capital of Croatia?","زغرب","Zagreb","ستوكهولم","Stockholm","سيول","Seoul","زغرب هي عاصمة كرواتيا.","Zagreb is the capital of Croatia."],
  ["في أي بلد تقع بحيرة بيوا؟","In which country is Lake Biwa?","اليابان","Japan","كندا","Canada","نيوزيلندا","New Zealand","بحيرة بيوا تقع في اليابان.","Lake Biwa is in Japan."],
  ["في أي بلد ينبع نهر الدانوب؟","In which country does the Danube originate?","ألمانيا","Germany","النمسا","Austria","المجر","Hungary","ينبع نهر الدانوب في ألمانيا.","The Danube originates in Germany."],
  ["ما عاصمة سلوفينيا؟","What is the capital of Slovenia?","ليوبليانا","Ljubljana","هلسنكي","Helsinki","أولان باتور","Ulaanbaatar","ليوبليانا هي عاصمة سلوفينيا.","Ljubljana is the capital of Slovenia."],
  ["في أي بلد يقع برج سي إن؟","In which country is CN Tower?","كندا","Canada","رومانيا","Romania","السويد","Sweden","برج سي إن يقع في كندا.","CN Tower is in Canada."],
  ["في أي بلد يقع جبل أكونكاغوا؟","In which country is Aconcagua?","الأرجنتين","Argentina","الولايات المتحدة","United States","اليابان","Japan","جبل أكونكاغوا يقع في الأرجنتين.","Aconcagua is in Argentina."],
  ["ما عاصمة البوسنة والهرسك؟","What is the capital of Bosnia and Herzegovina?","سراييفو","Sarajevo","كوبنهاغن","Copenhagen","بانكوك","Bangkok","سراييفو هي عاصمة البوسنة والهرسك.","Sarajevo is the capital of Bosnia and Herzegovina."],
  ["في أي بلد تقع جزيرة ماديرا؟","In which country is Madeira?","البرتغال","Portugal","تنزانيا","Tanzania","إيطاليا","Italy","جزيرة ماديرا تقع في البرتغال.","Madeira is in Portugal."],
  ["ما عاصمة الجبل الأسود؟","What is the capital of Montenegro?","بودغوريتسا","Podgorica","ريكيافيك","Reykjavik","هانوي","Hanoi","بودغوريتسا هي عاصمة الجبل الأسود.","Podgorica is the capital of Montenegro."],
  ["في أي بلد تقع بحيرة تاوبو؟","In which country is Lake Taupo?","نيوزيلندا","New Zealand","الولايات المتحدة","United States","إيطاليا","Italy","بحيرة تاوبو تقع في نيوزيلندا.","Lake Taupo is in New Zealand."],
  ["في أي بلد يقع نهر يانغتسي؟","In which country is Yangtze?","الصين","China","كندا","Canada","اليونان","Greece","نهر يانغتسي يقع في الصين.","Yangtze is in China."],
  ["ما عاصمة مقدونيا الشمالية؟","What is the capital of North Macedonia?","سكوبيه","Skopje","تالين","Tallinn","بنوم بنه","Phnom Penh","سكوبيه هي عاصمة مقدونيا الشمالية.","Skopje is the capital of North Macedonia."],
  ["في أي بلد يقع دار أوبرا سيدني؟","In which country is Sydney Opera House?","أستراليا","Australia","كرواتيا","Croatia","المملكة المتحدة","United Kingdom","دار أوبرا سيدني يقع في أستراليا.","Sydney Opera House is in Australia."],
  ["ما عاصمة النمسا؟","What is the capital of Austria?","فيينا","Vienna","ريغا","Riga","فيينتيان","Vientiane","فيينا هي عاصمة النمسا.","Vienna is the capital of Austria."],
  ["في أي بلد يقع جبل كوسيوسكو؟","In which country is Kosciuszko?","أستراليا","Australia","التشيك","Czechia","الولايات المتحدة","United States","جبل كوسيوسكو يقع في أستراليا.","Kosciuszko is in Australia."],
  ["في أي بلد تقع جزيرة ساو ميغيل؟","In which country is São Miguel?","البرتغال","Portugal","تشيلي","Chile","كندا","Canada","جزيرة ساو ميغيل تقع في البرتغال.","São Miguel is in Portugal."],
  ["ما عاصمة المجر؟","What is the capital of Hungary?","بودابست","Budapest","فيلنيوس","Vilnius","مانيلا","Manila","بودابست هي عاصمة المجر.","Budapest is the capital of Hungary."],
  ["أي قارة تضم جبال الأنديز؟","On which continent are the Andes?","أمريكا الجنوبية","South America","أفريقيا","Africa","أوروبا","Europe","تمتد جبال الأنديز على طول غرب أمريكا الجنوبية.","The Andes stretch along western South America."],
  ["ما عاصمة التشيك؟","What is the capital of Czechia?","براغ","Prague","كييف","Kyiv","كوالالمبور","Kuala Lumpur","براغ هي عاصمة التشيك.","Prague is the capital of Czechia."],
  ["في أي بلد يقع النهر الأصفر؟","In which country is Yellow River?","الصين","China","نيوزيلندا","New Zealand","كندا","Canada","النهر الأصفر يقع في الصين.","Yellow River is in China."],
  ["في أي بلد يقع برج خليفة؟","In which country is Burj Khalifa?","الإمارات","United Arab Emirates","فرنسا","France","إيطاليا","Italy","برج خليفة يقع في الإمارات.","Burj Khalifa is in United Arab Emirates."],
  ["ما عاصمة سلوفاكيا؟","What is the capital of Slovakia?","براتيسلافا","Bratislava","كيشيناو","Chisinau","كانبيرا","Canberra","براتيسلافا هي عاصمة سلوفاكيا.","Bratislava is the capital of Slovakia."],
  ["في أي بلد يقع جبل كوك؟","In which country is Aoraki / Mount Cook?","نيوزيلندا","New Zealand","كينيا","Kenya","إندونيسيا","Indonesia","جبل كوك يقع في نيوزيلندا.","Aoraki / Mount Cook is in New Zealand."],
  ["في أي بلد تقع جزيرة فانكوفر؟","In which country is Vancouver Island?","كندا","Canada","الولايات المتحدة","United States","اليونان","Greece","جزيرة فانكوفر تقع في كندا.","Vancouver Island is in Canada."],
  ["ما عاصمة بولندا؟","What is the capital of Poland?","وارسو","Warsaw","مينسك","Minsk","ويلينغتون","Wellington","وارسو هي عاصمة بولندا.","Warsaw is the capital of Poland."],
  ["في أي بلد تقع بحيرة وينيبغ؟","In which country is Lake Winnipeg?","كندا","Canada","تركيا","Türkiye","نيوزيلندا","New Zealand","بحيرة وينيبغ تقع في كندا.","Lake Winnipeg is in Canada."],
  ["ما عاصمة إسبانيا؟","What is the capital of Spain?","مدريد","Madrid","موسكو","Moscow","واشنطن","Washington, D.C.","مدريد هي عاصمة إسبانيا.","Madrid is the capital of Spain."],
  ["في أي بلد يقع نهر شينانو؟","In which country is Shinano?","اليابان","Japan","البرازيل","Brazil","بولندا","Poland","نهر شينانو يقع في اليابان.","Shinano is in Japan."],
  ["في أي بلد يقع أنغكور وات؟","In which country is Angkor Wat?","كمبوديا","Cambodia","الصين","China","كندا","Canada","أنغكور وات يقع في كمبوديا.","Angkor Wat is in Cambodia."],
  ["ما عاصمة البرتغال؟","What is the capital of Portugal?","لشبونة","Lisbon","تبليسي","Tbilisi","مكسيكو سيتي","Mexico City","لشبونة هي عاصمة البرتغال.","Lisbon is the capital of Portugal."],
  ["في أي بلد يقع جبل إلبروس؟","In which country is Elbrus?","روسيا","Russia","إيطاليا","Italy","الولايات المتحدة","United States","جبل إلبروس يقع في روسيا.","Elbrus is in Russia."],
  ["ما عاصمة بلجيكا؟","What is the capital of Belgium?","بروكسل","Brussels","يريفان","Yerevan","هافانا","Havana","بروكسل هي عاصمة بلجيكا.","Brussels is the capital of Belgium."],
  ["في أي بلد تقع جزيرة بافن؟","In which country is Baffin Island?","كندا","Canada","نيوزيلندا","New Zealand","الولايات المتحدة","United States","جزيرة بافن تقع في كندا.","Baffin Island is in Canada."],
  ["في أي بلد تقع بحيرة الدب العظيم؟","In which country is Great Bear Lake?","كندا","Canada","اليابان","Japan","السويد","Sweden","بحيرة الدب العظيم تقع في كندا.","Great Bear Lake is in Canada."],
  ["ما عاصمة هولندا؟","What is the capital of Netherlands?","أمستردام","Amsterdam","باكو","Baku","كينغستون","Kingston","أمستردام هي عاصمة هولندا.","Amsterdam is the capital of Netherlands."],
  ["في أي بلد ينبع نهر النيل الأزرق؟","In which country does the Blue Nile originate?","إثيوبيا","Ethiopia","مصر","Egypt","السودان","Sudan","ينبع نهر النيل الأزرق في إثيوبيا.","The Blue Nile originates in Ethiopia."],
  ["ما عاصمة أيرلندا؟","What is the capital of Ireland?","دبلن","Dublin","طهران","Tehran","برازيليا","Brasilia","دبلن هي عاصمة أيرلندا.","Dublin is the capital of Ireland."],
  ["في أي بلد يقع الأكروبوليس؟","In which country is Acropolis of Athens?","اليونان","Greece","الولايات المتحدة","United States","المملكة المتحدة","United Kingdom","الأكروبوليس يقع في اليونان.","Acropolis of Athens is in Greece."],
  ["في أي بلد يقع جبل أرارات؟","In which country is Mount Ararat?","تركيا","Türkiye","الأرجنتين","Argentina","اليابان","Japan","جبل أرارات يقع في تركيا.","Mount Ararat is in Türkiye."],
  ["ما عاصمة المملكة المتحدة؟","What is the capital of United Kingdom?","لندن","London","إسلام آباد","Islamabad","بوينس آيرس","Buenos Aires","لندن هي عاصمة المملكة المتحدة.","London is the capital of United Kingdom."],
  ["في أي بلد تقع جزيرة نيوفاوندلاند؟","In which country is Newfoundland?","كندا","Canada","إندونيسيا","Indonesia","الفلبين","Philippines","جزيرة نيوفاوندلاند تقع في كندا.","Newfoundland is in Canada."],
  ["ما عاصمة النرويج؟","What is the capital of Norway?","أوسلو","Oslo","نيودلهي","New Delhi","سانتياغو","Santiago","أوسلو هي عاصمة النرويج.","Oslo is the capital of Norway."],
  ["في أي بلد تقع بحيرة الملح الكبرى؟","In which country is Great Salt Lake?","الولايات المتحدة","United States","كندا","Canada","تركيا","Türkiye","بحيرة الملح الكبرى تقع في الولايات المتحدة.","Great Salt Lake is in United States."],
  ["في أي بلد يقع نهر هان؟","In which country is Han River (Seoul)?","كوريا الجنوبية","South Korea","النرويج","Norway","فرنسا","France","نهر هان يقع في كوريا الجنوبية.","Han River (Seoul) is in South Korea."],
  ["ما عاصمة السويد؟","What is the capital of Sweden?","ستوكهولم","Stockholm","كاتماندو","Kathmandu","ليما","Lima","ستوكهولم هي عاصمة السويد.","Stockholm is the capital of Sweden."],
  ["في أي بلد يقع قصر الحمراء؟","In which country is Alhambra?","إسبانيا","Spain","الإمارات","United Arab Emirates","العراق","Iraq","قصر الحمراء يقع في إسبانيا.","Alhambra is in Spain."],
  ["في أي بلد يقع جبل تيدي؟","In which country is Teide?","إسبانيا","Spain","روسيا","Russia","الولايات المتحدة","United States","جبل تيدي يقع في إسبانيا.","Teide is in Spain."],
  ["ما عاصمة فنلندا؟","What is the capital of Finland?","هلسنكي","Helsinki","دكا","Dhaka","بوغوتا","Bogota","هلسنكي هي عاصمة فنلندا.","Helsinki is the capital of Finland."],
  ["في أي بلد تقع جزيرة أواهو؟","In which country is Oahu?","الولايات المتحدة","United States","كندا","Canada","البرتغال","Portugal","جزيرة أواهو تقع في الولايات المتحدة.","Oahu is in United States."],
  ["ما عاصمة الدنمارك؟","What is the capital of Denmark?","كوبنهاغن","Copenhagen","تيمفو","Thimphu","كيتو","Quito","كوبنهاغن هي عاصمة الدنمارك.","Copenhagen is the capital of Denmark."],
  ["في أي بلد يقع نهر تشاو فرايا؟","In which country is Chao Phraya?","تايلاند","Thailand","المملكة المتحدة","United Kingdom","ميانمار","Myanmar","نهر تشاو فرايا يقع في تايلاند.","Chao Phraya is in Thailand."],
  ["في أي بلد يقع برج بيزا؟","In which country is Leaning Tower of Pisa?","إيطاليا","Italy","سوريا","Syria","بلغاريا","Bulgaria","برج بيزا يقع في إيطاليا.","Leaning Tower of Pisa is in Italy."],
  ["ما عاصمة آيسلندا؟","What is the capital of Iceland?","ريكيافيك","Reykjavik","بكين","Beijing","مونتيفيديو","Montevideo","ريكيافيك هي عاصمة آيسلندا.","Reykjavik is the capital of Iceland."],
  ["في أي بلد يقع جبل هكلا؟","In which country is Hekla?","آيسلندا","Iceland","إندونيسيا","Indonesia","الفلبين","Philippines","جبل هكلا يقع في آيسلندا.","Hekla is in Iceland."],
  ["ما عاصمة إستونيا؟","What is the capital of Estonia?","تالين","Tallinn","طوكيو","Tokyo","أسونسيون","Asuncion","تالين هي عاصمة إستونيا.","Tallinn is the capital of Estonia."],
  ["في أي بلد تقع جزيرة كودياك؟","In which country is Kodiak?","الولايات المتحدة","United States","إندونيسيا","Indonesia","الفلبين","Philippines","جزيرة كودياك تقع في الولايات المتحدة.","Kodiak is in United States."],
  ["في أي بلد يقع نهر إيراوادي؟","In which country is Irrawaddy?","ميانمار","Myanmar","إسبانيا","Spain","كندا","Canada","نهر إيراوادي يقع في ميانمار.","Irrawaddy is in Myanmar."],
  ["ما عاصمة لاتفيا؟","What is the capital of Latvia?","ريغا","Riga","سيول","Seoul","كاراكاس","Caracas","ريغا هي عاصمة لاتفيا.","Riga is the capital of Latvia."],
  ["في أي بلد يقع ساعة بيغ بن؟","In which country is Big Ben?","المملكة المتحدة","United Kingdom","ماليزيا","Malaysia","تركيا","Türkiye","ساعة بيغ بن يقع في المملكة المتحدة.","Big Ben is in United Kingdom."],
  ["ما عاصمة ليتوانيا؟","What is the capital of Lithuania?","فيلنيوس","Vilnius","أولان باتور","Ulaanbaatar","نيروبي","Nairobi","فيلنيوس هي عاصمة ليتوانيا.","Vilnius is the capital of Lithuania."],
  ["في أي بلد يقع جبل ميرابي؟","In which country is Merapi?","إندونيسيا","Indonesia","الإكوادور","Ecuador","الولايات المتحدة","United States","جبل ميرابي يقع في إندونيسيا.","Merapi is in Indonesia."],
  ["في أي بلد تقع جزيرة تسمانيا؟","In which country is Tasmania?","أستراليا","Australia","كندا","Canada","اليونان","Greece","جزيرة تسمانيا تقع في أستراليا.","Tasmania is in Australia."],
  ["ما عاصمة أوكرانيا؟","What is the capital of Ukraine?","كييف","Kyiv","بانكوك","Bangkok","أديس أبابا","Addis Ababa","كييف هي عاصمة أوكرانيا.","Kyiv is the capital of Ukraine."],
  ["في أي بلد يقع نهر سبيرو؟","In which country is Spercheios?","اليونان","Greece","الصين","China","بولندا","Poland","نهر سبيرو يقع في اليونان.","Spercheios is in Greece."],
  ["ما عاصمة مولدوفا؟","What is the capital of Moldova?","كيشيناو","Chisinau","هانوي","Hanoi","أكرا","Accra","كيشيناو هي عاصمة مولدوفا.","Chisinau is the capital of Moldova."],
  ["في أي بلد يقع ستونهنج؟","In which country is Stonehenge?","المملكة المتحدة","United Kingdom","بولندا","Poland","البرازيل","Brazil","ستونهنج يقع في المملكة المتحدة.","Stonehenge is in United Kingdom."],
  ["في أي بلد يقع جبل مايون؟","In which country is Mayon?","الفلبين","Philippines","الولايات المتحدة","United States","اليابان","Japan","جبل مايون يقع في الفلبين.","Mayon is in Philippines."],
  ["ما عاصمة بيلاروس؟","What is the capital of Belarus?","مينسك","Minsk","بنوم بنه","Phnom Penh","أبوجا","Abuja","مينسك هي عاصمة بيلاروس.","Minsk is the capital of Belarus."],
  ["في أي بلد يقع الجزيرة الجنوبية؟","In which country is South Island?","نيوزيلندا","New Zealand","الولايات المتحدة","United States","كندا","Canada","الجزيرة الجنوبية تقع في نيوزيلندا.","South Island is in New Zealand."],
  ["في أي بلد يقع نهر العاصي الأعلى قرب الهرمل؟","In which country is Upper Orontes near Hermel?","لبنان","Lebanon","ميانمار","Myanmar","الصين","China","نهر العاصي الأعلى قرب الهرمل يقع في لبنان.","Upper Orontes near Hermel is in Lebanon."],
  ["ما عاصمة روسيا؟","What is the capital of Russia?","موسكو","Moscow","فيينتيان","Vientiane","داكار","Dakar","موسكو هي عاصمة روسيا.","Moscow is the capital of Russia."],
  ["في أي بلد يقع بوابة براندنبورغ؟","In which country is Brandenburg Gate?","ألمانيا","Germany","ماليزيا","Malaysia","روسيا","Russia","بوابة براندنبورغ يقع في ألمانيا.","Brandenburg Gate is in Germany."],
  ["ما عاصمة جورجيا؟","What is the capital of Georgia?","تبليسي","Tbilisi","مانيلا","Manila","كمبالا","Kampala","تبليسي هي عاصمة جورجيا.","Tbilisi is the capital of Georgia."],
  ["في أي بلد يقع جبل كينابالو؟","In which country is Kinabalu?","ماليزيا","Malaysia","الصين","China","الولايات المتحدة","United States","جبل كينابالو يقع في ماليزيا.","Kinabalu is in Malaysia."],
  ["في أي بلد تقع جزيرة بالي؟","In which country is Bali?","إندونيسيا","Indonesia","اليونان","Greece","الإكوادور","Ecuador","جزيرة بالي تقع في إندونيسيا.","Bali is in Indonesia."],
  ["ما عاصمة أرمينيا؟","What is the capital of Armenia?","يريفان","Yerevan","كوالالمبور","Kuala Lumpur","كيغالي","Kigali","يريفان هي عاصمة أرمينيا.","Yerevan is the capital of Armenia."],
  ["في أي بلد يقع نهر الليطاني؟","In which country is Litani?","لبنان","Lebanon","المغرب","Morocco","الولايات المتحدة","United States","نهر الليطاني يقع في لبنان.","Litani is in Lebanon."],
  ["ما عاصمة أذربيجان؟","What is the capital of Azerbaijan?","باكو","Baku","كانبيرا","Canberra","دودوما","Dodoma","باكو هي عاصمة أذربيجان.","Baku is the capital of Azerbaijan."],
  ["في أي بلد يقع قلعة نويشفانشتاين؟","In which country is Neuschwanstein Castle?","ألمانيا","Germany","بولندا","Poland","ليبيا","Libya","قلعة نويشفانشتاين يقع في ألمانيا.","Neuschwanstein Castle is in Germany."],
  ["في أي بلد يقع جبل تشيمبورازو؟","In which country is Chimborazo?","الإكوادور","Ecuador","اليونان","Greece","النرويج","Norway","جبل تشيمبورازو يقع في الإكوادور.","Chimborazo is in Ecuador."],
  ["ما عاصمة إيران؟","What is the capital of Iran?","طهران","Tehran","ويلينغتون","Wellington","لوساكا","Lusaka","طهران هي عاصمة إيران.","Tehran is the capital of Iran."],
  ["في أي بلد تقع جزيرة جاوة؟","In which country is Java?","إندونيسيا","Indonesia","إسبانيا","Spain","البرتغال","Portugal","جزيرة جاوة تقع في إندونيسيا.","Java is in Indonesia."],
  ["ما عاصمة باكستان؟","What is the capital of Pakistan?","إسلام آباد","Islamabad","واشنطن","Washington, D.C.","هراري","Harare","إسلام آباد هي عاصمة باكستان.","Islamabad is the capital of Pakistan."],
  ["في أي بلد يقع نهر بردى؟","In which country is Barada?","سوريا","Syria","الولايات المتحدة","United States","كندا","Canada","نهر بردى يقع في سوريا.","Barada is in Syria."],
  ["في أي بلد يقع كاتدرائية القديس باسيل؟","In which country is Saint Basil's Cathedral?","روسيا","Russia","إندونيسيا","Indonesia","المملكة المتحدة","United Kingdom","كاتدرائية القديس باسيل يقع في روسيا.","Saint Basil's Cathedral is in Russia."],
  ["ما عاصمة الهند؟","What is the capital of India?","نيودلهي","New Delhi","مكسيكو سيتي","Mexico City","غابورون","Gaborone","نيودلهي هي عاصمة الهند.","New Delhi is the capital of India."],
  ["في أي بلد يقع جبل كوتوباكسي؟","In which country is Cotopaxi?","الإكوادور","Ecuador","المغرب","Morocco","إيطاليا","Italy","جبل كوتوباكسي يقع في الإكوادور.","Cotopaxi is in Ecuador."],
  ["في أي بلد تقع جزيرة سومطرة؟","In which country is Sumatra?","إندونيسيا","Indonesia","كندا","Canada","الولايات المتحدة","United States","جزيرة سومطرة تقع في إندونيسيا.","Sumatra is in Indonesia."],
  ["ما عاصمة نيبال؟","What is the capital of Nepal?","كاتماندو","Kathmandu","هافانا","Havana","ويندهوك","Windhoek","كاتماندو هي عاصمة نيبال.","Kathmandu is the capital of Nepal."],
  ["في أي بلد يقع نهر أبي رقراق؟","In which country is Bou Regreg?","المغرب","Morocco","أستراليا","Australia","النرويج","Norway","نهر أبي رقراق يقع في المغرب.","Bou Regreg is in Morocco."],
  ["ما عاصمة بنغلاديش؟","What is the capital of Bangladesh?","دكا","Dhaka","كينغستون","Kingston","أنتاناناريفو","Antananarivo","دكا هي عاصمة بنغلاديش.","Dhaka is the capital of Bangladesh."],
  ["في أي بلد يقع آيا صوفيا؟","In which country is Hagia Sophia?","تركيا","Türkiye","التشيك","Czechia","المغرب","Morocco","آيا صوفيا يقع في تركيا.","Hagia Sophia is in Türkiye."],
  ["في أي بلد يقع جبل هواسكاران؟","In which country is Huascarán?","بيرو","Peru","إيطاليا","Italy","اليابان","Japan","جبل هواسكاران يقع في بيرو.","Huascarán is in Peru."],
  ["ما عاصمة بوتان؟","What is the capital of Bhutan?","تيمفو","Thimphu","برازيليا","Brasilia","تيرانا","Tirana","تيمفو هي عاصمة بوتان.","Thimphu is the capital of Bhutan."],
  ["في أي بلد تقع جزيرة لوزون؟","In which country is Luzon?","الفلبين","Philippines","اليونان","Greece","إيطاليا","Italy","جزيرة لوزون تقع في الفلبين.","Luzon is in Philippines."],
  ["ما عاصمة الصين؟","What is the capital of China?","بكين","Beijing","بوينس آيرس","Buenos Aires","باريس","Paris","بكين هي عاصمة الصين.","Beijing is the capital of China."],
  ["من أي بحيرة ينبع نهر المسيسيبي؟","Which lake is the source of the Mississippi River?","بحيرة إتاسكا","Lake Itasca","بحيرة ميشيغان","Lake Michigan","بحيرة سوبيريور","Lake Superior","ينبع المسيسيبي من بحيرة إتاسكا في مينيسوتا.","The Mississippi begins at Lake Itasca in Minnesota."],
  ["في أي بلد يقع قلعة الحصن؟","In which country is Krak des Chevaliers?","سوريا","Syria","الدنمارك","Denmark","النمسا","Austria","قلعة الحصن يقع في سوريا.","Krak des Chevaliers is in Syria."],
  ["ما عاصمة اليابان؟","What is the capital of Japan?","طوكيو","Tokyo","سانتياغو","Santiago","روما","Rome","طوكيو هي عاصمة اليابان.","Tokyo is the capital of Japan."],
  ["في أي بلد يقع جبل رينييه؟","In which country is Mount Rainier?","الولايات المتحدة","United States","المملكة المتحدة","United Kingdom","الإكوادور","Ecuador","جبل رينييه يقع في الولايات المتحدة.","Mount Rainier is in United States."],
  ["ما عاصمة كوريا الجنوبية؟","What is the capital of South Korea?","سيول","Seoul","ليما","Lima","برلين","Berlin","سيول هي عاصمة كوريا الجنوبية.","Seoul is the capital of South Korea."],
  ["في أي بلد تقع جزيرة مينداناو؟","In which country is Mindanao?","الفلبين","Philippines","البرتغال","Portugal","كندا","Canada","جزيرة مينداناو تقع في الفلبين.","Mindanao is in Philippines."],
  ["في أي بلد يقع نهر فريزر؟","In which country is Fraser?","كندا","Canada","جورجيا","Georgia","المغرب","Morocco","نهر فريزر يقع في كندا.","Fraser is in Canada."],
  ["ما عاصمة منغوليا؟","What is the capital of Mongolia?","أولان باتور","Ulaanbaatar","بوغوتا","Bogota","أوتاوا","Ottawa","أولان باتور هي عاصمة منغوليا.","Ulaanbaatar is the capital of Mongolia."],
  ["في أي بلد يقع معبد بعلبك؟","In which country is Baalbek temples?","لبنان","Lebanon","فنلندا","Finland","البرتغال","Portugal","معبد بعلبك يقع في لبنان.","Baalbek temples is in Lebanon."],
  ["ما عاصمة تايلاند؟","What is the capital of Thailand?","بانكوك","Bangkok","كيتو","Quito","دمشق","Damascus","بانكوك هي عاصمة تايلاند.","Bangkok is the capital of Thailand."],
  ["في أي بلد يقع جبل سانت هيلينز؟","In which country is Mount St. Helens?","الولايات المتحدة","United States","اليابان","Japan","تنزانيا","Tanzania","جبل سانت هيلينز يقع في الولايات المتحدة.","Mount St. Helens is in United States."],
  ["في أي بلد تقع جزيرة هوكايدو؟","In which country is Hokkaido?","اليابان","Japan","كندا","Canada","أستراليا","Australia","جزيرة هوكايدو تقع في اليابان.","Hokkaido is in Japan."],
  ["ما عاصمة فيتنام؟","What is the capital of Vietnam?","هانوي","Hanoi","مونتيفيديو","Montevideo","بيروت","Beirut","هانوي هي عاصمة فيتنام.","Hanoi is the capital of Vietnam."],
  ["في أي بلد يقع نهر ماكنزي؟","In which country is Mackenzie?","كندا","Canada","فرنسا","France","بولندا","Poland","نهر ماكنزي يقع في كندا.","Mackenzie is in Canada."],
  ["في أي بلد يقع زقورة أور؟","In which country is Ziggurat of Ur?","العراق","Iraq","هولندا","Netherlands","بلغاريا","Bulgaria","زقورة أور يقع في العراق.","Ziggurat of Ur is in Iraq."],
  ["ما عاصمة كمبوديا؟","What is the capital of Cambodia?","بنوم بنه","Phnom Penh","أسونسيون","Asuncion","عمّان","Amman","بنوم بنه هي عاصمة كمبوديا.","Phnom Penh is the capital of Cambodia."],
  ["في أي بلد يقع جبل هالاسان؟","In which country is Hallasan?","كوريا الجنوبية","South Korea","إسبانيا","Spain","الولايات المتحدة","United States","جبل هالاسان يقع في كوريا الجنوبية.","Hallasan is in South Korea."],
  ["ما عاصمة لاوس؟","What is the capital of Laos?","فيينتيان","Vientiane","كاراكاس","Caracas","بغداد","Baghdad","فيينتيان هي عاصمة لاوس.","Vientiane is the capital of Laos."],
  ["في أي بلد تقع جزيرة كيوشو؟","In which country is Kyushu?","اليابان","Japan","الولايات المتحدة","United States","كوريا الجنوبية","South Korea","جزيرة كيوشو تقع في اليابان.","Kyushu is in Japan."],
  ["في أي بلد يقع نهر موراي؟","In which country is Murray?","أستراليا","Australia","إسبانيا","Spain","أيرلندا","Ireland","نهر موراي يقع في أستراليا.","Murray is in Australia."],
  ["ما عاصمة الفلبين؟","What is the capital of Philippines?","مانيلا","Manila","نيروبي","Nairobi","القاهرة","Cairo","مانيلا هي عاصمة الفلبين.","Manila is the capital of Philippines."],
  ["في أي بلد يقع مسجد الحسن الثاني؟","In which country is Hassan II Mosque?","المغرب","Morocco","رومانيا","Romania","الهند","India","مسجد الحسن الثاني يقع في المغرب.","Hassan II Mosque is in Morocco."],
  ["ما عاصمة ماليزيا؟","What is the capital of Malaysia?","كوالالمبور","Kuala Lumpur","أديس أبابا","Addis Ababa","الرباط","Rabat","كوالالمبور هي عاصمة ماليزيا.","Kuala Lumpur is the capital of Malaysia."],
  ["في أي بلد يقع جبل تاي؟","In which country is Mount Tai?","الصين","China","الفلبين","Philippines","اليابان","Japan","جبل تاي يقع في الصين.","Mount Tai is in China."],
  ["في أي بلد تقع جزيرة جيجو؟","In which country is Jeju?","كوريا الجنوبية","South Korea","البرتغال","Portugal","كندا","Canada","جزيرة جيجو تقع في كوريا الجنوبية.","Jeju is in South Korea."],
  ["ما عاصمة أستراليا؟","What is the capital of Australia?","كانبيرا","Canberra","أكرا","Accra","تونس","Tunis","كانبيرا هي عاصمة أستراليا.","Canberra is the capital of Australia."],
  ["في أي بلد يقع نهر وايكاتو؟","In which country is Waikato?","نيوزيلندا","New Zealand","الصين","China","اليابان","Japan","نهر وايكاتو يقع في نيوزيلندا.","Waikato is in New Zealand."],
  ["ما عاصمة نيوزيلندا؟","What is the capital of New Zealand?","ويلينغتون","Wellington","أبوجا","Abuja","الجزائر","Algiers","ويلينغتون هي عاصمة نيوزيلندا.","Wellington is the capital of New Zealand."],
  ["في أي بلد يقع مدرج الجم؟","In which country is El Jem amphitheatre?","تونس","Tunisia","كرواتيا","Croatia","الإمارات","United Arab Emirates","مدرج الجم يقع في تونس.","El Jem amphitheatre is in Tunisia."],
  ["في أي بلد يقع جبل كاتاهدين؟","In which country is Katahdin?","الولايات المتحدة","United States","نيوزيلندا","New Zealand","الصين","China","جبل كاتاهدين يقع في الولايات المتحدة.","Katahdin is in United States."],
  ["ما عاصمة الولايات المتحدة؟","What is the capital of United States?","واشنطن","Washington, D.C.","داكار","Dakar","طرابلس","Tripoli","واشنطن هي عاصمة الولايات المتحدة.","Washington, D.C. is the capital of United States."],
  ["في أي بلد تقع جزيرة سقطرى؟","In which country is Socotra?","اليمن","Yemen","كندا","Canada","إندونيسيا","Indonesia","جزيرة سقطرى تقع في اليمن.","Socotra is in Yemen."],
  ["ما عاصمة المكسيك؟","What is the capital of Mexico?","مكسيكو سيتي","Mexico City","كمبالا","Kampala","الرياض","Riyadh","مكسيكو سيتي هي عاصمة المكسيك.","Mexico City is the capital of Mexico."],
  ["في أي بلد يقع نهر ماغدالينا؟","In which country is Magdalena?","كولومبيا","Colombia","تايلاند","Thailand","لبنان","Lebanon","نهر ماغدالينا يقع في كولومبيا.","Magdalena is in Colombia."],
  ["في أي بلد يقع مدينة لبدة الكبرى؟","In which country is Leptis Magna?","ليبيا","Libya","فرنسا","France","ألمانيا","Germany","مدينة لبدة الكبرى يقع في ليبيا.","Leptis Magna is in Libya."],
  ["ما عاصمة كوبا؟","What is the capital of Cuba?","هافانا","Havana","كيغالي","Kigali","الدوحة","Doha","هافانا هي عاصمة كوبا.","Havana is the capital of Cuba."],
  ["في أي بلد يقع جبل بن نيفيس؟","In which country is Ben Nevis?","المملكة المتحدة","United Kingdom","الولايات المتحدة","United States","آيسلندا","Iceland","جبل بن نيفيس يقع في المملكة المتحدة.","Ben Nevis is in United Kingdom."],
  ["في أي بلد تقع جزيرة جربة؟","In which country is Djerba?","تونس","Tunisia","أستراليا","Australia","كوريا الجنوبية","South Korea","جزيرة جربة تقع في تونس.","Djerba is in Tunisia."],
  ["ما عاصمة جامايكا؟","What is the capital of Jamaica?","كينغستون","Kingston","دودوما","Dodoma","المنامة","Manama","كينغستون هي عاصمة جامايكا.","Kingston is the capital of Jamaica."],
  ["في أي بلد يقع نهر ساو فرانسيسكو؟","In which country is São Francisco?","البرازيل","Brazil","سوريا","Syria","أيرلندا","Ireland","نهر ساو فرانسيسكو يقع في البرازيل.","São Francisco is in Brazil."],
  ["ما عاصمة البرازيل؟","What is the capital of Brazil?","برازيليا","Brasilia","لوساكا","Lusaka","مسقط","Muscat","برازيليا هي عاصمة البرازيل.","Brasilia is the capital of Brazil."],
  ["في أي بلد يقع تمثال المسيح الفادي؟","In which country is Christ the Redeemer?","البرازيل","Brazil","الصين","China","المغرب","Morocco","تمثال المسيح الفادي يقع في البرازيل.","Christ the Redeemer is in Brazil."],
  ["في أي بلد يقع جبل غالدهوبيغن؟","In which country is Galdhøpiggen?","النرويج","Norway","الولايات المتحدة","United States","كوريا الجنوبية","South Korea","جبل غالدهوبيغن يقع في النرويج.","Galdhøpiggen is in Norway."],
  ["ما عاصمة الأرجنتين؟","What is the capital of Argentina?","بوينس آيرس","Buenos Aires","هراري","Harare","أبو ظبي","Abu Dhabi","بوينس آيرس هي عاصمة الأرجنتين.","Buenos Aires is the capital of Argentina."],
  ["في أي بلد تقع جزيرة زنجبار الرئيسية؟","In which country is Unguja (Zanzibar)?","تنزانيا","Tanzania","إندونيسيا","Indonesia","إيطاليا","Italy","جزيرة زنجبار الرئيسية تقع في تنزانيا.","Unguja (Zanzibar) is in Tanzania."],
  ["ما عاصمة تشيلي؟","What is the capital of Chile?","سانتياغو","Santiago","غابورون","Gaborone","مدينة الكويت","Kuwait City","سانتياغو هي عاصمة تشيلي.","Santiago is the capital of Chile."],
  ["في أي بلد يقع نهر توكانتينس؟","In which country is Tocantins?","البرازيل","Brazil","كندا","Canada","الصين","China","نهر توكانتينس يقع في البرازيل.","Tocantins is in Brazil."],
  ["في أي بلد يقع تشيتشن إيتزا؟","In which country is Chichén Itzá?","المكسيك","Mexico","الولايات المتحدة","United States","التشيك","Czechia","تشيتشن إيتزا يقع في المكسيك.","Chichén Itzá is in Mexico."],
  ["ما عاصمة بيرو؟","What is the capital of Peru?","ليما","Lima","ويندهوك","Windhoek","أنقرة","Ankara","ليما هي عاصمة بيرو.","Lima is the capital of Peru."],
  ["في أي بلد يقع جبل سنيهكا قرب القمة التشيكية؟","In which country is Czech side of Sněžka?","التشيك","Czechia","اليابان","Japan","تنزانيا","Tanzania","جبل سنيهكا قرب القمة التشيكية يقع في التشيك.","Czech side of Sněžka is in Czechia."],
  ["ما عاصمة كولومبيا؟","What is the capital of Colombia?","بوغوتا","Bogota","أنتاناناريفو","Antananarivo","أثينا","Athens","بوغوتا هي عاصمة كولومبيا.","Bogota is the capital of Colombia."],
  ["في أي بلد تقع جزيرة الفصح؟","In which country is Easter Island?","تشيلي","Chile","إيطاليا","Italy","فرنسا","France","جزيرة الفصح تقع في تشيلي.","Easter Island is in Chile."],
  ["في أي بلد يقع نهر فيستولا؟","In which country is Vistula?","بولندا","Poland","كندا","Canada","الصين","China","نهر فيستولا يقع في بولندا.","Vistula is in Poland."],
  ["ما عاصمة الإكوادور؟","What is the capital of Ecuador?","كيتو","Quito","تيرانا","Tirana","صوفيا","Sofia","كيتو هي عاصمة الإكوادور.","Quito is the capital of Ecuador."],
  ["في أي بلد يقع معبد بوروبودور؟","In which country is Borobudur?","إندونيسيا","Indonesia","الإمارات","United Arab Emirates","البرتغال","Portugal","معبد بوروبودور يقع في إندونيسيا.","Borobudur is in Indonesia."],
  ["في أي بلد تقع جزيرة سانتا كروز في غالاباغوس؟","In which country is Santa Cruz, Galápagos?","الإكوادور","Ecuador","كوريا الجنوبية","South Korea","نيوزيلندا","New Zealand","جزيرة سانتا كروز في غالاباغوس تقع في الإكوادور.","Santa Cruz, Galápagos is in Ecuador."],
  ["ما عاصمة أوروغواي؟","What is the capital of Uruguay?","مونتيفيديو","Montevideo","باريس","Paris","بوخارست","Bucharest","مونتيفيديو هي عاصمة أوروغواي.","Montevideo is the capital of Uruguay."],
  ["في أي بلد يقع نهر غلومّا؟","In which country is Glomma?","النرويج","Norway","كولومبيا","Colombia","لبنان","Lebanon","نهر غلومّا يقع في النرويج.","Glomma is in Norway."],
  ["ما عاصمة باراغواي؟","What is the capital of Paraguay?","أسونسيون","Asuncion","روما","Rome","بلغراد","Belgrade","أسونسيون هي عاصمة باراغواي.","Asuncion is the capital of Paraguay."],
  ["في أي بلد يقع برجا بتروناس؟","In which country is Petronas Towers?","ماليزيا","Malaysia","إسبانيا","Spain","البوسنة والهرسك","Bosnia and Herzegovina","برجا بتروناس يقع في ماليزيا.","Petronas Towers is in Malaysia."],
  ["في أي بلد تقع جزيرة تشيلوي؟","In which country is Chiloé?","تشيلي","Chile","إسبانيا","Spain","أستراليا","Australia","جزيرة تشيلوي تقع في تشيلي.","Chiloé is in Chile."],
  ["ما عاصمة فنزويلا؟","What is the capital of Venezuela?","كاراكاس","Caracas","برلين","Berlin","زغرب","Zagreb","كاراكاس هي عاصمة فنزويلا.","Caracas is the capital of Venezuela."],
  ["في أي بلد يقع نهر شانون؟","In which country is Shannon?","أيرلندا","Ireland","بولندا","Poland","نيوزيلندا","New Zealand","نهر شانون يقع في أيرلندا.","Shannon is in Ireland."],
  ["ما عاصمة كينيا؟","What is the capital of Kenya?","نيروبي","Nairobi","أوتاوا","Ottawa","ليوبليانا","Ljubljana","نيروبي هي عاصمة كينيا.","Nairobi is the capital of Kenya."],
  ["في أي بلد يقع قصر شونبرون؟","In which country is Schönbrunn Palace?","النمسا","Austria","المملكة المتحدة","United Kingdom","الصين","China","قصر شونبرون يقع في النمسا.","Schönbrunn Palace is in Austria."],
  ["في أي بلد يقع نهر كورا قرب تبليسي؟","In which country is Kura near Tbilisi?","جورجيا","Georgia","المملكة المتحدة","United Kingdom","إيطاليا","Italy","نهر كورا قرب تبليسي يقع في جورجيا.","Kura near Tbilisi is in Georgia."],
  ["ما عاصمة إثيوبيا؟","What is the capital of Ethiopia?","أديس أبابا","Addis Ababa","دمشق","Damascus","سراييفو","Sarajevo","أديس أبابا هي عاصمة إثيوبيا.","Addis Ababa is the capital of Ethiopia."],
  ["في أي بلد يقع جسر تشارلز؟","In which country is Charles Bridge?","التشيك","Czechia","روسيا","Russia","كمبوديا","Cambodia","جسر تشارلز يقع في التشيك.","Charles Bridge is in Czechia."],
  ["ما عاصمة غانا؟","What is the capital of Ghana?","أكرا","Accra","بيروت","Beirut","بودغوريتسا","Podgorica","أكرا هي عاصمة غانا.","Accra is the capital of Ghana."],
  ["في أي بلد يقع قلعة وارسو الملكية؟","In which country is Royal Castle, Warsaw?","بولندا","Poland","لبنان","Lebanon","ألمانيا","Germany","قلعة وارسو الملكية يقع في بولندا.","Royal Castle, Warsaw is in Poland."],
  ["في أي بلد يقع قلعة بودا؟","In which country is Buda Castle?","المجر","Hungary","تونس","Tunisia","ليبيا","Libya","قلعة بودا يقع في المجر.","Buda Castle is in Hungary."],
  ["ما عاصمة نيجيريا؟","What is the capital of Nigeria?","أبوجا","Abuja","عمّان","Amman","سكوبيه","Skopje","أبوجا هي عاصمة نيجيريا.","Abuja is the capital of Nigeria."],
  ["في أي بلد يقع تمثال حورية البحر الصغيرة؟","In which country is Little Mermaid statue?","الدنمارك","Denmark","المكسيك","Mexico","التشيك","Czechia","تمثال حورية البحر الصغيرة يقع في الدنمارك.","Little Mermaid statue is in Denmark."],
  ["ما عاصمة السنغال؟","What is the capital of Senegal?","داكار","Dakar","بغداد","Baghdad","فيينا","Vienna","داكار هي عاصمة السنغال.","Dakar is the capital of Senegal."],
  ["في أي بلد يقع قاعة مدينة ستوكهولم؟","In which country is Stockholm City Hall?","السويد","Sweden","النمسا","Austria","بلجيكا","Belgium","قاعة مدينة ستوكهولم يقع في السويد.","Stockholm City Hall is in Sweden."],
  ["في أي بلد يقع قلعة أوسلو أكيرشوس؟","In which country is Akershus Fortress?","النرويج","Norway","المجر","Hungary","كرواتيا","Croatia","قلعة أوسلو أكيرشوس يقع في النرويج.","Akershus Fortress is in Norway."],
  ["ما عاصمة أوغندا؟","What is the capital of Uganda?","كمبالا","Kampala","القاهرة","Cairo","بودابست","Budapest","كمبالا هي عاصمة أوغندا.","Kampala is the capital of Uganda."],
  ["في أي بلد يقع قلعة سومينلينا؟","In which country is Suomenlinna?","فنلندا","Finland","النرويج","Norway","بيرو","Peru","قلعة سومينلينا يقع في فنلندا.","Suomenlinna is in Finland."],
  ["في أي بلد يقع برج بيليم؟","In which country is Belém Tower?","البرتغال","Portugal","هولندا","Netherlands","اليونان","Greece","برج بيليم يقع في البرتغال.","Belém Tower is in Portugal."],
  ["ما عاصمة رواندا؟","What is the capital of Rwanda?","كيغالي","Kigali","الرباط","Rabat","براغ","Prague","كيغالي هي عاصمة رواندا.","Kigali is the capital of Rwanda."],
  ["في أي بلد يقع الأتويميوم؟","In which country is Atomium?","بلجيكا","Belgium","رومانيا","Romania","روسيا","Russia","الأتويميوم يقع في بلجيكا.","Atomium is in Belgium."],
  ["ما عاصمة تنزانيا؟","What is the capital of Tanzania?","دودوما","Dodoma","تونس","Tunis","براتيسلافا","Bratislava","دودوما هي عاصمة تنزانيا.","Dodoma is the capital of Tanzania."],
  ["في أي بلد يقع طواحين كيندردايك؟","In which country is Kinderdijk windmills?","هولندا","Netherlands","كرواتيا","Croatia","ليبيا","Libya","طواحين كيندردايك يقع في هولندا.","Kinderdijk windmills is in Netherlands."],
  ["في أي بلد يقع قلعة بلارني؟","In which country is Blarney Castle?","أيرلندا","Ireland","فرنسا","France","بولندا","Poland","قلعة بلارني يقع في أيرلندا.","Blarney Castle is in Ireland."],
  ["ما عاصمة زامبيا؟","What is the capital of Zambia?","لوساكا","Lusaka","الجزائر","Algiers","وارسو","Warsaw","لوساكا هي عاصمة زامبيا.","Lusaka is the capital of Zambia."],
  ["في أي بلد يقع قلعة إدنبرة؟","In which country is Edinburgh Castle?","المملكة المتحدة","United Kingdom","لبنان","Lebanon","التشيك","Czechia","قلعة إدنبرة يقع في المملكة المتحدة.","Edinburgh Castle is in United Kingdom."],
  ["ما عاصمة زيمبابوي؟","What is the capital of Zimbabwe?","هراري","Harare","طرابلس","Tripoli","مدريد","Madrid","هراري هي عاصمة زيمبابوي.","Harare is the capital of Zimbabwe."],
  ["في أي بلد يقع قلعة بران؟","In which country is Bran Castle?","رومانيا","Romania","الولايات المتحدة","United States","سلوفينيا","Slovenia","قلعة بران يقع في رومانيا.","Bran Castle is in Romania."],
  ["في أي بلد يقع دير ريلا؟","In which country is Rila Monastery?","بلغاريا","Bulgaria","الإمارات","United Arab Emirates","مصر","Egypt","دير ريلا يقع في بلغاريا.","Rila Monastery is in Bulgaria."],
  ["ما عاصمة بوتسوانا؟","What is the capital of Botswana?","غابورون","Gaborone","الرياض","Riyadh","لشبونة","Lisbon","غابورون هي عاصمة بوتسوانا.","Gaborone is the capital of Botswana."],
  ["في أي بلد يقع جسر موستار القديم؟","In which country is Stari Most?","البوسنة والهرسك","Bosnia and Herzegovina","إسبانيا","Spain","إيطاليا","Italy","جسر موستار القديم يقع في البوسنة والهرسك.","Stari Most is in Bosnia and Herzegovina."],
  ["ما عاصمة ناميبيا؟","What is the capital of Namibia?","ويندهوك","Windhoek","الدوحة","Doha","بروكسل","Brussels","ويندهوك هي عاصمة ناميبيا.","Windhoek is the capital of Namibia."],
  ["في أي بلد يقع قصر دقلديانوس؟","In which country is Diocletian's Palace?","كرواتيا","Croatia","المملكة المتحدة","United Kingdom","تركيا","Türkiye","قصر دقلديانوس يقع في كرواتيا.","Diocletian's Palace is in Croatia."],
  ["في أي بلد يقع قلعة ليوبليانا؟","In which country is Ljubljana Castle?","سلوفينيا","Slovenia","روسيا","Russia","البرازيل","Brazil","قلعة ليوبليانا يقع في سلوفينيا.","Ljubljana Castle is in Slovenia."],
  ["ما عاصمة مدغشقر؟","What is the capital of Madagascar?","أنتاناناريفو","Antananarivo","المنامة","Manama","أمستردام","Amsterdam","أنتاناناريفو هي عاصمة مدغشقر.","Antananarivo is the capital of Madagascar."],
  ["في أي بلد يقع قلعة براتيسلافا؟","In which country is Bratislava Castle?","سلوفاكيا","Slovakia","لبنان","Lebanon","المجر","Hungary","قلعة براتيسلافا يقع في سلوفاكيا.","Bratislava Castle is in Slovakia."]
];
var legacyGeoIds=[0,-1,3,-1,6,-1,8,-1,11,-1,13,-1,16,-1,18,-1,21,-1,24,-1,26,-1,29,-1,31,-1,34,-1,36,-1,39,-1,41,-1,44,-1,47,-1,49,-1,52,-1,54,-1,57,-1,59,-1,62,-1,64,-1,67,-1,70,-1,72,-1,75,-1,77,-1,80,-1,82,-1,85,-1,88,-1,90,-1,93,-1,95,-1,98,-1,100,-1,103,-1,105,-1,108,-1,111,-1,113,-1,116,-1,118,-1,121,-1,123,-1,126,-1,128,-1,131,-1,134,-1,136,-1,139,-1,141,-1,144,-1,146,-1,149,-1,152,-1,154,-1,157,-1,159,-1,162,-1,164,-1,167,-1,169,-1,172,-1,175,-1,177,-1,180,-1,182,-1,185,-1,187,-1,190,-1,192,-1,195,-1,198,-1,200,-1,203,-1,205,-1,208,-1,210,-1,213,-1,216,-1,218,-1,221,-1,223,-1,226,-1,228,-1,231,-1,233,-1,236,-1,239,-1,241,-1,244,-1,246,-1,249,-1,251,-1,254,-1,9,2,5,7,17,-1,25,-1,42,-1,50,-1,58,-1,74,-1,83,-1,91,-1,107,-1,114,-1,120,-1,127,-1,133,-1,140,-1,147,-1,153,-1,160,-1,166,-1,173,-1,179,-1,186,-1,193,-1,199,-1,206,-1,212,-1,217,-1,222,-1,225,-1,4,-1,12,-1,20,-1,28,-1,37,-1,45,-1,53,-1,61,-1,69,-1,78,-1,86,-1,94,-1,102,-1,110,-1,117,-1,124,-1,130,-1,137,-1,143,-1,150,-1,156,-1,163,-1,170,-1,176,-1,183,-1,189,-1,196,-1,202,-1,209,-1,14,-1,22,-1,30,-1,38,-1,46,-1,55,-1,63,-1,71,-1,79,-1,87,-1,96,-1,104,-1,112,-1,119,-1,125,-1,132,-1,138,-1,145,-1,151,-1,158,-1,165,-1,171,-1,178,-1,184,-1,191,-1,197,-1,204,-1,211,-1,215,-1,220,-1,10,-1,19,-1,27,-1,35,-1,43,-1,51,-1,60,-1,68,-1,76,-1,84,-1,92,-1,101,-1,109,-1,115,-1,122,-1,129,-1,135,-1,142,-1,148,-1,155,-1,161,-1,168,-1,174,-1,181,-1,188,-1,194,-1,201,-1,207,-1,214,-1,219,-1,224,-1,227,-1,229,-1,230,-1,232,-1,234,-1,235,-1,237,-1,238,-1,240,-1,242,-1,243,-1,245,-1,247,-1,248,-1,250,-1,252,-1,253,-1,255,-1,15,-1,23,-1,32,-1,40,-1,48,-1,56,-1,65,-1,73,-1,81,-1,89,-1,97,-1,106,-1];
function geoProgress(){
  var c=collectionData();
  if(c.geoTourVersion!==2){
    var old=c.geoCurrent;
    var index=old ? legacyGeoIds[old.id] : -1;
    if(Number.isInteger(index)&&index>=0){
      old.id=index;
      c.geoNextIndex=(index+1)%abuGeoQuestions.length;
    }else{
      c.geoCurrent=null;
      var next=Number.isInteger(c.geoNextIndex)?c.geoNextIndex:0;
      c.geoNextIndex=legacyGeoIds[next]>=0?legacyGeoIds[next]:0;
    }
    c.geoTourVersion=2;
  }
  return c;
}
function geoShuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function geoNext(){if(!state.abu.hired)return;var c=geoProgress();if(!Number.isInteger(c.geoNextIndex))c.geoNextIndex=0;c.geoCurrent={id:c.geoNextIndex%abuGeoQuestions.length,order:geoShuffle([0,1,2]),answer:null};c.geoNextIndex=(c.geoNextIndex+1)%abuGeoQuestions.length;render()}
function geoAnswer(i){var c=geoProgress(),g=c.geoCurrent;if(!state.abu.hired||!g||g.answer!==null)return;g.answer=i;c.geoTotal=(c.geoTotal||0)+1;if(i===0)c.geoCorrect=(c.geoCorrect||0)+1;render()}
function renderAbuGeo(){var panel=$('abuGeoPanel');if(!panel)return;panel.hidden=!state.abu.hired;if(panel.hidden)return;var c=geoProgress(),g=c.geoCurrent,en=state.lang==='en',l=en?1:0;$('abuGeoTitle').textContent=en?'🌍 Around the world with John':'🌍 حول العالم مع أبو وردة';if(!panel.open)return;$('abuGeoScore').textContent=(en?'Correct answers: ':'الإجابات الصحيحة: ')+(c.geoCorrect||0)+' / '+(c.geoTotal||0);$('abuGeoNext').hidden=!!g&&g.answer===null;$('abuGeoNext').textContent=g?(en?'Next question':'السؤال التالي'):(en?'Start quiz':'ابدأ المسابقة');$('abuGeoQuestion').textContent=g?abuGeoQuestions[g.id][l]:(en?'Ready to explore the world?':'لشوف معلوماتك بالجغرافيا يا ابني!');var opts=$('abuGeoOptions');opts.hidden=!g;if(g){var q=abuGeoQuestions[g.id];g.order.forEach(function(k,i){var b=opts.children[i];b.textContent=q[2+k*2+l];b.disabled=g.answer!==null;b.dataset.result=g.answer===null?'':k===0?'correct':g.answer===k?'wrong':'';b.onclick=function(){geoAnswer(k)}})}$('abuGeoFeedback').hidden=!g||g.answer===null;if(g&&g.answer!==null)$('abuGeoFeedback').textContent=(g.answer===0?(en?'Well done! ':'برافو يا ابني! '):(en?'Every day we learn something new. ':'مو مشكلة يا ابني، كل يوم منتعلّم شي جديد. '))+abuGeoQuestions[g.id][8+l]}
$('abuGeoPanel').ontoggle=renderAbuGeo;
$('abuGeoNext').onclick=geoNext;
function render(){financeData();renderCollections();renderFinance();renderAbuGeo();var pot=selectedPot();updateNurseryQuickActions();updateYasminFinancialAid();renderGoal();$('emergencyFertilizer').hidden=state.stock.fertilizer>0||!!state.emergencyFertilizerUsed;updateSky();$('employeesClose').textContent=state.lang==='ar'?'إغلاق':'Close';$('siteBack').textContent=state.lang==='ar'?'رجوع ←':'Back ←';$('daySettings').querySelector('label[for="dayMode"]').textContent=state.lang==='ar'?'🌤️ الوقت والسماء':'🌤️ Time & sky';$('daySettings').querySelector('label[for="weatherMode"]').textContent=state.lang==='ar'?'🌦️ الطقس':'🌦️ Weather';[['dayMode',['Automatic — day cycle','Always day','Always night']],['weatherMode',['Automatic — changing weather','Clear','Rain','Wind']]].forEach(function(x){var labels=state.lang==='en'?x[1]:x[0]==='dayMode'?['تلقائي — دورة اليوم','نهار دائم','ليل دائم']:['تلقائي — طقس متغير','صحو','مطر','ريح'];Array.from($(x[0]).options).forEach(function(o,i){o.textContent=labels[i]})});$('manualCare').hidden=!!state.abu.hired;$('careInfo').hidden=!!state.abu.hired;$('missionPanel').hidden=true;document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==='ar'?'rtl':'ltr';document.title=tr('title');['title','subtitle','moneyLabel','salesLabel','qualityLabel','water','feed','sun','careInfo','buyerTitle','buyerText','sell','shopTitle','shopInfo','missionTitle','missionInfo'].forEach(function(k){$(k).textContent=tr(k)});$('lang').setAttribute('aria-pressed',String(state.lang==='en'));$('chooseArabic').setAttribute('aria-pressed',String(state.lang==='ar'));$('gameFooter').textContent=state.lang==='ar'?'التقدم محفوظ على جهازك · نباتاتك بتكمل نموها وإنت غايب':'Progress saved on your device · Plants keep growing while you’re away';$('topEditNames').textContent=state.lang==='ar'?'⚙️ الإعدادات':'⚙️ Settings';$('settingsNames').textContent=state.lang==='ar'?'أسماء اللعبة':'Game names';$('title').textContent='🌿 '+displayName("gardenName");$('settingsAudio').textContent=state.lang==='ar'?'الصوت':'Audio';$('employeesToggle').textContent=state.lang==='ar'?'إدارة الموظفين':'Manage employees';$('employeesTitle').textContent=state.lang==='ar'?'إدارة الموظفين':'Manage employees';$('yasminSalary').textContent=state.lang==='ar'?'👩🏻‍🌾 المديرة ياسمين — الراتب: لا يوجد راتب دوري؛ تطلب مبالغ للمشتريات أو المكافآت.':'👩🏻‍🌾 Manager Yasmin — no recurring salary; requests funds for supplies or bonuses.';$('yasminEmployeeName').textContent=state.lang==='ar'?'ياسمين':'Yasmin';$('yasminEmployeeDescription').textContent=state.lang==='ar'?'مديرة المشتل':'Nursery manager';$('yasminEmployeeDuty').textContent=state.lang==='ar'?'بتدير المخزون وطلبات الشراء والدعابات وبتتفقد محطة السماد قبل الشراء':'Manages supplies and purchase requests, checks the compost station and tells jokes';$('yasminEmployeeState').textContent=state.lang==='ar'?'● تعمل':'● Working';$('abuEmployeeName').textContent=state.lang==='ar'?'أبو وردة':'John';$('abuEmployeeRole').textContent=state.lang==='ar'?'مسؤول العناية بالنباتات':'Plant caretaker';$('abuEmployeeDuty').textContent=state.lang==='ar'?'بيسقي وبيسمّد وبيشيل الدود، وبيلمّ الأوراق اليابسة وقت يكون عم يشتغل':'Waters, fertilizes, removes pests and gathers fallen leaves while working';$('nanaEmployeeName').textContent=state.lang==='ar'?'نانا':'Nana';$('nanaEmployeeRole').textContent=state.lang==='ar'?'مربّية القطط':'Cat caretaker';$('nanaEmployeeDuty').textContent=state.lang==='ar'?'بتطعم القطة وبتسقيها وبتساعد بتمشيطها واللعب معها':'Feeds and waters the cat, and helps with grooming and play';$('nanaEmployeeSalary').textContent=state.lang==='ar'?'20 عملة كل 3 مبيعات':'20 coins every 3 sales';$('nanaEmployeeState').textContent=state.lang==='ar'?(state.nana.hired?(state.nana.paused?'● متوقفة مؤقتاً':'● تعمل'):'○ غير موظفة'):(state.nana.hired?(state.nana.paused?'● Paused':'● Working'):'○ Not hired');$('abuSalary').textContent=state.lang==='ar'?'👨‍🌾 مسؤول المشتل أبو وردة — الراتب: 15 عملة كل 3 مبيعات. الحالة: '+(state.abu.hired?(state.abu.paused?'متوقف':'يعمل'):'غير موظف'):'👨‍🌾 Nursery manager John — 15 coins every 3 sales. Status: '+(state.abu.hired?(state.abu.paused?'paused':'working'):'not hired');$('restartGame').textContent=state.lang==='ar'?'🔄 إعادة اللعبة من البداية':'🔄 Restart game';$('money').textContent='💰 '+state.money;$('sales').textContent=state.sales;$('quality').textContent=pot.quality+'%';$('qualityReason').textContent=pot.qualityCause||(state.lang==='ar'?'الجودة ممتازة، ما في ضرر مسجّل.':'Excellent quality; no recorded damage.');var crop=crops[pot.kind];$('cropName').textContent=pot.active?crop[state.lang]:'—';$('growth').style.width=pot.progress+'%';$('pct').textContent=Math.floor(pot.progress)+'%';$('stage').textContent=pot.active?crop.stages[state.lang][window.YasmineGardenCore.stageFor(pot.progress)]:'—';var remaining=Math.max(0,Math.ceil(crop.time*(100-pot.progress)/100));$('clock').textContent='⏱ '+String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');var ready=pot.active&&pot.progress>=100;$('sell').disabled=!ready;var price=Math.round(crop.price*(.5+pot.quality/200)*(state.sales<ECONOMY_CONFIG.starterSales?1+ECONOMY_CONFIG.starterBonus:1));$('offer').hidden=!ready;$('offer').textContent=ready?'💰 '+price:'';$('buyerText').textContent=ready?tr('ready'):tr('buyerText');['water','feed','sun'].forEach(function(k){$(k).disabled=!pot.active||ready||Date.now()-last[k]<5000});$('mission').textContent=state.sales>=3?tr('won'):tr('mission')+' ('+state.sales+'/3)';renderSeedShop(pot);renderPlots();renderUpgrade();renderCat();renderStaff();renderNurseryNotice();updateAudioButtons();renderCatEnergy();window.YasmineCompost.render(state,{state:()=>state,save,render,charge:financeMove,open:()=>{activeArea='nursery';render()},potAlerts:()=>nurseryPots().filter(p=>!p.active||isReady(p)).length});save()}
function buy(k){advancePlantClock(Date.now());var c=crops[k],pot=selectedPot();if(!c || window.YasmineGardenCore.levelFor(state.sales)<c.level)return;if(pot.active){msg(tr('busy'));return}if(state.money<c.cost){msg(tr('need'));return}financeMove(-c.cost,'seeds');state.dismissedEmpty=false;pot.kind=k;pot.progress=0;pot.quality=100;pot.qualityCause='';pot.care=0;pot.active=true;var empty=nurseryPots().findIndex(p=>!p.active);if(empty>=0)state.selectedPot=empty;msg(tr('plant')+c[state.lang]);sound('plant');render()}
$('buyFertilizerDirect').onclick=function(){if(state.money<10)return;financeMove(-10,'fertilizer');state.stock.fertilizer+=5;save();render();msg(state.lang==='ar'?'اشتريت 5 وحدات سماد.':'Bought 5 fertilizer portions.');sound('purchase')};$('emergencyFertilizer').onclick=function(){if(state.stock.fertilizer>0||state.emergencyFertilizerUsed)return;state.stock.fertilizer=2;state.emergencyFertilizerUsed=true;save();render();msg(state.lang==='ar'?'حصلت على وحدتين سماد مجاناً!':'You received two free fertilizer portions!')};function care(k){if(state.abu.hired){msg(state.lang==='ar'?'أبو وردة مسؤول عن السقاية والتسميد تلقائياً.':'John handles watering and fertilizer automatically.');return}if(!state.active||state.progress>=100||Date.now()-last[k]<5000)return;if(k==='feed'){if(state.stock.fertilizer<=0){msg(state.lang==='ar'?'السماد خلص! اشتري سماد من زر الشراء بقسم ياسمين، حتى قبل توظيفها.':'Fertilizer is empty! Ask Yasmin to restock.');if(state.staff.hired){state.staff.rejectedStock={};state.staff.request='fertilizer'}render();return}state.stock.fertilizer--}last[k]=Date.now();state.care++;state.progress=Math.min(100,state.progress+3.2);if(state.care%7===0){state.quality=Math.max(30,state.quality-3);state.qualityCause=state.lang==='ar'?'عناية زائدة بالنبتة: ناقص 3%':'Excessive care: -3%';msg(tr('over'))}else msg(tr(k==='water'?'waterMsg':k==='feed'?'feedMsg':'sunMsg'));sound(k);render()}
function sell(){var pot=selectedPot();if(!pot.active||pot.progress<100)return;recordCollections();var amount=salePrice(pot);financeMove(amount,'sales');window.YasmineCompost.add(state,'scraps');state.sales++;financeWage();pot.eventEarned=0;state.eventCycleSales=state.sales;if(state.abu.hired){state.abu.paidSales++;if(state.abu.paidSales>=3){state.abu.paidSales=0;if(state.money>=15)financeMove(-15,'salary');else state.abu.paused=true}}if(state.nana.hired){state.nana.paidSales++;if(state.nana.paidSales>=3){state.nana.paidSales=0;if(state.money>=20)financeMove(-20,'salary');else state.nana.paused=true}}if(ev&&eventPot===(state.selectedPot||0)){clearTimeout(evTimeout);ev=null;$('event').hidden=true}pot.active=false;pot.collectionRecorded=false;pot.progress=0;msg(tr('sold')+'💰 '+amount);sound('sell');render()}
function eventBudget(pot){var price=crops[pot.kind].price*(.5+pot.quality/200);return Math.max(0,Math.floor(price*ECONOMY_CONFIG.eventSaleCap)-pot.eventEarned)}
function awardEvent(amount){var pot=potAt(eventPot);var n=Math.min(amount,eventBudget(pot));if(n>0){financeMove(n,'events');pot.eventEarned+=n;state.extraEarned+=n}return n}
var eventPot=0,eventNext=Date.now()+ECONOMY_CONFIG.eventMinMs,eventTaps=0;
function scheduleEvent(){eventNext=Date.now()+ECONOMY_CONFIG.eventMinMs+Math.random()*(ECONOMY_CONFIG.eventMaxMs-ECONOMY_CONFIG.eventMinMs)}
function eventSpawn(){var pot=selectedPot();if(!pot.active||pot.progress>=100||ev||activeArea!=='nursery'||document.hidden||document.querySelector('dialog[open],#catSheetOverlay:not([hidden])')||settingsOpen)return;eventPot=state.selectedPot||0;ev=Math.random()<.5?'dew':'pest';eventTaps=0;var b=$('event');b.hidden=false;b.dataset.kind=ev;b.textContent='';b.removeAttribute('data-left');
 b.setAttribute('aria-label',ev==='dew'?(state.lang==='ar'?'اجمع الندى':'Collect dew'):(state.lang==='ar'?'أزل الدودة':'Remove worm'));
 const leaf=$('plot'+eventPot).querySelector('.foliage').getBoundingClientRect(), frame=$('scene').getBoundingClientRect();
 b.style.left=((leaf.left+leaf.width*.54-frame.left)/frame.width*100)+'%';
 b.style.top=((leaf.top+leaf.height*.52-frame.top)/frame.height*100)+'%';
 evTimeout=setTimeout(function(){if(!ev)return;if(ev==='pest'){pot.quality=Math.max(30,pot.quality-ECONOMY_CONFIG.pestQualityLoss);pot.qualityCause=state.lang==='ar'?'دودة: ناقص 2%':'Worm: -2%'}ev=null;b.hidden=true;render()},ECONOMY_CONFIG.eventDurationMs)}
$('event').onclick=function(){if(!ev)return;var type=ev;if(type==='pest'&&++eventTaps<ECONOMY_CONFIG.pestTaps){$('event').dataset.left=String(ECONOMY_CONFIG.pestTaps-eventTaps);return}clearTimeout(evTimeout);var reward=awardEvent(ECONOMY_CONFIG.eventRewards[type]);msg((state.lang==='ar'?'مكافأة الحدث: +':'Event reward: +')+reward);sound(type==='pest'?'pest':'water');ev=null;$('event').hidden=true;render()};
['water','feed','sun'].forEach(function(k){$(k).onclick=function(){care(k)}});$('sell').onclick=sell;function chooseLanguage(language){state.lang=language;history.replaceState(null,'',location.pathname+(state.lang==='en'?'?lang=en':''));render()};$('lang').onclick=()=>chooseLanguage('en');$('chooseArabic').onclick=()=>chooseLanguage('ar');$('reset').onclick=function(){if(confirm(state.lang==='ar'?'متأكد بدك تعيد اللعبة من البداية؟ رح تنمسح كل المصاري والمبيعات والأسماء والقطة وتوظيف ياسمين.':'Restart from scratch? All coins, sales, names, cat and Yasmin progress will be erased.')){state={gameEpoch:Date.now(),dayMode:'auto',weatherMode:'auto',catTreats:0,catSpy:{status:'idle',report:'',end:0},catHunt:{status:'idle',end:0},catItems:{},catEquipped:{},gardenName:'حديقة السعادة',dismissedEmpty:false,money:50,sales:0,kind:'jasmine',progress:0,quality:100,care:0,active:true,lang:state.lang,cat:freshCat(),nurseryName:'مشتل الياسمينة',catName:'مشمش',namesSet:false,stock:{fertilizer:4,catfood:3},staff:{hired:false,mood:60,request:null,dialogue:''},abu:{hired:false,paidSales:0,paused:false,lastCare:0},nana:{hired:false,paidSales:0,paused:false,lastCare:0,lastWarn:0,dialogueIndex:0,action:''},eventEarned:0,eventCycleSales:0,extraEarned:0,catHuntLast:0,catCoinTimes:[],catEmergencyBill:0,catFoodEmergencyNotice:false};catLast={};catMessage=null;catSeconds=0;catBusyUntil=0;nanaCareUntil=0;catDrinking=false;graceSample=null;clearTimeout(catCareTimer);editingNames=false;settingsOpen=false;audioPanelOpen=false;jokeAwaitingRating=false;activeArea='nursery';lastNotificationCount=0;lastTick=Date.now();last={water:0,feed:0,sun:0};clearTimeout(catAnimationTimer);clearTimeout(evTimeout);ev=null;$('event').hidden=true;delete $('catScene').dataset.action;$('catScene').classList.remove('is-napping');try{localStorage.removeItem(key)}catch(e){}msg('');render()}};

/* Mimi: petting, treats and playful inspection of John's nursery work. */
if(typeof state.catTreats!=='number')state.catTreats=0;
if(!state.catSpy||typeof state.catSpy!=='object')state.catSpy={status:'idle',report:'',end:0};
function purrCat(){
 if(state.cat.away||state.cat.sleeping)return;
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
 $('catMessage').textContent=state.lang==='ar'?'🐱 خرررر... '+displayName("catName")+' مبسوطة بالدلع!':'🐱 Purrrr... '+displayName("catName")+' loves being petted!';
 save();
}
$('catScene').style.cursor='pointer';
$('catScene').setAttribute('role','button');
$('catScene').setAttribute('tabindex','0');
$('catScene').addEventListener('click',purrCat);
$('catScene').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();purrCat()}});
$('catTreatBuy').onclick=function(){
 if(state.money<10)return;
 buyCatItem({id:'treat',cost:10,ar:'🍬 3 حبات مكافأة',en:'🍬 3 treats'});
};
$('caseClose').onclick=function(){state.catSpy.dismissed=true;save();render();};
$('catSpy').onclick=function(){
 if(state.cat.sleeping||Date.now()<catBusyUntil||state.cat.away||state.catSpy.status==='running'||!state.abu.hired||Date.now()<(Number(state.catSpy.cooldownUntil)||0))return;
 $('catMissions').open=false;
 state.catSpy={status:'running',report:'',end:Date.now()+8000,cooldownUntil:Date.now()+8000+120000};
 activeArea='nursery';sound('notify');save();render();
 updateSpyScene();$('scene').scrollIntoView({behavior:'smooth',block:'center'});
};
$('catTreatReward').onclick=function(){
 if(state.cat.away||state.catTreats<1||state.catSpy.status!=='done')return;
 if(!giveCatTreat(18))return;state.catSpy.status='rewarded';save();render();
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
const detectiveNotes=[
 ["أبو وردة عم يهمس للحبق. قرّبت أسمع كلمة السر. طلع عم يقلّه: دخيلك هالمرة لا تموت، قلت لياسمين إني خبير.", "John whispered to the basil. I leaned in for the password. “Please stay alive. I told Yasmin I knew what I was doing.”"],
 ["تتبّعت آثار طين لحدّ المرش. لفّيت المشتل تلات مرات قبل ما انتبه إنو قياس الكف… قياسي.", "I followed muddy pawprints around John’s watering can. Three laps later I checked my own feet. Case closed."],
 ["سمعت أبو وردة يقلّي: شايف ديلك. ضلّيت ثابتة. قال: وشايف إنك عم تحاولي تقعدي عليه.", "“I can see your tail,” said John. I froze. “I can also see you trying to sit on it.”"],
 ["أبو وردة عم يفتّش عالقلم ورا دانو. كنت رح ساعده، بس أنا كمان صارلي ساعة عم فتّش عالعدسة… وعم شوف فيها.", "John spent ages looking for the pencil behind his ear. I would’ve helped, but I was looking for my magnifier. Through my magnifier."],
 ["لقيت أصيص فاضي، قلت هاد مخبأ مثالي. أبو وردة كتب عليه: نعنع. إذا سألت عنّي ياسمين، قلّها بدّي شوية مي.", "I hid in an empty pot. John labelled it “Mint.” If Yasmin asks where I am, tell her I could use a little water."],
 ["سمعت أبو وردة يقلّها: الزبون جاي، وقّفي دغري! فكرتو كشفني. طلع عم يحكي مع توليبة مايلة.", "“Customer coming. Stand up straight!” said John. Thought I’d been spotted. He was talking to a drooping flower."],
 ["أبو وردة مغمّض عيونه. قرّبت أتأكد إذا نايم. قال: بس تخلّصي التقرير، فيكي تبطّلي تخرخري بإذني؟", "John had his eyes shut. I crept closer to see if he was asleep. “When you finish that report, could you stop purring in my ear?”"]
];
function finishInvestigation(spy){
 const choices=[0,1,2,3];
 if(nurseryPots().some(p=>!p.active))choices.push(4);
 if(nurseryPots().some(isReady))choices.push(5);
 if(state.abu.paused)choices.push(6);
 spy.reportIndex=choices.find(i=>i>(state.lastDetectiveNote??-1))??choices[0];
 state.lastDetectiveNote=spy.reportIndex;
 spy.caseNumber=state.detectiveCount=(state.detectiveCount||0)+1;
 spy.status='done';spy.report='file';sound('notify');save();
}
function caseText(spy,ar){
 const note=detectiveNotes[spy.reportIndex]||detectiveNotes[0];
 return (ar?'ملف ':'Case ')+String(spy.caseNumber||1).padStart(3,'0')+' · '+displayName('catName')+' — '+note[ar?0:1];
}
function renderCatExtras(){
 $('catMissionsLabel').textContent=state.lang==='ar'?'مهمّات القطة':'Cat missions';
 updateCatMissionTime();
 var ar=state.lang==='ar',spy=state.catSpy;
 $('catTreatBuy').textContent=ar?'🍬 اشتري 3 حبة مكافأة لـ'+displayName("catName")+' · 💰 10':'🍬 Buy 3 treats · 💰 10';
 $('catTreatBuy').disabled=state.money<10;
 $('catTreatCount').textContent=(ar?'🍬 الحبة مكافأة المتوفرة: ':'🍬 Treats available: ')+state.catTreats;
 $('catSpy').textContent=spy.status==='running'?(ar?'🐾 '+displayName("catName")+' عم تتجسس...':'🐾 '+displayName("catName")+' is spying...'):(ar?'🕵️ ابعت '+displayName("catName")+' تتجسس على أبو وردة':'🕵️ Send '+displayName("catName")+' to spy on John');
 var spyCooldown=Math.max(0,(Number(spy.cooldownUntil)||0)-Date.now());
 if(spy.status!=='running'&&spyCooldown>0){var secs=Math.ceil(spyCooldown/1000);$('catSpy').textContent=(ar?'🕵️ التجسس متاح بعد ':'🕵️ Spy available in ')+String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0');}
 $('catSpy').disabled=spy.status==='running'||spyCooldown>0||!state.abu.hired;
 if(spy.status!=='running'&&!spyCooldown){
   const reason=!state.abu.hired?(ar?'وظّف أبو وردة أولاً':'Hire John first'):state.cat.sleeping?(ar?'القطة نايمة':'Cat is asleep'):Date.now()<catBusyUntil?(ar?'القطة مشغولة شوي':'Cat is busy'):'';
   if(reason){$('catSpy').disabled=true;$('catSpy').textContent=reason;}
 }
 const card=$('caseCard');
 card.hidden=!spy.report||spy.dismissed===true||spy.status==='running';
 if(!card.hidden){
   $('caseTitle').textContent=(ar?'دفتر '+displayName('catName')+' · ملف ':'Detective '+displayName('catName')+' · Case ')+String(spy.caseNumber||1).padStart(3,'0');
   $('caseNote').textContent=(detectiveNotes[spy.reportIndex]||detectiveNotes[0])[ar?0:1];
   $('caseClose').ariaLabel=ar?'إغلاق التقرير':'Close case file';
 }
 $('catSpy').style.opacity=$('catSpy').disabled?'0.55':'';
 $('catSpy').style.filter=$('catSpy').disabled?'grayscale(1)':'';
 $('catSpyReport').textContent=spy.status==='running'?(ar?displayName("catName")+' رايحة تتفقد المشتل، استناها شوي...':''+displayName("catName")+' is checking the nursery...'):spy.report?caseText(spy,ar):(ar?'دلّع '+displayName("catName")+' بلمسة، وابعتها بمهمة تجسس!':'Tap '+displayName("catName")+' to pet her, or send her on a spy mission!');
 $('catTreatReward').hidden=spy.status!=='done';
 $('catTreatReward').textContent=ar?'🍬 كافئ '+displayName("catName")+' بحبة مكافأة':'🍬 Reward '+displayName("catName")+' with a treat';
 $('catTreatReward').disabled=state.catTreats<1;
}

/* Visible spy mission: Mimi sneaks into the nursery and watches John. */
var spyStyle=document.createElement('style');
spyStyle.textContent='#spyMimi{position:absolute;bottom:6%;right:-24%;width:100px;height:75px;z-index:15;pointer-events:none;transition:right 2s ease-in-out;filter:drop-shadow(0 5px 4px #0004)}#spyMimi.spy-in{right:5%}#spyMimi.spy-out{right:-24%}#spyMimi svg{width:100%;height:100%}#spyCaption{position:absolute;left:8%;right:8%;top:2%;bottom:auto;z-index:17;background:#fff9e6e8;color:#27442d;border-radius:15px;padding:8px;text-align:center;font-weight:bold;pointer-events:none}';
document.head.appendChild(spyStyle);
var spyMimi=document.createElement('div');spyMimi.id='spyMimi';spyMimi.hidden=true;
spyMimi.innerHTML='<img alt="" src="yasmine/images/cat-care/idle.webp">';
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
 if(spyButton)spyButton.textContent=(ar?'🐾 '+displayName("catName")+' عم تتجسس... ':'🐾 '+displayName("catName")+' is spying... ')+Math.max(0,Math.ceil(remain/1000))+' '+(ar?'ثانية':'s');
 spyCaption.textContent=remain>4000?(ar?'🐾 '+displayName("catName")+' عم تتسلّل لتراقب أبو وردة...':'🐾 '+displayName("catName")+' is sneaking up on John...'):(ar?'🤫 ششش... '+displayName("catName")+' عم تتلصّص!':'🤫 Shhh... '+displayName("catName")+' is spying!');
 if(!spyVisualStarted){spyVisualStarted=Date.now();spyMimi.className='';requestAnimationFrame(function(){spyMimi.className='spy-in spy-peek'})}
 if(remain<2200)spyMimi.className='spy-out';
}
setInterval(function(){
 if(document.hidden)return;
 var spy=state.catSpy;
 if(spy.status!=='running'&&activeArea!=='cat')return;
 updateSpyScene();
 if(spy.status==='running'&&Date.now()>=spy.end){
  finishInvestigation(spy);
  activeArea='cat';updateSpyScene();render();$('caseCard').scrollIntoView({behavior:'smooth',block:'center'});
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
 var ar=state.lang==='ar';$('catSheetHeading').textContent=ar?'متجر '+displayName("catName"):displayName("catName")+' shop';$('catSheetBalance').textContent=(ar?'رصيدك: ':'Balance: ')+state.money+' 💰';$('catBoutiqueTitle').textContent=(ar?'🛍️ متجر '+displayName("catName"):'🛍️ '+displayName("catName")+' shop')+(shopOpen?' ▴':' ▾');
 var root=$('catBoutiqueItems');root.replaceChildren();
 catBoutiqueCatalog.concat([{id:'treat',ar:'🍬 3 حبات مكافأة',en:'🍬 3 reward treats',cost:10}]).forEach(function(item){
  var owned=item.id!=='treat'&&!!state.catItems[item.id],b=document.createElement('button');
  b.textContent=(ar?item.ar:item.en).replace('{cat}',displayName("catName"))+(owned?(item.id==='bed'?(ar?' ✓ موجود':' ✓ Owned'):((!state.catEquipped||state.catEquipped[item.id]!==false)?(ar?' ✓ لابستها — اضغط لتشيلها':' ✓ Wearing — tap to remove'):(ar?' — اضغط لتلبسها':' — Tap to wear'))):' · 💰 '+item.cost);
  b.dataset.item=item.id;
  if(item.id==='treat')b.textContent+=(ar?' · عندك ':' · Stock: ')+state.catTreats;
  if(catPurchase&&catPurchase.until>Date.now()&&catPurchase.id===item.id)b.textContent=ar?'✓ تم الشراء':'✓ Purchased';
  b.disabled=false;
  b.onclick=function(){if(owned){if(item.id!=='bed'){state.catEquipped=state.catEquipped||{};state.catEquipped[item.id]=state.catEquipped[item.id]===false;save();render()}return}buyCatItem(item)};
  root.appendChild(b);
 });

 var napping=!!state.cat.sleeping;
 var scene=$('catScene');
 var ownsBed=String(!!state.catItems.bed||napping);
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
  round:activeHuntRound,language:()=>state.lang,name:()=>displayName("catName"),
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
    financeMove(hunt.coins,'catreward');state.extraEarned+=hunt.coins;
    for(let i=0;i<hunt.coins;i++)state.catCoinTimes.push(now);
  }
  sound(won?'cheer':'notify');save();render();
}
$('catMouseHunt').onclick=function(){
  if(state.cat.sleeping||Date.now()<catBusyUntil||state.cat.away||activeHuntRound()||Date.now()<Number(state.catHunt.cooldownUntil||0))return;
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
 if(!giveCatTreat(20))return;state.catHunt.status='rewarded';save();render();
};
var previousRenderCatExtras=renderCatExtras;
renderCatExtras=function(){
 previousRenderCatExtras();renderBoutique();
 var ar=state.lang==='ar',hunt=state.catHunt;
 $('catMouseHunt').textContent=ar?'🐭 ابعت '+displayName("catName")+' جولة بالمشتل لتصيد فأرة':'🐭 Send '+displayName("catName")+' on a mouse patrol';
 var mouseCooldown=Math.max(0,(Number(hunt.cooldownUntil)||0)-Date.now());
 if(mouseCooldown>0&&hunt.status!=='running'){var mouseSeconds=Math.ceil(mouseCooldown/1000);$('catMouseHunt').textContent=(ar?'🐭 صيد الفأرة متاح بعد ':'🐭 Mouse patrol in ')+String(Math.floor(mouseSeconds/60)).padStart(2,'0')+':'+String(mouseSeconds%60).padStart(2,'0');}
 $('catMouseHunt').disabled=hunt.status==='running'||mouseCooldown>0;
 $('catMouseHunt').style.opacity=$('catMouseHunt').disabled?'0.55':'';
 $('catMouseHunt').style.filter=$('catMouseHunt').disabled?'grayscale(1)':'';
 const report=hunt.status==='escaped'?(ar?'الفارة هربت هالمرة!':'The mouse escaped this time!'):hunt.status==='running'?'':(hunt.status==='done'||hunt.status==='rewarded')?(ar?'🐱 '+displayName("catName")+' كمشت الفأرة وطردتها من المشتل!':'🐱 '+displayName("catName")+' caught the mouse and chased it away!'):'';
 const reportText=report+(hunt.coins?(ar?' · عملات: ':' · Coins: ')+hunt.coins:'');
 $('mouseChaseResult').hidden=!reportText||!!hunt.dismissed||state.cat.away;
 $('closeMouseResult').setAttribute('aria-label',ar?'إغلاق نتيجة الصيد':'Dismiss hunt result');
 if($('catMouseReport').textContent!==reportText)$('catMouseReport').textContent=reportText;
 mouseChase.sync(activeHuntRound());
 $('catMouseReward').hidden=hunt.status!=='done';
 $('catMouseReward').textContent=ar?'🍬 كافئ '+displayName("catName")+' بحبة مكافأة على شطارتها':'🍬 Reward '+displayName("catName")+' with a treat';
 $('catMouseReward').disabled=state.catTreats<1;
};
var previousRenderCat=renderCat;
renderCat=function(){previousRenderCat();renderCatExtras();var n=state.nana;renderNanaNews();if(n.hired&&!n.paused){$('nanaDialogue').textContent=(state.lang==='ar'?nanaLinesAr:nanaLinesEn)[n.dialogueIndex%10].replace('{cat}',displayName("catName"))}};

// Persistent energy is independent of the visual animation and the purchased bed.
var catPurchase=null,catFeedback='',catFeedbackUntil=0;
function catSay(ar,en){catFeedback=state.lang==='ar'?ar:en;catFeedbackUntil=Date.now()+6500;}
function tickCatEnergy(delta){
 var c=state.cat,now=Date.now();
 if(!Number.isFinite(c.energy))c.energy=100;
 if(c.away){c.sleeping=false;c.sleepUpdated=now;return;}
 if(c.sleeping){
   c.energy=Math.min(100,c.energy+Math.max(0,now-(c.sleepUpdated||now))/1000*1.25);
   c.sleepUpdated=now;
   if(c.energy>=100){c.sleeping=false;catSay('☀️ '+displayName("catName")+' ارتاحت وصحيت!','☀️ Rested and awake!');}
 }else{
   c.energy=Math.max(0,c.energy-Math.min(2,delta)/12);
   if(c.energy===0&&Date.now()>=catBusyUntil){c.sleeping=true;c.sleepUpdated=now;catSay('💤 '+displayName("catName")+' تعبت وراحت تنام','💤 Tired — time to sleep');}
 }
}
function renderCatEnergy(){
 var c=state.cat,ar=state.lang==='ar',busy=Date.now()<catBusyUntil;
 $('catEnergyLabel').textContent=ar?'الطاقة':'Energy';
 $('catEnergy').textContent=Math.floor(c.energy)+'%';
 $('catEnergyBar').style.width=c.energy+'%';
 for(const [label,value] of Object.entries({Fullness:c.fullness,Hydration:c.hydration,Mood:c.mood,Energy:c.energy})){
   const color=value<20?'#d84943':value<50?'#d98a30':'';
   $('cat'+label+'Bar').style.background=color;
   $('cat'+label).style.color=value<20?'#dc4c47':'';
 }
 $('catScene').dataset.tired=String(c.energy<20&&!c.sleeping);
 $('catRestStatus').textContent=c.sleeping?(ar?'💤 عم ترتاح — الطاقة ':'💤 Resting — energy ')+Math.floor(c.energy)+'%':catFeedbackUntil>Date.now()?catFeedback:c.energy<20?(ar?'🥱 نعسانة وبدها ترتاح':'🥱 Sleepy — needs rest'):'';
 ['Feed','Water','Play','Brush','TreatReward','MouseReward','Spy','MouseHunt'].forEach(function(id){var b=$('cat'+id);if(b&&(c.sleeping||busy))b.disabled=true;});
 if(c.energy<8)$('catPlay').disabled=true;
 $('catGiveTreat').textContent=state.catTreats>0?(ar?'🍬 أعطيها مكافأة · عندك ':'🍬 Give a treat · Stock: ')+state.catTreats:(ar?'🍬 خلصت المكافآت — افتح المتجر':'🍬 No treats — open shop');
 $('catGiveTreat').disabled=c.away||c.sleeping||busy;
 $('catWalkButton').textContent=ar?'🐾 خدها نزهة':'🐾 Take a walk';
 var remaining=Math.max(0,Math.ceil(((c.walkNext||0)-Date.now())/1000));
 if(remaining)$('catWalkButton').textContent=(ar?'🐾 نزهة بعد ':'🐾 Walk in ')+plotClock(remaining);
 $('catWalkButton').disabled=c.away||c.sleeping||busy||c.energy<12||remaining>0;
 $('catWalkButton').title=ar?'المزاج +12، الطاقة −12، الارتواء −4. فرصة تلاقي عملة.':'Mood +12, energy −12, hydration −4. May find a coin.';
 if(c.energy<12)$('catWalkButton').textContent=ar?'🐾 بدها ترتاح قبل النزهة':'🐾 Needs rest before walking';
 $('catNapButton').hidden=false;
 $('catNapButton').textContent=c.sleeping?(ar?'💤 '+displayName("catName")+' نايمة':'💤 Sleeping'):(ar?'💤 خليها تنام':'💤 Take a nap');
 $('catNapButton').disabled=c.away||c.sleeping||busy||c.energy>=100;
}
function giveCatTreat(amount){
 if(state.cat.away||state.cat.sleeping||Date.now()<catBusyUntil||state.catTreats<1)return false;
 var before=state.cat.mood;state.catTreats--;state.cat.mood=Math.min(100,before+amount);state.cat.fullness=Math.min(100,state.cat.fullness+3);
 catBusyUntil=Date.now()+4300;$('catScene').dataset.action='Treat';
 catSay('🍬 أكلت حبة! المزاج +'+(state.cat.mood-before),'🍬 Ate a treat! Mood +'+(state.cat.mood-before));
 sound('feed');
 if(audioSettings.sfx){var ctx=audio();if(ctx){var t=ctx.currentTime;[1.3,1.65,2].forEach(function(d){note(140,t+d,.065,.1,'sawtooth');note(240,t+d+.03,.04,.06,'triangle');});}}
 clearTimeout(catAnimationTimer);
 catAnimationTimer=setTimeout(function(){delete $('catScene').dataset.action;render();},4300);
 save();render();return true;
}
$('catGiveTreat').onclick=function(){if(state.catTreats<1){setShopOpen(true);return;}giveCatTreat(8);};
window.YasmineCatActions={
 walk:function(){
 var c=state.cat;if(c.away||c.sleeping||Date.now()<catBusyUntil||c.energy<12||Date.now()<(c.walkNext||0))return false;
 const before=c.mood;
 c.energy-=12;c.mood=Math.min(100,c.mood+12);c.hydration=Math.max(0,c.hydration-4);catBusyUntil=Date.now()+7000;c.walkNext=catBusyUntil+120000;$('catScene').dataset.walkUntil=String(catBusyUntil);
 // At most one coin per walk, bounded by the existing hourly and economy limits.
 state.catCoinTimes=(state.catCoinTimes||[]).filter(function(t){return t>Date.now()-3600000;});
 var found=Math.random()<.3&&state.catCoinTimes.length<4&&(state.extraEarned||0)<Math.floor((state.sales||0)*.25);
 if(found){financeMove(1,'catreward');state.extraEarned=(state.extraEarned||0)+1;state.catCoinTimes.push(Date.now());}
 catSay('🐾 '+displayName("catName")+' عم تتمشى بالمشتل','🐾 '+displayName("catName")+' is exploring the nursery');
 catFeedbackUntil=catBusyUntil;
 const gained=c.mood-before;
 setTimeout(function(){
   if(state.cat!==c)return;
   catSay('رجعت من النزهة · المزاج +'+gained+' · الطاقة −12'+(found?' · لقت عملة 🪙':''),
     'Back from the walk · Mood +'+gained+' · Energy −12'+(found?' · Found a coin 🪙':''));
   render();
 },7000);
 save();render();return true;
 },
 nap:function(){if(state.cat.away||state.cat.sleeping||Date.now()<catBusyUntil||state.cat.energy>=100)return false;state.cat.sleeping=true;state.cat.sleepUpdated=Date.now();save();render();return true;}
};
function buyCatItem(item){
 var ar=state.lang==='ar',before=state.catTreats;
 var notice=$('catPurchaseNotice');if(!notice){notice=document.createElement('p');notice.id='catPurchaseNotice';notice.setAttribute('role','status');notice.style.cssText='padding:12px;border-radius:12px;background:#e4efd5;color:#24452e;font-weight:bold';$('catSheetBalance').after(notice);}
 if(state.money<item.cost){notice.textContent=ar?'ما معك عملات كفاية':'Not enough coins';return;}
 financeMove(-item.cost,'catshop');if(item.id==='treat')state.catTreats+=3;else state.catItems[item.id]=true;
 catPurchase={id:item.id,until:Date.now()+2200};
 notice.textContent=(ar?'✓ اشتريت ':'✓ Purchased ')+(ar?item.ar:item.en).replace('{cat}',displayName("catName"))+(item.id==='treat'?(ar?' · المخزون: ':' · Stock: ')+before+' → '+state.catTreats:'')+' · −'+item.cost+' 🪙';
 notice.animate([{opacity:.35,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}],{duration:350});
 sound('purchase');save();render();
}
tickCatEnergy(0);
document.addEventListener('visibilitychange',function(){if(!document.hidden){tickCatEnergy(0);render();}});

advancePlantClock(Date.now());
function syncPlants(){advancePlantClock(Date.now());save();if(!document.hidden)render();}
document.addEventListener('visibilitychange',syncPlants);
window.addEventListener('pageshow',syncPlants);
window.addEventListener('pagehide',()=>{advancePlantClock(Date.now());save();});
var lastNotificationCount=notificationCount();var lastTick=Date.now();setInterval(function(){var now=Date.now(),delta=Math.min(2,(now-lastTick)/1000);lastTick=now;if(document.hidden)return;updateClock();updateSky();if(state.weatherMode==='auto')updateWeather();window.YasmineCompost.tick(state,delta,activeArea==='nursery',save);tickCat(delta);tickStaff();tickAbu();tickNana();tickCatEmergency();var n=notificationCount();if(n>lastNotificationCount&&state.staff.hired)sound('notify');lastNotificationCount=n;advancePlantClock(now);render()},1000);setInterval(function(){if(Date.now()>=eventNext){scheduleEvent();if(!document.hidden&&activeArea==='nursery')eventSpawn()}},1000);render();msg(state.lang==='ar'?'بلّش اعتني بالياسمينة!':'Start caring for your jasmine!');
if(audioSettings.music)tryPlayMusic();
})();
