# alpeshrupapara21.github.io

Portfolio of **Alpesh Rupapara** — Senior Software Engineer & iOS Technical Lead.

Two audiences, one design system:

| Page | URL | For |
|---|---|---|
| Engineering profile | https://alpeshrupapara21.github.io/ | Job applications — architecture depth, project specifications, capability matrix, experience |
| Freelance | https://alpeshrupapara21.github.io/hire/ | Client enquiries — services, proof, process, engagement models |

## Design

"The Engineering Record" — Swiss-technical dark. IBM Plex Sans + JetBrains Mono,
near-black ground, single signal accent (green for hiring, amber for freelance via
one CSS custom-property swap on `body.hire`).

## Stack

Hand-written HTML, CSS and JavaScript. **No framework, no build step, no dependencies.**
Push to `main` and GitHub Pages serves it.

```
index.html          # hiring page
hire/index.html     # freelance page
assets/css/style.css
assets/js/main.js   # sticky nav, scroll reveal, count-up, capability bars
```

Accessibility: skip link, visible focus rings, ARIA labels on icon controls,
`prefers-reduced-motion` respected throughout, 44px minimum touch targets.

## Local preview

```sh
python3 -m http.server 8080
# → http://localhost:8080
```
