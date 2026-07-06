# Angel Lal Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static HTML/CSS/JS portfolio site (poems, media analysis, photographs) with a bento/waterfall homepage grid whose cards expand into a modal showing the full piece, styled in true grayscale with a single crimson accent, deployable to GitHub Pages under angel-lal.com.

**Architecture:** A single `content.js` array is the source of truth for every piece of content. `script.js` renders bento cards from that array into `index.html`'s grid on page load, and renders the same items' full content into an in-page modal on click, using a URL hash (`#<id>`) for direct-linkable deep links. `style.css` provides the grayscale palette, CSS Grid bento layout, card styling, and modal styling. No build step, no framework, no external dependencies — files are opened directly in a browser to verify.

**Tech Stack:** HTML5, CSS3 (CSS Grid, CSS custom properties), vanilla JavaScript (ES6, no modules/bundler), GitHub Pages for hosting.

## Global Constraints

- No JS framework, bundler, or build step — plain `<script>` tags, files run directly via `file://` or a static host.
- Palette is true grayscale (`#ffffff`/`#111111`/grays) plus exactly one accent color, crimson (`#b3232c`), stored as a CSS custom property so it's a one-line change to retune.
- All content types (poem/photo/analysis) blend into a single waterfall grid — no separate sections per type, only a small type-indicator label per card.
- Cards have rounded corners; images on cards are grayscale-filtered via CSS regardless of source color.
- The homepage is one long page: sticky header → About section → bento grid → footer. No separate About page.
- Every new content item is added as one object in `js/content.js` — no hand-written per-item HTML.
- Site must work opened directly as `index.html` (no local server required) since no `fetch()` is used.

---

## File Structure

```
prisha-portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── content.js
│   └── script.js
├── images/
│   └── .gitkeep
├── CNAME
└── README.md
```

---

### Task 1: HTML scaffold and page skeleton

**Files:**
- Create: `index.html`
- Create: `css/style.css` (empty placeholder for now)
- Create: `js/content.js` (empty array placeholder for now)
- Create: `js/script.js` (empty placeholder for now)
- Create: `images/.gitkeep`

**Interfaces:**
- Produces: DOM ids `about`, `grid`, `modal`, `modal-scrim`, `modal-content`, `modal-close`, `modal-body` — every later task relies on these exact ids.
- Produces: script load order `content.js` before `script.js`, both at the end of `<body>`.

- [ ] **Step 1: Create the folder structure and empty files**

```bash
mkdir -p css js images
touch images/.gitkeep
touch css/style.css
```

- [ ] **Step 2: Write `js/content.js` with an empty array**

```js
// js/content.js
const CONTENT = [];
```

- [ ] **Step 3: Write `js/script.js` with a no-op stub**

```js
// js/script.js
(function () {
  console.log("script.js loaded, CONTENT has", CONTENT.length, "items");
})();
```

- [ ] **Step 4: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angel Lal — Poems, Photography & Media Analysis</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header class="site-header">
    <div class="site-header__inner">
      <h1 class="site-title">Angel Lal</h1>
      <p class="site-tagline">Poems, photographs, and media analysis.</p>
    </div>
  </header>

  <section class="about" id="about">
    <div class="about__inner">
      <img class="about__photo" src="images/profile.jpg" alt="Angel Lal">
      <div class="about__text">
        <h2>About</h2>
        <p>Write a short bio here.</p>
        <div class="about__links">
          <a href="mailto:hello@angel-lal.com">Email</a>
          <a href="https://instagram.com/">Instagram</a>
        </div>
      </div>
    </div>
  </section>

  <main class="grid" id="grid"></main>

  <div class="modal" id="modal" hidden>
    <div class="modal__scrim" id="modal-scrim"></div>
    <div class="modal__content" id="modal-content" role="dialog" aria-modal="true">
      <button class="modal__close" id="modal-close" aria-label="Close">&times;</button>
      <div class="modal__body" id="modal-body"></div>
    </div>
  </div>

  <footer class="site-footer">
    <p>&copy; 2026 Angel Lal</p>
    <div class="site-footer__links">
      <a href="mailto:hello@angel-lal.com">Email</a>
      <a href="https://instagram.com/">Instagram</a>
    </div>
  </footer>

  <script src="js/content.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
