/* Bilingual field notes for the nine crops grown in the nursery. */
(function () {
'use strict';
const entries = {
 mint: {
  species:'Mentha spicata',
  fact:['على سطح ورقة النعنع غدد صغيرة بتخزّن زيت عطري. جرّب تفرك ورقة بلطف بين أصابعك وتشمّ ريحتها.','Tiny glands on a spearmint leaf store fragrant oil. Gently rub a leaf between your fingers and smell the scent it releases.'],
  steps:[
   ['قصّ طرف غصن سليم وشيل أوراقه السفلية.','Take a healthy shoot tip and remove its lower leaves.'],
   ['حطّ أسفل الساق بكاسة مي نظيفة وخلي الأوراق فوق المي.','Stand the bare stem in clean water, keeping the leaves above the surface.'],
   ['لما تطلع الجذور، انقله لأصيص مثقوب وحافظ على رطوبة التراب.','When roots appear, pot it into a container with drainage holes and keep the mix moist.']],
  note:['أنا بعطي النعنع أصيص لحاله. بيحب ياخد راحته!','I give mint a pot of its own. It likes a little room to roam!'],
  sources:[['RHS','https://www.rhs.org.uk/herbs/mint/grow-your-own'],['UC Agriculture','https://ucanr.edu/node/125167/printable/print'],['BMC Plant Biology','https://pmc.ncbi.nlm.nih.gov/articles/PMC4232691/']]
 },
 rose: {
  species:'Rosa × damascena',
  fact:['بعض أصناف الورد الدمشقي، مثل كازانليك، عطرها قوي لدرجة إن المزارعين بيقطفوا بتلاتها لصنع ميّ الورد وزيت الورد.','Some Damask roses, including Kazanlik, have such fragrant petals that growers harvest them for rose water and rose oil.'],
  steps:[
   ['ابدأ بشتلة ورد دمشقي مجذّرة، واختارلها مكان مشمس ومحمي من الريح.','Choose a rooted Damask rose and a sunny spot sheltered from wind.'],
   ['احفر حفرة واسعة تساع الجذور، بتربة بتصرّف المي منيح.','Dig a hole wide enough for the roots in soil that drains well.'],
   ['ردّ التراب حول الجذور واسقِه بتمهّل. راقب الرطوبة لحتى تثبت الشتلة.','Backfill around the roots and water slowly. Check soil moisture while the shrub establishes.']],
  note:['قرّب شوي من الزهرة. أحياناً أول شي بتتذكّره منها هو ريحتها.','Lean a little closer. Sometimes the scent is what you remember first.'],
  sources:[['NC State Extension','https://plants.ces.ncsu.edu/plants/rosa-x-damascena-kazanlik/common-name/summer-damask/']]
 },
 jasmine: {
  species:'Jasminum officinale',
  fact:['الياسمين البلدي بيحمل زهره الأبيض العطري بعناقيد صغيرة. واللي بيبان كأنه عدة أوراق على غصن قصير ممكن يكون وريقات لورقة وحدة.','Common jasmine carries clusters of scented white flowers. What looks like a little branch of leaves can be the leaflets of a single compound leaf.'],
  steps:[
   ['اختار شتلة ياسمين بلدي ومكان مشمس ودافي ومحمي من الريح الباردة.','Start with a common jasmine plant in a sunny, sheltered spot.'],
   ['ازرعها بتربة بتصرّف المي، وحط تعريشة متينة جنبها.','Plant in free-draining soil beside a sturdy trellis.'],
   ['وجّه الأغصان الصغيرة عالتعريشة واربطها برخاوة لتقدر تكبر.','Guide young stems onto the trellis and tie them loosely so they can thicken.']],
  note:['تطلّع بنهاية الغصن. هونيك بتلاقي مجموعة الزهرات البيض سوا.','Look at the tip of the stem. That’s where you’ll find a cluster of white flowers.'],
  sources:[['RHS · Jasmine','https://www.rhs.org.uk/plants/9454/jasminum-officinale/details'],['RHS · Growing guide','https://www.rhs.org.uk/plants/jasmine/growing-guide']]
 },
 sunflower: {
  species:'Helianthus annuus',
  fact:['دوّار الشمس بيستقبل زوّار مختلفين خلال الموسم. النحل بيزور الأزهار، وبعد ما تنضج البذور بتصير أكل لطيور مثل الحسون.','A sunflower feeds different visitors as the season turns. Bees visit its flowers, and finches can feed on the seeds that follow.'],
  steps:[
   ['بعد ما يمرّ خطر الصقيع، ازرع البذرة بمكان مشمس حسب العمق المكتوب على الظرف.','After frost danger passes, sow in a sunny spot at the depth on the seed packet.'],
   ['اسقِ بلطف وخلي بين الشتلات المسافة الموصى فيها للصنف.','Water gently and space seedlings according to the variety.'],
   ['للأصناف الطويلة، ثبّت دعامة واربط الساق فيها برخاوة.','Give tall varieties a stake and loosely tie the stem to it.']],
  note:['خلّي راس زهرة ناضج للعصافير وشوف مين بيزورك.','Leave a ripe seed head for the birds and see who visits.'],
  sources:[['RHS · Sunflower','https://www.rhs.org.uk/plants/105515/helianthus-annuus/details'],['RHS · Growing guide','https://www.rhs.org.uk/plants/helianthus/growing-guide']]
 },
 basil: {
  species:'Ocimum basilicum',
  fact:['لما تقطف رأس غصن الحبق فوق زوج أوراق، بتشجّع البراعم الجانبية تكبر، وبتصير النبتة أكثف.','Pinching a basil shoot just above a pair of leaves encourages side shoots and gives you a bushier plant.'],
  steps:[
   ['ازرع البذور بأصيص صغير فيه فتحات تصريف بمكان دافي ومضيء.','Sow seeds in a small pot with drainage holes in a warm, bright place.'],
   ['حافظ على رطوبة خفيفة، وانقل الشتلات لأصص أوسع لما تكبر ويصير فيها أوراق حقيقية.','Keep the mix lightly moist. Once seedlings have true leaves and are growing well, move them into larger pots.'],
   ['بعد ما تقوى النبتة، اقطف القمة فوق زوج أوراق وخلي تحته أوراق كفاية.','Once established, pinch a tip above a pair of leaves, leaving plenty of foliage below.']],
  note:['دور على ورقتين طالعين من نفس النقطة عالساق. اقرص رأس الغصن فوقهن مباشرة وخلي الورقتين عالنبتة، حتى تطلع فروع جديدة من هالمكان.','Find two leaves growing opposite each other on the stem. Pinch the tip just above them and leave both leaves in place so side shoots can grow there.'],
  sources:[['RHS','https://www.rhs.org.uk/propagation/propagating-herbs'],['Royal Botanical Gardens','https://www.rbg.ca/app/uploads/Plant-Profiles-final-2024_1.pdf']]
 },
 lavender: {
  species:'Lavandula angustifolia',
  fact:['حتى قبل الإزهار فيك تميّز الخزامى الإنكليزية من أوراقها الرفيعة الرمادية المخضرّة. الأوراق كمان إلها ريحة عطرية.','Even before flowering, English lavender has distinctive narrow, grey-green leaves. Its foliage is aromatic too.'],
  steps:[
   ['ابدأ بشتلة خزامى إنكليزية وأصيص مثقوب بمكان مشمس.','Start with an English lavender plant and a pot with drainage holes in full sun.'],
   ['استعمل خلطة سريعة التصريف وازرع الشتلة بنفس مستوى تربتها السابق.','Use a free-draining potting mix and plant at the same level as before.'],
   ['اسقِ بعد الزرع واترك المي الزايدة تطلع. افحص التربة قبل السقاية الجاية.','Water after planting and let excess water escape. Check the mix before watering again.']],
  note:['شوف كيف السنابل البنفسجية طالعة فوق الورق الفضي.','Notice how the purple spikes stand above the silvery foliage.'],
  sources:[['RHS · Lavender','https://www.rhs.org.uk/plants/91398/lavandula-angustifolia/details'],['RHS · Growing guide','https://www.rhs.org.uk/plants/lavender/growing-guide']]
 },
 tulip: {
  species:'Tulipa',
  fact:['بصلة التوليب فيها مخزون غذاء بيساعدها تطلع أول زهرة. وبعد الإزهار، الأوراق الخضرا بتساعدها تعبي مخزونها من جديد.','A tulip bulb holds food for its first flower. After flowering, green leaves help replenish the bulb’s reserves.'],
  steps:[
   ['بالمناخ البارد والمعتدل، اختار أبصال سليمة للزراعة بالخريف.','In cool and temperate climates, choose healthy bulbs for autumn planting.'],
   ['ازرع البصلة ورأسها المدبّب لفوق، بعمق حوالي ثلاثة أضعاف ارتفاعها، بتربة جيدة التصريف.','Plant pointed end up, about three bulb heights deep, in free-draining soil.'],
   ['بعد زهر الربيع، خلّي الأوراق حتى تصفرّ لحالها.','After the spring flowers fade, leave the foliage until it yellows naturally.']],
  note:['وقت الزراعة دور على الطرف المدبّب. هاد اللي بتوجّهه لفوق.','Find the pointed tip when you plant. That end faces the sky.'],
  sources:[['RHS','https://www.rhs.org.uk/plants/tulip/growing-guide'],['National Capital Commission','https://publications.gc.ca/collections/collection_2024/ccn-ncc/W93-16-1999-eng.pdf']]
 },
 strawberry: {
  species:'Fragaria × ananassa',
  fact:['نص كوب فراولة طازجة مقطّعة فيه تقريباً ٤٩ ملغ من فيتامين C. والنبتة فيها تكوّن شتلات صغيرة على سيقان طويلة اسمها مدّادات.','Half a cup of sliced fresh strawberries provides about 49 mg of vitamin C. The plant can also form daughter plants on long stems called runners.'],
  steps:[
   ['اختار شتلة سليمة بجذور قوية ومكان مشمس.','Choose a healthy plant with strong roots and a sunny spot.'],
   ['افرد الجذور بالتراب وخلي التاج، نقطة التقاء الجذور والأوراق، بمستوى سطح التربة.','Spread out the roots and keep the crown, where roots and leaves meet, level with the soil surface.'],
   ['اسقِها بعد الزرع. إذا بدّك شتلة جديدة، وجّه إحدى بنات المدّادات لتلامس التربة وتتجذّر.','Water after planting. To start another plant, guide a runner’s plantlet onto soil so it can take root.']],
  note:['شايف النبتة الصغيرة على طرف المدّاد؟ هيك الفراولة بتوسّع عيلتها.','See the little plant at the tip of the runner? That’s how your strawberry grows its family.'],
  sources:[['Ontario','https://www.ontario.ca/page/growing-strawberries-home-gardens'],['NIH · Vitamin C','https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/']]
 },
 gardenia: {
  species:'Gardenia jasminoides',
  fact:['رغم شبه ريحتها بالياسمين، الغاردينيا قريبة لنبتة البن. أوراقها لامعة وبتضل خضرا طول السنة بظروفها المناسبة.','Gardenia belongs to the coffee family. Its glossy foliage stays green year-round in suitable growing conditions.'],
  steps:[
   ['اختار شتلة غاردينيا وأصيص فيه فتحات تصريف.','Choose a rooted gardenia and a pot with drainage holes.'],
   ['ازرعها بخلطة للنباتات المحبّة للتربة الحمضية وحافظ على كتلة جذورها.','Use a potting mix for acid-loving plants and keep the root ball intact.'],
   ['حطّها بضو ساطع مفلتر أو ظل جزئي، واسقِ بحيث تظل التربة رطبة والمي الزايدة تخرج.','Give it bright filtered light or partial shade. Keep the mix moist and allow excess water to drain.']],
  note:['تطلّع بلمعة الورق الغامق جنب الزهرة الكريمية.','Look at the sheen of the dark leaves beside the creamy flower.'],
  sources:[['NC State Extension','https://plants.ces.ncsu.edu/plants/gardenia-jasminoides/common-name/gardenia/']]
 }
};
let signature='', current, dialog, opened;
function showPlant(id){
 const {crops,plants,en,markRead}=current;
 const record=plants[id], entry=entries[id], crop=crops[id];
 if(!record||!entry)return;
 opened=id;
 if(!dialog){
   dialog=document.createElement('dialog');
   dialog.className='field-page';
   dialog.setAttribute('aria-labelledby','field-title');
   document.body.append(dialog);
   dialog.addEventListener('close',()=>{
     current.area.querySelector('[data-plant="'+opened+'"]')?.focus({preventScroll:true});
   });
 }
 const lang=en?'en':'ar', index=en?1:0;
 const discovered=Object.keys(crops).filter(key=>plants[key]);
 const page=discovered.indexOf(id);
 const sources=entry.sources.map(([name,url])=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+name+'</a>').join(' · ');
 const steps=entry.steps.map(pair=>'<li>'+pair[index]+'</li>').join('');
 dialog.dir=en?'ltr':'rtl';
 dialog.innerHTML='<header><div><h2 id="field-title">'+crop[lang]+'</h2><i lang="la" dir="ltr">'+entry.species+'</i></div><button type="button">'+(en?'Close':'إغلاق')+'</button></header>'+
   '<img class="field-portrait" src="yasmine/images/field-guide/'+id+'.webp" alt="'+(en?'Botanical illustration and growing stages of ':'رسم النبتة وخطوات زراعتها · ')+crop[lang]+'">'+
   '<p class="field-fact">'+entry.fact[index]+'</p>'+
   '<details><summary>'+(en?'How to grow it at home':'كيف بزرعها بالبيت؟')+'</summary><ol>'+steps+'</ol></details>'+
   '<details><summary>'+(en?'From John’s notebook':'من دفتر أبو وردة')+'</summary><p>'+entry.note[index]+'</p></details>'+
   '<details><summary>'+(en?'Your nursery record':'سجلّك بالمشتل')+'</summary><p>'+(en?'Times this plant reached maturity':'عدد المرّات اللي وصلت فيها هالنبتة للنضج')+' · '+record.count+'<br>'+(en?'Highest quality recorded':'أعلى جودة سجّلتها لهالنوع')+' · '+record.best+'%</p></details>'+
   '<footer>'+(en?'Sources · ':'المصادر · ')+sources+'</footer>'+
   '<nav class="field-pages"><button type="button" class="prev" '+(page===0?'disabled':'')+'>'+(en?'← Previous':'→ السابق')+'</button><bdi>'+(page+1)+' / '+discovered.length+'</bdi><button type="button" class="next" '+(page===discovered.length-1?'disabled':'')+'>'+(en?'Next →':'التالي ←')+'</button></nav>';
 dialog.querySelector('header button').onclick=()=>dialog.close();
 dialog.querySelector('.prev').onclick=()=>showPlant(discovered[page-1]);
 dialog.querySelector('.next').onclick=()=>showPlant(discovered[page+1]);
 if(!dialog.open)dialog.showModal();
 dialog.scrollTop=0;
 if(record.unread)markRead(id);
}
function render(area,crops,plants,en,markRead,openMedal){
 current={area,crops,plants,en,markRead};
 const ids=Object.keys(crops), known=ids.filter(id=>plants[id]);
 const key=JSON.stringify([en,ids.map(id=>plants[id]||null)]);
 if(key===signature)return;
 signature=key;
 const lang=en?'en':'ar';
 const cards=ids.map(id=>{
   const plant=crops[id],record=plants[id];
   const text=record?plant[lang]:(en?'Undiscovered plant':'نبتة غير مكتشفة');
   return '<button type="button" class="field-card'+(record?.unread?' fresh':'')+'" data-plant="'+id+'" '+(record?'':'disabled')+'><span class="field-specimen" aria-hidden="true" style="background-image:url(yasmine/images/plants/'+id+'.webp)"></span><strong>'+text+'</strong>'+
    (record?.unread?'<small>'+(en?'New':'جديد')+'</small>':!record?'<small>'+(en?'Grow to maturity · Level ':'ازرعها حتى النضج · المستوى ')+plant.level+'</small>':'')+'</button>';
 });
 area.innerHTML='<h2>'+(en?'Plant encyclopedia':'موسوعة النباتات')+'</h2><p>'+(en?'Plants discovered':'نباتات اكتشفتها')+' · <bdi>'+known.length+' / '+ids.length+'</bdi></p><div class="field-grid">'+cards.join('')+'</div>'+
   (known.length===ids.length?'<button type="button" class="field-award"><img alt="" src="yasmine/images/plant-lover.webp">'+(en?'View Plant lover medal':'شوف وسام عاشق النباتات')+'</button>':'');
 area.onclick=e=>{
   const card=e.target.closest('[data-plant]');
   if(card)showPlant(card.dataset.plant);
   else if(e.target.closest('.field-award'))openMedal();
 };
}
window.YasmineFieldGuide={render};
})();
