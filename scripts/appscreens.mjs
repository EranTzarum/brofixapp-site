// Generates the "how it looks in the app" phone mockups (customer / pro) for both languages
// into src/partials/appscreens.<lang>.html, which build.mjs inlines at <!--app-screens-->.
// Drawn to the builder's UI spec of 2026-10-22 (src/ui/tab-bar.tsx, theme.ts, he.ts on main 95cd88b).
// shortcut: hand-drawn mockups, replace with real screenshots from the 1.2.0 build when they exist.
// Usage: node scripts/appscreens.mjs
import { writeFileSync } from 'node:fs';

const T = {
  he: {
    title: 'ככה זה נראה באפליקציה', sub: 'בחרו צד וראו את המסכים שלכם.', note: 'המחשה. הנתונים לדוגמה.',
    customer: 'אני מחפש בעל מקצוע', pro: 'אני בעל מקצוע',
    quotes: 'הצעות מחיר', job: 'נזילה מתחת לכיור', p1: 'יוסי', p2: 'אבי', cat: 'אינסטלציה', min: 'דק׳', km: 'ק״מ',
    leaves: 'יוצא בעוד', arrives: 'מגיע ב־', choose: 'בחירה', verified: 'רישיון מאומת',
    updated: 'עודכן לפני 5 שנ׳', onway: 'בעל המקצוע בדרך אליך', chat: 'צ׳אט', details: 'פרטי העבודה',
    requests: 'בקשות', mapv: 'מפה', listv: 'רשימה', approx: 'המיקומים במפה מקורבים (כקילומטר)', urgent: 'דחוף',
    today: 'היום', sendq: 'לשליחת הצעה', newq: 'הצעה חדשה', price: 'מחיר', depart: 'מתי יוצאים',
    now: 'עכשיו', in30: 'בעוד 30 דק׳', in60: 'בעוד שעה', other: 'מועד אחר', send: 'שליחה',
    hello: 'בוקר טוב, דנה', whatfix: 'מה צריך לתקן?', active: 'פעיל עכשיו', onwayShort: 'בדרך אליך',
    cats: ['אינסטלציה', 'חשמל', 'מנעולנות', 'הנדימן', 'מיזוג אוויר', 'צביעה', 'מכשירי חשמל', 'גז', 'אחר'],
    tabsC: ['בית', 'שמורים', '', 'ארכיון', 'הגדרות'], tabsP: ['בקשות', 'ההצעות שלי', 'עבודות', 'הגדרות'],
  },
  en: {
    title: 'What it looks like in the app', sub: 'Pick a side and see your screens.', note: 'Illustration with sample data.',
    customer: 'I need a pro', pro: "I'm a pro",
    quotes: 'Quotes', job: 'Leak under the sink', p1: 'Yossi', p2: 'Avi', cat: 'Plumbing', min: 'min', km: 'km',
    leaves: 'Leaves in', arrives: 'Arrives at ', choose: 'Choose', verified: 'Verified license',
    updated: 'Updated 5s ago', onway: 'Your pro is on the way', chat: 'Chat', details: 'Job details',
    requests: 'Requests', mapv: 'Map', listv: 'List', approx: 'Map locations are approximate (~1 km)', urgent: 'Urgent',
    today: 'Today', sendq: 'Send a quote', newq: 'New quote', price: 'Price', depart: 'When you leave',
    now: 'Now', in30: 'In 30 min', in60: 'In an hour', other: 'Other time', send: 'Send',
    hello: 'Good morning, Dana', whatfix: 'What needs fixing?', active: 'Active now', onwayShort: 'On the way',
    cats: ['Plumbing', 'Electrical', 'Locksmith', 'Handyman', 'Air con', 'Painting', 'Appliances', 'Gas', 'Other'],
    tabsC: ['Home', 'Saved', '', 'Archive', 'Settings'], tabsP: ['Requests', 'My quotes', 'Jobs', 'Settings'],
  },
};

