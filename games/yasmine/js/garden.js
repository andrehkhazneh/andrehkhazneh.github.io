/* Plant growth and sky phase rules, independent from the UI. */
(function(root){
 'use strict';
 function growth(progress,delta,growSeconds){
   if(!Number.isFinite(progress)||!Number.isFinite(delta)||!Number.isFinite(growSeconds)||growSeconds<=0)return progress;
   return Math.max(0,Math.min(100,progress+100*Math.max(0,delta)/growSeconds));
 }
 function skyPhase(mode,hour){
   if(mode==='day')return 'day';
   if(mode==='night')return 'night';
   return hour<5?'night':hour<6?'dawn':hour<8?'sunrise':hour<11?'morning':hour<17?'day':hour<19?'sunset':hour<21?'dusk':'night';
 }
 function eventDelay(min,max,random){
   return min+Math.max(0,Math.min(1,random))*(max-min);
 }
 function randomEvent(random){
   return ['bee','dew','pest'][Math.min(2,Math.floor(Math.max(0,random)*3))];
 }
 const levels = [0, 10, 25, 50, 80, 120, 170, 230, 300, 400];
 const upgrade = {level: 3, cost: 200};
 function crop(ar, en, cost, time, price, level, arabicStages, englishStages) {
   return {ar, en, cost, time, price, level, stages: {ar: arabicStages, en: englishStages}};
 }
 const crops = {
   jasmine: crop('الياسمينة','Jasmine',10,150,40,1,['شتلة صغيرة','أغصان جديدة','براعم بيضا','زهر الياسمين'],['Seedling','New branches','White buds','Jasmine blossoms']),
   mint: crop('النعنع','Mint',15,125,30,1,['شتلة صغيرة','أوراق مسنّنة','فروع جديدة','نعنع كثيف'],['Seedling','Serrated leaves','New shoots','Full mint bush']),
   rose: crop('الورد الجوري','Rose',30,180,90,1,['شتلة صغيرة','فروع مورقة','براعم الورد','ورد مفتّح'],['Seedling','Leafy branches','Rosebuds','Open roses']),
   sunflower: crop('دوّار الشمس','Sunflower',35,190,105,1,['شتلة صغيرة','أوراق عريضة','برعم أخضر','زهرة مفتوحة'],['Seedling','Broad leaves','Green bud','Open sunflower']),
   basil: crop('الحبق','Basil',20,120,45,2,['شتلة صغيرة','ورق حبق','فروع جديدة','حبق كثيف'],['Seedling','Glossy leaves','New branches','Full basil bush']),
   lavender: crop('الخزامى','Lavender',45,215,125,3,['شتلة صغيرة','أوراق رفيعة','براعم بنفسجية','سنابل مزهرة'],['Seedling','Slender leaves','Purple buds','Flowering spikes']),
   tulip: crop('التوليب','Tulip',55,230,150,4,['أول ورقة','أوراق طويلة','برعم ملوّن','توليب مفتّح'],['First shoot','Long leaves','Colored bud','Open tulips']),
   strawberry: crop('الفراولة','Strawberry',70,250,180,5,['شتلة صغيرة','زهر أبيض','فراولة خضرا','فراولة حمرا'],['Seedling','White flowers','Green berries','Red berries']),
   gardenia: crop('الغاردينيا','Gardenia',90,300,230,6,['شتلة صغيرة','أوراق لامعة','براعم كريمية','زهر الغاردينيا'],['Seedling','Glossy leaves','Creamy buds','Gardenia blossoms'])
 };
 function levelFor(sales) { return levels.filter(minimum => sales >= minimum).length; }
 function stageFor(progress) { return progress < 20 ? 0 : progress < 58 ? 1 : progress < 85 ? 2 : 3; }
 root.YasmineGardenCore=Object.freeze({growth,skyPhase,eventDelay,randomEvent,crops,levels,levelFor,stageFor,upgrade});
})(window);
