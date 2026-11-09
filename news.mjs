// News: every story has its own page, and the lists on the home page and the News page are built from here.
// Newest first. Words are the charity's own, with names as {{SETTINGS}}.
export const stories = [
  {
    slug: 'open-hands-technology-trust-joins', date: '5 November 2026',
    title: '{{JOINED_TRUST}} has become part of {{SHORT}}',
    summary: '"We have ambitious plans for the future," said {{CHAIR}}, {{SHORT}} Chair of Trustees.',
    body: `<p>{{JOINED_TRUST}} ({{JOINED_TRUST_SHORT}}) became part of {{SHORT}} on 30 October 2026.</p>
<p>"We have ambitious plans for the future," said {{CHAIR}}, {{SHORT}} Chair of Trustees. "The resources which are coming from {{JOINED_TRUST_SHORT}} will enable us to kick-start a number of new developments, and we are delighted to be able to build on {{JOINED_TRUST_SHORT}}'s legacy."</p>
<p>{{JOINED_TRUST_SHORT}}'s device scheme has now closed. If you would like advice on using technology, or on organisations that provide free equipment and grants for it, we can help: see <a href="/supporting-you/equipment-and-funding/">Equipment and funding</a>.</p>`,
  },
  {
    slug: 'masterclass-series-jaws-with-microsoft-office', date: '26 October 2026',
    title: 'Masterclass Series: Using JAWS with Microsoft Office',
    summary: 'A new series introduces the JAWS screen reader with Microsoft Word, Excel and Outlook.',
    body: `<p>We have started a new Masterclass Series, an introduction to using the JAWS screen reader with Microsoft Word, Excel and Outlook.</p>
<p>The recording of Session 1 is available. Session 2 was on 4 November, and Session 3 is on 2 December.</p>
<p>Details of each session are emailed to members. <a href="/membership/">Joining is free</a>.</p>`,
  },
  {
    slug: 'new-community-development-lead', date: '23 October 2026',
    title: '{{SHORT}} welcomes a new team member',
    summary: '{{DEV_LEAD}} has joined us in the new role of Community Development Lead.',
    body: `<p>{{SHORT}} is pleased to announce that {{DEV_LEAD}} has recently joined the organisation in the new role of Community Development Lead.</p>`,
  },
  {
    slug: 'grant-for-digital-skills-for-employment', date: '31 July 2026',
    title: 'Grant secured to develop digital skills for employment',
    summary: 'A grant to develop a Digital Skills Framework, with a Scottish sight loss charity.',
    body: `<p>We and a Scottish sight loss charity have been given a grant to develop a Digital Skills Framework, and a national case for support, to help people build the skills they need for today's workplace.</p>`,
  },
  {
    slug: 'training-videos-for-professionals', date: '13 July 2026',
    title: 'Sector launches training videos for professionals',
    summary: 'A four-part introduction to technology for people working in the sight loss sector.',
    body: `<p>Organisations in the technology group of {{ALLIANCE}} have come together to develop training for professionals working in the sight loss sector.</p>
<p>The four-part pilot introduces mainstream and specialist technology for people who are blind or partially sighted, and the session recordings are now available.</p>`,
  },
];

const BASE = '/news/';

// A list of stories: each headline is a link to the story's own page.
// Headline level: 2 where the list sits right under the page's main heading, 3 under a section heading.
export function storyList(fill, count = stories.length, level = 3) {
  return `<ul class="news-list">
${stories.slice(0, count).map(s => `<li><h${level}><a href="${BASE}${s.slug}/">${fill(s.title)}</a></h${level}>
<p class="meta">${s.date}</p>
<p>${fill(s.summary)}</p></li>`).join('\n')}
</ul>`;
}

// One page for each story.
export function storyPages(fill) {
  return stories.map(s => ({
    path: `${BASE}${s.slug}/`, h1: fill(s.title), description: fill(s.summary).replace(/"/g, '&quot;'),
    html: `<p class="meta">${s.date}</p>
${fill(s.body)}
<p><a href="${BASE}">All news</a></p>`,
  }));
}
