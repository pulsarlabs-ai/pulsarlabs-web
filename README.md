# Pulsar Labs — Teaser Website

Static one-page teaser site for [pulsarlabs.co.uk](https://pulsarlabs.co.uk).

## Stack

Pure HTML / CSS / vanilla JS. No framework, no build step.

## Files

| File | Role |
|---|---|
| `index.html` | Page structure and content |
| `style.css` | Dark theme, typography, layout |
| `pulsar.js` | Animated pulsar waveform (HTML5 Canvas) |

## Setup

### Email form
The contact form uses [Formspree](https://formspree.io). Replace `YOUR_FORM_ID` in `index.html` with your actual form ID:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Deployment
Deployed via [Vercel](https://vercel.com) from this repository. Every push to `main` triggers an automatic redeploy.

### Custom domain
`pulsarlabs.co.uk` is pointed to Vercel via GoDaddy DNS:
- `A` record: `@` → `76.76.21.21`
- `CNAME` record: `www` → `cname.vercel-dns.com`