```

- [ ] **Step 5: Verify in browser**

Open `index.html` directly in a browser (double-click, or drag into a browser
window). Expected:
- Page loads with no console errors.
- Browser console shows: `script.js loaded, CONTENT has 0 items`
- You see unstyled text: "Angel Lal" heading, tagline, "About" heading and bio
  paragraph, a broken image icon for `images/profile.jpg` (expected — no
  image yet), and copyright/footer text. No visible bento grid yet (it's
  empty).

- [ ] **Step 6: Commit**

```bash
git add index.html css/style.css js/content.js js/script.js images/.gitkeep
git commit -m "Add HTML scaffold and empty CSS/JS files"
```

---

### Task 2: Content data model with sample entries

**Files:**
- Modify: `js/content.js`

**Interfaces:**
- Consumes: nothing.
- Produces: the `CONTENT` array shape every later task renders from:
  `{ id, type, title, thumb, size, excerpt, body, image }` where
  `type` is `"poem" | "photo" | "analysis"` and `size` is
  `"small" | "wide" | "tall" | "large"`.

- [ ] **Step 1: Replace `js/content.js` with six sample entries covering all three types and a mix of sizes**

```js
// js/content.js
const CONTENT = [
  {
    id: "rain-poem",
    type: "poem",
    title: "Rain",
    thumb: "",
    size: "small",
    excerpt: "The city exhales in gray, steam rising off warm stone.",
    body: "<p>The city exhales in gray,<br>steam rising off warm stone.</p><p>This is placeholder body text for a poem — replace with the full piece.</p>",
    image: ""
  },
  {
    id: "harbor-photo",
    type: "photo",
    title: "Harbor at Dusk",
    thumb: "",
    size: "tall",
    excerpt: "Boats at rest, light going soft.",
    body: "<p>Placeholder caption for a photograph — replace with real description if needed.</p>",
    image: ""
  },
  {
    id: "film-noir-analysis",
    type: "analysis",
    title: "Shadows in Film Noir",
    thumb: "",
    size: "wide",
    excerpt: "How lighting builds moral ambiguity on screen.",
    body: "<p>Placeholder analysis text — replace with the full media analysis piece.</p><p>Second paragraph placeholder.</p>",
    image: ""
  },
  {
    id: "winter-poem",
    type: "poem",
    title: "Winter Correspondence",
    thumb: "",
    size: "small",
    excerpt: "Letters that never quite arrive.",
    body: "<p>Placeholder poem text for Winter Correspondence.</p>",
    image: ""
  },
  {
    id: "market-photo",
    type: "photo",
    title: "Market Street",
    thumb: "",
    size: "large",
    excerpt: "Color and motion, held still.",
    body: "<p>Placeholder caption for Market Street photograph.</p>",
    image: ""
  },
  {
    id: "documentary-analysis",
    type: "analysis",
    title: "Truth and the Documentary Frame",
    thumb: "",
    size: "small",
    excerpt: "What the camera includes, and what it leaves out.",
    body: "<p>Placeholder analysis text about documentary framing.</p>",
    image: ""
  }
];
```

- [ ] **Step 2: Verify in browser**

Reload `index.html`. Expected: console still logs
`script.js loaded, CONTENT has 6 items` (confirms the array parses and
loads correctly). No visible change on the page yet — rendering comes in
Task 3.

- [ ] **Step 3: Commit**

```bash
git add js/content.js
git commit -m "Add sample content data covering poem, photo, and analysis types"
```

---

### Task 3: Render bento cards from content data

**Files:**
- Modify: `js/script.js`

**Interfaces:**
- Consumes: `CONTENT` array from Task 2 (`id, type, title, thumb, size, excerpt`).
- Consumes: `#grid` element from Task 1.
- Produces: rendered `.card` elements with `data-id` attribute and classes
  `card card--<size>`, each containing `.card__type`, `.card__thumb` or
  `.card__placeholder`, `.card__title`, `.card__excerpt` — Task 5/6 style
  these classes, Task 4 wires their click handlers.

- [ ] **Step 1: Replace `js/script.js` with grid-rendering logic**

