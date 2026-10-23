// Acceptance checks for the site-feedback crew run (tickets 01-03). Usage: node scripts/accept-site-feedback.mjs <01|02|03>
// Run after `node build.mjs`. Exits non-zero with the first failed check.
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');
const visible = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '');
const fail = (msg) => { console.error(`FAIL: ${msg}`); process.exit(1); };
const need = (ok, msg) => { if (!ok) fail(msg); };

const checks = {
  '01'() {
    for (const p of ['dist/terms.html', 'dist/en/terms.html']) {
      need(existsSync(p), `${p} missing`);
      need(/href="\/(en\/)?privacy"/.test(read(p)), `${p} does not link to privacy`);
    }
    need(/href="\/terms"/.test(read('dist/index.html')), 'he footer has no /terms link');
    need(/href="\/en\/terms"/.test(read('dist/en/index.html')), 'en footer has no /en/terms link');
    need(read('dist/terms.html').includes('הדברה'), 'terms do not mention pest control (הדברה)');
    need(read('dist/accessibility.html').includes('ערן דוד צארום'), 'he accessibility has no coordinator');
    need(read('dist/en/accessibility.html').includes('Eran David Tzarum'), 'en accessibility has no coordinator');
  },
  '02'() {
    for (const p of ['dist/pros.html', 'dist/en/pros.html']) {
      const h = read(p);
      const sel = h.match(/<select[^>]*name="trade"[\s\S]*?<\/select>/);
      need(sel && (sel[0].match(/<option/g) || []).length >= 38, `${p}: trade select with 37 options + empty missing`);
      need(/name="city"/.test(h), `${p}: city field missing`);
      need(!/wa\.me/.test(h), `${p}: wa.me link rendered while WA_NUMBER is empty`);
      need(!/commission|עמלה|שמונה|\beight\b/i.test(visible(h)), `${p}: commission or 8-trades wording present`);
      need(/id="trades"/.test(h), `${p}: no id="trades" section`);
    }
    need(read('dist/pros.html').includes('הדברה'), 'he /pros does not mention הדברה');
    need(/pest/i.test(read('dist/en/pros.html')), 'en /pros does not mention pest control');
    for (const p of ['src/pages/he/pros.html', 'src/pages/en/pros.html']) {
      const s = read(p);
      need(s.includes('<!--wa:start-->') && s.includes('wa.me/%WA_NUMBER%'), `${p}: no wa:start block with wa.me/%WA_NUMBER%`);
    }
  },
  '03'() {
    const h = read('dist/index.html');
    need(!/שמונה|להורדה ב-|דני ·/.test(visible(h)), 'he home still has שמונה / להורדה ב- / דני');
    need(h.includes('מדביר') && h.includes('יוסי'), 'he home lacks מדביר or יוסי');
    const e = read('dist/en/index.html');
    need(!e.includes('con&shy;') && !e.includes('Home pros'), 'en home still has con&shy; or "Home pros"');
    need(/and 25 more/i.test(e), 'en home lacks "and 25 more"');
  },
};

const run = checks[process.argv[2]];
if (!run) fail('usage: node scripts/accept-site-feedback.mjs <01|02|03>');
run();
console.log(`ok: ticket ${process.argv[2]}`);
