// Accept check for ticket 02 (home page).
import { readFileSync } from 'node:fs';
for (const l of ['he', 'en']) {
  const s = readFileSync(`src/pages/${l}/index.html`, 'utf8');
  for (const k of ['teaser.mp4', 'store-badges', `${l === 'he' ? '"/pros"' : '"/en/pros"'}`, '<details', 'class="phone']) if (!s.includes(k)) throw new Error(`${l}: missing ${k}`);
  if (/href="https?:\/\/(apps\.apple|play\.google)/.test(s)) throw new Error(`${l}: store link must not exist yet`);
}
console.log('02 ok');
