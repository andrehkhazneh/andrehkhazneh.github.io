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
 root.YasmineGardenCore=Object.freeze({growth:growth,skyPhase:skyPhase,eventDelay:eventDelay,randomEvent:randomEvent});
})(window);
