// Shared page shell: head, header (logo, nav, language switch, theme toggle), footer.
export const SITE = 'https://brofixapp.com';

// URL of a page in a language: Hebrew at the root, English under /en/.
export function pageUrl(lang, page) {
  const tail = page === 'index' ? '' : page;
  return lang === 'he' ? `/${tail}` : `/en/${tail}`;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function layout({ t, other, page, meta, body, navPages }) {
  const here = pageUrl(t.lang, page);
  const there = pageUrl(other.lang, page);
  const nav = navPages
    .map((p) => `<a href="${pageUrl(t.lang, p)}"${p === page ? ' aria-current="page"' : ''}>${t.nav[p]}</a>`)
    .join('');
  return `<!doctype html>
<html lang="${t.lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<link rel="canonical" href="${SITE}${here}">
<link rel="alternate" hreflang="${t.lang}" href="${SITE}${here}">
<link rel="alternate" hreflang="${other.lang}" href="${SITE}${there}">
<link rel="alternate" hreflang="x-default" href="${SITE}${pageUrl('he', page)}">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${SITE}${here}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#F9BA0B">
<script>try{var m=localStorage.getItem('theme');if(m)document.documentElement.dataset.theme=m}catch(e){}</script>
<link rel="icon" type="image/svg+xml" href="/assets/brofix-wrench.svg">
<link rel="preload" href="/assets/fonts/Rubik_400Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/style.css">
</head>
<body>
<div class="wrap">
  <header class="site">
    <a class="brand" href="${pageUrl(t.lang, 'index')}"><img src="/assets/brofix-wordmark.svg" alt="BroFix" height="36"></a>
    <nav>${nav}</nav>
    <div class="tools">
      <a class="lang" href="${there}" hreflang="${other.lang}" lang="${other.lang}">${t.switchTo}</a>
      <button class="theme" type="button" aria-label="${esc(t.themeToggle)}" title="${esc(t.themeToggle)}">◐</button>
    </div>
  </header>
  <main>
${body}  </main>
  <footer>${t.footer} · <span class="mail">brofixapp@gmail.com</span></footer>
</div>
<script>
document.querySelector('.theme').addEventListener('click',function(){
  var r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme=dark?'light':'dark';try{localStorage.setItem('theme',r.dataset.theme)}catch(e){}
});
</script>
</body>
</html>
`;
}
