# Accessibility statement

Canonical page: https://tka.unremarkable.me/accessibility/

> **Preview.** This is a private preview of a website being built for a real charity, under an invented name. Names, pictures and numbers on it are made up.

Menu:

- [Accessibility statement](https://tka.unremarkable.me/accessibility/) (this page)
- [Home](https://tka.unremarkable.me/)
- [Supporting you](https://tka.unremarkable.me/supporting-you/)
- [Resources](https://tka.unremarkable.me/resources/)
- [Membership](https://tka.unremarkable.me/membership/)
- [News](https://tka.unremarkable.me/news/)
- [Events](https://tka.unremarkable.me/events/)
- [Shop](https://tka.unremarkable.me/shop/)
- [Donate](https://tka.unremarkable.me/donate/)
- [About us](https://tka.unremarkable.me/about-us/)

This site is built so that nobody, whether reading the screen, using assistive technology or sending an agent, loses access to anything on it.

It is built to [Zero Information Casualty version 1.7](https://zeroinformationcasualty.org/), and aims to meet WCAG 2.2 at level AA, with all text meeting AAA contrast.

## How it is built

- Every page is plain HTML. Nothing depends on JavaScript, and the site uses none.
- One main heading on every page, headings in order, landmarks, and a skip link to the main content.
- The logo is read once, as the charity's name.
- The font is Atkinson Hyperlegible, designed by the Braille Institute for readers with low vision.
- Every text colour meets 7:1 contrast. A dark scheme follows your system setting, and if your system asks for more contrast, secondary text and lines change to the full text colour.
- Text sizes are relative, so the site follows your browser's text size and zoom.
- Every picture is described, and nothing moves.
- The site sets no cookies, so there's no cookie banner.
- Every page has a Markdown version for agents, and the site has an llms.txt.

## What has been checked

- **9 November 2026, the directory's front page, heard with NVDA 2026.3.1**, reading through and tabbing. The ten ways in, each with its number of entries, read as one list. Three problems were found, and all are fixed (below).
- **9 November 2026, the home page, heard with NVDA 2026.3.1**, reading from top to bottom and moving through it with Tab, by someone who uses a screen reader every day. Headings, lists, landmarks, the drawing and its caption, and the order of the links were all as intended. Two problems were found, and both are fixed (below).
- **9 November 2026:** the build checks that no placeholder is left unfilled, and every text colour was measured.

## Not yet checked

- Listening to every other kind of page with a screen reader: the inside pages, the directory and its entries. The results will be written here with dates.
- VoiceOver on iPhone and Mac.
- Phone widths with text enlarged.
- Windows High Contrast.

## Found and fixed

- **9 November 2026: a link to the page you were on.** In the menu, the current page was a link to itself, so NVDA said "same page link, current page, Home". It is now named as the current page, but is no longer a link.
- **9 November 2026: "Preview" said twice.** The preview note was a landmark named Preview that began with the word Preview, so NVDA read the word twice. It is now a plain note.
- **9 November 2026: bullets read aloud.** In ordinary bulleted lists, NVDA read the bullet character before each item. The bullets are now drawn by the stylesheet and hidden from screen readers.
- **9 November 2026: a comma after a link.** "The whole directory as data, for agents" was read with the comma on its own. The line was rewritten so the link comes last.
- **9 November 2026: headings that skipped a level.** On the News and Events pages, the stories and events were level 3 headings straight under the main heading. They are now level 2. Found in a review by another AI, Codex.
- **9 November 2026: links lost from the directory.** When the directory was moved over, the links inside entries were dropped, so some entries, such as the smart glasses, had nowhere to go. Eleven links to other organisations are back. Seven links to the charity's own pages and documents are marked as linked in the finished site. Found in the same review.
- **9 November 2026: no sign of where you are.** Inside a section, such as the directory inside Resources, the menu now says that section is current.
- **12 November 2026: footer links below 7:1.** The link blue measured 6.5:1 on the pale footer, short of the 7:1 this statement promises for all text. Links on that pale background now use a darker blue, at 7.8:1. Found in an accessibility review on 12 November 2026.
- **12 November 2026: sideways scrolling with large text on a phone.** With text at double size on a narrow screen, the logo, the "Accessibility statement" menu item and the footer email address ran off the right edge. They now wrap. Every page was checked at 320 and 375 pixels wide with text at one and a half and twice its size, in light and dark. Found in the same review.
- **12 November 2026: lists Safari might not announce.** Lists whose bullets are hidden or drawn by the stylesheet, such as the five things on the home page, now say explicitly that they are lists, because Safari can stop treating them as lists. This was a risk found in the same review, not a problem anyone heard.

## Known issues

None known. Only the home page and the directory's front page have been heard so far, so this site makes no claim about the other pages beyond how they are built.

## Reporting a problem

Every page ends with "Fix something on this page", which opens a short form that already knows which page you were on. It doesn't ask who you are.

---

The Talking Kettle Association: email hello@tka.unremarkable.me, helpline 020 7946 0321

This site is [Unremarkable](https://unremarkable.me/)

[Fix something on this page](https://unremarkable.me/fix/?page=https%3A%2F%2Ftka.unremarkable.me%2Faccessibility%2F)

Words by The Talking Kettle Association. Design and code licensed under [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

Built to [Zero Information Casualty v1.7](https://zeroinformationcasualty.org/)

For agents: [llms.txt](https://tka.unremarkable.me/llms.txt)
