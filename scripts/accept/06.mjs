// Accept check for ticket 06 (accessibility statement).
import { readFileSync } from 'node:fs';
const h = readFileSync('src/pages/he/accessibility.html', 'utf8');
const e = readFileSync('src/pages/en/accessibility.html', 'utf8');
if (!h.includes('5568') || !e.includes('WCAG') || !h.includes('brofixapp@gmail.com')) throw new Error('accessibility statement incomplete');
console.log('06 ok');
