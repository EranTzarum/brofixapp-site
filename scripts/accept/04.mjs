// Accept check for ticket 04 (pros page).
import { readFileSync } from 'node:fs';
for (const l of ['he', 'en']) {
  const s = readFileSync(`src/pages/${l}/pros.html`, 'utf8');
  if (s.length < 2500 || !s.includes('store-badges')) throw new Error(`${l}: pros page too short or no store badges`);
}
console.log('04 ok');
