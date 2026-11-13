# Flow on tka.unremarkable.me

This file is for Cloud Dancer, who sorts every request, and Flo, her flow agent. Their own rules are in the Unremarkable repo (`dancer/DANCER.md` and `flo/FLO.md` in `Carrados/unremarkable`). This file lists the shapes of flow this site has: the kinds of thing the owner adds often, each piece on its own. Flo fills these shapes and nothing else.

Anything that isn't in a shape here is fabric: layout, sections, menus, pages, design and standing wording. Cloud Dancer does fabric on a private preview copy, and it goes live only when the owner says publish.

Adding a shape is fabric too. When a new one is made, it is written down here: what it is, where each piece goes and what it is called, what it starts with, where it is listed, and how the site is built afterwards.

This site has two shapes: a news story and a directory entry.

## Rules for every shape

- **Names are settings.** This site is a preview under an invented name (`DESIGN.md`). A name that is in `settings.mjs` is written as its `{{KEY}}`, never typed out: `{{SHORT}}` for the short name, `{{CHAIR}}` for the Chair, and so on. An unknown `{{KEY}}` stops the build. Adding or changing a setting is fabric.
- **No real names while `PREVIEW` is true.** If a request names a real person or organisation that `DESIGN.md` says must be invented (people, the charity's own branded names, funders and partners), stop and ask the owner what invented name to use. Technology and the companies that make it keep their real names. Directory entries are the exception: they are real, public organisations and keep their own names.
- **No photographs.** A story or entry has no picture unless the owner asks for one. Every picture on this site is a drawn SVG (`DESIGN.md`), and a new drawing is fabric.
- **The owner's words stay theirs.** Fix only plain typos, and say which.

## Shape 1: a news story

A dated piece of news with its own page.

**Where it goes.** One object in the `stories` list in `news.mjs`. Newest first, so a new story goes at the top of the list. Change nothing else in that file: the code under the list is fabric.

**What it holds.**

- `slug`: the story's address, made from the title. Lower case, words joined by hyphens, no punctuation, and no settings keys. It must not match another story's slug. Once a story is live, its slug never changes.
- `date`: the day it is published, written like `5 November 2026`. Today's date, unless the owner gives another.
- `title`: the headline, as the owner gave it. One line, no full stop at the end.
- `summary`: one sentence, shown under the headline in lists. Use the owner's if they gave one. If not, use the story's own first sentence when it stands alone, or write one and report it as something you wrote.
- `body`: the story as HTML. Each paragraph in `<p>`. Links as `<a href>`: a link within this site starts with `/` and must point at a page that exists. A list is `<ul>` and `<li>`. No headings, no pictures, no styles, no scripts.

**Where it is listed.** The build does this. The latest three stories show on the home page, and every story shows on `/news/`. The story's own page is `/news/<slug>/`, with a Markdown copy beside it, and it joins `llms-full.txt`.

**Taking one down or correcting one.** Remove or change its object in the list. A correction keeps the slug and the date.

**What may change.** `news.mjs` (the `stories` list only) and the built `site/` folder.

## Shape 2: a directory entry

One organisation or resource in the directory of services.

**Where it goes.** One object in `entries` in `data/directory.json`. The build sorts them A to Z, so add it at the end.

**What it holds.**

- `slug`: made from the name, as for a news story. It must not match another entry's slug, or any key of `needNames`, or the words `kinds` or `a-to-z`. Once live, it never changes.
- `name`: the organisation's or resource's own name.
- `description`: a list of strings. Each string is one paragraph. A string starting `- ` is a list item. A link is written `[words](address)`. The first sentence of the first paragraph is what shows in lists, so it must say what the organisation does.
- `types`: one or more keys of `typeNames`, for the kind of organisation.
- `needs`: one or more keys of `needNames`, for what a visitor wants to do. An entry with no need is not reachable from the directory's front door.
- `website`: the full address, starting `https://` where the site has it. Check that it answers.
- `email` and `phone`: as the organisation publishes them, or an empty string.
- `checked`: the day the details were last checked, written like `13 November 2026`. Set it to today when you add an entry or check one. Leave it alone when you change nothing about the contact details.

If the owner doesn't say which `types` and `needs` an entry belongs under, choose from what the description says, and report what you chose so the owner can change it.

**Where it is listed.** The build does this: the entry's own page at `/resources/directory/<slug>/`, the A to Z, the page for each of its needs, its kinds, the counts on the directory's front door, and `/resources/directory/directory.json` for agents.

**Taking one out or correcting one.** Remove or change its object in `entries`.

**What is fabric here.** A new kind (`typeNames`) or a new need (`needNames`), renaming one, or changing how the directory is laid out.

**What may change.** `data/directory.json` (`entries` only) and the built `site/` folder.

## Building the site

Needs Node 18 or later. Nothing else.

```
node build.mjs
```

It writes the whole site to `site/`. Commit `site/` with the change, so the repo matches the live site. Merging to `main` publishes it.

## Checks for this site

On top of Flo's own checks:

- The build ends with "Built" and a page count, and no error.
- The only files changed are the one the shape names and files under `site/`.
- The new page exists in `site/` at the address the shape gives, with one main heading.
- The count on `/resources/directory/` went up by one for a new entry, or the story is first on `/news/` for a new story.
