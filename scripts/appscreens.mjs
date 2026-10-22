// Generates the "how it looks in the app" phone mockups (customer / pro) for both languages
// into src/partials/appscreens.<lang>.html, which build.mjs inlines at <!--app-screens-->.
// shortcut: hand-drawn mockups, replace with real screenshots from the app when they exist.
// Usage: node scripts/appscreens.mjs
import { writeFileSync } from 'node:fs';

const T = {
  he: {
    title: 'ככה זה נראה באפליקציה', sub: 'בחרו צד וראו את המסכים שלכם.', note: 'המחשה. הנתונים לדוגמה.',
    customer: 'אני מחפש בעל מקצוע', pro: 'אני בעל מקצוע',
    quotes: 'הצעות מחיר', job: 'נזילה מתחת לכיור', pro1: 'יוסי · אינסטלטור', pro2: 'אבי · אינסטלטור', leaves: 'יוצא בעוד', min: 'דק׳', choose: 'בחירה',
    onway: 'בדרך אליך', eta: 'מגיע בעוד', chat: 'צ׳אט',
    feed: 'עבודות באזור', mapv: 'מפה', listv: 'רשימה', today: 'היום', km: 'ק״מ', send: 'שליחת הצעה',
    price: 'מחיר', depart: 'שעת יציאה', sendq: 'שליחה',
    tabsC: ['בית', 'בקשה', 'היסטוריה', 'הגדרות'], tabsP: ['עבודות', 'שלי', 'הגדרות'],
  },
  en: {
    title: 'What it looks like in the app', sub: 'Pick a side and see your screens.', note: 'Illustration with sample data.',
    customer: 'I need a pro', pro: "I'm a pro",
    quotes: 'Quotes', job: 'Leak under the sink', pro1: 'Yossi · Plumber', pro2: 'Avi · Plumber', leaves: 'Leaves in', min: 'min', choose: 'Choose',
    onway: 'On the way to you', eta: 'Arrives in', chat: 'Chat',
    feed: 'Jobs near you', mapv: 'Map', listv: 'List', today: 'Today', km: 'km', send: 'Send quote',
    price: 'Price', depart: 'Departure', sendq: 'Send',
    tabsC: ['Home', 'Request', 'History', 'Settings'], tabsP: ['Jobs', 'Mine', 'Settings'],
  },
};

const ICON = {
  home: '<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a2.1 2.1 0 0 0 3 3l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.4-.4-2.6z"/>',
};
const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
const tabbar = (labels, icons, active) => `<nav class="m-tabs">${labels.map((l, i) => `<span${i === active ? ' class="on"' : ''}${icons[i] === 'plus' ? ' data-fab' : ''}>${svg(icons[i])}${l}</span>`).join('')}</nav>`;

// Simple street map; route + markers drawn per screen.
const streets = `<rect width="300" height="420" fill="var(--m-ground)"/>
<path d="M0 90h300M0 210h300M0 330h300M80 0v420M150 0v420M220 0v420" stroke="var(--m-road)" stroke-width="14"/>
<path d="M0 150h300M0 270h300M115 0v420M185 0v420" stroke="var(--m-road)" stroke-width="6"/>
<rect x="190" y="222" width="26" height="42" rx="6" fill="var(--m-park)"/><rect x="88" y="100" width="22" height="44" rx="6" fill="var(--m-park)"/>`;

const arrivalMap = `<svg class="m-map" viewBox="0 0 300 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${streets}
<path d="M80 290V210h70V90h70" fill="none" stroke="#F9BA0B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="220" cy="90" r="11" fill="#3F2913" stroke="#fff" stroke-width="3"/>
<g transform="translate(68 278)"><circle cx="12" cy="12" r="17" fill="#F9BA0B" opacity=".25"/><circle cx="12" cy="12" r="12" fill="#F9BA0B" stroke="#fff" stroke-width="3"/><g transform="translate(5 5) scale(.6)" fill="none" stroke="#3F2913" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${ICON.wrench}</g></g></svg>`;