```js
// js/script.js
(function () {
  const grid = document.getElementById("grid");

  function cardMarkup(item) {
    const media = item.thumb
      ? `<img class="card__thumb" src="${item.thumb}" alt="${item.title}">`
      : `<div class="card__placeholder"><span>${item.title}</span></div>`;

    return `
      <article class="card card--${item.size}" data-id="${item.id}" tabindex="0" role="button" aria-label="Open ${item.title}">
        <span class="card__type card__type--${item.type}">${item.type}</span>
        ${media}
        <div class="card__caption">
          <h3 class="card__title">${item.title}</h3>
          <p class="card__excerpt">${item.excerpt}</p>
        </div>
      </article>
    `;
  }

  function renderGrid() {
    grid.innerHTML = CONTENT.map(cardMarkup).join("");
  }

  renderGrid();
})();
```

- [ ] **Step 2: Verify in browser**

Reload `index.html`. Expected: six unstyled `<article>` blocks appear inside
the `<main>` area, each showing a small "poem"/"photo"/"analysis" label, a
gray placeholder box with the title inside it (since `thumb` is empty for
all sample items), and the title/excerpt text below. No grid layout or
styling yet — that's Tasks 5/6. Open browser devtools and confirm each
`article` has the correct `data-id` matching the content array (e.g.
`data-id="rain-poem"`).

- [ ] **Step 3: Commit**

```bash
git add js/script.js
git commit -m "Render bento cards from content data array"
```

---

### Task 4: Modal open/close with hash-based deep linking

**Files:**
- Modify: `js/script.js`

**Interfaces:**
- Consumes: `#modal`, `#modal-scrim`, `#modal-content`, `#modal-close`,
  `#modal-body` from Task 1; `.card[data-id]` elements from Task 3;
  `CONTENT` array's `id, type, title, body, image` fields.
- Produces: `openModal(id)` and `closeModal()` functions (used only
  internally in this file, documented here so later tasks know the
  behavior: opening sets `location.hash` to `#<id>` and unhides `#modal`;
  closing clears the hash and re-hides `#modal`).
- Produces: modal content DOM structure — `.card__type`, an `<h2>`, an
  optional `.modal__image`, and a `.modal__text` div — Task 7 styles these.

- [ ] **Step 1: Add modal logic to `js/script.js` (append after `renderGrid()`, replacing the final `renderGrid();` call)**

```js
// js/script.js
(function () {
  const grid = document.getElementById("grid");
  const modal = document.getElementById("modal");
  const modalScrim = document.getElementById("modal-scrim");
  const modalClose = document.getElementById("modal-close");
  const modalBody = document.getElementById("modal-body");

  function cardMarkup(item) {
    const media = item.thumb
      ? `<img class="card__thumb" src="${item.thumb}" alt="${item.title}">`
      : `<div class="card__placeholder"><span>${item.title}</span></div>`;

    return `
      <article class="card card--${item.size}" data-id="${item.id}" tabindex="0" role="button" aria-label="Open ${item.title}">
        <span class="card__type card__type--${item.type}">${item.type}</span>
        ${media}
        <div class="card__caption">
          <h3 class="card__title">${item.title}</h3>
          <p class="card__excerpt">${item.excerpt}</p>
        </div>
      </article>
    `;
  }

  function renderGrid() {
    grid.innerHTML = CONTENT.map(cardMarkup).join("");
    grid.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.id));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(card.dataset.id);
        }
      });
    });
  }

  function findItem(id) {
    return CONTENT.find((item) => item.id === id);
  }

  function modalMarkup(item) {
    const media = item.image
      ? `<img class="modal__image" src="${item.image}" alt="${item.title}">`
      : item.type === "photo"
      ? `<div class="card__placeholder card__placeholder--modal"><span>${item.title}</span></div>`
      : "";

    return `
      <span class="card__type card__type--${item.type}">${item.type}</span>
      <h2>${item.title}</h2>
      ${media}
      <div class="modal__text">${item.body}</div>
    `;
  }

  function openModal(id) {
    const item = findItem(id);
    if (!item) return;
    modalBody.innerHTML = modalMarkup(item);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    if (location.hash !== `#${id}`) {
      history.pushState(null, "", `#${id}`);
    }
    modalClose.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (location.hash) {
      history.pushState(null, "", location.pathname + location.search);
    }
  }

  function openFromHash() {
    const id = location.hash.replace("#", "");
    if (id && findItem(id)) openModal(id);
  }

  modalClose.addEventListener("click", closeModal);
  modalScrim.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
  window.addEventListener("hashchange", openFromHash);

  renderGrid();
  openFromHash();
})();
```

- [ ] **Step 2: Verify in browser**

Reload `index.html` and check each of the following:
1. Click the "Rain" card → the modal appears (unstyled but functional:
   overlay behind it, close button, "poem" label, "Rain" heading, full
   placeholder body text) and the address bar shows `...index.html#rain-poem`.
