# Angel Lal Portfolio Site — Design Spec

## Purpose

A personal portfolio site for angel-lal.com featuring poems, media analysis
pieces, and photographs. The homepage is a single long bento/waterfall grid
of rounded, monochrome cards; clicking any card expands it into a full-page
modal view showing the complete piece (full image, full poem, or full
analysis text).

## Hosting Model

- The site itself is a plain static HTML/CSS/JS project — no framework, no
  build step.
- It is hosted on GitHub Pages (free, serves static files directly from the
  repo).
- angel-lal.com stays registered/managed in Squarespace, but Squarespace's
  site builder is **not** used to build the site. Instead, Squarespace's DNS
  settings for the domain are pointed at GitHub Pages:
  - `A` records → GitHub Pages' IPs
  - `www` `CNAME` → `<github-username>.github.io`
- A `CNAME` file in the repo root (containing `angel-lal.com`) tells GitHub
  Pages which custom domain to serve under.

## File Structure

```
prisha-portfolio/
├── index.html          # header, about section, bento grid container, modal shell, footer
├── css/
│   └── style.css       # grayscale palette, bento/waterfall grid, modal, responsive rules
├── js/
│   ├── content.js      # the data array — every poem/photo/analysis entry
│   └── script.js       # renders cards from content.js, handles modal open/close, deep-linking
├── images/
│   └── ...             # photos + thumbnails, organized by piece
├── CNAME               # contains "angel-lal.com"
└── README.md           # how to add a new piece, how to deploy
```

## Content Data Model

All content lives in `js/content.js` as a single array. Each entry:

```js
{
  id: "rain-poem",              // used in the URL hash for shareable/direct links
  type: "poem",                 // "poem" | "photo" | "analysis"
  title: "Rain",
  thumb: "images/rain-thumb.jpg",   // shown on the homepage card
  size: "tall",                 // "small" | "wide" | "tall" | "large" — bento grid footprint
  excerpt: "a short teaser line or first stanza...",
  body: "full poem text OR full analysis text (basic HTML like <p>/<br> allowed)",
  image: "images/rain-full.jpg" // only for photos — full-res version shown in the modal
}
```

`js/script.js` reads this array once on page load and renders both:
1. The homepage bento card (`thumb` + `title` + `excerpt`, rounded corners,
   grayscale-filtered image).
2. The modal content for that piece (full `body` and/or full-res `image`),
   built lazily / shown on click.

Adding new content means adding one object to the array and dropping the
associated image(s) in `images/` — no HTML to hand-write or duplicate.

## Layout & Styling

**Bento/waterfall grid**: CSS Grid with `grid-auto-flow: dense`. The `size`
field maps to a CSS class controlling column/row span, producing the varied
waterfall-down-the-page look without a masonry JS library. Collapses to a
single column on narrow/mobile viewports.

**Cards**: rounded corners, subtle border/shadow, grayscale-filtered images
(`filter: grayscale(1)` in CSS — keeps photos monochrome on the front page
even if the source photo has color), slight hover lift/zoom transition. A
small, quiet type-indicator icon on each card hints at poem/photo/analysis
without splitting the grid into separate sections — content types blend
together in one waterfall.

**Modal/lightbox**: clicking a card opens an in-page overlay (dark scrim +
centered content card, close "×" button, closes on scrim click or Escape).
Opening a modal updates the URL to `index.html#<id>` so a specific piece is
directly linkable/shareable; loading the page with that hash present reopens
the corresponding modal on load.

**Palette**: true grayscale base — white/near-white background, near-black
text, mid-gray for borders and secondary text — plus a single crimson accent
color (exact hex stored as one CSS custom property for easy tuning) used
only for links, the active/hover state on cards, and the type-indicator
icons. Sparse and intentional, not decorative.

**Page structure**: sticky header (name + short tagline) → About section
(bio, photo, contact/social links) → bento waterfall grid → footer (repeats
contact/social links).

## Testing / Verification Plan

Since there's no build step, verification is manual in-browser:
- Open `index.html` (or serve locally) and confirm cards render correctly
  from `content.js`.
- Resize the viewport (mobile/tablet/desktop) and confirm the bento grid
  reflows sensibly at each breakpoint.
- Click cards of each type (poem/photo/analysis) and confirm the modal opens
  with correct content, closes via ×/scrim/Escape, and the URL hash updates.
- Load the page directly with a piece's hash in the URL and confirm the
  modal opens automatically.
- Confirm images render grayscale on cards and the crimson accent appears
  only in its intended spots.

## Out of Scope

- No CMS or admin UI — content is edited directly in `content.js`.
- No build tooling, bundler, or JS framework.
- No separate About page — About is a section on the same long page.
- No search/filter UI (all content blends into one waterfall).
