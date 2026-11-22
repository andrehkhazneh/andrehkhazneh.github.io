
(function(){
'use strict';
var ECONOMY_CONFIG={eventMinMs:25000,eventMaxMs:45000,eventDurationMs:6000,eventRewards:{bee:2,dew:1,pest:1},pestTaps:3,pestQualityLoss:2,eventSaleCap:0.12,starterSales:4,starterBonus:0.15,abuSales:6,catChance:0.30,catMinFullness:30,catMinMood:30,catFullnessCost:10,catCooldownMs:180000,catHourlyCap:4,catRewards:[1,2],extraIncomeRatio:0.25};
var crops={jasmine:{ar:'الياسمينة',en:'Jasmine',cost:10,time:65,price:40,flower:'#fffdf0'},mint:{ar:'النعنع',en:'Mint',cost:15,time:60,price:30,flower:'#a1df8a'},rose:{ar:'الورد الجوري',en:'Rose',cost:30,time:70,price:90,flower:'#ed6380'},sunflower:{ar:'دوّار الشمس',en:'Sunflower',cost:35,time:75,price:105,flower:'#f6bd23'}};
var txt={ar:{title:'🌿 حديقة السعادة',subtitle:'ازرع، اعتنِ، بِع، وكبّر مشتلك!',preview:'إعدادات اللعبة',moneyLabel:'المصاري',salesLabel:'المبيعات',qualityLabel:'الجودة',water:'💧 سقاية',feed:'🌱 سماد',sun:'☀️ شمس',careInfo:'كل عناية بتسرّع النمو، والأزرار إلها استراحة 5 ثواني. لا تفرط بالعناية!',buyerTitle:'🧑‍🌾 زبون المشتل',buyerText:'لما تزهر النبتة، بيجي زبون ليشتريها.',sell:'بيع النبتة',shopTitle:'🛒 متجر البذور',shopInfo:'اختار بذرة جديدة بعد البيع. النبتة الحالية لازم تنباع أول.',missionTitle:'🎯 مهمة المشتل',missionInfo:'بيع 3 نباتات وافتح أنواع مختلفة. فيك تكمل بلا حدود.',reset:'إعادة التجربة',stages:['بذرة','برعم صغير','أوراق خضراء','نبتة قوية','براعم الزهور','مزهرة وجاهزة للبيع'],ready:'نبتتك زهرت! الزبون ناطر يشتريها.',sold:'مبروك! بعت النبتة وربحت ',need:'ما معك مصاري كفاية.',plant:'زرعت ',busy:'بيع النبتة الحالية أولاً.',pest:'🐛 دودة! اضغط عليها قبل ما تضرّ النبتة.',pestDone:'شطّور! تخلّصت من الدودة.',pestMiss:'الدودة ضرّت جودة النبتة!',bee:'🐝 نحلة! اضغط عليها لتحصل على مكافأة.',beeDone:'النحلة ساعدت النبتة! +5 جودة.',beeMiss:'النحلة طارت.',waterMsg:'سقيت النبتة.',feedMsg:'أضفت سماد.',sunMsg:'عرّضتها للشمس.',over:'العناية الزايدة خفّضت الجودة شوي.',mission:'بيع 3 نباتات',won:'أنجزت المهمة! كمّل وكبّر مشتلك.',resetAsk:'بدك تمسح تقدم النسخة التجريبية؟'},en:{title:'🌿 Andreh’s Garden',subtitle:'Plant, care, sell, and grow your nursery!',preview:'Game settings',moneyLabel:'Coins',salesLabel:'Sales',qualityLabel:'Quality',water:'💧 Water',feed:'🌱 Fertilize',sun:'☀️ Sunlight',careInfo:'Care speeds growth. Each button has a 5-second cooldown. Avoid overdoing it!',buyerTitle:'🧑‍🌾 Nursery customer',buyerText:'A customer arrives when your plant blooms.',sell:'Sell plant',shopTitle:'🛒 Seed shop',shopInfo:'Choose a new seed after selling your plant.',missionTitle:'🎯 Nursery goal',missionInfo:'Sell 3 plants, unlock new varieties, and keep going.',reset:'Reset test',stages:['Seed','Tiny sprout','Green leaves','Strong plant','Flower buds','Blooming and ready to sell'],ready:'Your plant is blooming! A customer wants it.',sold:'Sold! You earned ',need:'Not enough coins.',plant:'You planted ',busy:'Sell your current plant first.',pest:'🐛 Caterpillar! Tap it before it harms your plant.',pestDone:'Nice! You removed the caterpillar.',pestMiss:'The caterpillar damaged your plant quality!',bee:'🐝 Bee! Tap it for a bonus.',beeDone:'The bee helped your plant! +5 quality.',beeMiss:'The bee flew away.',waterMsg:'You watered the plant.',feedMsg:'You fertilized the plant.',sunMsg:'You gave it sunlight.',over:'Too much care reduced quality a little.',mission:'Sell 3 plants',won:'Goal complete! Keep growing your nursery.',resetAsk:'Reset your test progress?'}};
var audioSettings={sfx:true,music:false,sfxVolume:85,musicVolume:85};try{var storedAudio=JSON.parse(localStorage.getItem('yasmine-audio-v1'));if(storedAudio&&typeof storedAudio==='object')audioSettings=Object.assign(audioSettings,storedAudio)}catch(e){}
var audioCtx=null,jazzTrack=document.getElementById('jazzTrack');function audio(){try{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx}catch(e){return null}}
function note(freq,when,dur,vol,type){var ctx=audio();if(!ctx)return;var osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type||'sine';osc.frequency.setValueAtTime(freq,when);var level=Math.min(.25,vol*audioSettings.sfxVolume/100);gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,level),when+.012);gain.gain.exponentialRampToValueAtTime(.0001,when+dur);osc.connect(gain);gain.connect(ctx.destination);osc.start(when);osc.stop(when+dur+.03)}
function sound(kind){if(!audioSettings.sfx)return;var ctx=audio();if(!ctx)return;var t=ctx.currentTime+.02;if(kind==='meow'){note(650,t,.18,.19,'triangle');note(490,t+.17,.26,.16,'sine')}else if(kind==='laugh'){[560,740,610,820,690].forEach(function(n,i){note(n,t+i*.105,.13,.18,'sine')})}else if(kind==='cheer'){[523,659,784,1047].forEach(function(n,i){note(n,t+i*.09,.18,.24,'triangle')});[170,220,170,220].forEach(function(n,i){note(n,t+i*.12,.07,.13,'square')})}else if(kind==='sad'){[440,330,260,185].forEach(function(n,i){note(n,t+i*.14,.23,.18,'sawtooth')})}else if(kind==='reject'){[350,280].forEach(function(n,i){note(n,t+i*.13,.2,.14,'triangle')})}else if(kind==='purchase'){[392,523,659].forEach(function(n,i){note(n,t+i*.08,.2,.22,'triangle')})}else if(kind==='notify'){note(740,t,.14,.13,'sine');note(980,t+.16,.22,.15,'sine')}else if(kind==='sell'){[523,659,784,1047].forEach(function(n,i){note(n,t+i*.09,.28,.19,'triangle')})}else if(kind==='bloom'){[392,494,587,784,988].forEach(function(n,i){note(n,t+i*.13,.46,.16,'sine')})}else if(kind==='water'){[740,620,510].forEach(function(n,i){note(n,t+i*.07,.18,.12,'sine')})}else if(kind==='feed'){note(330,t,.16,.14,'triangle');note(440,t+.12,.26,.13,'triangle')}else if(kind==='sun'){note(587,t,.25,.13,'sine');note(784,t+.09,.35,.12,'sine')}else if(kind==='plant'){note(294,t,.16,.14,'triangle');note(392,t+.15,.3,.15,'triangle')}else if(kind==='pest'){note(240,t,.13,.11,'square');note(180,t+.15,.18,.10,'square')}else if(kind==='bee'){note(659,t,.18,.13,'sine');note(880,t+.13,.2,.12,'sine')}}
function updateAudioButtons(){var a=document.getElementById('sfxToggle'),b=document.getElementById('musicToggle');a.setAttribute('aria-checked',String(audioSettings.sfx));b.setAttribute('aria-checked',String(audioSettings.music));a.querySelector('b').textContent=audioSettings.sfx?'ON':'OFF';b.querySelector('b').textContent=audioSettings.music?'ON':'OFF';document.getElementById('sfxLabel').textContent=state.lang==='ar'?'🔊 المؤثرات':'🔊 Effects';document.getElementById('musicLabel').textContent=state.lang==='ar'?'🎹 موسيقى الجاز':'🎹 Jazz music';document.getElementById('sfxVolume').value=audioSettings.sfxVolume;document.getElementById('musicVolume').value=audioSettings.musicVolume}
function saveAudio(){try{localStorage.setItem('yasmine-audio-v1',JSON.stringify(audioSettings))}catch(e){}updateAudioButtons()}
function tryPlayMusic(){
  if(!audioSettings.music)return;
  jazzTrack.volume=Math.max(0,Math.min(100,Number(audioSettings.musicVolume)||0))/100;
  var attempt=jazzTrack.play();
  if(attempt&&typeof attempt.catch==='function')attempt.catch(function(){/* Browser autoplay policy: preserve saved ON preference. */});
}
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
function freshCat(){return window.YasmineCatCore.freshCat()}
var key='yasmine-nursery-preview-v1';var state={gameEpoch:Date.now(),dayMode:'auto',weatherMode:'auto',gardenName:'حديقة السعادة',dismissedEmpty:false,money:50,sales:0,kind:'jasmine',progress:0,quality:100,care:0,active:true,lang:'ar',cat:freshCat(),nurseryName:'مشتل الياسمينة',catName:'مشمش',namesSet:false,stock:{fertilizer:4,catfood:3},staff:{hired:false,mood:60,request:null,nextRequest:Date.now()+45000,dialogue:''},yasminFace:'',emergencyFertilizerUsed:false};
function safeNumber(v,fallback,min,max){return typeof v==='number'&&Number.isFinite(v)?Math.min(max,Math.max(min,v)):fallback}
function normalizeGameState(s){
  if(!s||typeof s!=='object'||Array.isArray(s))return s;
  s.money=safeNumber(s.money,50,0,1000000000);s.sales=safeNumber(s.sales,0,0,100000000);
  s.progress=safeNumber(s.progress,0,0,100);s.quality=safeNumber(s.quality,100,0,100);
  s.care=safeNumber(s.care,0,0,100000000);
  if(!s.cat||typeof s.cat!=='object'||Array.isArray(s.cat))s.cat=freshCat();
  s.cat.fullness=safeNumber(s.cat.fullness,60,0,100);s.cat.mood=safeNumber(s.cat.mood,55,0,100);
  if(!s.stock||typeof s.stock!=='object'||Array.isArray(s.stock))s.stock={fertilizer:4,catfood:3};
  s.stock.fertilizer=safeNumber(s.stock.fertilizer,4,0,1000000);s.stock.catfood=safeNumber(s.stock.catfood,3,0,1000000);
  if(!s.staff||typeof s.staff!=='object'||Array.isArray(s.staff))s.staff={hired:false,mood:60,request:null,nextRequest:Date.now()+45000,dialogue:''};
  s.staff.mood=safeNumber(s.staff.mood,60,0,100);
  if(!s.abu||typeof s.abu!=='object'||Array.isArray(s.abu))s.abu={hired:false,paidSales:0,paused:false,lastCare:0};
  if(!s.nana||typeof s.nana!=='object'||Array.isArray(s.nana))s.nana={hired:false,paidSales:0,paused:false,lastCare:0,lastWarn:0,dialogueIndex:0,action:''};
  s.abu.paidSales=safeNumber(s.abu.paidSales,0,0,3);s.nana.paidSales=safeNumber(s.nana.paidSales,0,0,3);
  if(!['jasmine','mint','rose','sunflower'].includes(s.kind))s.kind='jasmine';
  if(!['ar','en'].includes(s.lang))s.lang='ar';
  ['gardenName','nurseryName','catName'].forEach(function(k){if(typeof s[k]!=='string')s[k]=k==='catName'?'مشمش':k==='nurseryName'?'مشتل الياسمينة':'حديقة السعادة';s[k]=s[k].slice(0,24)});
  if(!['happy','sad',''].includes(s.yasminFace))s.yasminFace='';
  s.emergencyFertilizerUsed=!!s.emergencyFertilizerUsed;
  return s;
}
try{var rawSave=localStorage.getItem(key);var old=rawSave?JSON.parse(rawSave):null;if(old&&typeof old==='object'&&!Array.isArray(old))state=Object.assign(state,old)}catch(e){console.warn('Garden save could not be read; keeping stored data unchanged',e)}
state=normalizeGameState(state);
if(!Number.isFinite(Number(state.gameEpoch)))state.gameEpoch=Date.now();else state.gameEpoch=Number(state.gameEpoch);if(!['auto','day','night'].includes(state.dayMode))state.dayMode='auto';if(!['auto','clear','rain','wind'].includes(state.weatherMode))state.weatherMode='auto';if(!state.qualityCause)state.qualityCause='';if(typeof state.gardenName!=='string')state.gardenName='حديقة السعادة';if(typeof state.dismissedEmpty!=='boolean')state.dismissedEmpty=false;if(new URLSearchParams(location.search).get('lang')==='en')state.lang='en';if(!state.stock)state.stock={fertilizer:4,catfood:3};if(typeof state.namesSet!=='boolean')state.namesSet=false;if(!state.cat||typeof state.cat!=='object')state.cat=freshCat();if(!state.staff||typeof state.staff!=='object')state.staff={hired:false,mood:60,request:null,nextRequest:Date.now()+45000,dialogue:''};if(typeof state.nurseryName!=='string')state.nurseryName='مشتل الياسمينة';if(typeof state.catName!=='string')state.catName='مشمش';
if(!state.abu||typeof state.abu!=='object')state.abu={hired:false,paidSales:0,paused:false,lastCare:0};if(!state.nana||typeof state.nana!=='object')state.nana={hired:false,paidSales:0,paused:false,lastCare:0,lastWarn:0,dialogueIndex:0,action:''};
if(!Number.isFinite(state.eventEarned))state.eventEarned=0;if(!Number.isFinite(state.eventCycleSales))state.eventCycleSales=state.sales;if(!Number.isFinite(state.extraEarned))state.extraEarned=0;if(!Number.isFinite(state.catHuntLast))state.catHuntLast=0;if(!Array.isArray(state.catCoinTimes))state.catCoinTimes=[];
var $=function(id){return document.getElementById(id)},last={water:0,feed:0,sun:0},ev=null,evTimer=0,evTimeout=0;
var workersSection=document.getElementById('workersArea');document.getElementById('staffArea').after(workersSection);var jokeQueue=[];var activeArea='nursery', catMessage=null, catLast={}, catSeconds=0, catAnimationTimer;
var catTxt={
  ar:{
    nav:'التنقّل داخل اللعبة',nursery:'🌱 المشتل',ready:'🌼 النبتة جاهزة للبيع',cat:'🐱 القطة',
    title:'قطة المشتل',fullness:'الشبع',mood:'المزاج',feed:'🍲 طعميها',
    play:'🧶 العب معها',feather:'🪶 العب معها بالريشة',brush:'🪮 مشّطها',
    buy:'🪶 اشتري لعبة ريشة · 💰 20',hello:'قطتك عم تستنّاك!',
    fed:'أكلت ورجعت تخرخر.',played:'ركضت ورا كرة الخيط ومسكِتها!',sleepy:'شدّت كرة الخيط لعندها ونامت فوقها.',
    brushed:'تمدّدت وخرخرت وإنت عم تمشّطها.',bought:'الريشة صارت جاهزة للعب!',caught:'نطّت ومسكت الريشة بكفّيها!'
  },
  en:{
    nav:'Game areas',nursery:'🌱 Nursery',ready:'🌼 Plant ready to sell',cat:'🐱 Cat',
    title:'Nursery cat',fullness:'Fullness',mood:'Mood',feed:'🍲 Feed',
    play:'🧶 Play',feather:'🪶 Play with feather',brush:'🪮 Brush',
    buy:'🪶 Buy a feather toy · 💰 20',hello:'Your cat is waiting for you!',
    fed:'She ate and started purring.',played:'She chased the ball of yarn and caught it!',sleepy:'She pulled the yarn close and fell asleep on it.',
    brushed:'She stretched out and purred as you brushed her.',bought:'The feather toy is ready!',caught:'She pounced and caught the feather in her paws!'
  }
};
function renderCat(){
  var words=catTxt[state.lang], cat=state.cat;
  var nursery=activeArea==='nursery', ready=state.active&&state.progress>=100;
  $('gameNav').setAttribute('aria-label',words.nav);
  $('nurseryArea').hidden=!nursery;
  $('catArea').hidden=activeArea!=='cat';
  $('staffArea').hidden=activeArea!=='staff';
  $('workersArea').hidden=activeArea!=='workers';
  $('workersYasminName').textContent=state.lang==='ar'?'👩🏻‍🌾 ياسمين':'👩🏻‍🌾 Jasmine';
  $('workersYasminRole').textContent=state.lang==='ar'?'مديرة المشتل':'Nursery manager';
  $('workersYasminInfo').textContent=state.lang==='ar'?'مسؤولة عن المشتل والقطط. ما إلها راتب دوري، وبتطلب مصاري للمشتريات والمكافآت فقط.':'Oversees the nursery and cats. No recurring salary; requests funds for supplies and bonuses.';
  $('workersYasminStatus').textContent=state.staff.hired?(state.lang==='ar'?'الحالة: موظّفة':'Status: hired'):(state.lang==='ar'?'الحالة: لسا ما توظّفت — وظّفها من قسم ياسمين':'Status: not hired yet — hire her in the Jasmine tab');
  $('workersTab').setAttribute('aria-pressed',String(activeArea==='workers'));
  $('workersTab').firstChild.textContent=state.lang==='ar'?'👥 موظفين ':'👥 Staff ';
  $('workersBadge').hidden=!((!state.abu.hired&&state.sales>=ECONOMY_CONFIG.abuSales)||(!state.nana.hired&&state.sales>=12));
  $('staffTab').setAttribute('aria-pressed',String(activeArea==='staff'));
  $('staffTab').firstChild.textContent=state.lang==='ar'?'👩🏻‍🌾 ياسمين ':'👩🏻‍🌾 Jasmine ';
  $('nurseryTab').setAttribute('aria-pressed',String(nursery));
  $('catTab').setAttribute('aria-pressed',String(activeArea==='cat'));
  $('nurseryTab').textContent='🌱 '+(state.nurseryName||words.nursery);var nurseryAction=ready?'sell':!state.active?'plant':null;$('nurseryBadge').hidden=!nurseryAction;$('abuNotice').hidden=!nurseryAction||activeArea!=='nursery';$('abuNotice').textContent=nurseryAction==='sell'?(state.lang==='ar'?'👨‍🌾 أبو وردة: النبتة جاهزة للبيع!':'👨‍🌾 John: Plant ready to sell!'):(state.lang==='ar'?'👨‍🌾 أبو وردة: المشتل فاضي، ازرع بذرة جديدة!':'👨‍🌾 John: Plant a new seed!');
  $('catTab').textContent='🐱 '+(state.catName||words.cat);
  $('catTitle').textContent=state.lang==='ar'?'قطة المشتل: '+state.catName:'Nursery cat: '+state.catName;
  ['Fullness','Mood'].forEach(function(stat){
    var value=cat[stat.toLowerCase()];
    $('cat'+stat+'Label').textContent=words[stat.toLowerCase()];
    $('cat'+stat).textContent=value+'%';
    $('cat'+stat+'Bar').style.width=value+'%';
  });
  $('catFeed').textContent=words.feed;
  $('catFeed').hidden=!!state.nana.hired;
  $('catFeed').disabled=!!state.nana.hired;
  $('catPlay').textContent=cat.toy?words.feather:words.play;
  $('catBrush').textContent=words.brush;
  $('catToy').textContent=words.buy;
  $('catToy').hidden=cat.toy;
  $('catToy').disabled=state.money<20;
  ['Feed','Play','Brush'].forEach(function(action){
    $('cat'+action).disabled=Date.now()<(catLast[action]||0);
  });
  var message=words[catMessage||'hello'];
  if($('catMessage').textContent!==message)$('catMessage').textContent=message;
}
function visitCat(action){
  var cat=state.cat;
  if(Date.now()<(catLast[action]||0))return;
  catLast[action]=Date.now()+5000;
  if(action==='Feed'){
    if(state.stock.catfood<=0){catMessage=null;state.staff.dialogue=state.lang==='ar'?'ما ضل أكل للقطة! افتح قسم ياسمين لتشتري أكل.':'No cat food left! Ask Jasmine to restock.';if(state.staff.hired)state.staff.request='catfood';activeArea='staff';render();return}state.stock.catfood--;
    cat.fullness=Math.min(100,cat.fullness+24);
    catMessage='fed';
  }else if(action==='Play'){
    cat.mood=Math.min(100,cat.mood+(cat.toy?24:18));
    cat.fullness=Math.max(0,cat.fullness-4);
    catMessage=cat.toy?'caught':(Math.random()<.5?'played':'sleepy');
  }else{
    cat.mood=Math.min(100,cat.mood+12);
    catMessage='brushed';
  }
  var scene=$('catScene');
  clearTimeout(catAnimationTimer);
  var animationMs=window.YasmineCatCore.animateAction(scene,action,cat.toy);
  catAnimationTimer=setTimeout(function(){window.YasmineCatCore.clearAction(scene)},animationMs);
  render();
}
$('nurseryTab').onclick=function(){activeArea='nursery';renderCat();renderNurseryNotice()};
$('catTab').onclick=function(){activeArea='cat';renderCat();renderNurseryNotice()};
['Feed','Play','Brush'].forEach(function(action){
  $('cat'+action).onclick=function(){visitCat(action)};
});
$('catToy').onclick=function(){
  if(state.cat.toy||state.money<20)return;
  state.money-=20;sound('purchase');
  state.cat.toy=true;
  catMessage='bought';
  render();
};
function rescueStarvingCat(){
  // Emergency help is free and does not depend on hiring Jasmine.
  if(state.cat.fullness>0||state.stock.catfood>0||state.money>=15)return false;
  var now=Date.now();
  if(now-(Number(state.catFoodRescueAt)||0)<300000)return false;
  state.cat.fullness=30;
  state.catFoodRescueAt=now;
  msg(state.lang==='ar'?'👩🏻‍🌾 ياسمين: بعت شي من مقتنياتي وجبت أكل لمشمش، بس المرة الجاية دير بالك!':'👩🏻‍🌾 Jasmine: I sold something of mine to feed the cat. Please keep an eye on the food next time!');
  save();
  return true;
}
function tickCat(delta){
  catSeconds=window.YasmineCatCore.tickNeeds(state.cat,catSeconds+delta);
  rescueStarvingCat();
}
function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch(e){}}
var requests=[{type:'fertilizer',cost:20},{type:'catfood',cost:15},{type:'bonus',cost:30}];
function staffWords(){return state.lang==='ar'?{nursery:'اسم المشتل',cat:'اسم القطة',hire:'وظّف ياسمين · 💰 50',hired:'موظفة دائمة',joke:'اسمع دعابة 😂',yes:'ادفع',no:'ارفض',mood:'مزاج ياسمين',hello:'أهلاً يا مدير! أنا جاهزة أراقب المشتل والقطة.',needWater:'يا مدير، النبتة عطشانة! لا تكون مفكرها صبّارة؟',needCat:'يا مدير، '+state.catName+' جاعت! بدنا نطعميها.',request:{fertilizer:'يا مدير، بدي 20 عملة أجيب سماد للنبتة!',catfood:'عطيني 15 عملة أجيب أكل لـ'+state.catName+'!',bonus:'أنا عم اشتغل من قلبي... ما في بونص 30 عملة؟'},jokes:['القطة شكلها ناوية تستلم الإدارة!','يا مدير، النباتات بدها مي مو خطابات تحفيزية!','أنا موظفة مش ساحرة، بس بونص صغير بيعمل عجايب!','قلت للقطة اشتغلي معي، قالت: أنا مديرة النوم!','السماد غلي يا مدير... حتى الوردة صارت بدها قرض!','زرعت نعنع، طلعلي طلب إجازة من الياسمينة!','القطة بتعرف تعدّ المصاري... بس كل العدّ بيخلص عند التونة!','طلبت من النبتة تكبر بسرعة، قالت: ادفعلي أوفر تايم!','أنا وياسمين النبتة نفس الاسم، بس هي بتاخد مي وأنا بدي بونص!','ليش الجزرة احمرّت؟ شافت فاتورة السماد!'],thanks:'يسلمو يا مدير! هيك الشغل الحلو.',refused:'طيب يا مدير... بس رح أتذمّر شوي! 😂',poor:'الخزنة فاضية يا مدير!'}:{nursery:'Nursery name',cat:'Cat name',hire:'Hire Jasmine · 💰 50',hired:'Permanent employee',joke:'Tell a joke 😂',yes:'Pay',no:'Decline',mood:'Jasmine mood',hello:'Hello boss! I am watching the plants and your cat.',needWater:'Boss, the plant needs water!',needCat:'Boss, '+state.catName+' is hungry!',request:{fertilizer:'Boss, I need 20 coins for fertilizer!',catfood:'Give me 15 coins to buy food for '+state.catName+'!',bonus:'I work so hard... could I get a 30-coin bonus?'},jokes:['The cat wants to become the manager!','Plants need water, not motivational speeches!','I am no magician, but a bonus works wonders!','I offered the cat a job. She said she already manages naps!','Fertilizer is so expensive even the flowers want a loan!','I planted mint, and the jasmine asked for vacation time!','The cat can count coins, but only until dinner!','I told the plant to grow faster. It asked for overtime pay!','The jasmine gets water, and I get bonus requests!','Why did the carrot blush? It saw the fertilizer bill!'],thanks:'Thanks, boss! I appreciate it.',refused:'Okay boss... but I will complain a little! 😂',poor:'Not enough coins, boss!'}}
$('settingsNamesPanel').appendChild($('identityPanel'));var editingNames=false,settingsOpen=false,audioPanelOpen=false,jokeAwaitingRating=false;$('topEditNames').onclick=function(){settingsOpen=!settingsOpen;if(!settingsOpen){editingNames=false;audioPanelOpen=false}render();$('settingsPanel').hidden=!settingsOpen};$('settingsNames').onclick=function(){settingsOpen=true;editingNames=!editingNames;render();if(editingNames){$('settingsNamesPanel').hidden=false;$('identityPanel').hidden=false;$('gardenNameInput').focus()}};$('settingsAudio').onclick=function(){audioPanelOpen=!audioPanelOpen;render()};$('restartGame').onclick=function(){$('reset').click()};$('saveGardenName').onclick=function(){commitNames()};$('gardenNameInput').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();commitNames()}});function commitNames(){state.gardenName=($('gardenNameInput').value||'').trim().slice(0,24)||'حديقة السعادة';state.nurseryName=($('nurseryNameInput').value||'').trim().slice(0,12)||'مشتل الياسمينة';state.catName=($('catNameInput').value||'').trim().slice(0,10)||'مشمش';state.namesSet=true;editingNames=false;save();render()}
$('editNames').onclick=function(){editingNames=!editingNames;render();if(editingNames)$('nurseryNameInput').focus()};$('saveNurseryName').onclick=commitNames;$('saveCatName').onclick=commitNames;['nurseryNameInput','catNameInput'].forEach(function(id){$(id).addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();commitNames();this.blur()}})});
function notificationCount(){return state.staff.hired&&state.staff.request?1:0}
function renderStaff(){var w=staffWords(),st=state.staff;var buyDirect=$('buyFertilizerDirect');buyDirect.hidden=!!st.hired;buyDirect.textContent=state.lang==='ar'?'🌱 شراء 5 سماد · 💰 10':'🌱 Buy 5 fertilizer · 💰 10';buyDirect.disabled=state.money<10;var face=$('yasminFace');if(face)face.textContent=state.yasminFace==='happy'?'😄':state.yasminFace==='sad'?'😢':'';var mouth=$('yasminMouth');if(mouth)mouth.setAttribute('d',state.yasminFace==='sad'?'M80 112Q91 98 102 112':state.yasminFace==='happy'?'M79 102Q91 120 103 102':'M80 103Q90 115 102 103');renderAbu();renderNana();$('settingsNamesPanel').hidden=!settingsOpen||!editingNames;$('identityPanel').hidden=!settingsOpen||!editingNames;$('gardenNameLabel').textContent=state.lang==='ar'?'اسم الحديقة':'Garden name';if(document.activeElement!==$('gardenNameInput'))$('gardenNameInput').value=state.gardenName;$('jokeRating').hidden=!jokeAwaitingRating;$('jokeGood').textContent=state.lang==='ar'?'😂 حلوة!':'😂 Funny!';$('jokeBad').textContent=state.lang==='ar'?'😐 مش كتير':'😐 Not really';$('nurseryAlert').hidden=true;$('nurseryAlertTitle').textContent=state.lang==='ar'?'🌱 تنبيه المشتل':'🌱 Nursery alert';$('nurseryAlertText').textContent=state.lang==='ar'?'المشتل فاضي! حان وقت زراعة بذرة جديدة.':'Your garden is empty! Time to plant a new seed.';$('nurseryAlertAction').textContent=state.lang==='ar'?'🌱 سأزرع':'🌱 I’ll plant';$('nurseryAlertDismiss').textContent=state.lang==='ar'?'تجاهل':'Dismiss';var n=notificationCount();$('staffBadge').hidden=!n;$('staffBadge').textContent=n;$('settingsPanel').hidden=!settingsOpen;$('settingsAudioPanel').hidden=!audioPanelOpen;$('topEditNames').setAttribute('aria-expanded',String(settingsOpen));$('identityPanel').hidden=!settingsOpen||!editingNames;$('editNames').textContent=state.lang==='ar'?(editingNames?'✕ إغلاق التعديل':'✏️ تعديل الأسماء'):(editingNames?'✕ Close editing':'✏️ Edit names');$('staffRole').textContent=state.lang==='ar'?'مديرة المشتل':'Nursery manager';$('nurseryNameLabel').textContent=w.nursery;$('catNameLabel').textContent=w.cat;$('nurseryEdit').hidden=state.namesSet&&!editingNames;$('catEdit').hidden=state.namesSet&&!editingNames;$('nurseryNameDone').hidden=!state.namesSet||editingNames;$('catNameDone').hidden=!state.namesSet||editingNames;$('nurseryNameDone').textContent=state.nurseryName;$('catNameDone').textContent=state.catName;if(document.activeElement!==$('nurseryNameInput'))$('nurseryNameInput').value=state.nurseryName;if(document.activeElement!==$('catNameInput'))$('catNameInput').value=state.catName;$('fertilizerStockLabel').textContent=state.lang==='ar'?'🌱 مخزون السماد':'🌱 Fertilizer stock';$('catFoodStockLabel').textContent=state.lang==='ar'?'🍲 مخزون أكل القطة':'🍲 Cat food stock';$('fertilizerStock').textContent=state.stock.fertilizer;$('catFoodStock').textContent=state.stock.catfood;$('stockHint').hidden=true;$('staffTitle').textContent=state.lang==='ar'?'ياسمين':'Yasmin';$('staffMood').textContent=w.mood+': '+st.mood+'%';$('staffDialogue').textContent=jokeAwaitingRating?st.dialogue:(!state.active&&!state.dismissedEmpty?(state.lang==='ar'?'يا مدير، المشتل فاضي! ازرع بذرة جديدة من دكّان البذور.':'Boss, the nursery is empty! Plant a new seed from the seed shop.'):st.request?w.request[st.request]:(state.stock.fertilizer<=1?(state.lang==='ar'?'يا مدير، السماد قرب يخلص! ضل '+state.stock.fertilizer+' بس.':'Boss, fertilizer is running low!') :state.stock.catfood<=1?(state.lang==='ar'?'يا مدير، أكل '+state.catName+' قرب يخلص!':'Boss, cat food is running low!'):state.cat.fullness<35?w.needCat:state.active&&state.quality<55?w.needWater:(jokeAwaitingRating?st.dialogue:st.dialogue||w.hello)));$('hireStaff').textContent=st.hired?(state.lang==='ar'?'✓ تم توظيف ياسمين':'✓ Jasmine hired'):w.hire;$('hireStaff').hidden=st.hired;$('hireStaff').disabled=st.hired||state.money<50;$('staffJoke').textContent=w.joke;$('staffJoke').disabled=!st.hired;$('staffRequest').hidden=!st.hired||!st.request;if(st.request){var req=requests.find(function(x){return x.type===st.request});if(req){$('requestTitle').textContent=state.lang==='ar'?'طلب من ياسمين':'Jasmine’s request';$('requestText').textContent=w.request[req.type];$('acceptRequest').textContent=w.yes+' 💰 '+req.cost;$('acceptRequest').disabled=state.money<req.cost;$('rejectRequest').textContent=w.no}}}
/* Names are confirmed with Enter or the check button, not on every keystroke. */
$('nurseryAlertDismiss').onclick=function(){state.dismissedEmpty=true;render()};$('nurseryAlertAction').onclick=function(){state.dismissedEmpty=true;activeArea='nursery';render();$('shop').scrollIntoView({behavior:'smooth',block:'center'})};$('staffTab').onclick=function(){activeArea='staff';render()};$('workersTab').onclick=function(){activeArea='workers';render()};$('hireStaff').onclick=function(){if(state.staff.hired||state.money<50)return;state.money-=50;sound('purchase');state.staff.hired=true;state.staff.dialogue=staffWords().hello;state.staff.nextRequest=Date.now()+30000;render()};$('staffJoke').onclick=function(){if(!state.staff.hired)return;var jokes=Array.from(new Set(staffWords().jokes.concat(state.lang==='ar'&&Array.isArray(window.YASMIN_JOKES)?window.YASMIN_JOKES.filter(function(j){return typeof j==='string'&&j.trim()}):[])));if(!jokeQueue.length||jokeQueue.some(function(j){return !jokes.includes(j)})){jokeQueue=jokes.slice();for(var i=jokeQueue.length-1;i>0;i--){var k=Math.floor(Math.random()*(i+1)),tmp=jokeQueue[i];jokeQueue[i]=jokeQueue[k];jokeQueue[k]=tmp}}state.staff.dialogue=jokeQueue.pop();jokeAwaitingRating=true;state.yasminFace='happy';sound('laugh');render()};$('jokeGood').onclick=function(){if(!jokeAwaitingRating)return;jokeAwaitingRating=false;state.staff.mood=Math.min(100,state.staff.mood+8);state.yasminFace='happy';state.staff.dialogue=state.lang==='ar'?'يا سلام! ضحكتك أحلى من البونص! 😂':'Yay! Your laugh is better than a bonus! 😂';sound('cheer');save();render()};$('jokeClose').onclick=function(){jokeAwaitingRating=false;render()};$('jokeBad').onclick=function(){if(!jokeAwaitingRating)return;jokeAwaitingRating=false;state.staff.mood=Math.max(0,state.staff.mood-7);state.yasminFace='sad';state.staff.dialogue=state.lang==='ar'?'آخ يا مدير! خلص رح جرّب نكتة أحسن المرة الجاية.':'Ouch, boss! I’ll try a better joke next time.';sound('sad');save();render()};$('acceptRequest').onclick=function(){var st=state.staff,req=requests.find(function(x){return x.type===st.request});if(!st.hired||!req||state.money<req.cost)return;state.money-=req.cost;sound(req.type==='bonus'?'cheer':'purchase');st.mood=Math.min(100,st.mood+(req.type==='bonus'?20:7));if(req.type==='fertilizer')state.stock.fertilizer+=5;if(req.type==='catfood')state.stock.catfood+=5;st.dialogue=staffWords().thanks;st.request=null;st.nextRequest=Date.now()+65000;render()};$('rejectRequest').onclick=function(){var st=state.staff;if(!st.request)return;sound(st.request==='bonus'?'sad':'reject');st.mood=Math.max(0,st.mood-8);st.dialogue=staffWords().refused;state.yasminFace='sad';st.request=null;st.nextRequest=Date.now()+65000;render()};
function renderAbu(){var a=state.abu,en=state.lang==='en';$('abuPanel').hidden=false;var worker=$('abuWorker');$('abuWagePay').hidden=!a.hired||!a.paused;$('abuWorkStatus').hidden=!a.hired;$('abuWorkStatus').textContent=a.paused?(en?'John is waiting for wages.':'أبو وردة متوقف بانتظار راتبه.'):(en?'John waters, fertilizes and removes pests automatically.':'أبو وردة يسقي ويسمّد ويكافح الدود تلقائياً.');if(worker){worker.hidden=!a.hired;worker.classList.toggle('paused',!!a.paused);worker.title=en?'John — nursery worker':'أبو وردة — عامل المشتل';}$('abuName').textContent=en?'John':'أبو وردة';$('abuStatus').textContent=!a.hired?(en?'Available after 6 sales':'بيفتح بعد 6 مبيعات'):a.paused?(en?'On break — wages due':'متوقف مؤقتاً — الراتب ناقص'):(en?'Working in the nursery':'عم يعتني بالنبتة');$('abuDialogue').textContent=!a.hired?(en?'Hire for 80 coins after 6 sales.':'بعد 6 مبيعات فيك توظفني بـ80 عملة، وبساعدك بالسقاية والحشرات.'):(a.paused?(en?'Pay 15 coins to resume work.':'يا مدير، في 15 عملة راتب مستحقة. ادفعلي وبرجع للشغل.'):(en?'I water the plant and remove harmful worms. I leave bees alone.':'أنا بسقي النبتة وبشيل الدود المؤذي، والنحل بخليه بحاله!'));$('hireAbu').hidden=a.hired&&!a.paused;$('hireAbu').disabled=state.money<(a.paused?15:80)||(!a.hired&&state.sales<ECONOMY_CONFIG.abuSales);$('hireAbu').textContent=a.paused?(en?'Pay wages · 15 coins':'💰 دفع الراتب · 15 عملة'):(en?'Hire John · 80 coins':'👨‍🌾 وظّف أبو وردة · 80 عملة');$('abuWage').textContent=en?'Wages: 15 coins every 3 sales after hiring.':'الراتب: 15 عملة كل 3 مبيعات بعد التوظيف. عدم الدفع بيوقف الشغل مؤقتاً.'}
$('hireAbu').onclick=function(){var a=state.abu;if(a.paused){if(!window.YasmineStaffCore.canPayWages(a,state.money,15))return;state.money-=15;a.paused=false;render();return}if(!window.YasmineStaffCore.canHire(a,state.money,state.sales,80,ECONOMY_CONFIG.abuSales))return;state.money-=80;a.hired=true;a.paidSales=0;a.lastCare=Date.now();sound('purchase');render()};
function renderNana(){var n=state.nana,en=state.lang==='en';var card=$('nanaPanel');var destination=$('workersArea');if(card.parentNode!==destination)destination.appendChild(card);$('nanaTitle').textContent=en?'Nana':'نانا';$('nanaRole').textContent=en?'Cat caretaker':'مربّية القطط';$('nanaStatus').textContent=!n.hired?(en?'Unlocks after 12 sales':'بيفتح بعد 12 مبيعة'):n.paused?(en?'Paused — wages due':'متوقفة بانتظار الراتب'):(en?'Caring for '+state.catName:'عم تهتم بـ'+state.catName);$('nanaDialogue').textContent=n.hired?(n.paused?(en?'Please pay my wages so I can help again.':'يا حبيبي، ادفعلي راتبي وبرجع دلّع القطة!'):(en?'I feed, brush and play with '+state.catName+'.':'أنا بطعمي '+state.catName+' وبمشّطها وبلعب معها.')):(en?'Hire me after 12 sales to care for your cat.':'بعد 12 مبيعة وظّفني، وأنا بدير بالي على القطة بحنية.');$('hireNana').hidden=n.hired&&!n.paused;$('hireNana').disabled=n.paused?state.money<20:n.hired||state.sales<12||state.money<120;$('hireNana').textContent=n.paused?(en?'Pay wages · 20 coins':'💰 دفع الراتب · 20 عملة'):(en?'Hire Nana · 120 coins':'👵 وظّف نانا · 120 عملة');$('nanaWage').textContent=en?'Wages: 20 coins every 3 sales. Unpaid wages pause her work.':'الراتب: 20 عملة كل 3 مبيعات، وعدم الدفع بيوقف شغلها مؤقتاً.'}
$('hireNana').onclick=function(){var n=state.nana;if(n.paused){if(!window.YasmineStaffCore.canPayWages(n,state.money,20))return;state.money-=20;n.paused=false}else{if(!window.YasmineStaffCore.canHire(n,state.money,state.sales,120,12))return;state.money-=120;n.hired=true;n.paidSales=0;n.lastCare=0}sound('purchase');save();render()};
var nanaLinesAr=['يا حبيبتي يا {cat}، بدك تاكلي؟','تعالي لعندي يا {cat}، بدي مشّطلك فروك!','يا روحي يا {cat}، شو هالعيون الحلوة!','تعالي نلعب بالريشة يا {cat}!','يا عيوني، ما بدي ياكي تجوعي!','إيه يا {cat}، شو هالدلال كله!','يا قمر، تعالي لعند نانا!','حبيبتي، فروك بدّه شوية ترتيب!','يا {cat}، خلّينا نلعب شوي!','الله يحميكي يا روح نانا!'];var nanaLinesEn=['Sweet {cat}, are you hungry?','Come here, {cat}, let me brush your fur!','Look at those lovely eyes, {cat}!','Let’s play with the feather, {cat}!','My darling, I won’t let you go hungry!','Oh {cat}, you are so spoiled!','Come to Nana, little sweetheart!','Your fur needs a little brushing!','Let’s play a bit, {cat}!','Stay safe, Nana’s little darling!'];var nanaFoodJokesAr=['📨 نانا: بعتت مسج لياسمين إنو خلص أكل مشمش... نشوف شو آخرتها معها!','👵 نانا: نشوف إمتى الست ياسمين رح تتسوّق!','🐱 نانا: شو شكلها مطوّلة الست ياسمين... في قطة جوعانة هون!'];
var nanaFoodJokesEn=['📨 Nana: I texted Jasmine that the cat food is gone. Let’s see what happens!','👵 Nana: Wonder when Jasmine will go shopping!','🐱 Nana: Jasmine is taking her time... there’s a hungry cat here!'];
function tickNana(){var n=state.nana;if(!window.YasmineStaffCore.canWork(n))return;var now=Date.now();
 if(!Number.isFinite(n.lastWater))n.lastWater=0;
 if(now-n.lastWater>=60000){n.lastWater=now;n.waterAt=now;n.action=state.lang==='ar'?'💧 نانا غيّرت المي وحطّت لمشمش مي نظيفة.':'💧 Nana refreshed the cat’s water bowl.';save()}
 if(state.stock.catfood<=0){
  if(state.staff.hired&&state.staff.request!=='catfood'){state.staff.request='catfood';state.staff.dialogue=state.lang==='ar'?'📨 نانا بعتتلي مسج: أكل مشمش خلص! لازم أشتري أكل للقطة.':'📨 Nana texted me: the cat food is gone! We need to buy more.';save()}
  if(now-(Number(n.lastWarn)||0)>=60000){n.lastWarn=now;n.foodJokeIndex=((Number(n.foodJokeIndex)||0)+1)%3;n.action=(state.lang==='ar'?nanaFoodJokesAr:nanaFoodJokesEn)[n.foodJokeIndex];save()}
  return;
 }
 if(now-n.lastCare<30000)return;var action='';if(state.cat.fullness<40){if(state.stock.catfood>0){state.stock.catfood--;state.cat.fullness=Math.min(100,state.cat.fullness+25);n.feedAt=now;action='feed'}}else if(window.YasmineStaffCore.nanaAction(state.cat,state.stock)==='brush'){state.cat.mood=Math.min(100,state.cat.mood+15);action='brush'}else if(window.YasmineStaffCore.nanaAction(state.cat,state.stock)==='play'){state.cat.mood=Math.min(100,state.cat.mood+10);action='play'}if(!action)return;n.lastCare=now;n.dialogueIndex=(n.dialogueIndex+1)%10;n.action=(state.lang==='ar'?({feed:'نانا أطعمت ',brush:'نانا مشّطت ',play:'نانا لعبت مع '}[action]):({feed:'Nana fed ',brush:'Nana brushed ',play:'Nana played with '}[action]))+state.catName;save()}