const ICON_WRENCH = '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a2.1 2.1 0 0 0 3 3l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.4-.4-2.6z"/>';
const ICON = {
  home: '<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bookmark: '<path d="M6 4h12v16l-6-4-6 4z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  tools: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.5 17.5a2.1 2.1 0 0 0 3 3l5.8-5.8a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.4-.4-2.6z"/>',
  back: '<path d="m9 6 6 6-6 6"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
};
const CAT = [
  '<path d="M3 9h9a4 4 0 0 1 4 4v1"/><path d="M8.5 9V5.5M5.5 5.5h6"/><path d="M16 17.5c0 1.2-.7 2-1.6 2s-1.6-.8-1.6-2c0-1 1.6-2.7 1.6-2.7s1.6 1.7 1.6 2.7z"/>',
  '<path d="M13 2.5 5.5 13h6l-1 8.5L18 11h-6l1-8.5z"/>',
  '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2.5"/>',
  ICON_WRENCH,
  '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/><path d="m9.5 4.5 2.5 1.6 2.5-1.6M9.5 19.5l2.5-1.6 2.5 1.6"/>',
  '<rect x="3.5" y="3" width="13.5" height="6" rx="2"/><path d="M17 6h3v6h-8v3"/><rect x="10.5" y="15" width="3" height="6.5" rx="1.2"/>',
  '<rect x="4" y="2.5" width="16" height="19" rx="3"/><circle cx="12" cy="13.5" r="4.5"/><path d="M8 6.5h.01M11 6.5h3"/>',
  '<path d="M12 21.5c3.9 0 6.5-2.6 6.5-6.2 0-3.7-2.6-6.2-4.9-9.8-.9 2.3-1.9 3.6-3.4 4.6-.4-1.3-1-2.3-1.9-3.1-1.4 2.2-2.8 4.7-2.8 7.7 0 3.6 2.6 6.8 6.5 6.8z"/>',
  '<circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>',
];
const svg = (k, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;

// Tab bar: active tab = icon in a tinted 56x30 pill, label in primaryText. Customer has a raised center "+".
function tabbar(labels, icons, active) {
  return `<nav class="m-tabs">${labels.map((l, i) => icons[i] === 'plus'
    ? `<span class="m-fab">${svg('plus')}</span>`
    : `<span${i === active ? ' class="on"' : ''}><i>${svg(icons[i])}</i>${l}</span>`).join('')}</nav>`;
}

// Neutral street map (no custom map style in the app: plain Google/Apple map, POIs hidden).
const streets = `<rect width="300" height="460" fill="var(--m-ground)"/>
<path d="M0 95h300M0 215h300M0 335h300M80 0v460M150 0v460M220 0v460" stroke="var(--m-road)" stroke-width="14"/>
<path d="M0 155h300M0 275h300M0 400h300M115 0v460M185 0v460" stroke="var(--m-road)" stroke-width="6"/>
<rect x="190" y="225" width="26" height="42" rx="6" fill="var(--m-park)"/><rect x="88" y="104" width="22" height="44" rx="6" fill="var(--m-park)"/>`;

// Live trip: amber 5px route, pro marker = 24px amber circle with white border, red destination pin.
const tripMap = `<svg class="m-map" viewBox="0 0 300 460" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${streets}
<path d="M80 250V215h70V95h70" fill="none" stroke="#F9BA0B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="80" cy="250" r="12" fill="#F9BA0B" stroke="#fff" stroke-width="3"/>
<path d="M220 97c-6-8-10-12-10-17a10 10 0 0 1 20 0c0 5-4 9-10 17z" fill="#D93025" stroke="#fff" stroke-width="2"/><circle cx="220" cy="80" r="3.5" fill="#fff"/></svg>`;

// Pro feed: request pins are pills with the distance; urgent pins amber "Urgent · d"; selected amber, x1.12.
function feedMap(t) {
  const pill = (x, y, text, kind) => {
    const w = text.length * 6.6 + 18;
    const cls = kind === 'sel' ? 'm-pin sel' : kind === 'urgent' ? 'm-pin urgent' : 'm-pin';
    return `<g class="${cls}" transform="translate(${x} ${y})${kind === 'sel' ? ' scale(1.12)' : ''}"><rect x="${-w / 2}" y="-12" width="${w}" height="24" rx="12"/><text y="4.5" text-anchor="middle">${text}</text></g>`;
  };
  return `<svg class="m-map" viewBox="0 0 300 460" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${streets}
${pill(110, 135, `1.2 ${t.km}`, 'sel')}${pill(165, 185, `${t.urgent} · 0.8 ${t.km}`, 'urgent')}${pill(130, 255, `2.4 ${t.km}`)}${pill(205, 300, `3.1 ${t.km}`)}
<circle cx="150" cy="345" r="7" fill="#1a73e8" stroke="#fff" stroke-width="3"/></svg>`;
}

function screens(t) {
  const quoteCard = (name, price, mins, at, verified, on) => `<div class="m-card${on ? '' : ' dim'}">
          <div class="m-row"><b>${name} · ${t.cat}</b><span class="m-stars">${svg('star')}4.9</span></div>
          ${verified ? `<span class="m-badge">${t.verified}</span>` : ''}
          <div class="m-row"><span class="m-price">₪${price}</span><span class="m-muted">${t.leaves} ${mins} ${t.min} · ${t.arrives}${at}</span></div>
          ${on ? `<span class="m-btn">${t.choose}</span>` : ''}</div>`;
  const customer = `
    <figure class="phone"><div class="m-screen">
      <header class="m-head"><b>${t.hello}</b><small>${t.whatfix}</small></header>
      <div class="m-body">
        <div class="m-cats">${t.cats.map((c, i) => `<span><i><svg viewBox="0 0 24 24" aria-hidden="true">${CAT[i]}</svg></i>${c}</span>`).join('')}</div>
        <b class="m-group">${t.active} <span>1</span></b>
        <div class="m-card live"><div class="m-row"><b>${t.cat}</b><span class="m-mins">${t.arrives}14:32</span></div><span class="m-muted">${t.job} · ${t.p1}</span></div>
      </div>
      ${tabbar(t.tabsC, ['home', 'bookmark', 'plus', 'archive', 'gear'], 0)}
    </div></figure>
    <figure class="phone"><div class="m-screen">
      <header class="m-head"><small>${t.job}</small><b>${t.quotes}</b></header>
      <div class="m-body">${quoteCard(t.p1, 320, 15, '14:32', true, true)}${quoteCard(t.p2, 380, 40, '15:05', false, false)}</div>
      ${tabbar(t.tabsC, ['home', 'bookmark', 'plus', 'archive', 'gear'], 0)}
    </div></figure>
    <figure class="phone"><div class="m-screen m-full">
      ${tripMap}
      <div class="m-top"><span class="m-round">${svg('back')}</span><span class="m-updated"><i></i>${t.updated}</span></div>
      <div class="m-sheet">
        <span class="m-muted">${t.onway}</span>
        <div class="m-row"><b class="m-eta">${t.arrives}14:32</b><span class="m-mins">12 ${t.min}</span></div>
        <span class="m-progress"><i></i></span>
        <div class="m-pro"><span class="m-avatar">${t.p1[0]}</span><span><b>${t.p1} · ${t.cat}</b><small class="m-muted">★ 4.9 · 2.1 ${t.km}</small></span></div>
        <div class="m-actions"><span class="m-btn wide">${t.chat}</span><span class="m-btn ghost wide">${t.details}</span></div>
      </div>
    </div></figure>`;
  const pro = `
    <figure class="phone"><div class="m-screen m-full">
      ${feedMap(t)}
      <header class="m-head m-float"><b>${t.requests}</b><span class="m-seg"><span class="on">${t.mapv}</span><span>${t.listv}</span></span></header>
      <span class="m-note-map">${t.approx}</span>
      <div class="m-rail">
        <div class="m-card"><div class="m-row"><b>${t.job}</b><span class="m-muted">1.2 ${t.km}</span></div><div class="m-row"><span class="m-muted">${t.cat} · ${t.today}</span><span class="m-btn">${t.sendq}</span></div></div>
        <div class="m-card peek"></div>
      </div>
      ${tabbar(t.tabsP, ['map', 'tag', 'tools', 'gear'], 0)}
    </div></figure>
    <figure class="phone"><div class="m-screen">
      <header class="m-head"><small>${t.job}</small><b>${t.newq}</b></header>
      <div class="m-body">
        <label class="m-field"><span>${t.price}</span><b>₪320</b></label>
        <div class="m-field"><span>${t.depart}</span><div class="m-chips"><span class="on">${t.now}</span><span>${t.in30}</span><span>${t.in60}</span><span>${t.other}</span></div></div>
        <span class="m-btn wide">${t.send}</span>
      </div>
      ${tabbar(t.tabsP, ['map', 'tag', 'tools', 'gear'], 0)}
    </div></figure>`;
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
