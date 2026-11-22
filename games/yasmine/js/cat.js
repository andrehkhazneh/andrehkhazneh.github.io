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
 function animateAction(scene,action,toy){
   scene.dataset.toy=toy?'feather':'yarn';
   scene.dataset.action=action;
   return 4300;
 }
 function clearAction(scene){delete scene.dataset.action}
 function canHunt(cat,config){
   return cat.fullness>config.catMinFullness&&cat.mood>config.catMinMood;
 }
 function huntCooldownRemaining(now,lastHunt,cooldownMs){
   return Math.max(0,cooldownMs-(now-lastHunt));
 }
 root.YasmineCatCore=Object.freeze({freshCat:freshCat,tickNeeds:tickNeeds,animateAction:animateAction,clearAction:clearAction,canHunt:canHunt,huntCooldownRemaining:huntCooldownRemaining});
})(window);
