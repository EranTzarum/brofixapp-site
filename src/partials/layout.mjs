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
    <a class="brand" href="${pageUrl(t.lang, 'index')}"><img class="brand-wrench" src="/assets/brofix-wrench.svg" alt="" width="58" height="32"><img src="/assets/brofix-wordmark.svg" alt="Brofix" width="94" height="32"></a>
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
  <div class="container foot">
    <p class="name"><img src="/assets/brofix-wrench.svg" alt="" width="40" height="22">Brofix</p>
    <ul>${links}<li><a href="${there}" hreflang="${other.lang}" lang="${other.lang}">${t.switchTo}</a></li></ul>
    <a class="write" href="mailto:brofixapp@gmail.com">${t.writeUs}</a>
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
// scroll reveal: hidden state lives in CSS under html.js; reveal once when a block enters the viewport
(function(){
  var els=document.querySelectorAll('main > .section > .container > :not(.steps):not(.stickers), .steps > li, .stickers > li');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e){var i=Array.prototype.indexOf.call(e.parentNode.children,e);e.style.setProperty('--d',Math.min(i,7)*60+'ms');io.observe(e)});
})();
// pros lead form: needs a phone or an email; sends with fetch and shows the result in place
(function(){
  var f=document.getElementById('lead');if(!f)return;
  var ph=f.elements.phone,em=f.elements.email,st=f.querySelector('.form-status'),b=f.querySelector('button');
  function need(){ph.setCustomValidity(ph.value.trim()||em.value.trim()?'':f.dataset.need)}
  need();ph.addEventListener('input',need);em.addEventListener('input',need);
  f.addEventListener('submit',function(e){
    e.preventDefault();b.disabled=true;st.textContent='';
    fetch(f.action,{method:'POST',headers:{Accept:'application/json'},body:new FormData(f)})
      .then(function(r){return r.json()})
      .then(function(d){if(!d.success)throw 0;f.reset();need();st.textContent=f.dataset.ok})
      .catch(function(){st.textContent=f.dataset.fail})
      .finally(function(){b.disabled=false});
  });
})();
// hero map: hold the pro dot still for reduced motion
if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('svg.map').forEach(function(m){m.pauseAnimations();m.setCurrentTime(6)});
</script>
</body>
</html>
`;
}
