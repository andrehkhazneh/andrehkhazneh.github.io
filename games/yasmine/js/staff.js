/* Staff rules shared by Jasmine, Abu Warda and Nana. */
(function(root){
 'use strict';
 function canWork(worker){return !!(worker&&worker.hired&&!worker.paused)}
 function nanaAction(cat,stock){
   if(cat.fullness<40)return stock.catfood>0?'feed':'out-of-food';
   if(cat.mood<50)return 'brush';
   if(cat.toy&&cat.mood<80)return 'play';
   return '';
 }
 function abuCanCare(abu,active,progress){return canWork(abu)&&!!active&&progress<100}
 function jasmineShouldRestock(staff,stock,money){return !!(staff&&staff.hired&&stock.fertilizer<=1&&money>=10)}
 function jasmineUrgentRequest(stock){return stock.catfood<=1?'catfood':null}
 root.YasmineStaffCore=Object.freeze({canWork:canWork,nanaAction:nanaAction,abuCanCare:abuCanCare,jasmineShouldRestock:jasmineShouldRestock,jasmineUrgentRequest:jasmineUrgentRequest});
})(window);