const feedMap = `<svg class="m-map" viewBox="0 0 300 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${streets}
${[[100, 120], [200, 175], [132, 255], [205, 300]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="26" fill="#F9BA0B" opacity=".18"/><circle cx="${x}" cy="${y}" r="${i === 0 ? 10 : 8}" fill="${i === 0 ? '#E0930D' : '#F9BA0B'}" stroke="#fff" stroke-width="3"/>`).join('')}
<circle cx="150" cy="350" r="8" fill="#1a73e8" stroke="#fff" stroke-width="3"/></svg>`;

function screens(t) {
  const quoteCard = (name, price, mins, on) => `<div class="m-card${on ? '' : ' dim'}"><div class="m-row"><b>${name}</b><span class="m-stars">★ 4.9</span></div><div class="m-row"><span class="m-price">₪${price}</span><span class="m-muted">${t.leaves} ${mins} ${t.min}</span></div>${on ? `<span class="m-btn">${t.choose}</span>` : ''}</div>`;
  const customer = `
    <div class="phone"><div class="m-screen">
      <header class="m-head"><small>${t.job}</small><b>${t.quotes}</b></header>
      <div class="m-body">${quoteCard(t.pro1, 320, 15, true)}${quoteCard(t.pro2, 380, 40, false)}</div>
      ${tabbar(t.tabsC, ['home', 'plus', 'clock', 'gear'], 0)}
    </div></div>
    <div class="phone"><div class="m-screen m-full">
      ${arrivalMap}
      <span class="m-eta">${t.eta} 12 ${t.min}</span>
      <div class="m-sheet"><div class="m-row"><b>${t.pro1}</b><span class="m-chip">${t.chat}</span></div><span class="m-muted">${t.onway}</span></div>
    </div></div>`;
  const pro = `
    <div class="phone"><div class="m-screen m-full">
      ${feedMap}
      <div class="m-seg"><span class="on">${svg('map')}${t.mapv}</span><span>${t.listv}</span></div>
      <div class="m-sheet"><div class="m-row"><b>${t.job}</b><span class="m-muted">1.2 ${t.km}</span></div><div class="m-row"><span class="m-muted">${t.today}</span><span class="m-btn">${t.send}</span></div></div>
      ${tabbar(t.tabsP, ['map', 'wrench', 'gear'], 0)}
    </div></div>
    <div class="phone"><div class="m-screen">
      <header class="m-head"><small>${t.job}</small><b>${t.send}</b></header>
      <div class="m-body"><label class="m-field"><span>${t.price}</span><b>₪320</b></label><label class="m-field"><span>${t.depart}</span><b>15 ${t.min}</b></label><span class="m-btn wide">${t.sendq}</span></div>
      ${tabbar(t.tabsP, ['map', 'wrench', 'gear'], 0)}
    </div></div>`;
  return `<section class="section" id="app">
  <div class="container">
    <div class="section-head"><h2>${t.title}</h2><p>${t.sub}</p></div>
    <div class="roles" data-role="customer">
      <div class="role-switch" role="tablist">
        <button type="button" role="tab" aria-selected="true" data-role="customer">${t.customer}</button>
        <button type="button" role="tab" aria-selected="false" data-role="pro">${t.pro}</button>
      </div>
      <div class="role-panel" data-panel="customer">${customer}</div>
      <div class="role-panel" data-panel="pro">${pro}</div>
    </div>
    <p class="m-note">${t.note}</p>
  </div>
</section>
<script>
document.querySelectorAll('.role-switch button').forEach(function(b){b.addEventListener('click',function(){
  var r=b.closest('.roles');r.dataset.role=b.dataset.role;
  r.querySelectorAll('.role-switch button').forEach(function(x){x.setAttribute('aria-selected',x===b)});
})});
</script>
`;
}

for (const lang of ['he', 'en']) writeFileSync(new URL(`../src/partials/appscreens.${lang}.html`, import.meta.url), screens(T[lang]));
console.log('app screens written');