2. Click the "×" close button → modal disappears, hash is removed from the
   address bar.
3. Click the "Harbor at Dusk" card (a `photo` type with no `image` set) →
   modal shows the gray placeholder box in place of a full image.
4. Open a card, then press `Escape` → modal closes.
5. Open a card, then click on the dark area outside the modal content (the
   scrim) → modal closes.
6. Manually type `#market-photo` onto the end of the URL in the address bar
   and press Enter (reload) → the "Market Street" modal opens automatically
   on page load.

- [ ] **Step 3: Commit**

```bash
git add js/script.js
git commit -m "Add modal open/close behavior with hash-based deep linking"
```

---

### Task 5: Grayscale palette, typography, and header/about/footer styling

**Files:**
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `.site-header`, `.site-title`, `.site-tagline`, `.about`,
  `.about__inner`, `.about__photo`, `.about__text`, `.about__links`,
  `.site-footer`, `.site-footer__links` classes from Task 1's `index.html`.
- Produces: CSS custom properties `--color-bg`, `--color-text`,
  `--color-muted`, `--color-border`, `--color-accent`, `--radius`, `--gap`
  — every later CSS task uses these instead of hardcoded colors/values.

- [ ] **Step 1: Write the base palette, reset, and typography into `css/style.css`**

```css
/* css/style.css */

:root {
  --color-bg: #ffffff;
  --color-text: #111111;
  --color-muted: #666666;
  --color-border: #dddddd;
  --color-accent: #b3232c;
  --radius: 14px;
  --gap: 16px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.5;
}

a {
  color: var(--color-accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

h1, h2, h3 {
  font-weight: normal;
}
```

- [ ] **Step 2: Append header/about/footer styling**

```css
/* Header */
.site-header {
  position: sticky;
  top: 0;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  z-index: 10;
  padding: 16px 24px;
}

.site-title {
  margin: 0;
  font-size: 1.4rem;
  letter-spacing: 0.02em;
}

.site-tagline {
  margin: 4px 0 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}

/* About */
.about {
  max-width: 900px;
  margin: 48px auto;
  padding: 0 24px;
}

.about__inner {
  display: flex;
  gap: 32px;
  align-items: center;
  flex-wrap: wrap;
}

.about__photo {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 50%;
  filter: grayscale(1);
  background: #ececec;
}

.about__links a {
  margin-right: 16px;
}

/* Footer */
.site-footer {
  text-align: center;
  padding: 32px 24px;
  color: var(--color-muted);
  border-top: 1px solid var(--color-border);
  margin-top: 48px;
}

.site-footer__links a {
  margin: 0 8px;
}
```

- [ ] **Step 3: Verify in browser**

Reload `index.html`. Expected:
- Header is white with a bottom border, stays fixed to the top when you
  scroll down the page (sticky).
- Body text renders in a serif typeface.
- Links (Email/Instagram) are crimson-colored and underline on hover.
- About section shows a circular photo frame (broken image icon is fine —
  no real photo yet) next to the bio text, with reasonable spacing.
- Footer is centered, gray text, with a top border separating it from the
  content above.

- [ ] **Step 4: Commit**

```bash
git add css/style.css
git commit -m "Add grayscale palette, typography, and header/about/footer styling"
```

---

### Task 6: Bento waterfall grid layout

**Files:**
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `#grid` / `.grid` from Task 1; `.card--small/wide/tall/large`
  classes produced by Task 3's `cardMarkup()`.
- Produces: the responsive grid layout every card renders inside — Task 7
  styles the cards' internals, this task only controls their footprint and
  placement.

- [ ] **Step 1: Append grid layout rules to `css/style.css`**

