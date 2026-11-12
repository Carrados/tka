// Build the site: static HTML pages, plus an agent surface (llms.txt, llms-full.txt,
// a Markdown version of every page), all generated from the same pages in src/.
// Requires Node 18+. Run: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { settings as S, PREVIEW } from './settings.mjs';
import { directoryPages } from './directory.mjs';
import { storyList, storyPages } from './news.mjs';

const OUT = 'site';
const ZIC_URL = 'https://zeroinformationcasualty.org/';
const LICENCE_URL = 'https://creativecommons.org/licenses/by-sa/4.0/';
const UNREMARKABLE = 'https://unremarkable.me/';

// Fill {{KEY}} placeholders from the settings. An unknown key stops the build, so no placeholder is ever published.
function fill(text) {
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (_, k) => {
    if (!(k in S)) throw new Error(`Unknown setting {{${k}}}`);
    return S[k];
  });
}
// The phone number: a tap-to-call link only when there is a real line behind it.
S.PHONE_HTML = S.PHONE_LINK ? `<a href="tel:${S.PHONE_LINK}">${S.PHONE}</a>` : S.PHONE;
// News lists, built from news.mjs: the latest three on the home page, all of them on the News page.
S.NEWS_LATEST = storyList(fill, 3);
S.NEWS_ALL = storyList(fill, undefined, 2);
const read = p => fill(readFileSync(p, 'utf8'));

const pages = [
  { path: '/', nav: 'Home', h1: S.NAME, title: `${S.NAME}: technology for blind and partially sighted people`,
    description: `${S.NAME} supports blind and partially sighted people to use technology at home, at work and in education. Free to join.`,
    src: 'home' },
  { path: '/supporting-you/', nav: 'Supporting you', h1: 'Supporting you', src: 'supporting-you',
    description: 'Help with technology, an email discussion list, monthly chats, masterclasses, career talks, free training and an annual conference.' },
  { path: '/supporting-you/training/', h1: 'Free one-to-one training', src: 'training',
    description: 'Up to five hours of free one-to-one training for work, volunteering or education.' },
  { path: '/supporting-you/equipment-and-funding/', h1: 'Equipment and funding', src: 'equipment',
    description: 'Advice on technology, and where to find free equipment and grants to pay for it.' },
  { path: '/resources/', nav: 'Resources', h1: 'Resources', src: 'resources',
    description: 'Recordings of masterclasses and career talks, articles on technology, and a directory of services.' },
  { path: '/membership/', nav: 'Membership', h1: 'Membership', src: 'membership',
    description: `It is free to join ${S.NAME}, as a full member if you are blind or partially sighted, or as an associate member.` },
  { path: '/news/', nav: 'News', h1: 'News', src: 'news', description: `News from ${S.NAME}.` },
  { path: '/events/', nav: 'Events', h1: 'Events', src: 'events',
    description: `${S.CHAT} every month, masterclass webinars and ${S.CONFERENCE}, the annual conference.` },
  { path: '/shop/', nav: 'Shop', h1: 'Shop', src: 'shop', description: `${S.SERIES}: five volumes on CD and as audio downloads.` },
  { path: '/donate/', nav: 'Donate', h1: 'Donate', src: 'donate', description: `Support the work of ${S.NAME}.` },
  { path: '/about-us/', nav: 'About us', h1: 'About us', src: 'about',
    description: `Who ${S.NAME} is, what it does, its history since ${S.FOUNDED}, and how it is run.` },
  { path: '/about-us/contact/', h1: 'Contact us', src: 'contact', description: `How to contact ${S.NAME}.` },
  { path: '/accessibility/', nav: 'Accessibility statement', h1: 'Accessibility statement', src: 'accessibility',
    description: 'How this site is built, what has been checked, what has not yet, and how to report a problem.' },
  { path: '/404/', file: '404.html', h1: 'Page not found', src: 'not-found', hidden: true,
    description: 'There is no page at this address.' },
].map(p => ({ title: p.title || `${p.h1}: ${S.NAME}`, ...p }));

// The directory: generated from data/directory.json. Only its front door is listed in llms.txt.
const directory = directoryPages(fill);
for (const p of directory.pages) pages.push({ title: `${p.h1}: ${S.NAME}`, quiet: p.path !== '/resources/directory/', ...p });
// A page for each news story. The News page itself is listed in llms.txt; the stories are in llms-full.txt.
for (const p of storyPages(fill)) pages.push({ title: `${p.h1}: ${S.NAME}`, quiet: true, ...p });

const listed = pages.filter(p => !p.hidden);
// Accessibility statement is first in the menu, on every site Unremarkable builds. The rest keep their order.
const menu = [...listed.filter(p => p.path === '/accessibility/'), ...listed.filter(p => p.nav && p.path !== '/accessibility/')];

