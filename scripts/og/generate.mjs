import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

mkdirSync('static/assets/og', { recursive: true });
mkdirSync('scripts/og', { recursive: true });

const boldWoff2 = readFileSync('static/assets/fonts/Rubik_700Bold.woff2').toString('base64');
const regularWoff2 = readFileSync('static/assets/fonts/Rubik_400Regular.woff2').toString('base64');

const wordmarkContent = readFileSync('static/assets/brofix-wordmark.svg', 'utf8')
  .replace(/<\?xml.*?\?>/i, '')
  .replace(/<svg[^>]*>/i, '')
  .replace(/<\/svg>/i, '');

const wrenchContent = readFileSync('static/assets/brofix-wrench.svg', 'utf8')
  .replace(/<\?xml.*?\?>/i, '')
  .replace(/<svg[^>]*>/i, '')
  .replace(/<\/svg>/i, '');

function makeSvg({ lang, dir, headline, subline }) {
  const isHe = lang === 'he';

  // For Hebrew (RTL): content aligned to right (x=1100), wrench watermark on left.
  // For English (LTR): content aligned to left (x=100), wrench watermark on right.
  const wrenchTransform = isHe
    ? 'translate(-100, 70) scale(0.95)'
    : 'translate(450, 70) scale(0.95)';

  const wordmarkX = isHe ? (1100 - 236) : 100;
  const contentX = isHe ? 1100 : 100;
  // In SVG with direction="rtl", text-anchor="start" aligns the right (start) edge of the text chunk.
  const textAlign = 'start';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      @font-face {
        font-family: 'Rubik';
        font-style: normal;
        font-weight: 700;
        src: url('data:font/woff2;base64,${boldWoff2}') format('woff2');
      }
      @font-face {
        font-family: 'Rubik';
        font-style: normal;
        font-weight: 400;
        src: url('data:font/woff2;base64,${regularWoff2}') format('woff2');
      }
      .headline {
        font-family: 'Rubik', sans-serif;
        font-weight: 700;
        font-size: 58px;
        line-height: 1.25;
        fill: #11181C;
      }
      .badge-text {
        font-family: 'Rubik', sans-serif;
        font-weight: 700;
        font-size: 26px;
        letter-spacing: 0.5px;
        fill: #3F2913;
      }
      .domain {
        font-family: 'Rubik', sans-serif;
        font-weight: 700;
        font-size: 28px;
        letter-spacing: 0.5px;
        fill: #6B6250;
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#F4F5F7"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="12" fill="#F9BA0B"/>

  <!-- Faded wrench watermark -->
  <g opacity="0.10" transform="${wrenchTransform}">
    ${wrenchContent}
  </g>

  <!-- Wordmark Logo (viewBox 0 0 1124 384 -> scale 0.21 => ~236x80) -->
  <g transform="translate(${wordmarkX}, 80) scale(0.21)">
    ${wordmarkContent}
  </g>

  <!-- Main Headline -->
  <text x="${contentX}" y="295" text-anchor="${textAlign}" direction="${dir}" class="headline">${headline}</text>
  ${subline ? `<text x="${contentX}" y="375" text-anchor="${textAlign}" direction="${dir}" class="headline">${subline}</text>` : ''}

  <!-- Bottom Accent / Domain Bar -->
  ${isHe ? `
  <g transform="translate(910, 490)">
    <rect x="0" y="0" width="190" height="48" rx="24" fill="#F9BA0B"/>
    <circle cx="165" cy="24" r="7" fill="#3F2913"/>
    <text x="85" y="33" text-anchor="middle" class="badge-text">Brofix</text>
  </g>
  <text x="880" y="524" text-anchor="end" class="domain">brofixapp.com</text>
  ` : `
  <g transform="translate(100, 490)">
    <rect x="0" y="0" width="190" height="48" rx="24" fill="#F9BA0B"/>
    <circle cx="25" cy="24" r="7" fill="#3F2913"/>
    <text x="105" y="33" text-anchor="middle" class="badge-text">Brofix</text>
  </g>
  <text x="315" y="524" text-anchor="start" class="domain">brofixapp.com</text>
  `}
</svg>`;
}

const heSvg = makeSvg({
  lang: 'he',
  dir: 'rtl',
  headline: 'בעל מקצוע לבית,',
  subline: 'בלי לרדוף אחרי אף אחד',
});

const enSvg = makeSvg({
  lang: 'en',
  dir: 'ltr',
  headline: 'A home pro,',
  subline: 'without chasing anyone',
});

writeFileSync('scripts/og/og-he.svg', heSvg);
writeFileSync('scripts/og/og-en.svg', enSvg);
console.log('Saved SVGs to scripts/og/');

const edge = 'C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe';

for (const lang of ['he', 'en']) {
  const svgPath = resolve(`scripts/og/og-${lang}.svg`);
  const pngPath = resolve(`static/assets/og/og-${lang}.png`);
  execSync(`"${edge}" --headless --screenshot="${pngPath}" --window-size=1200,630 --hide-scrollbars "file:///${svgPath.replace(/\\\\/g, '/')}"`);
  console.log(`Rendered static/assets/og/og-${lang}.png`);
}