function tickAbu(){var a=state.abu;if(!window.YasmineStaffCore.abuCanCare(a,state.active,state.progress))return;var now=Date.now();if(ev==='pest'){clearTimeout(evTimeout);ev=null;$('event').hidden=true;msg(state.lang==='en'?'John removed the worm!':'أبو وردة شال الدودة وحمى النبتة!');a.lastCare=now;return}if(now-a.lastCare<5000)return;a.lastCare=now;state.progress=Math.min(100,state.progress+3.2);if(state.stock.fertilizer>0&&Math.random()<.45){state.stock.fertilizer--;state.progress=Math.min(100,state.progress+3);msg(state.lang==='en'?'John fertilized the plant.':'أبو وردة سمّد النبتة تلقائياً.')}else{msg(state.lang==='en'?'John watered the plant.':'أبو وردة سقى النبتة تلقائياً.')}state.quality=Math.min(100,state.quality+1)}
function tickStaff(){var st=state.staff;if(!st.hired)return;
 if(st.request==='catfood'&&state.stock.catfood>=3){st.request=null;st.nextRequest=Date.now()+65000;st.dialogue='';save()}
 if(st.request==='fertilizer'&&state.stock.fertilizer>=3){st.request=null;st.nextRequest=Date.now()+65000;st.dialogue='';save()}
 if(st.request)return;
 var urgent=state.stock.fertilizer<=0?'fertilizer':state.stock.catfood<=0?'catfood':null;
 if(Date.now()<st.nextRequest&&!urgent)return;
 var options=['bonus'];if(state.stock.fertilizer<3)options.push('fertilizer');if(state.stock.catfood<3)options.push('catfood');
 st.request=urgent||options[Math.floor(Math.random()*options.length)];st.dialogue='';save()}