```css
/* Bento waterfall grid */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-flow: dense;
  grid-auto-rows: 160px;
  gap: var(--gap);
  padding: var(--gap) 24px 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.card--small {
  grid-column: span 1;
  grid-row: span 1;
}

.card--wide {
  grid-column: span 2;
  grid-row: span 1;
}

.card--tall {
  grid-column: span 1;
  grid-row: span 2;
}

.card--large {
  grid-column: span 2;
  grid-row: span 2;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .card--small,
  .card--wide,
  .card--tall,
  .card--large {
    grid-column: span 1;
    grid-row: span 1;
  }
}
```

- [ ] **Step 2: Verify in browser**

Reload `index.html` at full desktop width. Expected:
- The six sample cards arrange into a 4-column grid with varied
  footprints: "Harbor at Dusk" (tall) is taller than "Rain" (small),
  "Shadows in Film Noir" (wide) spans two columns, "Market Street" (large)
  spans a 2x2 block. `grid-auto-flow: dense` should fill gaps rather than
  leaving obvious holes.
- Resize the browser window to ~800px wide → grid reflows to 2 columns.
- Resize to ~500px wide → grid collapses to a single column, and every card
  becomes the same single-column footprint regardless of its `size` class.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "Add responsive bento waterfall grid layout"
```

---

### Task 7: Card and modal visual styling

**Files:**
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `.card`, `.card__type`, `.card__thumb`, `.card__placeholder`,
  `.card__caption`, `.card__title`, `.card__excerpt` from Task 3;
  `.modal`, `.modal__scrim`, `.modal__content`, `.modal__close`,
  `.modal__image`, `.modal__text`, `body.modal-open` from Task 4.
- Produces: final visual appearance — no further tasks style these classes.

- [ ] **Step 1: Append card styling to `css/style.css`**

```css
/* Cards */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover,
.card:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  outline: none;
}

.card__thumb {
  width: 100%;
  height: 60%;
  object-fit: cover;
  filter: grayscale(1);
  flex: 1;
}

.card__placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ececec;
  color: var(--color-muted);
  font-size: 0.9rem;
  text-align: center;
  padding: 8px;
}

.card__type {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
  background: rgba(255, 255, 255, 0.85);
  padding: 2px 8px;
  border-radius: 999px;
  z-index: 1;
}

.card__caption {
  padding: 10px 12px;
}

.card__title {
  margin: 0 0 4px;
  font-size: 1rem;
}

.card__excerpt {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-muted);
}
```

- [ ] **Step 2: Append modal styling to `css/style.css`**

```css
/* Modal */
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal[hidden] {
  display: none;
}

.modal__scrim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.modal__content {
  position: relative;
  background: var(--color-bg);
  border-radius: var(--radius);
  max-width: 640px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 32px;
  z-index: 1;
}

.modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--color-text);
}

.modal__image {
  width: 100%;
  border-radius: calc(var(--radius) - 4px);
  margin: 16px 0;
  filter: grayscale(1);
}

.card__placeholder--modal {
  height: 240px;
  border-radius: calc(var(--radius) - 4px);
  margin: 16px 0;
}

.modal__text p {
  margin: 0 0 1em;
}

body.modal-open {
  overflow: hidden;
}
```

- [ ] **Step 3: Verify in browser**

Reload `index.html`. Expected:
- Cards have rounded corners, a subtle border, and lift slightly with a
  soft shadow on hover.
- Each card shows a small pill-shaped crimson type label ("poem"/"photo"/
  "analysis") in its top-left corner.
- Placeholder boxes (light gray) show the title centered where a thumbnail
  would go.
- Clicking a card opens a centered, rounded modal over a dark scrim; the
  page behind it does not scroll while the modal is open (test by trying to
  scroll the background — it shouldn't move).
- The modal's close "×" is positioned top-right and clickable.
- Modal content that overflows (long body text) scrolls within the modal
  box rather than the modal growing off-screen.

- [ ] **Step 4: Commit**

```bash
git add css/style.css
git commit -m "Add card and modal visual styling"
```

---

### Task 8: README and GitHub Pages deployment files

**Files:**
- Create: `README.md`
- Create: `CNAME`

**Interfaces:**
- Consumes: nothing (documentation/config only).
- Produces: nothing consumed by other tasks — this is the final task.

- [ ] **Step 1: Create `CNAME` with the custom domain**

```
angel-lal.com
```

- [ ] **Step 2: Write `README.md`**

```markdown
# Angel Lal Portfolio

