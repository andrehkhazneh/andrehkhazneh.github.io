/* Jasmine nursery: independent cat care and needs calculations. */
(function(root){
 'use strict';
 function freshCat(){return {fullness:60,mood:55,toy:false}}
 function tickNeeds(cat,seconds){
   if(seconds<15)return seconds;
   var cycles=Math.floor(seconds/15);
   cat.fullness=Math.max(0,cat.fullness-2*cycles);
   cat.mood=Math.max(0,cat.mood-cycles);
   return seconds-cycles*15;
 }
 root.YasmineCatCore=Object.freeze({freshCat:freshCat,tickNeeds:tickNeeds});
})(window);
