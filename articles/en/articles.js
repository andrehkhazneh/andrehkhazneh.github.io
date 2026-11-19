const articles = [
  {
    "title": "Silence",
    "summary": "A literary reflection on the words we choose not to speak, and the hidden reasons behind silence.",
    "category": "Philosophy & Reflections",
    "url": "/articles/en/silence/",
    "cover": {
      "src": "/assets/article-silence-preview.webp",
      "alt": "An abstract illustration of silence, tangled lines, and empty speech bubbles"
    },
    "date": "2026-11-16"
  },
  {
    "title": "The Beginning: The Missing First Chapter of Existence",
    "summary": "How does not knowing the beginning limit our understanding, and why must we return to the roots of a story to judge others fairly?",
    "category": "Philosophy & Reflections",
    "url": "/articles/en/albedaya/",
    "cover": {
      "src": "/assets/article-albedaya-preview.webp",
      "alt": "A silhouetted figure partly obscured by a torn page against a muted sun"
    },
    "date": "2026-11-14"
  }
];
const perPage=6;let page=1,filter="All",query="";
const cards=document.getElementById("cards"),filters=document.getElementById("filters"),pager=document.getElementById("pager"),status=document.getElementById("status");
const categories=["All",...new Set(articles.map(x=>x.category))];
const el=(tag,cls,value)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(value!==undefined)x.textContent=value;return x};
const normalizeSearch = text => text
  .normalize("NFKC")
  .toLowerCase()
  .trim()
  .replace(/\s+/gu, " ");

function draw(){filters.replaceChildren();categories.forEach(c=>{const b=el("button","",c);b.type="button";b.setAttribute("aria-pressed",String(filter===c));b.onclick=()=>{filter=c;page=1;draw()};filters.append(b)});
  const match = articles
    .filter(article => (filter === "All" || article.category === filter)
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
    const link = el("a", "link", "Read article →");
    link.href = article.url;
    card.append(link);
    cards.append(card);
  });
  if (!match.length) {
    status.textContent = "No matching articles found.";
  } else {
    status.textContent = query ? match.length + (match.length === 1 ? " search result" : " search results") : "";
    if (pages > 1) {
      const pageStatus = "Page " + page + " of " + pages;
      status.textContent = [status.textContent, pageStatus].filter(Boolean).join(" · ");
    }
  }
  pager.replaceChildren();
  if(pages>1){const prev=el("button","","Previous");prev.disabled=page===1;prev.onclick=()=>{page--;draw()};pager.append(prev);for(let i=1;i<=pages;i++){const b=el("button","",String(i));b.setAttribute("aria-current",String(page===i));b.onclick=()=>{page=i;draw()};pager.append(b)}const next=el("button","","Next");next.disabled=page===pages;next.onclick=()=>{page++;draw()};pager.append(next)}
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
