(function(){
'use strict';
function amounts(rows){
 const totals={seeds:0,sales:0,food:0,treat:0,goods:0,oldShop:0,transport:0,emergency:0,abu:0,nana:0,yasmin:0,ledger:0,oldSalary:0,managerSalary:0};
 for(const r of rows){
   const paid=-r.amount;
   switch(r.category){
     case 'seeds': totals.seeds+=paid;break;
     case 'sales': totals.sales+=r.amount;break;
     case 'catfood': totals.food+=paid;break;
     case 'catshop': totals[r.itemId==='treat'?'treat':r.itemId?'goods':'oldShop']+=paid;break;
     case 'invoice':
       if(paid===20){totals.food+=15;totals.transport+=5}
       else totals.emergency+=paid;
       break;
     case 'salary': {
       // Before names were recorded, these were the only two salary postings.
       const person=r.person || ({15:'abu',20:'nana'})[paid];
       totals[person==='yasmin'?'managerSalary':['abu','nana'].includes(person)?person:'oldSalary']+=paid;
       break;
     }
     case 'bonus': totals.yasmin+=paid;break;
     case 'accountant': totals.ledger+=paid;break;
   }
 }
 return totals;
}
function render(box,group,f,en,cat,name,title,wages){
 const t=(ar,eng)=>en?eng:ar,fmt=n=>String(n);
 const a=amounts(f.rows);
 const lines=[],line=(label,value)=>lines.push([label,value]);
 let label,note,total;
 if(group==='campaign'){
   const sales=f.rows.filter(r=>r.category==='sales'&&r.person==='yasmin');
   const revenue=sales.reduce((n,r)=>n+r.amount,0),cost=sales.reduce((n,r)=>n+r.seedCost,0);
   const bags=f.rows.filter(r=>r.category==='fertilizerSale');
   const fert=bags.reduce((n,r)=>n+r.amount,0),knownCost=bags.reduce((n,r)=>n+(r.fertilizerCost||0),0);
   const honey=f.rows.filter(r=>r.category==='honeySale'&&r.person==='yasmin').reduce((n,r)=>n+r.amount,0);
   total=revenue+fert+honey-cost-knownCost;
   line(t('ثمن البذور','Seed cost'),cost);line(t('بيع النبات','Plant sales'),revenue);
   line(t('بيع السماد','Fertilizer sales'),fert);if(honey)line(t('بيع عسل وردة','Warda’s honey sales'),honey);line(t('صافي الأرباح','Net earnings'),total);
   line(t('عدد العروض عن طريق ياسمين','Offers through Yasmin'),f.offerCount??sales.length+bags.length);
   label='';note=t('الصافي بعد البذور وكلفة السماد المقدّرة المسجّلة، وقبل الرواتب والمحطة وبذور المنحلة. العروض القديمة غير المسجّلة تشمل المبيعات المعروفة فقط.','Net of seeds and recorded estimated fertilizer costs, before wages, station costs and apiary seeds. Earlier untracked offers include known sales only.');
   if(bags.some(r=>r.fertilizerCost==null))note+=t(' كلفة السماد بالمبيعات القديمة غير متوفرة.',' Cost was unavailable for earlier fertilizer sales.');
 }else if(group==='garden'){
   line(t('ثمن البذور اللي اشتريتها','Seed purchases'),a.seeds);
   line(t('قبضت من بيع النباتات','Plant sales received'),a.sales);
   total=a.sales-a.seeds;label=t('الصافي بعد ثمن البذور','Net after seeds');
   note=t('منطرح ثمن كل البذور المشتراة من مبيعات النباتات، بما فيها بذور النباتات اللي لسا ما بعتها. السماد والرواتب إلها حساب منفصل.','All seed purchases, including unsold plants, are deducted from plant sales. Fertilizer and wages are separate.');
 }else if(group==='cat'){
   line(t('طعام ','Food · ')+cat,a.food);line(t('حبّات المكافأة','Treats'),a.treat);line(t('ملابس وأغراض من المتجر','Clothing and shop items'),a.goods);
   if(a.transport)line(t('النقل بالطوارئ','Emergency transport'),a.transport);
   if(a.emergency)line(t('طوارئ أخرى','Other emergency bills'),a.emergency);
   if(a.oldShop)line(t('مشتريات متجر قديمة بلا تفاصيل','Earlier shop purchases without item details'),a.oldShop);
   label=t('مجموع مصاريف ','Total spent on ')+cat;
   note=t('كل دفعة بتنحسب مرة وحدة. فاتورة الطوارئ المدفوعة بـ20 عملة بتتوزع بين 15 للطعام و5 للنقل.','Each payment is counted once. A paid 20-coin emergency bill includes 15 for food and 5 for transport.');
 }else{
   line(t('أبو وردة · راتب البستاني','Abu Warda · Gardener wages'),a.abu);line(t('نانا · راتب مربية القطط','Nana · Cat caretaker wages'),a.nana);
   line(t('ياسمين · راتب المديرة','Yasmin · Manager wages'),a.managerSalary);line(t('ياسمين · بونص المديرة','Yasmin · Manager bonuses'),a.yasmin);line(t('جمال · راتب المحاسب','Jamal · Accountant wages'),a.ledger);
   total=a.managerSalary+a.abu+a.nana+a.yasmin+a.ledger+a.oldSalary;
   label=t('مجموع المدفوع للموظفين','Total wages and bonuses paid');
   note=t('نجمع الرواتب والبونص المدفوع. الراتب المستحق بينضاف وقت الدفع. التوظيف والتطوير مسجّلين لحالهم بالدفتر.','Includes paid wages and bonuses. Wages due count once paid. Hiring and upgrades are separate ledger entries.');
   if(a.oldSalary)note+=t(' المجموع بيشمل دفعات سابقة إضافية بقيمة ',' The total includes additional earlier payments of ')+fmt(a.oldSalary)+t(' عملة.',' coins.');
 }
 total??=lines.reduce((n,row)=>n+row[1],0);
 const helpOpen=box.dataset.group===group&&box.querySelector('details')?.open;
 box.dataset.group=group;
 box.innerHTML='<div class="paper-brand"></div><h3></h3><div class="paper-period"></div><table><thead><tr><th></th><th></th></tr></thead><tbody></tbody></table><div class="paper-total"><strong></strong><bdi></bdi></div><details><summary></summary><div class="paper-note"></div></details><footer><span></span><b></b></footer>';
 const put=(selector,value)=>{box.querySelector(selector).textContent=value};
 put('.paper-brand',name);put('h3',title);put('.paper-period',t('من بداية التسجيل','Since recording began'));
 box.querySelector('thead').hidden=group!=='staff';box.querySelector('.paper-total').hidden=group==='campaign';
 put('th',t('البيان','Description'));put('th:last-child',t('المبلغ بالعملة','Coins'));
 for(const [index,[text,value]] of lines.entries()){
   const row=box.querySelector('tbody').insertRow(),description=row.insertCell();
   description.textContent=text;row.insertCell().textContent=fmt(value);
   const wage=group==='staff'&&wages[['abu','nana','yasmin','', 'ledger'][index]];
   if(wage){
     const button=document.createElement('button');button.type='button';
     button.textContent=t('ادفع الراتب المستحق · ','Pay wage due · ')+fmt(wage.amount);
     button.disabled=!wage.affordable;button.onclick=wage.pay;description.append(document.createElement('br'),button);
   }
 }
 put('.paper-total strong',label);put('.paper-total bdi',fmt(total)+t(' عملة',' coins'));
 put('summary',t('كيف انحسب المبلغ؟','How is this calculated?'));put('.paper-note',note);
 box.querySelector('details').open=!!helpOpen;put('footer span',t('محاسب المشتل','Nursery accountant'));put('footer b',t('جمال','Jamal'));
}
window.JamalStatements={render};
})();
