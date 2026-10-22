// Gate for dist/: internal links resolve, every page has a he/en pair with hreflang,
// no leftover [placeholders], no misspelled founder name. Usage: node scripts/check.mjs
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = dirname(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')));
const DIST = join(ROOT, 'dist');
const errors = [];
if (!existsSync(DIST)) { console.error('dist/ missing: run node build.mjs first'); process.exit(1); }

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(DIST).filter((f) => f.endsWith('.html'));

// /x -> x.html or x/index.html, like GitHub Pages.
function resolves(url) {
  const p = decodeURI(url.split(/[?#]/)[0]);
  if (p === '/' ) return existsSync(join(DIST, 'index.html'));
  const base = join(DIST, p);
  return [base, `${base}.html`, join(base, 'index.html')].some((f) => existsSync(f) && statSync(f).isFile());
}

for (const file of pages) {
  const rel = file.slice(DIST.length + 1).replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');
  if (rel === 'privacy-en.html') continue; // copy of en/privacy.html
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (!resolves(url)) errors.push(`${rel}: broken link ${url}`);
  }
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  for (const [m] of text.matchAll(/\[[^\]\n]{2,60}\]/g)) errors.push(`${rel}: placeholder ${m}`);
  if (html.includes('צרום')) errors.push(`${rel}: misspelled name צרום (correct: צארום)`);
  if (html.includes('BroFix')) errors.push(`${rel}: brand is spelled Brofix (lowercase f)`);
  if (!/<html lang="(he|en)" dir="(rtl|ltr)">/.test(html)) errors.push(`${rel}: missing lang/dir`);
  if (!html.includes('hreflang="he"') || !html.includes('hreflang="en"')) errors.push(`${rel}: missing hreflang pair`);
  if (rel === '404.html') continue;
  const pair = rel.startsWith('en/') ? rel.slice(3) : `en/${rel}`;
  if (!existsSync(join(DIST, pair))) errors.push(`${rel}: no counterpart ${pair}`);
}

if (errors.length) { console.error(errors.join('\n')); console.error(`\n${errors.length} problem(s)`); process.exit(1); }
console.log(`ok: ${pages.length} pages checked`);