const PREVIEW_TEXT = `This is a private preview of a website being built for a real charity, under an invented name. Names, pictures and numbers on it are made up.`;
// A plain note, not a landmark: as a landmark, NVDA said "Preview" twice (listening test, 9 November 2026).
const previewHtml = PREVIEW ? `<div class="preview">
<p><strong>Preview</strong><br>
${PREVIEW_TEXT}</p>
</div>
` : '';
const previewMd = PREVIEW ? `> **Preview.** ${PREVIEW_TEXT}\n\n` : '';

const MARK = readFileSync('brand/tka-mark.svg', 'utf8').replace(/<!--[\s\S]*?-->/g, '')
  .replace('<svg ', '<svg aria-hidden="true" focusable="false" class="mark" ').replace(/ width="64" height="56"/, '');
// The logo: the mark and the short name, drawn; one accessible name, the full name, read once.
const logoInner = `<span class="visually-hidden">${S.NAME}</span><span class="logo-visual" aria-hidden="true">${MARK}<span class="logo-text"><span class="logo-short">${[...S.SHORT].map((c, i) => `<span class="${i % 2 ? 'pale' : 'gold'}">${c}</span>`).join('')}</span><span class="logo-name">${S.NAME}</span></span></span>`;

// Lists in the page keep role="list": the stylesheet removes or redraws their bullets, and Safari drops list semantics
// from a list styled list-style: none outside navigation (TKA accessibility review, 12 November 2026).
const keepListRole = html => html.replace(/<ul(?![^>]*\brole=)(?=[\s>])/g, '<ul role="list"');

