// Accept check for ticket 01 (design system): slot pages, 404, sitemap, robots exist; legal wording intact.
import { statSync, readFileSync } from 'node:fs';
for (const f of ['dist/404.html', 'dist/sitemap.xml', 'dist/robots.txt', 'dist/pros.html', 'dist/en/pros.html', 'dist/accessibility.html', 'dist/en/accessibility.html']) statSync(f);
const he = readFileSync('src/pages/he/privacy.html', 'utf8');
if (!he.includes('180 יום') || !he.includes('חושן נוסבאום')) throw new Error('privacy wording changed');
const css = readFileSync('src/css/site.css', 'utf8');
for (const c of ['.hero', '.store-badges', '.phone', '.faq', '.legal', '.video', 'data-theme']) if (!css.includes(c)) throw new Error(`css missing ${c}`);
console.log('01 ok');
