/* To add an article: publish its HTML at /articles/slug/index.html, then append an entry below. */
const articles=[{title:"الصمت",summary:"تأمل أدبي في أسباب الصمت، بين القوة والضعف والحماية والألم.",category:"فلسفة وتأملات",url:"/articles/silence/",cover:{src:"/assets/article-silence-preview.webp",alt:"شخص صامت يمتد ظله على هيئة خطوط متشابكة وفقاعات كلام فارغة"},date:"2026-11-16"},{title:"البداية... الفصل الغائب من حكاية الوجود",summary:"كيف يقيّد جهلنا بالبدايات قدرتنا على الفهم، ولماذا نحتاج إلى العودة للجذور كي نكون أكثر عدلاً في أحكامنا؟",category:"فلسفة وتأملات",url:"/articles/albedaya/",cover:{src:"/assets/article-albedaya-preview.webp",alt:"شخص تحجبه جزئياً صفحة ناقصة أمام شمس محجوبة"},date:"2026-11-14"}];
const perPage=6;let page=1,filter="الكل",query="";
const cards=document.getElementById("cards"),filters=document.getElementById("filters"),pager=document.getElementById("pager"),status=document.getElementById("status");
const categories=["الكل",...new Set(articles.map(x=>x.category))];
const el=(tag,cls,text)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const normalizeSearch = text => text
  .normalize("NFKC")
  .replace(/[\u0610-\u061a\u0640\u064b-\u065f\u0670\u06d6-\u06ed]/gu, "")
  .replace(/[أإآٱ]/gu, "ا")
  .toLowerCase()
  .trim()
  .replace(/\s+/gu, " ");

function draw(){filters.replaceChildren();categories.forEach(c=>{const b=el("button","",c);b.type="button";b.setAttribute("aria-pressed",String(filter===c));b.onclick=()=>{filter=c;page=1;draw()};filters.append(b)});
  const match = articles
    .filter(article => (filter === "الكل" || article.category === filter)
      && normalizeSearch([article.title, article.summary, article.category].join(" ")).includes(query))
    .sort((a, b) => b.date.localeCompare(a.date));
  const pages=Math.max(1,Math.ceil(match.length/perPage));page=Math.min(page,pages);cards.replaceChildren();match.slice((page - 1) * perPage, page * perPage).forEach(article => {
    const card = el("article", "card");
    const heading = el("h2");
    const title = el("a", "", article.title);
    title.href = article.url;
    heading.append(title);
    card.append(el("div", "meta", article.category), heading, el("p", "", article.summary));
    if (article.cover) {
      const image = el("img", "card-cover");
      image.src = article.cover.src;
      image.alt = article.cover.alt;
      image.width = 768;
      image.height = 512;
      image.loading = "lazy";
      image.decoding = "async";
      card.append(image);
    }
    const link = el("a", "link", "قراءة المقال ←");
    link.href = article.url;
    card.append(link);
    cards.append(card);
  });
  if (!match.length) {
    status.textContent = "لا توجد مقالات مطابقة.";
  } else {
    status.textContent = query ? "عدد نتائج البحث: " + match.length : "";
    if (pages > 1) {
      const pageStatus = "الصفحة " + page + " من " + pages;
      status.textContent = [status.textContent, pageStatus].filter(Boolean).join(" · ");
    }
  }
  pager.replaceChildren();
  if(pages>1){const prev=el("button","","السابق");prev.disabled=page===1;prev.onclick=()=>{page--;draw()};pager.append(prev);for(let i=1;i<=pages;i++){const b=el("button","",String(i));b.setAttribute("aria-current",String(page===i));b.onclick=()=>{page=i;draw()};pager.append(b)}const next=el("button","","التالي");next.disabled=page===pages;next.onclick=()=>{page++;draw()};pager.append(next)}
}

const searchInput = document.getElementById("q");
function updateSearch() {
  query = normalizeSearch(searchInput.value);
  page = 1;
  draw();
}

searchInput.addEventListener("input", updateSearch);
window.addEventListener("pageshow", () => {
  if (query !== normalizeSearch(searchInput.value)) updateSearch();
});
updateSearch();
