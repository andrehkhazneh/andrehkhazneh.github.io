(function(root){
'use strict';
const tiers=[
 {capacity:15},
 {level:4,price:100,leaves:3,scraps:2,yield:5,seconds:180,capacity:30},
 {level:6,price:200,leaves:5,scraps:3,yield:8,seconds:120,capacity:60},
 {level:8,price:350,leaves:8,scraps:4,yield:12,seconds:60,capacity:100}
];
function data(state){
 return state.compost||(state.compost={tier:0,leaves:0,scraps:0,gathered:0,batches:0,units:0,invested:0,batch:null});
}
function add(state,kind){
 const c=data(state);
 if(c[kind]>=tiers[c.tier].capacity)return false;
 c[kind]++;c.gathered++;return true;
}
function canStart(c){
 const t=tiers[c.tier];
 return c.tier>0&&!c.batch&&c.leaves>=t.leaves&&c.scraps>=t.scraps;
}
function improve(state,level,charge){
 const c=data(state),next=tiers[c.tier+1];
 if(!next||c.batch||level<next.level||state.money<next.price)return false;
 charge(-next.price,['compostBuy','compostUpgrade2','compostUpgrade3'][c.tier]);
 c.tier++;c.invested+=next.price;return true;
}
function start(state,now){
 const c=data(state),t=tiers[c.tier];
 if(!canStart(c))return false;
 c.leaves-=t.leaves;c.scraps-=t.scraps;
 c.batch={start:now,end:now+t.seconds*1000,units:t.yield};return true;
}
function ready(c,now){return !!c.batch&&now>=c.batch.end}
function collect(state,now){
 const c=data(state);
 if(!ready(c,now))return 0;
 const amount=c.batch.units;
 state.stock.fertilizer+=amount;c.organicStock=(c.organicStock||0)+amount;c.units+=amount;c.batches++;c.batch=null;return amount;
}
// Only one finished batch can be waiting. Moving it into stock leaves lifetime output unchanged.
function production(c,now){
 const pending=ready(c,now)?c.batch.units:0;
 const units=c.units+pending;
 return {completed:c.batches+Number(pending>0),collected:c.batches,units,pending,
   value:units*2,investment:c.invested,net:(c.organicUsed||0)*2-c.invested};
}
function clock(seconds){return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')}
const el=id=>document.getElementById(id);
function put(id,text){const n=el(id);if(n.textContent!==text)n.textContent=text}
let lastUpgrade=-Infinity,lastAction=-Infinity;
function tick(state,seconds,save){
 const c=data(state);
 const previous=c.gatherSeconds||0;
 const elapsed=previous+Math.max(0,Math.min(2,seconds));
 c.gatherSeconds=elapsed%30;
 if(elapsed>=30){
   add(state,'leaves');add(state,'scraps');save();
 }
}
let feedbackUntil=0;
function feedback(text){feedbackUntil=Date.now()+5000;put('compostFeedback',text)}
function render(state,h){
 if(Date.now()>=feedbackUntil)put('compostFeedback','');
 const c=data(state),t=tiers[c.tier],next=tiers[c.tier+1],en=state.lang==='en',now=Date.now();
 const txt=(ar,english)=>en?english:ar,level=root.YasmineGardenCore.levelFor(state.sales);
 const done=ready(c,now),batch=c.batch,recipe=c.tier?t:tiers[1];
 if(done&&!batch.notified){batch.notified=true;h.save()}
 const left=batch?Math.max(0,Math.ceil((batch.end-now)/1000)):0;
 const status=batch?(done?txt('جاهز للجمع','Ready to collect'):clock(left)):!c.tier?(level<4?txt('🔒 المستوى 4','🔒 Level 4'):txt('متاحة للشراء','Available to buy')):canStart(c)?txt('جاهزة لبدء التصنيع','Ready to start'):txt('عم نجمع المواد','Gathering materials');
 const panel=el('compostStation');
 put('compostTitle',txt('محطة السماد العضوي','Organic Compost Station'));
 put('compostStatus',status);el('compostBadge').hidden=!(done||canStart(c));
 el('compostArt').style.backgroundPosition=(Math.max(c.tier-1,0)*50)+'% center';el('compostArt').dataset.phase=batch?(done?'ready':'working'):c.tier?'empty':'locked';
 put('compostInventory',txt('🍂 أوراق ','🍂 Leaves ')+c.leaves+'/'+t.capacity+txt(' · 🌿 بقايا ',' · 🌿 Scraps ')+c.scraps+'/'+t.capacity+txt(' · سماد بالمخزون ',' · Fertilizer in stock ')+state.stock.fertilizer);
 const mins=recipe.seconds/60;
 const duration=en?mins+(mins===1?' minute':' minutes'):['','دقيقة','دقيقتين','٣ دقايق'][mins];
 put('compostRecipe',done?txt('دفعتك جاهزة: ','Ready to collect: ')+batch.units+txt(' سماد',' fertilizer'):batch?txt('عم يتحضّر السماد · باقي ','Composting · ')+clock(left):txt('بتصنع ','Make ')+recipe.yield+txt(' سماد خلال ',' fertilizer in ')+duration);
 const needL=Math.max(0,recipe.leaves-c.leaves),needS=Math.max(0,recipe.scraps-c.scraps);
 el('compostNeeds').hidden=!!batch||!c.tier;
 put('compostLeaves',txt('🍂 أوراق يابسة · معك ','🍂 Dry leaves · Have ')+c.leaves+txt('، المطلوب ',' · Need ')+recipe.leaves);
 put('compostScraps',txt('🌿 بقايا نباتات · معك ','🌿 Plant scraps · Have ')+c.scraps+txt('، المطلوب ',' · Need ')+recipe.scraps);
 const instructions=needL||needS?[txt('المواد بتتجمع لحالها كل ٣٠ ثانية لعب. البيع بيسرّع التجميع.','Materials arrive every 30 seconds of play. Selling plants speeds this up.')]:[];
 put('compostHint',!c.tier?(level<4?txt('بتفتح المحطة بالمستوى 4. فيك تجمع المواد من هلّق.','Unlocks at level 4. You can already gather materials.'):txt('اشتري الصندوق لتصنع السماد من الأوراق وبقايا النباتات.','Buy the bin to make fertilizer from leaves and scraps.')):batch&&!done?txt('فيك تسكّر اللعبة وترجع تجمع دفعتك.','You can close the game and collect your batch later.'):batch?'':instructions.join(' '));
 const action=el('compostAction'),upgrade=el('compostUpgrade'),buy=el('compostBuy');
 action.hidden=!done&&!canStart(c);action.disabled=action.hidden;
 buy.hidden=!!c.tier||level<4;buy.disabled=state.money<tiers[1].price;
 put('compostBuy',txt('اشتري المحطة · 100 عملة','Buy station · 100 coins'));
 put('compostAction',batch?(done?txt('اجمع السماد · ','Collect fertilizer · ')+batch.units:txt('جاري التصنيع · ','Composting · ')+clock(left)):txt('ابدأ تصنيع السماد','Start composting'));
 el('compostProgress').hidden=!batch||done;if(batch)el('compostProgress').value=Math.min(1,(now-batch.start)/(batch.end-batch.start));
 upgrade.hidden=!next||!c.tier;
 if(next){upgrade.disabled=!!batch||state.money<next.price||level<next.level;put('compostUpgrade',(c.tier?txt('تطوير المحطة','Upgrade station'):txt('شراء المحطة','Buy station'))+' · '+next.price+' 🪙 · '+txt('المستوى ','Level ')+next.level)}
 const book=production(c,now),value=book.value,net=book.net;
 const stats=txt('دفعات جمعتها: ','Batches collected: ')+c.batches+txt(' · وحدات سماد: ',' · Fertilizer units: ')+book.units+txt(' · قيمة تقديرية: ',' · Estimated value: ')+value+txt(' · استثمار: ',' · Investment: ')+c.invested+' · '+(net<0?txt('باقي لاسترداد التكلفة: ','Left to break even: '):txt('صافي الوفر التقديري: ','Estimated net savings: '))+Math.abs(net)+' 🪙';
 put('compostStatsTitle',txt('تفاصيل المحطة','Station details'));put('compostStats',stats);
 put('compostLedgerTitle',txt('توفير السماد العضوي','Organic compost savings'));
 put('compostLedgerStats',[
   txt('من بداية تشغيل المحطة','Lifetime station totals'),
   txt('دفعات اكتمل تصنيعها: ','Completed batches: ')+book.completed,
   txt('دفعات تم جمعها: ','Collected batches: ')+book.collected,
   txt('إجمالي السماد المنتج: ','Total fertilizer produced: ')+book.units,
   txt('وحدات جاهزة بانتظار الجمع: ','Units awaiting collection: ')+book.pending,
   txt('قيمة الإنتاج بسعر وحدتين نقديتين لكل سماد: ','Production valued at 2 coins per unit: ')+book.value+' 🪙',
   txt('سماد عضوي استعملته من وقت تحديث الدفتر: ','Organic units used since ledger update: ')+(c.organicUsed||0),
   txt('تكلفة شراء المحطة وتطويرها: ','Station purchase and upgrades: ')+book.investment+' 🪙',
   txt('صافي الوفر التقديري: ','Estimated net savings: ')+book.net+' 🪙',
   txt('الدفتر بيحسب هالتقدير لحاله. الرصيد والربح النقدي بيتغيّروا بالحركات المالية الفعلية.','This estimate is separate from the cash balance and net cash result.')
 ].join('\n'));
 const route=el('compostRequest'),fert=state.staff.hired&&state.staff.request==='fertilizer';
 route.hidden=!fert||(!batch&&!canStart(c));
 if(!route.hidden){put('compostRequest',done?txt('اجمع السماد الجاهز','Collect ready fertilizer'):txt('افتح المحطة','Open station'));put('requestText',done?txt('يا مدير، السماد جاهز بالصندوق!','There’s fertilizer ready to collect!'):batch?txt('باقي ','Time left: ')+clock(left)+txt(' للدفعة. فينا نشتري إذا مستعجلين.','. We can buy now if needed.'):txt('مواد الدفعة جاهزة. منبلّش التصنيع أو منشتري؟','We have enough materials. Compost or buy?'))}
 if(done||canStart(c)){el('nurseryBadge').hidden=false;el('nurseryBadge').textContent=h.potAlerts()+1}
 if(panel.dataset.bound)return;
 panel.dataset.bound='1';
 route.onclick=()=>{h.open();panel.open=true;panel.scrollIntoView({block:'center'})};
 action.onclick=()=>{const s=h.state();if(performance.now()-lastAction<650)return;let message;
   if(data(s).batch){const amount=collect(s,Date.now());if(!amount)return;
     message=s.lang==='en'?'Collected '+amount+' · Stock: '+s.stock.fertilizer:'انضاف '+amount+' سماد · صار عندك '+s.stock.fertilizer;
   }else{if(!start(s,Date.now()))return;message=s.lang==='en'?'Batch started.':'بلّشت الدفعة.'}
   lastAction=performance.now();h.save();h.render();feedback(message);
 };
 buy.onclick=upgrade.onclick=()=>{const s=h.state();if(performance.now()-lastUpgrade<650||!improve(s,root.YasmineGardenCore.levelFor(s.sales),h.charge))return;lastUpgrade=performance.now();h.save();h.render();put('compostFeedback','')};
}
root.YasmineCompost={data,add,improve,start,collect,ready,production,tick,render};
})(window);
