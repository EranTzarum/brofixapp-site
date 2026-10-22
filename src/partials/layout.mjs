// Shared page shell: head, header (logo, nav, language switch, theme toggle), footer.
export const SITE = 'https://brofixapp.com';

// URL of a page in a language: Hebrew at the root, English under /en/.
export function pageUrl(lang, page) {
  const tail = page === 'index' ? '' : page;
  return lang === 'he' ? `/${tail}` : `/en/${tail}`;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const SUN = '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
const MOON = '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const BARS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

export function layout({ t, other, page, meta, body, navPages, footerPages }) {
  const here = pageUrl(t.lang, page);
  const there = pageUrl(other.lang, page);
  const nav = navPages
    .map((p) => `<a href="${pageUrl(t.lang, p)}"${p === page ? ' aria-current="page"' : ''}>${t.nav[p]}</a>`)
    .join('');
  const links = footerPages.map((p) => `<li><a href="${pageUrl(t.lang, p)}">${t.nav[p]}</a></li>`).join('');
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
<meta property="og:image" content="${SITE}/assets/og/og-${t.lang}.png">
<meta name="twitter:card" content="summary_large_image">${meta.robots ? `
<meta name="robots" content="${esc(meta.robots)}">` : ''}
<meta name="theme-color" content="#F9BA0B">
<script>document.documentElement.className+=' js';try{var m=localStorage.getItem('theme');if(m)document.documentElement.dataset.theme=m}catch(e){}</script>
<link rel="icon" type="image/svg+xml" href="/assets/brofix-wrench.svg">
<link rel="apple-touch-icon" href="/assets/brofix-wrench.svg">
<link rel="preload" href="/assets/fonts/Rubik_400Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/style.css">
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>
<header class="site">
  <div class="container bar">
    <a class="brand" href="${pageUrl(t.lang, 'index')}"><img src="/assets/brofix-wordmark.svg" alt="Brofix" width="94" height="32"></a>
    <div class="tools">
      <a class="lang" href="${there}" hreflang="${other.lang}" lang="${other.lang}">${t.switchTo}</a>
      <button class="icon-btn theme" type="button" aria-label="${esc(t.themeToggle)}" title="${esc(t.themeToggle)}">${SUN}${MOON}</button>
      <button class="icon-btn menu-btn" type="button" aria-label="${esc(t.menu)}" aria-expanded="false" aria-controls="site-nav">${BARS}</button>
    </div>
    <nav class="primary" id="site-nav" aria-label="${esc(t.menu)}">${nav}</nav>
  </div>
</header>
<main id="main">
${body}</main>
<footer class="site">
  <div class="container">
    <div class="cols">
      <div>
        <p class="name">Brofix</p>
        <a class="mail" href="mailto:brofixapp@gmail.com">brofixapp@gmail.com</a>
      </div>
      <ul>${links}<li><a href="${there}" hreflang="${other.lang}" lang="${other.lang}">${t.switchTo}</a></li></ul>
    </div>
    <p class="legal-line">${t.footer}</p>
  </div>
</footer>
<script>
document.querySelector('.theme').addEventListener('click',function(){
  var r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme=dark?'light':'dark';try{localStorage.setItem('theme',r.dataset.theme)}catch(e){}
});
document.querySelector('.menu-btn').addEventListener('click',function(){
  var h=document.querySelector('header.site'),o=h.classList.toggle('open');this.setAttribute('aria-expanded',o);
});
</script>
</body>
</html>
`;
}