function updateSky(){var mode=state.dayMode||'auto',hour=gameHour(),phase=window.YasmineGardenCore.skyPhase(mode,hour);$('scene').dataset.sky=phase;document.body.dataset.sky=phase;document.body.classList.toggle('night-ui',phase==='night'||phase==='dusk');var ar={night:'ليل',dawn:'فجر',sunrise:'شروق',morning:'ضحى',day:'نهار',sunset:'غروب',dusk:'غسق'},en={night:'Night',dawn:'Dawn',sunrise:'Sunrise',morning:'Morning',day:'Day',sunset:'Sunset',dusk:'Dusk'};$('skyPhase').textContent=(state.lang==='ar'?'السماء الآن: ':'Sky: ')+(state.lang==='ar'?ar[phase]:en[phase]);$('dayMode').value=mode;updateWeather();updateClock()}function tr(s){return txt[state.lang][s]}function msg(s){$('message').textContent=s}
function plantSVG(){var p=state.progress,flower=crops[state.kind].flower;if(!state.active){$('plant').innerHTML='';return}var h=Math.max(3,Math.round(22+p*1.45));if(state.kind==='sunflower'){h=Math.min(h,132)}if(state.kind==='mint'){var mint='<svg viewBox="0 0 220 210" aria-label="Mint">';var count=p<8?1:p<25?2:p<50?3:p<75?4:5;for(var m=0;m<count;m++){var x=70+m*20,top=195-Math.min(120,p*1.15)*(1-Math.abs(m-2)*.12);mint+='<path d="M110 210Q'+(x+10)+' 160 '+x+' '+top+'" fill="none" stroke="#74618b" stroke-width="4"/>';for(var t=0;t<Math.floor(p/17)+1;t++){var y=190-t*17;if(y<top+10)continue;for(var dir of [-1,1]){var xx=x+dir*17;mint+='<path d="M'+x+' '+y+' Q'+(x+dir*12)+' '+(y-17)+' '+(x+dir*27)+' '+(y-11)+' L'+(x+dir*24)+' '+(y-6)+' L'+(x+dir*29)+' '+(y-2)+' L'+(x+dir*20)+' '+(y+1)+' L'+(x+dir*19)+' '+(y+6)+' Q'+(x+dir*9)+' '+(y+8)+' '+x+' '+y+'" fill="#78c66b" stroke="#45965b" stroke-width="1.6"/><path d="M'+x+' '+y+'L'+xx+' '+(y-4)+'" stroke="#3d9151" stroke-width="1"/>'}}if(p>=80){for(var q=0;q<4;q++)mint+='<circle cx="'+(x+(q%2?5:-5))+'" cy="'+(top+q*5)+'" r="3.2" fill="#c7a7e8"/>'}}$('plant').innerHTML=mint+'</svg>';return}if(state.kind==='sunflower'){var yy=205-h;var petals='';for(var z=0;z<14;z++)petals+='<ellipse cx="110" cy="'+(yy-27)+'" rx="7" ry="19" fill="#f8c42c" stroke="#d99616" stroke-width="1" transform="rotate('+(z*360/14)+' 110 '+yy+')"/>';var flowerHead=p>=70?'<g>'+petals+'<circle cx="110" cy="'+yy+'" r="21" fill="#694027"/><circle cx="110" cy="'+yy+'" r="15" fill="#88522b"/>'+Array.from({length:12},function(_,i){var angle=i*2.399;return '<circle cx="'+(110+Math.cos(angle)*Math.sqrt(i)*4)+'" cy="'+(yy+Math.sin(angle)*Math.sqrt(i)*4)+'" r="1.5" fill="#3e291b"/>'}).join('')+'</g>':'';$('plant').innerHTML='<svg viewBox="0 0 220 210"><path d="M110 210 Q106 '+(yy+55)+' 110 '+yy+'" stroke="#3d8c43" stroke-width="9" fill="none"/>'+(p>25?'<ellipse cx="77" cy="155" rx="34" ry="15" fill="#4e9d4c" transform="rotate(25 77 155)"/><ellipse cx="144" cy="125" rx="35" ry="15" fill="#60aa4f" transform="rotate(-30 144 125)"/>':'')+flowerHead+'</svg>';return}if(state.kind==='rose'&&p>=70){var ry=205-h;var rose='<g transform="translate(110 '+Math.max(48,ry)+')"><path d="M-28 3Q-37 -21 -15 -30Q-9 -51 8 -35Q30 -43 29 -18Q43 -3 20 16Q0 34 -21 14Z" fill="#e94c70" stroke="#a52a4b" stroke-width="3"/><path d="M-15 -13Q-4 -32 13 -16Q24 -4 7 8Q-7 16 -12 0Q-15 -11 1 -12Q12 -11 6 -2" fill="none" stroke="#ff9bac" stroke-width="5" stroke-linecap="round"/><path d="M-24 15Q-12 29 0 19Q12 29 24 13" fill="none" stroke="#388b48" stroke-width="6"/></g>'; $('plant').innerHTML='<svg viewBox="0 0 220 210"><path d="M110 210Q105 155 110 '+Math.max(48,ry)+'" stroke="#378451" stroke-width="7" fill="none"/><ellipse cx="80" cy="154" rx="31" ry="13" fill="#4b9f59" transform="rotate(28 80 154)"/><ellipse cx="142" cy="125" rx="30" ry="13" fill="#65b76c" transform="rotate(-28 142 125)"/>'+rose+'</svg>';return}var leaves='',flowers='';for(var i=0;i<Math.floor(p/8);i++){var y=200-i*11,side=i%2?1:-1;leaves+='<ellipse cx="'+(110+side*18)+'" cy="'+y+'" rx="22" ry="9" fill="'+(i%3?'#48a45c':'#76bd68')+'" transform="rotate('+(side*25)+' '+(110+side*18)+' '+y+')"/>'}if(p>=70){for(var j=0;j<5;j++){var x=75+j*17,y2=205-h+Math.abs(j-2)*11;flowers+=p<100?'<ellipse cx="'+x+'" cy="'+y2+'" rx="5" ry="8" fill="'+flower+'"/>':'<g transform="translate('+x+' '+y2+')">'+[0,72,144,216,288].map(function(a){return '<ellipse cx="0" cy="-7" rx="5" ry="8" fill="'+flower+'" transform="rotate('+a+')"/>'}).join('')+'<circle r="3" fill="#f4c85e"/></g>'}}$('plant').innerHTML='<svg viewBox="0 0 220 210" aria-hidden="true"><path d="M110 210 Q95 '+(205-h/2)+' 110 '+(205-h)+'" stroke="#378451" stroke-width="6" fill="none" stroke-linecap="round"/>'+leaves+flowers+'</svg>'}
function renderNurseryNotice(){$('abuNotice').hidden=activeArea!=='nursery'||!(state.active&&state.progress>=100||!state.active)}function updateWeather(){var selected=state.weatherMode||'auto';var w=selected==='auto'?['clear','wind','rain','clear'][Math.floor((Date.now()-state.gameEpoch)/240000)%4]:selected;document.body.dataset.weather=w;$('scene').dataset.weather=w;$('weatherMode').value=selected;$('weatherStatus').textContent=(selected==='auto'?'🔄 ':'')+(w==='rain'?(state.lang==='ar'?'🌧️ مطر':'🌧️ Rain'):w==='wind'?(state.lang==='ar'?'💨 ريح':'💨 Wind'):(state.lang==='ar'?'☀️ صحو':'☀️ Clear'))}function gameHour(){if(!Number.isFinite(Number(state.gameEpoch)))state.gameEpoch=Date.now();return ((Math.floor((Date.now()-Number(state.gameEpoch))/120000)%24)+24)%24}function updateClock(){if(!Number.isFinite(Number(state.gameEpoch)))state.gameEpoch=Date.now();var elapsed=Math.floor((Date.now()-state.gameEpoch)/1000),minutes=Math.floor((elapsed%120)/2)%60,h=gameHour(),time=String(h%12||12).padStart(2,'0')+':'+String(minutes).padStart(2,'0')+' '+(h<12?'AM':'PM');$('gameTime').textContent=time;$('gameTime').setAttribute('dir','ltr');$('gameTime').style.direction='ltr';$('gameTime').style.unicodeBidi='isolate';$('skyClock').textContent=(state.lang==='ar'?'وقت اللعبة: ':'Game time: ')+time;$('skyClock').style.direction='ltr';$('skyClock').style.unicodeBidi='isolate'} function renderGoal(){var g=state.abu.hired?(state.nana.hired?null:{ar:'توظيف نانا',en:'Hire Nana',sales:12,cost:120}):{ar:'توظيف أبو وردة',en:'Hire John',sales:ECONOMY_CONFIG.abuSales,cost:80};var el=$('nextGoal');el.hidden=!g;if(!g)return;var en=state.lang==='en',ds=Math.max(0,g.sales-state.sales),dc=Math.max(0,g.cost-state.money);$('goalTitle').textContent=(en?'🎯 Next goal: ':'🎯 هدفك القادم: ')+g[en?'en':'ar'];$('goalSalesLabel').textContent=(en?'Sales: ':'المبيعات: ')+Math.min(state.sales,g.sales)+'/'+g.sales;$('goalCoinsLabel').textContent=(en?'Coins: ':'العملات: ')+Math.min(state.money,g.cost)+'/'+g.cost;$('goalSalesBar').value=Math.min(100,state.sales/g.sales*100);$('goalCoinsBar').value=Math.max(0,Math.min(100,state.money/g.cost*100));$('goalRemaining').textContent=en?ds+' more sales and '+dc+' coins needed':('باقي '+ds+' مبيعة و '+dc+' عملة لـ'+g.ar)}$('nextGoal').onclick=function(){activeArea='workers';render();$('workersArea').scrollIntoView({block:'start',behavior:'smooth'})};$('nextGoal').onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();$('nextGoal').click()}};
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
function render(){renderGoal();var cheapestSeedCost=Math.min.apply(null,Object.keys(crops).map(function(k){return crops[k].cost}));var needsSeed=!state.active&&state.money<cheapestSeedCost;$('emergencySeedBtn').hidden=!needsSeed;$('emergencySeedHint').hidden=!needsSeed;$('emergencySeedBtn').textContent=state.lang==='ar'?'🌱 ياسمين: بذرة إسعافية مجانية':'🌱 Jasmine: Free emergency seed';$('emergencySeedHint').textContent=state.lang==='ar'?'يا مدير، الخزنة فاضية! خُد بذرة ياسمين ببلاش وبلّش من جديد.':'Boss, the cash box is empty! Take a free jasmine seed and start growing again.';$('emergencyFertilizer').hidden=state.stock.fertilizer>0||!!state.emergencyFertilizerUsed;updateSky();$('employeesClose').textContent=state.lang==='ar'?'إغلاق':'Close';$('siteBack').textContent=state.lang==='ar'?'← الموقع':'← Website';$('daySettings').querySelector('label[for="dayMode"]').textContent=state.lang==='ar'?'🌤️ الوقت والسماء':'🌤️ Time & sky';$('daySettings').querySelector('label[for="weatherMode"]').textContent=state.lang==='ar'?'🌦️ الطقس':'🌦️ Weather';[['dayMode',['Automatic — day cycle','Always day','Always night']],['weatherMode',['Automatic — changing weather','Clear','Rain','Wind']]].forEach(function(x){var labels=state.lang==='en'?x[1]:x[0]==='dayMode'?['تلقائي — دورة اليوم','نهار دائم','ليل دائم']:['تلقائي — طقس متغير','صحو','مطر','ريح'];Array.from($(x[0]).options).forEach(function(o,i){o.textContent=labels[i]})});$('manualCare').hidden=!!state.abu.hired;$('careInfo').hidden=!!state.abu.hired;$('missionPanel').hidden=true;document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==='ar'?'rtl':'ltr';document.title=tr('title');['title','subtitle','moneyLabel','salesLabel','qualityLabel','water','feed','sun','careInfo','buyerTitle','buyerText','sell','shopTitle','shopInfo','missionTitle','missionInfo'].forEach(function(k){$(k).textContent=tr(k)});$('lang').textContent=state.lang==='ar'?'English':'العربية';$('gameFooter').textContent=state.lang==='ar'?'التقدم محفوظ على جهازك · النمو خلال اللعب فقط':'Progress saved on your device · Plants grow while playing';$('topEditNames').textContent=state.lang==='ar'?'⚙️ الإعدادات':'⚙️ Settings';$('settingsNames').textContent=state.lang==='ar'?'✏️ تعديل الأسماء':'✏️ Edit names';$('title').textContent='🌿 '+state.gardenName;$('settingsAudio').textContent=state.lang==='ar'?'🔊 تعديل الصوت':'🔊 Audio settings';$('employeesToggle').textContent=state.lang==='ar'?'👥 الموظفين':'👥 Employees';$('employeesTitle').textContent=state.lang==='ar'?'👥 الموظفين':'👥 Employees';$('yasminEmployeeName').textContent=state.lang==='ar'?'ياسمين — المديرة':'Jasmine — Manager';$('yasminEmployeeDescription').textContent=state.lang==='ar'?'مسؤولة عن المشتل والقطط':'Oversees the nursery and cats';$('yasminSalary').textContent=state.lang==='ar'?'👩🏻‍🌾 المديرة ياسمين — الراتب: لا يوجد راتب دوري؛ تطلب مبالغ للمشتريات أو المكافآت.':'👩🏻‍🌾 Manager Jasmine — no recurring salary; requests funds for supplies or bonuses.';$('abuSalary').textContent=state.lang==='ar'?'👨‍🌾 مسؤول المشتل أبو وردة — الراتب: 15 عملة كل 3 مبيعات. الحالة: '+(state.abu.hired?(state.abu.paused?'متوقف':'يعمل'):'غير موظف'):'👨‍🌾 Nursery manager John — 15 coins every 3 sales. Status: '+(state.abu.hired?(state.abu.paused?'paused':'working'):'not hired');$('restartGame').textContent=state.lang==='ar'?'🔄 إعادة اللعبة من البداية':'🔄 Restart game';$('money').textContent='💰 '+state.money;$('sales').textContent=state.sales;$('quality').textContent=state.quality+'%';$('qualityReason').textContent=state.qualityCause||(state.lang==='ar'?'الجودة ممتازة، ما في ضرر مسجّل.':'Excellent quality; no recorded damage.');var crop=crops[state.kind];$('cropName').textContent=state.active?crop[state.lang]:'—';$('growth').style.width=state.progress+'%';$('pct').textContent=Math.floor(state.progress)+'%';$('stage').textContent=state.active?tr('stages')[Math.min(5,Math.floor(state.progress/20))]:'—';var remaining=Math.max(0,Math.ceil(crop.time*(100-state.progress)/100));$('clock').textContent='⏱ '+String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');var ready=state.active&&state.progress>=100;$('sell').disabled=!ready;var price=Math.round(crop.price*(.5+state.quality/200)*(state.sales<ECONOMY_CONFIG.starterSales?1+ECONOMY_CONFIG.starterBonus:1));$('offer').hidden=!ready;$('offer').textContent=ready?'💰 '+price:'';$('buyerText').textContent=ready?tr('ready'):tr('buyerText');['water','feed','sun'].forEach(function(k){$(k).disabled=!state.active||ready||Date.now()-last[k]<5000});$('mission').textContent=state.sales>=3?tr('won'):tr('mission')+' ('+state.sales+'/3)';var shopSignature=state.lang+'|'+state.active+'|'+Object.keys(crops).map(function(k){return state.money>=crops[k].cost?'1':'0'}).join('');if($('shop').dataset.signature!==shopSignature){$('shop').replaceChildren();Object.keys(crops).forEach(function(k){var c=crops[k],b=document.createElement('button');b.textContent='🌱 '+c[state.lang]+' · 💰 '+c.cost;b.disabled=state.active||state.money<c.cost;b.onclick=function(){buy(k)};$('shop').appendChild(b)});$('shop').dataset.signature=shopSignature}plantSVG();renderCat();renderStaff();renderNurseryNotice();updateAudioButtons();save()}
$('emergencySeedBtn').onclick=function(){var cheapest=Math.min.apply(null,Object.keys(crops).map(function(k){return crops[k].cost}));if(state.active||state.money>=cheapest)return;var c=crops.jasmine;state.dismissedEmpty=false;state.kind='jasmine';state.progress=0;state.quality=100;state.qualityCause='';state.care=0;state.active=true;msg(state.lang==='ar'?'👩🏻‍🌾 ياسمين: يا مدير الخزنة فاضية، خد هالبذرة ببلاش وابدأ من جديد!':'👩🏻‍🌾 Jasmine: Boss, take this seed for free and start again!');sound('plant');save();render()};
function buy(k){var c=crops[k];if(state.active){msg(tr('busy'));return}if(state.money<c.cost){msg(tr('need'));return}state.money-=c.cost;state.dismissedEmpty=false;state.kind=k;state.progress=0;state.quality=100;state.qualityCause='';state.care=0;state.active=true;msg(tr('plant')+c[state.lang]);sound('plant');render()}
$('buyFertilizerDirect').onclick=function(){if(state.money<10)return;state.money-=10;state.stock.fertilizer+=5;save();render();msg(state.lang==='ar'?'اشتريت 5 وحدات سماد.':'Bought 5 fertilizer portions.');sound('purchase')};$('emergencyFertilizer').onclick=function(){if(state.stock.fertilizer>0||state.emergencyFertilizerUsed)return;state.stock.fertilizer=2;state.emergencyFertilizerUsed=true;save();render();msg(state.lang==='ar'?'حصلت على وحدتين سماد مجاناً!':'You received two free fertilizer portions!')};function care(k){if(state.abu.hired){msg(state.lang==='ar'?'أبو وردة مسؤول عن السقاية والتسميد تلقائياً.':'John handles watering and fertilizer automatically.');return}if(!state.active||state.progress>=100||Date.now()-last[k]<5000)return;if(k==='feed'){if(state.stock.fertilizer<=0){msg(state.lang==='ar'?'السماد خلص! اشتري سماد من زر الشراء بقسم ياسمين، حتى قبل توظيفها.':'Fertilizer is empty! Ask Jasmine to restock.');if(state.staff.hired)state.staff.request='fertilizer';render();return}state.stock.fertilizer--}last[k]=Date.now();state.care++;state.progress=Math.min(100,state.progress+3.2);if(state.care%7===0){state.quality=Math.max(30,state.quality-3);state.qualityCause=state.lang==='ar'?'عناية زائدة بالنبتة: ناقص 3%':'Excessive care: -3%';msg(tr('over'))}else msg(tr(k==='water'?'waterMsg':k==='feed'?'feedMsg':'sunMsg'));sound(k);render()}
function sell(){if(!state.active||state.progress<100)return;var amount=Math.round(crops[state.kind].price*(.5+state.quality/200)*(state.sales<ECONOMY_CONFIG.starterSales?1+ECONOMY_CONFIG.starterBonus:1));state.money+=amount;state.sales++;state.eventEarned=0;state.eventCycleSales=state.sales;if(state.abu.hired){state.abu.paidSales++;if(state.abu.paidSales>=3){state.abu.paidSales=0;if(state.money>=15)state.money-=15;else state.abu.paused=true}}if(state.nana.hired){state.nana.paidSales++;if(state.nana.paidSales>=3){state.nana.paidSales=0;if(state.money>=20)state.money-=20;else state.nana.paused=true}}state.active=false;state.progress=0;msg(tr('sold')+'💰 '+amount);sound('sell');render()}
function eventBudget(){var price=crops[state.kind].price*(.5+state.quality/200);return Math.max(0,Math.floor(price*ECONOMY_CONFIG.eventSaleCap)-state.eventEarned)}
function awardEvent(amount){var n=Math.min(amount,eventBudget());if(n>0){state.money+=n;state.eventEarned+=n;state.extraEarned+=n}return n}
var eventNext=Date.now()+ECONOMY_CONFIG.eventMinMs,eventTaps=0;
function scheduleEvent(){eventNext=Date.now()+window.YasmineGardenCore.eventDelay(ECONOMY_CONFIG.eventMinMs,ECONOMY_CONFIG.eventMaxMs,Math.random())}
function eventSpawn(){if(!state.active||state.progress>=100||ev||activeArea!=='nursery'||document.hidden||document.querySelector('dialog[open],#catSheetOverlay:not([hidden])')||settingsOpen)return;ev=window.YasmineGardenCore.randomEvent(Math.random());eventTaps=0;var b=$('event');b.hidden=false;b.textContent=ev==='bee'?'🐝':ev==='dew'?'💧':'🐛';b.setAttribute('aria-label',ev==='bee'?'Bee':ev==='dew'?'Dew':'Worm');b.style.left=ev==='dew'?'54%':'15%';b.style.top=ev==='dew'?'48%':'32%';evTimeout=setTimeout(function(){if(!ev)return;if(ev==='pest'){state.quality=Math.max(30,state.quality-ECONOMY_CONFIG.pestQualityLoss);state.qualityCause=state.lang==='ar'?'دودة: ناقص 2%':'Worm: -2%'}ev=null;b.hidden=true;render()},ECONOMY_CONFIG.eventDurationMs)}
$('event').onclick=function(){if(!ev)return;var type=ev;if(type==='pest'&&++eventTaps<ECONOMY_CONFIG.pestTaps){$('event').textContent='🐛 '+(ECONOMY_CONFIG.pestTaps-eventTaps);return}clearTimeout(evTimeout);var reward=awardEvent(ECONOMY_CONFIG.eventRewards[type]);msg((state.lang==='ar'?'مكافأة الحدث: +':'Event reward: +')+reward);sound(type==='pest'?'pest':'bee');ev=null;$('event').hidden=true;render()};
['water','feed','sun'].forEach(function(k){$(k).onclick=function(){care(k)}});$('sell').onclick=sell;$('lang').onclick=function(){state.lang=state.lang==='ar'?'en':'ar';history.replaceState(null,'',location.pathname+(state.lang==='en'?'?lang=en':''));render()};$('reset').onclick=function(){if(confirm(state.lang==='ar'?'متأكد بدك تعيد اللعبة من البداية؟ رح تنمسح كل المصاري والمبيعات والأسماء والقطة وتوظيف ياسمين.':'Restart from scratch? All coins, sales, names, cat and Jasmine progress will be erased.')){state={gameEpoch:Date.now(),dayMode:'auto',weatherMode:'auto',yasminFace:'',emergencyFertilizerUsed:false,catTreats:0,catSpy:{status:'idle',report:'',end:0},catHunt:{status:'idle',end:0},catItems:{},catEquipped:{},gardenName:'حديقة السعادة',dismissedEmpty:false,money:50,sales:0,kind:'jasmine',progress:0,quality:100,care:0,active:true,lang:state.lang,cat:freshCat(),nurseryName:'مشتل الياسمينة',catName:'مشمش',namesSet:false,stock:{fertilizer:4,catfood:3},staff:{hired:false,mood:60,request:null,nextRequest:Date.now()+45000,dialogue:''},abu:{hired:false,paidSales:0,paused:false,lastCare:0},nana:{hired:false,paidSales:0,paused:false,lastCare:0,lastWarn:0,dialogueIndex:0,action:''},eventEarned:0,eventCycleSales:0,extraEarned:0,catHuntLast:0,catCoinTimes:[],catFoodRescueAt:0};catLast={};catMessage=null;catSeconds=0;editingNames=false;settingsOpen=false;audioPanelOpen=false;jokeAwaitingRating=false;activeArea='nursery';lastNotificationCount=0;wasReady=false;lastTick=Date.now();last={water:0,feed:0,sun:0};clearTimeout(catAnimationTimer);clearTimeout(evTimeout);ev=null;$('event').hidden=true;window.YasmineCatCore.clearAction($('catScene'));$('catScene').classList.remove('is-napping');try{localStorage.removeItem(key)}catch(e){}msg('');render()}};

/* Mimi: petting, treats and playful inspection of John's nursery work. */
if(typeof state.catTreats!=='number')state.catTreats=0;
if(!state.catSpy||typeof state.catSpy!=='object')state.catSpy={status:'idle',report:'',end:0};
function purrCat(){
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
 if(state.catSpy.status==='running'||!state.abu.hired)return;
 state.catSpy={status:'running',report:'',end:Date.now()+8000};
 activeArea='nursery';sound('notify');save();render();
 $('nurseryArea').scrollIntoView({behavior:'smooth',block:'center'});
};
$('catTreatReward').onclick=function(){
 if(state.catTreats<1||state.catSpy.status!=='done')return;
 state.catTreats--;state.cat.mood=Math.min(100,state.cat.mood+18);
 state.catSpy.status='rewarded';sound('feed');save();render();
};
function renderCatExtras(){
 var ar=state.lang==='ar',spy=state.catSpy;
 $('catTreatBuy').textContent=ar?'🍬 اشتري 3 حبة مكافأة لـ'+state.catName+' · 💰 10':'🍬 Buy 3 treats · 💰 10';
 $('catTreatBuy').disabled=state.money<10;
 $('catTreatCount').textContent=(ar?'🍬 الحبة مكافأة المتوفرة: ':'🍬 Treats available: ')+state.catTreats;
 if(spy.status==='running'&&Date.now()>=spy.end){
  var sleeping=state.abu.paused||(!state.active&&Math.random()<.45);
  spy.status='done';spy.report=sleeping?'sleeping':'working';sound('notify');save();
 }
 $('catSpy').textContent=spy.status==='running'?(ar?'🐾 '+state.catName+' عم تتجسس...':'🐾 '+state.catName+' is spying...'):(ar?'🕵️ ابعت '+state.catName+' تتجسس على أبو وردة':'🕵️ Send '+state.catName+' to spy on John');
 $('catSpy').disabled=spy.status==='running'||!state.abu.hired;
 $('catSpyReport').textContent=spy.status==='running'?(ar?state.catName+' رايحة تتفقد المشتل، استناها شوي...':''+state.catName+' is checking the nursery...'):spy.report?(spy.report==='sleeping'?(ar?'🐱 '+state.catName+': كمشتو نايم! 😴':'🐱 '+state.catName+': Caught John napping! 😴'):(ar?'🐱 '+state.catName+': أبو وردة عم يكدح بالمشتل! 💪':'🐱 '+state.catName+': John is working hard! 💪')):(ar?'دلّع '+state.catName+' بلمسة، وابعتها بمهمة تجسس!':'Tap '+state.catName+' to pet her, or send her on a spy mission!');
 $('catTreatReward').hidden=spy.status!=='done';
 $('catTreatReward').textContent=ar?'🍬 كافئ '+state.catName+' بحبة مكافأة':'🍬 Reward '+state.catName+' with a treat';
 $('catTreatReward').disabled=state.catTreats<1;
}

/* Visible spy mission: Mimi sneaks into the nursery and watches John. */
var spyStyle=document.createElement('style');
spyStyle.textContent='#spyMimi{position:absolute;bottom:6%;left:-24%;width:100px;height:75px;z-index:15;pointer-events:none;transition:left 3s ease-in-out;filter:drop-shadow(0 5px 4px #0004)}#spyMimi.spy-in{left:18%}#spyMimi.spy-out{left:105%}#spyMimi svg{width:100%;height:100%}#spyCaption{position:absolute;left:8%;right:8%;top:2%;bottom:auto;z-index:17;background:#fff9e6e8;color:#27442d;border-radius:15px;padding:8px;text-align:center;font-weight:bold;pointer-events:none}';
document.head.appendChild(spyStyle);
var spyMimi=document.createElement('div');spyMimi.id='spyMimi';spyMimi.hidden=true;
spyMimi.innerHTML='<svg viewBox="0 0 120 95" aria-hidden="true"><path d="M19 47L16 13L43 29Q60 20 78 28L104 12L102 48Q109 71 84 83Q57 94 32 80Q12 69 19 47Z" fill="#edab61" stroke="#a76234" stroke-width="3"/><path d="M24 34L22 23L40 34M82 34L99 22L96 37" fill="#f3a6a0"/><ellipse cx="45" cy="54" rx="5" ry="7" fill="#322b25"/><ellipse cx="78" cy="54" rx="5" ry="7" fill="#322b25"/><path d="M55 66L66 66L60 72Z" fill="#bc7073"/><path d="M60 72Q51 80 45 73M60 72Q69 80 75 73" stroke="#8a5236" stroke-width="2.5" fill="none"/></svg>';
$('scene').appendChild(spyMimi);
var spyCover=document.createElement('div');spyCover.id='spyCover';spyCover.hidden=true;spyCover.setAttribute('aria-hidden','true');spyCover.innerHTML='<svg viewBox="0 0 130 90" aria-hidden="true"><rect x="15" y="38" width="104" height="45" rx="8" fill="#a7764b" stroke="#795335" stroke-width="3"/><path d="M15 51H119M37 38V83M96 38V83" stroke="#d2a477" stroke-width="4"/><path d="M17 37Q22 12 42 25Q54 0 70 23Q94 5 111 32" fill="#428d57" stroke="#27653d" stroke-width="3"/><path d="M34 26Q23 10 17 16M69 22Q76 8 88 12M103 27Q114 15 123 22" fill="none" stroke="#428d57" stroke-width="9" stroke-linecap="round"/></svg>';$('scene').appendChild(spyCover);
var spyCaption=document.createElement('div');spyCaption.id='spyCaption';spyCaption.hidden=true;$('scene').appendChild(spyCaption);
var spyVisualStarted=0;
function updateSpyScene(){
 var spy=state.catSpy, running=spy.status==='running',ar=state.lang==='ar';
 if(!running){spyMimi.hidden=true;spyCaption.hidden=true;spyCover.hidden=true;spyVisualStarted=0;return}
 spyMimi.hidden=false;spyCaption.hidden=false;spyCover.hidden=false;
 var remain=spy.end-Date.now();
 spyCaption.textContent=remain>4000?(ar?'🐾 '+state.catName+' عم تتسلّل لتراقب أبو وردة...':'🐾 '+state.catName+' is sneaking up on John...'):(ar?'🤫 ششش... '+state.catName+' عم تتلصّص!':'🤫 Shhh... '+state.catName+' is spying!');
 if(!spyVisualStarted){spyVisualStarted=Date.now();spyMimi.className='';requestAnimationFrame(function(){spyMimi.className='spy-in spy-peek'})}
 if(remain<1800)spyMimi.className='spy-out';
}
setInterval(function(){
 updateSpyScene();
 var spy=state.catSpy;
 if(spy.status==='running'&&Date.now()>=spy.end){
  spy.status='done';spy.report=state.abu.paused?'sleeping':'working';sound('notify');save();
  activeArea='cat';render();$('catArea').scrollIntoView({behavior:'smooth',block:'center'});
 }
},250);


/* Mimi boutique and occasional naps */
if(!state.catItems)state.catItems={};
var catBoutiqueCatalog=[{id:'bed',ar:'🛏️ تخت {cat}',en:'🛏️ {cat} bed',cost:25},{id:'glasses',ar:'🕶️ نظارات شمسية',en:'🕶️ Sunglasses',cost:15},{id:'hat',ar:'👒 طاقية',en:'👒 Hat',cost:15}];
var shopOpen=false;var shopButton=document.createElement('button');shopButton.id='catBoutiqueTitle';shopButton.type='button';shopButton.setAttribute('aria-expanded','false');$('catShopMount').appendChild(shopButton);$('catMouseReport').after($('catSpyReport'));$('catSpyReport').after($('catMouseReward'));$('catMouseReward').after($('catTreatReward'));
var sheetOverlay=document.createElement('div');sheetOverlay.id='catSheetOverlay';sheetOverlay.hidden=true;sheetOverlay.innerHTML='<div id="catSheet" role="dialog" aria-modal="true" aria-labelledby="catSheetHeading"><div class="sheet-grip"></div><div class="sheet-head"><b id="catSheetHeading"></b><button type="button" id="catSheetClose" aria-label="Close">✕</button></div><p id="catSheetBalance"></p></div>';document.body.appendChild(sheetOverlay);$('catSheet').appendChild($('catBoutique'));function setShopOpen(open){shopOpen=open;sheetOverlay.hidden=!open;$('catBoutiqueItems').hidden=!open;$('catBoutiqueItems').style.display=open?'grid':'none';$('catBoutiqueTitle').setAttribute('aria-expanded',String(open));document.body.classList.toggle('cat-shop-open',open);if(open){$('catSheetClose').focus();renderBoutique()}}$('catBoutiqueTitle').onclick=function(){setShopOpen(!shopOpen)};$('catSheetClose').onclick=function(){setShopOpen(false);$('catBoutiqueTitle').focus()};sheetOverlay.addEventListener('click',function(e){if(e.target===sheetOverlay)setShopOpen(false)});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&shopOpen)setShopOpen(false)});
var boutiqueStyle=document.createElement('style');boutiqueStyle.textContent='.cat-heading{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.cat-heading{margin-bottom:16px!important}.cat-heading h2{margin:0!important}.cat-heading button{width:auto!important;flex-shrink:0;padding:10px 13px;font-size:clamp(13px,3vw,18px)}#catBoutique{padding:0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important}#catBoutiqueItems:not([hidden]){margin:12px 0;padding:12px;border:1px solid #8295a4;border-radius:18px}#catScene{position:relative}#catAccessories{position:absolute;inset:0;pointer-events:none;z-index:4}#catAccessories svg{width:100%;height:100%}#catBed{position:absolute;inset:0;pointer-events:none;z-index:2;opacity:.95}#catScene:not(.is-napping) #catBed{transform:none;opacity:1}#catScene:not(.is-napping) .mimi-sleeping-cat{display:none}#catScene.is-napping #catBed{z-index:3}#catBed svg{width:100%;height:100%}#catSleep{position:absolute;left:58%;top:16%;font-size:28px;pointer-events:none;z-index:5;animation:cat-snooze 2s ease-in-out infinite alternate}@keyframes cat-snooze{to{transform:translateY(-12px);opacity:.3}}#catScene.is-napping>svg{visibility:hidden}#catScene.is-napping #catBed{z-index:3}#catScene.is-napping #catAccessories{display:none}#catBoutiqueItems[hidden]{display:none!important} #catBed .mimi-sleeping-cat{transform-box:fill-box;transform-origin:center 65%;animation:mimi-breathe 3.8s ease-in-out infinite alternate}@keyframes mimi-breathe{from{transform:scale(1)}to{transform:scale(1.03)}}@media(prefers-reduced-motion:reduce){#catBed .mimi-sleeping-cat,#catSleep{animation:none!important}}';document.head.appendChild(boutiqueStyle);
var catAccessories=document.createElement('div');catAccessories.id='catAccessories';$('catScene').appendChild(catAccessories);
var catBed=document.createElement('div');catBed.id='catBed';$('catScene').appendChild(catBed);
var nanaCareScene=document.createElement('div');nanaCareScene.id='nanaCareScene';nanaCareScene.hidden=true;nanaCareScene.innerHTML=`<svg viewBox="0 0 110 165" preserveAspectRatio="xMidYMax meet" aria-label="نانا مربّية القطط"><ellipse cx="54" cy="160" rx="34" ry="4" fill="#8d715a" opacity=".17"/><path d="M37 137L35 156H51L53 137M62 137L61 156H77L74 137" fill="#776887" stroke="#655675" stroke-width="2"/><path d="M28 77Q18 93 15 133L23 144Q54 153 87 144L94 133Q88 94 77 77Z" fill="#b899d2" stroke="#866ba9" stroke-width="3"/><path d="M39 91L38 139Q54 146 73 139L70 91Z" fill="#fff0dc" stroke="#e0cdb7" stroke-width="2"/><path d="M25 88Q13 99 15 121L24 123L34 101M83 88Q96 99 95 122L86 125L75 102" fill="#efbb9e" stroke="#d79a7c" stroke-width="8" stroke-linecap="round"/><path d="M32 34Q25 15 47 10Q71 1 83 22Q91 36 81 56L29 57Z" fill="#aeb4c2" stroke="#8d95a5" stroke-width="3"/><circle cx="83" cy="21" r="16" fill="#aeb4c2" stroke="#8d95a5" stroke-width="3"/><ellipse cx="54" cy="52" rx="27" ry="31" fill="#f2bea3" stroke="#d99b82" stroke-width="2"/><path d="M29 44Q27 21 48 23Q64 17 80 35L78 44Q58 29 29 44Z" fill="#aeb4c2"/><circle cx="43" cy="52" r="9" fill="none" stroke="#796879" stroke-width="2.5"/><circle cx="64" cy="52" r="9" fill="none" stroke="#796879" stroke-width="2.5"/><path d="M52 52H55" stroke="#796879" stroke-width="2"/><circle cx="43" cy="52" r="2" fill="#4d3b43"/><circle cx="64" cy="52" r="2" fill="#4d3b43"/><path d="M47 68Q54 75 62 68" stroke="#a35f69" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="33" cy="62" rx="6" ry="4" fill="#e8a0a1" opacity=".6"/><ellipse cx="74" cy="62" rx="6" ry="4" fill="#e8a0a1" opacity=".6"/><path d="M36 84L45 95L54 86L64 95L73 84" fill="none" stroke="#fff4e3" stroke-width="3"/><g class="nana-hand-bowl"><ellipse cx="91" cy="115" rx="15" ry="5" fill="#e9b5a7" stroke="#ad6660" stroke-width="2"/><path d="M76 115H106L102 128Q91 133 80 128Z" fill="#c46f65" stroke="#ad6660" stroke-width="2"/><path d="M81 115Q90 107 101 115" fill="#b88347"/></g></svg>`;$('catScene').appendChild(nanaCareScene);
var catSleep=document.createElement('div');catSleep.id='catSleep';catSleep.textContent='💤';$('catScene').appendChild(catSleep);
function renderBoutique(){
 var ar=state.lang==='ar';$('catSheetHeading').textContent=ar?'متجر '+state.catName:state.catName+' shop';$('catSheetBalance').textContent=(ar?'رصيدك: ':'Balance: ')+state.money+' 💰';$('catBoutiqueTitle').textContent=(ar?'🛍️ متجر '+state.catName:'🛍️ '+state.catName+' shop')+(shopOpen?' ▴':' ▾');
 var root=$('catBoutiqueItems');root.replaceChildren();
 catBoutiqueCatalog.concat([{id:'treat',ar:'🍬 3 حبات مكافأة',en:'🍬 3 reward treats',cost:10}]).forEach(function(item){
  var owned=item.id!=='treat'&&!!state.catItems[item.id],b=document.createElement('button');
  b.textContent=(ar?item.ar:item.en).replace('{cat}',state.catName)+(owned?(item.id==='bed'?(ar?' ✓ موجود':' ✓ Owned'):(state.catEquipped&&state.catEquipped[item.id]!==false?(ar?' ✓ لابستها — اضغط لتشيلها':' ✓ Wearing — tap to remove'):(ar?' — اضغط لتلبسها':' — Tap to wear'))):' · 💰 '+item.cost);
  b.disabled=!owned&&state.money<item.cost;
  b.onclick=function(){if(owned){if(item.id!=='bed'){state.catEquipped=state.catEquipped||{};state.catEquipped[item.id]=state.catEquipped[item.id]===false;save();render()}return}if(state.money<item.cost)return;state.money-=item.cost;if(item.id==='treat')state.catTreats+=3;else state.catItems[item.id]=true;sound('purchase');save();render()};
  root.appendChild(b);
 });

 var napping=!!state.catItems.bed&&Math.floor(Date.now()/45000)%5===0;
 var worn='';
 if(state.catItems.hat&&(!state.catEquipped||state.catEquipped.hat!==false))worn+='<g transform="translate(91 0) rotate(-8 23 15)"><path d="M3 19Q7 1 23 0Q39 1 43 19L43 23Q23 27 3 23Z" fill="#f4a2b6" stroke="#d1728a" stroke-width="2"/><path d="M7 19Q23 24 39 19" fill="none" stroke="#fff0f5" stroke-width="3"/><circle cx="23" cy="-2" r="5" fill="#fff" stroke="#d1728a" stroke-width="1.5"/></g>';
 if(state.catItems.glasses&&(!state.catEquipped||state.catEquipped.glasses!==false))worn+='<g stroke="#46372d" stroke-width="2"><ellipse cx="104" cy="45" rx="12" ry="8" fill="#303b4a"/><ellipse cx="124" cy="45" rx="12" ry="8" fill="#303b4a"/><path d="M114 43h1M92 43l-8 -4M136 43l8 -4" fill="none"/></g>';
 $('catWornAccessories').innerHTML=worn;catAccessories.innerHTML='';
 catBed.innerHTML=state.catItems.bed?`<svg viewBox="0 0 230 120" preserveAspectRatio="xMidYMid meet" aria-label="Soft oval cat bed"><defs><radialGradient id="catBedPillow"><stop stop-color="#fff3df"/><stop offset="1" stop-color="#e8b9a5"/></radialGradient></defs><ellipse cx="115" cy="110" rx="106" ry="9" fill="#987054" opacity=".16"/><ellipse cx="115" cy="71" rx="109" ry="48" fill="#b87961" stroke="#8d594c" stroke-width="4"/><ellipse cx="115" cy="65" rx="93" ry="37" fill="#e3ac93" stroke="#d3937e" stroke-width="5"/><ellipse cx="115" cy="63" rx="78" ry="28" fill="url(#catBedPillow)" stroke="#f5d4bd" stroke-width="3"/><path d="M18 73Q25 112 115 112Q204 112 212 73" fill="none" stroke="#b87961" stroke-width="13" stroke-linecap="round"/><path d="M27 78Q35 102 115 102Q195 102 203 78" fill="none" stroke="#e2a88e" stroke-width="6" stroke-linecap="round"/><path d="M65 59Q115 42 164 59" fill="none" stroke="#fff7eb" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg>`:'';

 nanaCareScene.hidden=!state.nana.hired||state.nana.paused;nanaCareScene.classList.toggle('feeding',Date.now()-(Number(state.nana.feedAt)||0)<4500);nanaCareScene.classList.toggle('watering',Date.now()-(Number(state.nana.waterAt)||0)<4500);catBed.hidden=!state.catItems.bed;catSleep.hidden=true;$('catScene').classList.remove('is-napping');
}
/* Put the reward action directly below both mission buttons, with reports below it. */
$('catMouseHunt').after($('catMouseReward'));
$('catMouseReward').after($('catTreatReward'));
$('catTreatReward').after($('catMouseReport'));
$('catMouseReport').after($('catSpyReport'));
/* Mimi's mouse patrol uses the same nursery camera as the spy mission. */
if(!state.catHunt||typeof state.catHunt!=='object')state.catHunt={status:'idle',end:0};
var mouse=document.createElement('div');mouse.id='huntMouse';mouse.innerHTML='<svg viewBox="0 0 120 90" width="55" height="45"><path d="M20 58Q0 46 9 30" stroke="#b7aeb8" stroke-width="5" fill="none"/><circle cx="41" cy="29" r="18" fill="#f1a7b8"/><circle cx="83" cy="28" r="18" fill="#f1a7b8"/><ellipse cx="62" cy="53" rx="42" ry="29" fill="#a6a8b2"/><circle cx="48" cy="47" r="4"/><circle cx="76" cy="47" r="4"/><circle cx="62" cy="59" r="5" fill="#eaa2b2"/></svg>';mouse.hidden=true;
mouse.style.cssText='position:absolute;bottom:9%;right:8%;font-size:45px;z-index:16;transition:right 3s linear;pointer-events:none';
$('scene').appendChild(mouse);
$('catMouseHunt').onclick=function(){
 if(state.catHunt.status==='running')return;
 var now=Date.now();if(window.YasmineCatCore.huntCooldownRemaining(now,state.catHuntLast,ECONOMY_CONFIG.catCooldownMs)>0){$('catMouseReport').textContent=state.lang==='ar'?'القطة بدها ترتاح 3 دقايق بين الصيدات.':'The cat needs a 3-minute rest between hunts.';return}state.catHuntLast=now;var eligible=window.YasmineCatCore.canHunt(state.cat,ECONOMY_CONFIG);state.cat.fullness=Math.max(0,state.cat.fullness-ECONOMY_CONFIG.catFullnessCost);state.catHunt={status:'running',end:now+4800,variant:Math.floor(Math.random()*3),coinEligible:eligible};
 activeArea='cat';save();render();
};
$('catMouseReward').onclick=function(){
 if(state.catHunt.status!=='done'||state.catTreats<1)return;
 state.catTreats--;state.cat.mood=Math.min(100,state.cat.mood+20);
 state.catHunt.status='rewarded';sound('feed');save();render();
};
var previousRenderCatExtras=renderCatExtras;
renderCatExtras=function(){
 previousRenderCatExtras();renderBoutique();
 var ar=state.lang==='ar',hunt=state.catHunt;
 $('catMouseHunt').textContent=ar?'🐭 ابعت '+state.catName+' جولة بالمشتل لتصيد فأرة':'🐭 Send '+state.catName+' on a mouse patrol';
 $('catMouseHunt').disabled=hunt.status==='running';
 $('catMouseReport').textContent=hunt.status==='running'?(ar?state.catName+' عم تفتش عن الفأرة...':''+state.catName+' is looking for the mouse...'):(hunt.status==='done'||hunt.status==='rewarded')?(ar?'🐱 '+state.catName+' كمشت الفأرة وطردتها من المشتل!':'🐱 '+state.catName+' caught the mouse and chased it away!'):'';
 $('catMouseReward').hidden=hunt.status!=='done';
 $('catMouseReward').textContent=ar?'🍬 كافئ '+state.catName+' بحبة مكافأة على شطارتها':'🍬 Reward '+state.catName+' with a treat';
 $('catMouseReward').disabled=state.catTreats<1;
};
setInterval(function(){
 var hunt=state.catHunt;
 if(hunt.status!=='running'){mouse.hidden=true;$('catHuntStage').hidden=true;return}
 mouse.hidden=true;spyMimi.hidden=true;spyCaption.hidden=true;spyCover.hidden=true;$('catHuntStage').hidden=false;var elapsed=4800-Math.max(0,hunt.end-Date.now());$('catHuntStage').dataset.phase=elapsed<1300?'spot':elapsed<2900?'crouch':'chase';$('catHuntStage').dataset.variant=hunt.variant||0;
 var remain=hunt.end-Date.now();
 if(remain>4500){
  spyMimi.className='spy-in';mouse.style.right='8%';
 }else{
  spyMimi.className='spy-in';mouse.style.right='38%';
 }
 spyCaption.hidden=true;
 if(remain<=0){
  hunt.status='done';if(hunt.coinEligible&&Math.random()<ECONOMY_CONFIG.catChance){var now=Date.now();state.catCoinTimes=state.catCoinTimes.filter(function(t){return now-t<3600000});var room=ECONOMY_CONFIG.catHourlyCap-state.catCoinTimes.length;var coins=Math.min(room,ECONOMY_CONFIG.catRewards[Math.floor(Math.random()*ECONOMY_CONFIG.catRewards.length)]);if(coins>0){state.money+=coins;state.extraEarned+=coins;for(var ci=0;ci<coins;ci++)state.catCoinTimes.push(now);$('catMouseReport').textContent=state.lang==='ar'?'القطة لقت '+coins+' عملة!':'Cat found '+coins+' coins!'}}mouse.hidden=true;spyMimi.hidden=true;spyCaption.hidden=true;$('catHuntStage').hidden=true;
  sound('cheer');save();activeArea='cat';render();
  $('catArea').scrollIntoView({behavior:'smooth',block:'center'});
 }
},250);

