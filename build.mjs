// Builds dist/ from src/: each src/pages/<lang>/<page>.html body is wrapped in the shared layout.
// Usage: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { layout, pageUrl, SITE } from './src/partials/layout.mjs';

const ROOT = dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const DIST = join(ROOT, 'dist');
const NAV = ['index', 'pros', 'privacy', 'delete-account'];
const FOOTER = ['pros', 'privacy', 'delete-account', 'accessibility'];
const i18n = {
  he: JSON.parse(readFileSync(join(ROOT, 'src/i18n/he.json'), 'utf8')),
  en: JSON.parse(readFileSync(join(ROOT, 'src/i18n/en.json'), 'utf8')),
};

rmSync(DIST, { recursive: true, force: true });
cpSync(join(ROOT, 'static'), DIST, { recursive: true });
cpSync(join(ROOT, 'src/css/site.css'), join(DIST, 'style.css'));

for (const lang of ['he', 'en']) {
  const other = i18n[lang === 'he' ? 'en' : 'he'];
  for (const file of readdirSync(join(ROOT, 'src/pages', lang)).filter((f) => f.endsWith('.html'))) {
    const page = file.replace(/\.html$/, '');
    const src = readFileSync(join(ROOT, 'src/pages', lang, file), 'utf8');
    const m = src.match(/^<!--meta (.*?) -->\n/);
    if (!m) throw new Error(`${lang}/${file}: missing <!--meta {...} --> first line`);
    const html = layout({ t: i18n[lang], other, page, meta: JSON.parse(m[1]), body: src.slice(m[0].length), navPages: NAV, footerPages: FOOTER });
    const out = join(DIST, lang === 'he' ? '' : 'en', file);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
  }
}

// GitHub Pages serves 404.html for any missing path; links back to the home pages.
writeFileSync(join(DIST, '404.html'), layout({
  t: i18n.he, other: i18n.en, page: 'index', navPages: NAV, footerPages: FOOTER,
  meta: { title: 'BroFix · הדף לא נמצא', description: 'הדף לא נמצא / Page not found', robots: 'noindex' },
  body: `<section class="section"><div class="container prose">
  <h1>הדף לא נמצא</h1>
  <p class="lead" lang="en" dir="ltr">Page not found</p>
  <div class="actions"><a class="btn" href="/">לדף הבית</a><a class="btn btn-ghost" href="/en/" lang="en" hreflang="en">Home (English)</a></div>
</div></section>
`,
}));

const pages = readdirSync(join(ROOT, 'src/pages/he')).filter((f) => f.endsWith('.html')).map((f) => f.replace(/.html$/, ''));
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.flatMap((p) => ['he', 'en'].map((l) => `  <url><loc>${SITE}${pageUrl(l, p)}</loc></url>
`)).join('')}</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *
Allow: /
Sitemap: ${SITE}/sitemap.xml
`);

// Old URL already handed to the app builder.
writeFileSync(join(DIST, 'privacy-en.html'),
  '<!doctype html><meta charset="utf-8"><title>Redirecting</title><link rel="canonical" href="https://brofixapp.com/en/privacy"><meta http-equiv="refresh" content="0; url=/en/privacy"><a href="/en/privacy">Privacy policy</a>\n');
console.log('built', DIST);
