// Builds dist/ from src/: each src/pages/<lang>/<page>.html body is wrapped in the shared layout.
// Usage: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { layout } from './src/partials/layout.mjs';

const ROOT = dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const DIST = join(ROOT, 'dist');
const NAV = ['index', 'privacy', 'delete-account'];
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
    const html = layout({ t: i18n[lang], other, page, meta: JSON.parse(m[1]), body: src.slice(m[0].length), navPages: NAV });
    const out = join(DIST, lang === 'he' ? '' : 'en', file);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
  }
}

// Old URL already handed to the app builder.
writeFileSync(join(DIST, 'privacy-en.html'),
  '<!doctype html><meta charset="utf-8"><title>Redirecting</title><link rel="canonical" href="https://brofixapp.com/en/privacy"><meta http-equiv="refresh" content="0; url=/en/privacy"><a href="/en/privacy">Privacy policy</a>\n');
console.log('built', DIST);
