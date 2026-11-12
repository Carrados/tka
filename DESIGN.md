# Design decisions: The Talking Kettle Association

The Talking Kettle Association (TKA) is the cover name for a private remake of a real charity's website, built by [Unremarkable](https://unremarkable.me/). If the charity adopts it, the name, logo and addresses change by settings, and nothing else changes.

Decided 9 November 2026.

## Names are settings, never typed into pages

Every page takes these from one place in the build:

- Full name: The Talking Kettle Association
- Short name: TKA
- Domain: tka.unremarkable.me
- Email address: to be decided
- Logo: the TKA logo (see below)

Swapping to the real charity means changing these settings and rebuilding. Never find-and-replace.

## Every real name is replaced by an invented one

Decided 9 November 2026. Wherever a real name appears in the charity's content, it's replaced by an invented one, and the same invented name is used every time that real name appears, on every page.

- **Covered:** people (trustees, staff, members, speakers, authors), the charity and its own branded names (events, courses, products, webinars), funders and partner organisations, and email addresses and web addresses that contain any of those.
- **Not covered:** the technology the content is about, such as screen readers, phones, apps and smart glasses, and the companies that make them. Those stay as they are, because the advice is about them.
- **Invented names are checked** so they don't belong to a real person or organisation in this field.
- **The names map is private.** It pairs each real name with its invented one, so it's kept outside this public repository, in the gitignored `research/` folder. If the charity adopts the site, the map turns every name back in one pass.

## Every image is a drawn SVG

Decided 9 November 2026. Wherever the charity's site has a photograph or image, this site has an SVG drawn in code in its place.

- The drawing shows what the photo shows, in the site's colours: a person at a conference wearing smart glasses is drawn as a person at a conference wearing smart glasses.
- Each drawing gets alt text written for it, based on the photo's original alt text, with any real names replaced.
- No photograph of a real person appears on this site.
- If the charity adopts the site, its own photographs can replace the drawings one by one, or the drawings can stay.

## Colours

Taken from the charity's own brand: its colours, not its theme code, which belongs to its web designer. Measured contrast; Unremarkable's standard is AAA (7:1) for all text.

| Name | Colour | Use | Contrast |
|---|---|---|---|
| Ink | #131313 | body text | 18.6:1 on white |
| Teal | #125a59 | brand colour, header band | 8.0:1 on white |
| Dark teal | #0f4948 | headings, hover | 10.2:1 on white |
| Blue | #205b7e | links | 7.3:1 on white |
| Dark blue | #1b4f6e | links on the pale wash (footer, notes, the five doors) | 7.8:1 on the wash, where the blue is only 6.5:1 |
| Gold | #efcb37 | highlights, logo, buttons on ink | 11.7:1 on ink |
| Pale blue | to be measured from the logo | logo | |

Rules:

- **No gold text on teal.** It's 5.0:1, AA only. Gold on teal is used only for shapes and the logo, never for words people need to read.
- **No #767676 grey.** It's 4.5:1. Secondary text uses a darker grey that reaches 7:1.
- **A dark scheme** follows the reader's system setting, and **more contrast** follows theirs too. There is no contrast switcher on the page: system settings do the job, and work the same on every site.

## Font

The charity uses FS Me (designed with Mencap to be easy to read). It's a paid font licensed to the charity's own site, so it can't be used here.

- Use a free font in the same spirit: **Atkinson Hyperlegible**, designed by the Braille Institute for readers with low vision, under the SIL Open Font License. Self-hosted, no font services.
- If the charity adopts the site, check whether its FS Me licence covers the new site, and swap the font by setting.

## Logo

The charity's logo: on the teal band, a small mark of dots joined by lines, in gold and pale blue; then the short name in thin capitals, widely spaced, the letters alternating gold and pale blue; the full name in white underneath.

- **The TKA logo is drawn in code as an SVG** in the same shape and style: the mark, then "TKA" in spaced capitals alternating gold and pale blue, then "The Talking Kettle Association" underneath.
- Idea for the mark: arrange the dots and lines as the outline of a kettle, the spout one of the lines.
- In the page, the logo is one link with one accessible name: the full name. The letters are never spelled out by a screen reader.
- The logo is a setting. The charity's own logo drops in later, ideally as the original SVG from the charity.

## Layout and structure mirrored from the charity's site

- The header: a teal band, logo on the left, search on the right.
- The menu: Home, Supporting You, Resources, Membership, News, Events, Shop, Donate, About us, with **Accessibility statement first**, and linked nowhere else.
- The kinds of page: news, events (the monthly webinar, masterclasses, the annual conference), the directory and its 14 types, membership levels, trustees and staff, history, reports and accounts, safeguarding, complaints, discussion list guidelines.
- The charity's own words, as written. Typos are fixed and reported; nothing is rewritten without asking.
- Each photo's subject, as a drawn SVG (see above).
- The charity's contact details and membership pitch, above the standard footer.

## Not mirrored

- **Funders' logos.** Real organisations mustn't appear to back a made-up one. A space says where they go.
- **Real names and photographs.** Invented names and drawings take their place (see above).
- **The contrast switcher.** System settings instead.
- **The cookie banner.** The site sets no cookies, so it needs none.
- **The shop, basket and accounts**, until a decision is made about what the shop sells.

## Unremarkable's standards, as on every site

- The standard footer: "This site is Unremarkable", "Fix something on this page" underneath, the licence, "Built to Zero Information Casualty", "For agents: llms.txt". Short lines, no full stop after a link.
- The licence line needs care: the charity's words aren't Unremarkable's to license. Either the charity agrees to the licence, or the footer says the words are the charity's and the code is openly licensed.
- The fix form at unremarkable.me must accept this site's address (`SITES` in `fix/worker.js` in the Unremarkable repo), or the fix link will be refused.
- Every page: one main heading, headings in order, a skip link, landmark regions, a Markdown version, and no JavaScript needed to read anything.
- Private while it carries the charity's content: not indexed, not linked from anywhere public.
- Built to the [builder's rulebook](https://unremarkable.me/accessibility/): real numbered lists, menus as lists, no link to the page you're on, no `text-transform: uppercase`, and every page ending with a way back.
