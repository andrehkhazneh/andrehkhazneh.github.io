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
 charge(-next.price,c.tier?'compostUpgrade':'compostBuy');
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
 state.stock.fertilizer+=amount;c.units+=amount;c.batches++;c.batch=null;return amount;
}
function clock(seconds){return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')}
const el=id=>document.getElementById(id);
function put(id,text){const n=el(id);if(n.textContent!==text)n.textContent=text}
let owner,leafDelay=0,lastWeather='',lastUpgrade=-Infinity,lastAction=-Infinity;
const leaves=[];
function clearLeaves(){for(const leaf of leaves)leaf.node.remove();leaves.length=0;leafDelay=0;lastWeather=''}
function tick(state,seconds,inNursery,save){
 const weather=document.getElementById('scene').dataset.weather;
 if(owner!==state||!inNursery){clearLeaves();owner=state;return}
 const c=data(state),wind=weather==='wind';
 function interval(){return (wind?30:90)+Math.random()*(wind?30:60)}
 if(lastWeather!==weather||!leafDelay){lastWeather=weather;leafDelay=interval()}
 for(let i=leaves.length-1;i>=0;i--){
   const leaf=leaves[i];leaf.age+=seconds;
   if(leaf.age>=8&&state.abu.hired&&!state.abu.paused&&add(state,'leaves')){
     leaf.node.remove();leaves.splice(i,1);save();
   }else if(leaf.age>=45){leaf.node.remove();leaves.splice(i,1)}
 }
 if(weather!=='clear'&&!wind)return;
 leafDelay-=seconds;
 if(leafDelay>0)return;
 leafDelay=interval();
 if(leaves.length>=3||c.leaves>=tiers[c.tier].capacity)return;
 const node=document.createElement('button'),leaf={node,age:0};
 node.className='compost-leaf';node.type='button';node.textContent='🍂';
 node.setAttribute('aria-label',state.lang==='en'?'Collect a dry leaf':'اجمع ورقة يابسة');
 node.style.left=(12+Math.random()*65)+'%';node.style.bottom=(2+Math.random()*13)+'%';
 node.onclick=()=>{const i=leaves.indexOf(leaf);if(owner!==state||i<0)return;
   if(add(state,'leaves')){leaves.splice(i,1);node.remove();save();put('compostFeedback',state.lang==='en'?'Leaf collected · '+c.leaves:'جمعت ورقة · عندك '+c.leaves)}
 };
 leaves.push(leaf);el('scene').append(node);
}
function render(state,h){
 const c=data(state),t=tiers[c.tier],next=tiers[c.tier+1],en=state.lang==='en',now=Date.now();
 const txt=(ar,english)=>en?english:ar,level=root.YasmineGardenCore.levelFor(state.sales);
 const done=ready(c,now),batch=c.batch,recipe=c.tier?t:tiers[1];
 if(done&&!batch.notified){batch.notified=true;h.save()}
 const left=batch?Math.max(0,Math.ceil((batch.end-now)/1000)):0;
 const status=batch?(done?txt('جاهز للجمع','Ready to collect'):clock(left)):!c.tier?(level<4?txt('🔒 المستوى 4','🔒 Level 4'):txt('متاحة للشراء','Available to buy')):canStart(c)?txt('المواد جاهزة','Materials ready'):txt('بانتظار المواد','Waiting for materials');
 const panel=el('compostStation');
 put('compostTitle',txt('محطة السماد العضوي','Organic Compost Station'));
 put('compostStatus',status);el('compostBadge').hidden=!done;
 el('compostArt').style.backgroundPosition=(Math.max(c.tier-1,0)*50)+'% center';el('compostArt').dataset.phase=batch?(done?'ready':'working'):c.tier?'empty':'locked';
 put('compostInventory',txt('🍂 أوراق ','🍂 Leaves ')+c.leaves+'/'+t.capacity+txt(' · 🌿 بقايا ',' · 🌿 Scraps ')+c.scraps+'/'+t.capacity+txt(' · سماد بالمخزون ',' · Fertilizer in stock ')+state.stock.fertilizer);
 put('compostRecipe',txt('دفعة المستوى ','Tier ')+(c.tier||1)+txt(' · أوراق ',' · Leaves ')+recipe.leaves+txt(' + بقايا ',' + scraps ')+recipe.scraps+' → '+recipe.yield+txt(' سماد · ',' fertilizer · ')+clock(recipe.seconds));
 put('compostWorker',state.abu.hired&&!state.abu.paused&&c.tier?(done?txt('أبو وردة: السماد جاهز للجمع!','John: Your compost is ready!'):canStart(c)?txt('أبو وردة: جهزتلك المواد، فيك تبلّش دفعة.','John: Materials ready. Start a batch when you like.'):''):'');
 const needL=Math.max(0,recipe.leaves-c.leaves),needS=Math.max(0,recipe.scraps-c.scraps);
 const full=c.leaves===t.capacity||c.scraps===t.capacity;
 put('compostHint',full?txt('مخزن المواد الممتلئ ما عاد يستقبل زيادة.','A full material bin cannot take more.'):batch?'':needL||needS?txt('ناقص للدفعة: ','Still needed: ')+[needL?needL+txt(' أوراق',' leaves'):'',needS?needS+txt(' بقايا',' scraps'):''].filter(Boolean).join(' + '):txt('كل المواد متوفرة.','All materials available.'));
 const action=el('compostAction'),upgrade=el('compostUpgrade');
 action.hidden=!c.tier;action.disabled=batch?!done:!canStart(c);
 put('compostAction',batch?(done?txt('اجمع السماد · ','Collect fertilizer · ')+batch.units:txt('جاري التصنيع · ','Composting · ')+clock(left)):txt('ابدأ تصنيع السماد','Start composting'));
 el('compostProgress').hidden=!batch;if(batch)el('compostProgress').value=Math.min(1,(now-batch.start)/(batch.end-batch.start));
 upgrade.hidden=!next;
 if(next){upgrade.disabled=!!batch||state.money<next.price||level<next.level;put('compostUpgrade',(c.tier?txt('تطوير المحطة','Upgrade station'):txt('شراء المحطة','Buy station'))+' · '+next.price+' 🪙 · '+txt('المستوى ','Level ')+next.level)}
 const value=c.units*2,net=value-c.invested;
 const stats=txt('دفعات جمعتها: ','Batches collected: ')+c.batches+txt(' · وحدات سماد: ',' · Fertilizer units: ')+c.units+txt(' · قيمة تقديرية: ',' · Estimated value: ')+value+txt(' · استثمار: ',' · Investment: ')+c.invested+' · '+(net<0?txt('باقي لاسترداد التكلفة: ','Left to break even: '):txt('صافي الوفر التقديري: ','Estimated net savings: '))+Math.abs(net)+' 🪙';
 put('compostStatsTitle',txt('إحصائيات المحطة','Station statistics'));put('compostStats',stats);
 put('compostLedgerTitle',txt('توفير السماد العضوي','Organic compost savings'));put('compostLedgerStats',stats);
 const route=el('compostRequest'),fert=state.staff.hired&&state.staff.request==='fertilizer';
 route.hidden=!fert||(!batch&&!canStart(c));
 if(!route.hidden){put('compostRequest',done?txt('اجمع السماد الجاهز','Collect ready fertilizer'):txt('افتح المحطة','Open station'));put('requestText',done?txt('يا مدير، السماد جاهز بالصندوق!','There’s fertilizer ready to collect!'):batch?txt('باقي ','Time left: ')+clock(left)+txt(' للدفعة. فينا نشتري إذا مستعجلين.','. We can buy now if needed.'):txt('مواد الدفعة جاهزة. منبلّش التصنيع أو منشتري؟','We have enough materials. Compost or buy?'))}
 if(done){el('nurseryBadge').hidden=false;el('nurseryBadge').textContent=h.potAlerts()+1}
 if(panel.dataset.bound)return;
 panel.dataset.bound='1';
 route.onclick=()=>{h.open();panel.open=true;panel.scrollIntoView({block:'center'})};
 action.onclick=()=>{const s=h.state();if(performance.now()-lastAction<650)return;let message;
   if(data(s).batch){const amount=collect(s,Date.now());if(!amount)return;
     message=s.lang==='en'?'Collected '+amount+' · Stock: '+s.stock.fertilizer:'انضاف '+amount+' سماد · صار عندك '+s.stock.fertilizer;
   }else{if(!start(s,Date.now()))return;message=s.lang==='en'?'Batch started.':'بلّشت الدفعة.'}
   lastAction=performance.now();h.save();h.render();put('compostFeedback',message);
 };
 upgrade.onclick=()=>{const s=h.state();if(performance.now()-lastUpgrade<650||!improve(s,root.YasmineGardenCore.levelFor(s.sales),h.charge))return;lastUpgrade=performance.now();h.save();h.render();put('compostFeedback',s.lang==='en'?'Station ready.':'المحطة جاهزة.')};
}
root.YasmineCompost={data,add,improve,start,collect,ready,tick,render};
})(window);