A static portfolio site for poems, media analysis, and photographs, built
with plain HTML/CSS/JS (no framework, no build step).

## Adding a new piece

1. Open `js/content.js`.
2. Add a new object to the `CONTENT` array:

   ```js
   {
     id: "unique-slug",             // used in the shareable URL, e.g. #unique-slug
     type: "poem",                  // "poem" | "photo" | "analysis"
     title: "Your Title",
     thumb: "images/your-thumb.jpg",   // homepage card image (leave "" for a text-only placeholder card)
     size: "small",                 // "small" | "wide" | "tall" | "large" — controls its footprint in the grid
     excerpt: "A short teaser line.",
     body: "<p>Full poem or analysis text, or a caption for a photo. Basic HTML like <p> and <br> is allowed.</p>",
     image: "images/your-full-image.jpg" // only needed for photos — shown full-size in the modal
   }
   ```

3. Drop any images referenced above into the `images/` folder.
4. Open `index.html` in a browser to preview, then commit and push.

## Local preview

No build step or local server is required. Just open `index.html` directly
in a browser (double-click the file, or drag it into a browser window).

## Deployment (GitHub Pages + Squarespace domain)

1. Push this repository to GitHub.
2. In the repo's **Settings → Pages**, set the source to the `main` branch,
   root folder.
3. Under **Settings → Pages → Custom domain**, enter `angel-lal.com` (this
   keeps the `CNAME` file in the repo in sync).
4. In Squarespace's domain settings for angel-lal.com (Settings → Domains →
   DNS Settings), add:
   - Four `A` records for `@` pointing to GitHub Pages' IP addresses:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`
   - A `CNAME` record for `www` pointing to `<your-github-username>.github.io`
5. Wait for DNS to propagate (can take up to a few hours), then confirm
   `https://angel-lal.com` loads the site with HTTPS enabled (GitHub Pages
   provisions this automatically once DNS is verified).

Squarespace is only used here as the domain registrar/DNS host — the actual
site is served entirely from GitHub Pages.
```

- [ ] **Step 3: Verify**

Confirm `CNAME` contains exactly `angel-lal.com` with no trailing slash or
protocol, and that `README.md` renders correctly (check via GitHub's
preview once pushed, or a local Markdown preview).

- [ ] **Step 4: Commit**

```bash
git add README.md CNAME
git commit -m "Add README with content and deployment instructions, and CNAME"
```

---

### Task 9: Full manual QA pass

**Files:** none (verification only, no code changes expected unless a bug is found).

**Interfaces:**
- Consumes: the entire site as built by Tasks 1-8.

- [ ] **Step 1: Desktop pass**

Open `index.html` at a desktop-sized window (~1280px+) and confirm:
- Header, About section, six-card bento grid, and footer all render with
  correct styling (grayscale palette, crimson accents on links/type labels
  only).
- Grid shows varied card sizes with no obvious gaps (`grid-auto-flow: dense`
  working).

- [ ] **Step 2: Tablet/mobile pass**

Resize the window (or use browser devtools device toolbar) to ~768px and
then ~375px and confirm:
- Grid reflows to 2 columns then 1 column.
- Header remains usable/readable, About section stacks vertically, footer
  stays centered and readable.

- [ ] **Step 3: Interaction pass**

For at least one card of each type (poem, photo, analysis):
- Click to open the modal, confirm the full body/image renders and the URL
  hash updates to `#<id>`.
- Confirm the modal closes via the "×" button, via clicking the scrim, and
  via pressing `Escape`, and that the hash clears each time.
- Reload the page with a piece's hash already in the URL (e.g. navigate to
  `index.html#winter-poem`) and confirm that piece's modal auto-opens on
  load.

- [ ] **Step 4: Fix any issues found**

If any check above fails, fix the specific file (`index.html`, `css/style.css`,
or `js/script.js`) and re-run the failing check until it passes. Commit each
fix separately with a message describing what was broken.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "Final QA pass for portfolio site" --allow-empty
```
