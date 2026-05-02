# eleazarai.dev

Personal site for **Eleazar Sebastian Martinez** — freelance AI automation engineer.
Live at [eleazarai.dev](https://eleazarai.dev/).

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- Framer Motion + GSAP for animations
- Geist + Geist Mono typography
- Two-way synced with Lovable for visual editing

## Local development

Requires Node.js 18+ and npm.

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # production build
npm run lint     # eslint
```

## Project layout

```
src/
  pages/            route components (Index, NotFound)
  components/       section components (Hero, Services, Portfolio, ...)
  components/ui/    shadcn primitives
  index.css         design tokens (palette, type, animations)
  assets/           portrait + workflow screenshots
```

## Deploy

Pushed commits sync automatically to Lovable; production deploys via Lovable's hosting at the custom domain `eleazarai.dev`.

## Contact

[tian1504@gmail.com](mailto:tian1504@gmail.com) · [LinkedIn](https://www.linkedin.com/in/eleazar-sebastian-martinez-76210983/) · [Upwork](https://www.upwork.com/freelancers/~01ac0c23391406fb0d)
