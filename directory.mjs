// The directory, built from one data file: data/directory.json.
// Three ways in: by what you want to do, by kind of organisation, and A to Z. Every entry has its own page.
// The same data is published at /resources/directory/directory.json for agents.
import { readFileSync } from 'node:fs';

const BASE = '/resources/directory/';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Descriptions keep their links as [text](url). Summaries show the words only; entry pages show the links.
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const plain = s => s.replace(LINK, '$1');
function inline(s) {
  let out = '', last = 0;
  for (const m of s.matchAll(LINK)) {
    out += esc(s.slice(last, m.index)) + `<a href="${esc(m[2])}">${esc(m[1])}</a>`;
    last = m.index + m[0].length;
  }
  return out + esc(s.slice(last));
}
// Lines starting "- " become a list; everything else is a paragraph.
function describe(lines) {
  const out = []; let list = [];
  const flush = () => { if (list.length) { out.push(`<ul>\n${list.map(l => `<li>${inline(l)}</li>`).join('\n')}\n</ul>`); list = []; } };
  for (const l of lines) { if (l.startsWith('- ')) list.push(l.slice(2)); else { flush(); out.push(`<p>${inline(l)}</p>`); } }
  flush();
  return out.join('\n');
}
const firstSentence = s => (plain(s).match(/^.*?[.!?](?=\s|$)/) || [plain(s)])[0];
const byName = (a, b) => a.name.localeCompare(b.name, 'en-GB', { sensitivity: 'base' });

export function directoryPages(fill) {
  const data = JSON.parse(fill(readFileSync('data/directory.json', 'utf8')));
  const { entries, typeNames, needNames } = data;
  entries.sort(byName);

  const item = e => `<li><a href="${BASE}${e.slug}/">${esc(e.name)}</a><br>
${esc(firstSentence(e.description[0] || ''))}</li>`;
  const list = es => `<ul class="directory-list">\n${es.map(item).join('\n')}\n</ul>`;
  const count = n => `${n} ${n === 1 ? 'entry' : 'entries'}`;
  const ways = `<h2 id="other-ways">Other ways to look</h2>
<ul>
<li><a href="${BASE}">By what you want to do</a></li>
<li><a href="${BASE}kinds/">By kind of organisation</a></li>
<li><a href="${BASE}a-to-z/">A to Z</a></li>
</ul>`;
  const pages = [];

  // The front door: what do you want to do?
  pages.push({
    path: BASE, h1: 'Directory of services',
    description: `Organisations and resources that help blind and partially sighted people get the most out of technology, by what you want to do.`,
    html: `<p class="lede">Organisations and resources that help blind and partially sighted people get the most out of technology.</p>
<p>${entries.length} entries, listed by what you want to do. Many appear under more than one heading.</p>
<h2 id="what-do-you-want-to-do">What do you want to do?</h2>
<ul class="doors">
${Object.entries(needNames).map(([id, label]) => {
  const n = entries.filter(e => e.needs.includes(id)).length;
  return n ? `<li><a href="${BASE}${id}/">${label}</a><p>${count(n)}</p></li>` : '';
}).join('\n')}
</ul>
<h2 id="other-ways">Other ways to look</h2>
<ul>
<li><a href="${BASE}kinds/">By kind of organisation</a></li>
<li><a href="${BASE}a-to-z/">A to Z</a></li>
<li>For agents, and anyone who wants it: <a href="${BASE}directory.json">the whole directory as data</a></li>
</ul>
<h2 id="suggest">Suggest an organisation</h2>
<p>Know an organisation that should be here, or found one that has changed? Use "Fix something on this page" at the foot of any directory page, and tell us.</p>`,
  });

  // One page for each need.
  for (const [id, label] of Object.entries(needNames)) {
    const es = entries.filter(e => e.needs.includes(id));
    if (!es.length) continue;
    pages.push({
      path: `${BASE}${id}/`, h1: label, description: `${label}: ${count(es.length)} in the directory of services.`,
      html: `<p>${count(es.length)}, A to Z.</p>\n${list(es)}\n${ways}`,
    });
  }

  // By kind of organisation, all on one page.
  const kinds = Object.entries(typeNames).sort((a, b) => a[1].localeCompare(b[1]));
  pages.push({
    path: `${BASE}kinds/`, h1: 'By kind of organisation', description: 'The directory of services, by kind of organisation.',
    html: `<p>Jump to a kind:</p>
<ul>
${kinds.map(([id, name]) => `<li><a href="#${id}">${name}</a></li>`).join('\n')}
</ul>
${kinds.map(([id, name]) => {
  const es = entries.filter(e => e.types.includes(id));
  return `<h2 id="${id}">${name}</h2>\n<p>${count(es.length)}</p>\n${list(es)}`;
}).join('\n')}
${ways}`,
  });

  // A to Z.
  pages.push({
    path: `${BASE}a-to-z/`, h1: 'A to Z', description: 'Every entry in the directory of services, A to Z.',
    html: `<p>All ${entries.length} entries.</p>\n${list(entries)}\n${ways}`,
  });

  // One page for each entry.
  for (const e of entries) {
    const contact = [
      e.website && `<li>Website: <a href="${esc(e.website)}">${esc(e.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a></li>`,
      e.email && `<li>Email: <a href="mailto:${esc(e.email)}">${esc(e.email)}</a></li>`,
      e.phone && `<li>Phone: ${esc(e.phone)}</li>`,
    ].filter(Boolean);
    pages.push({
      path: `${BASE}${e.slug}/`, h1: e.name,
      description: esc(firstSentence(e.description[0] || e.name)),
      html: `${describe(e.description)}
<h2 id="contact">Contact</h2>
${contact.length ? `<ul>\n${contact.join('\n')}\n</ul>` : '<p>No contact details yet.</p>'}
<h2 id="listed-under">Listed under</h2>
<ul>
${e.needs.map(n => `<li><a href="${BASE}${n}/">${needNames[n]}</a></li>`).join('\n')}
${e.types.map(t => `<li><a href="${BASE}kinds/#${t}">${typeNames[t]}</a></li>`).join('\n')}
</ul>
<p class="meta">${e.checked ? `Details last checked on ${e.checked}.` : 'These details have not been checked since they were copied from the old directory.'}</p>
<p><a href="${BASE}">Back to the directory</a></p>`,
    });
  }

  return { pages, json: JSON.stringify({ entries, typeNames, needNames }, null, 2) + '\n' };
}
