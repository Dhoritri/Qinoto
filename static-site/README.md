# Qinoto — Static HTML/CSS build

A 1:1 refactor of the Next.js + React + Tailwind + framer-motion app into
plain HTML, hand-written CSS, and vanilla JS. **Design and behavior are
unchanged** — same layouts, breakpoints, colors, animations, and interactions.

No build step. Open `index.html` in a browser, or serve the folder statically:

```bash
npx serve static-site      # or: python -m http.server (run inside static-site)
```

## Pages

| File | Was (Next.js route) |
|------|---------------------|
| `index.html` | `/` |
| `shop.html` | `/shop` |
| `about.html` | `/about` |
| `contact.html` | `/contact` |
| `faq.html` | `/faq` |
| `blog.html` | `/blog` |
| `blog-detail.html?slug=…` | `/blog/[slug]` (single template) |
| `product-detail.html?slug=…` | `/product/[slug]` (single template) |
| `privacy-policy.html` | `/legal/privacy-policy` |
| `terms-and-conditions.html` | `/legal/terms-and-conditions` |

## CSS

- `css/shared.css` — reset, fonts (Google Fonts), `.container`, `.title`/`.description`,
  buttons, navbar, footer, scroll-to-top, page-hero, animations.
- One file per page (`home.css`, `shop.css`, …) plus `product-card.css`.

Tailwind breakpoints preserved: **sm 640 · md 768 · lg 1024 · xl 1280**.

## JavaScript (vanilla, no framework)

- `shared.js` — navbar hide-on-scroll + scrolled state, overlay menu, scroll-to-top.
- `home.js` — testimonial slider · `faq.js` — accordion · `contact.js` — form (mock submit).
- `blog.js` / `blog-detail.js` / `shop.js` / `product.js` — data rendering, search,
  pagination, filtering, variants, tabs.
- `data.js` — mock products & blogs (mirrors `public/datas/*.ts`).
- `product-card.js` — shared product-card markup.

## Backend integration (your part)

All data currently comes from `js/data.js` (mirror of the old mock `src/services/api.ts`).
To wire a real backend, replace the in-memory arrays / fetches:

- **Products / blogs**: replace `window.QINOTO_DATA` in `js/data.js` with `fetch()` calls,
  or inject server-rendered data.
- **Contact form**: `js/contact.js` has a `submitContactForm()` stub — point it at your API.
- **Newsletter inputs** (footer + home): currently inert `<form>`s, ready to be wired.

## Notes

- The "LEARN MORE" buttons link to `products.html` / `shades.html`, mirroring the original
  `/products` and `/shades` links, which had **no routes in the source app either** (dead links).
- The ProductCard "Quick View" modal from the source was dead code (no trigger rendered),
  so it was intentionally omitted — the visible UI is identical.