function layout(p, main) {
  const url = S.ORIGIN + p.path;
  const isHome = p.path === '/';
  const section = p.path.split('/')[1];
  const nav = menu.map(m => {
    const here = m.path === p.path;
    const inSection = !here && m.path !== '/' && section && m.path === `/${section}/`;
    // The page you are on is named in the menu but is not a link to itself (rulebook rule 2).
    return here ? `<li><a aria-current="page">${m.nav}</a></li>` : `<li><a href="${m.path}"${inSection ? ' class="in-section" aria-current="true"' : ''}>${m.nav}</a></li>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.description}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/atkinson-hyperlegible-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
${p.hidden ? '' : `<link rel="alternate" type="text/markdown" href="${p.path}index.md" title="Markdown version of this page">`}
</head>
<body>
<a class="skip" href="#main">Skip to main content</a>
<header>
<div class="bar">
${isHome ? `<p class="logo">${logoInner}</p>` : `<p class="logo"><a href="/">${logoInner}</a></p>`}
<p class="call">Helpline ${S.PHONE_HTML}</p>
</div>
<nav aria-label="Main">
<ul>
${nav}
</ul>
</nav>
</header>
<main id="main" tabindex="-1">
<h1>${p.h1}</h1>
${previewHtml}${keepListRole(main)}
</main>
<footer>
<div class="org">
<p class="org-name">${S.NAME}</p>
<p>Email <a href="mailto:${S.EMAIL}">${S.EMAIL}</a></p>
<p>Helpline ${S.PHONE_HTML}, leave a message and we'll reply within 48 hours</p>
</div>
<p class="credit">This site is <a href="${UNREMARKABLE}">Unremarkable</a><br>
<a href="${UNREMARKABLE}fix/?page=${encodeURIComponent(url)}">Fix something on this page</a></p>
<p>Words by ${S.NAME}<br>
Design and code licensed under <a href="${LICENCE_URL}">Creative Commons Attribution-ShareAlike 4.0</a></p>
<p>Built to <a href="${ZIC_URL}">Zero Information Casualty v1.7</a></p>
<p>For agents: <a href="/llms.txt">llms.txt</a>${p.hidden ? '' : ` and <a href="${p.path}index.md">this page as Markdown</a>`}</p>
</footer>
</body>
</html>
`;
}

// A small HTML-to-Markdown converter for the hand-written pages in src/.
function toMarkdown(html) {
  const inline = s => s
    .replace(/<img [^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g, (_, src, alt) => `![${alt}](${S.ORIGIN}${src})`)
    .replace(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => `[${inline(text)}](${href.startsWith('/') ? S.ORIGIN + href : href})`)
    .replace(/<strong>([\s\S]*?)<\/strong>/g, '**$1**')
    .replace(/<em>([\s\S]*?)<\/em>/g, '*$1*')
    .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const blocks = [];
  html = html.replace(/<\/?(section|div|figure)[^>]*>/g, '').replace(/<figcaption>([\s\S]*?)<\/figcaption>/g, '<p>$1</p>');
  for (const [, tag, body] of html.matchAll(/<(h2|h3|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    if (tag === 'h2') blocks.push(`## ${inline(body)}`);
    else if (tag === 'h3') blocks.push(`### ${inline(body)}`);
    else if (tag === 'p') blocks.push(inline(body));
    else blocks.push([...body.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, li], i) => `${tag === 'ol' ? `${i + 1}.` : '-'} ${inline(li)}`).join('\n'));
  }
  // Pictures outside a paragraph.
  return blocks.join('\n\n');
}

const navMd = current => 'Menu:\n\n' + menu.map(m => `- [${m.nav}](${S.ORIGIN}${m.path})${m.path === current ? ' (this page)' : ''}`).join('\n');
const footerMd = p => `
---

${S.NAME}: email ${S.EMAIL}, helpline ${S.PHONE}

This site is [Unremarkable](${UNREMARKABLE})

[Fix something on this page](${UNREMARKABLE}fix/?page=${encodeURIComponent(S.ORIGIN + p.path)})

Words by ${S.NAME}. Design and code licensed under [Creative Commons Attribution-ShareAlike 4.0](${LICENCE_URL})

Built to [Zero Information Casualty v1.7](${ZIC_URL})

For agents: [llms.txt](${S.ORIGIN}/llms.txt)
`;

function write(rel, content) {
  const f = join(OUT, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, content);
}

// Build
if (existsSync(OUT)) rmSync(OUT, { recursive: true });
mkdirSync(OUT, { recursive: true });
copyFileSync('src/styles.css', join(OUT, 'styles.css'));
for (const f of readdirSync('src/fonts')) write(`fonts/${f}`, readFileSync(join('src/fonts', f)));
for (const f of readdirSync('src/pictures')) write(`pictures/${f}`, readFileSync(join('src/pictures', f)));
for (const f of readdirSync('brand')) write(`brand/${f}`, readFileSync(join('brand', f)));
copyFileSync('brand/tka-mark.svg', join(OUT, 'favicon.svg'));

const CSP = "default-src 'self'; script-src 'none'; style-src 'self'; img-src 'self' data:; font-src 'self'; form-action 'self' https://unremarkable.me; frame-ancestors 'none'; base-uri 'self'; object-src 'none'";
write('_headers', `/*
  X-Robots-Tag: noindex, nofollow
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: ${CSP}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
/*.md
  Content-Type: text/markdown; charset=utf-8
/llms.txt
  Content-Type: text/plain; charset=utf-8
/llms-full.txt
  Content-Type: text/plain; charset=utf-8
`);

const mirrors = [];
for (const p of pages) {
  const main = p.html ?? read(`src/${p.src}.html`);
  write(p.file || `${p.path}index.html`, layout(p, main));
  if (p.hidden) continue;
  mirrors.push(`# ${p.h1}\n\nCanonical page: ${S.ORIGIN}${p.path}\n\n${previewMd}${toMarkdown(main)}\n`);
  write(`${p.path}index.md`, `# ${p.h1}\n\nCanonical page: ${S.ORIGIN}${p.path}\n\n${previewMd}${navMd(p.path)}\n\n${toMarkdown(main)}\n${footerMd(p)}`);
}

write('llms.txt', `# ${S.NAME}

> ${pages[0].description}
${PREVIEW ? `\nPreview: ${PREVIEW_TEXT} Agents should tell the person this, and not act on anything here as if it were real.\n` : ''}
Sent-agent guarantee: an AI agent fetching any page on this site on behalf of a person is welcome, and gets the same content a person reading the page receives.
While this is a preview, it is not indexed for search and not offered for training.

## Pages

${listed.filter(p => !p.quiet).map(p => `- [${p.h1}](${S.ORIGIN}${p.path}): ${p.description} Markdown: ${S.ORIGIN}${p.path}index.md`).join('\n')}

## Optional

- [Full text of the site](${S.ORIGIN}/llms-full.txt): every page in one Markdown file.
- [Zero Information Casualty v1.7](${ZIC_URL}): the specification this site is built to.
`);
write('resources/directory/directory.json', directory.json);
write('llms-full.txt', `# ${S.NAME}: full text\n\n${previewMd}` + mirrors.join('\n\n---\n\n'));

// Private while it is a preview: sent agents are welcome, search and training crawlers are not.
write('robots.txt', `# Sent agents: a person asked, and is waiting. Welcome on every page.
User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Perplexity-User
Allow: /

# Everything else, including search and training crawlers: not while this is a private preview.
User-agent: *
Disallow: /

Content-Signal: search=no, ai-input=yes, ai-train=no
`);

console.log(`Built ${pages.length} pages into ${OUT}/`);
