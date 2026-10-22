// Accept check for ticket 05 (media).
import { statSync } from 'node:fs';
if (statSync('static/assets/media/teaser.mp4').size > 5.2e6) throw new Error('teaser.mp4 over 5 MB');
for (const f of ['static/assets/media/teaser-poster.webp', 'static/assets/media/teaser.json', 'static/assets/og/og-he.png', 'static/assets/og/og-en.png', 'scripts/media.md']) statSync(f);
console.log('05 ok');
