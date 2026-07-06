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