var previousRenderCat=renderCat;
renderCat=function(){previousRenderCat();renderCatExtras();var n=state.nana;$('nanaCatAction').hidden=!n.hired||!n.action;$('nanaCatAction').textContent=n.hired?(n.action||''):'';$('nanaCatWater').hidden=!n.hired;$('nanaCatWaterText').textContent=state.lang==='ar'?'💧 نانا بتغيّر مي مشمش وبتحطّلها مي نظيفة بشكل دوري.':'💧 Nana regularly refreshes the cat’s water bowl.';if(n.hired&&!n.paused){$('nanaDialogue').textContent=(state.lang==='ar'?nanaLinesAr:nanaLinesEn)[n.dialogueIndex%10].replace('{cat}',state.catName)}};

var lastNotificationCount=notificationCount();var lastTick=Date.now(),wasReady=state.active&&state.progress>=100;setInterval(function(){updateClock();updateSky();if(state.weatherMode==='auto')updateWeather();var now=Date.now(),delta=Math.max(0,Math.min(2,(now-lastTick)/1000));lastTick=now;if(document.hidden)return;tickCat(delta);tickStaff();tickAbu();tickNana();var n=notificationCount();if(n>lastNotificationCount&&state.staff.hired)sound('notify');lastNotificationCount=n;if(state.active&&state.progress<100){state.progress=window.YasmineGardenCore.growth(state.progress,delta,crops[state.kind].time);if(state.progress>=100&&!wasReady){sound('bloom');wasReady=true}render()}else render();if(!state.active||state.progress<100)wasReady=false},1000);setInterval(function(){if(Date.now()>=eventNext){scheduleEvent();if(!document.hidden&&activeArea==='nursery')eventSpawn()}},1000);render();msg(state.lang==='ar'?'بلّش اعتني بالياسمينة!':'Start caring for your jasmine!');
if(audioSettings.music)tryPlayMusic();
})();
