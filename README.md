# KOF Character Selection

A web-based **character selection screen** inspired by  
**The King of Fighters EX2: Howling Blood (Game Boy Advance)**.

This project recreates the classic arcade-style character select experience using modern web technologies, featuring animated UI, sound effects, background music, and interactive character previews.

Developed by **Sergio Alva**.

---

## Features

- **21 characters** displayed in a 3×7 selection grid
- **Black & white → color transition** on hover and selection
- **Background music (BGM)** with user-initiated playback
- **Sound effects** for hover, selection, and confirmation
- **Large character portrait preview** with animated transitions
- **Animated stat bars** (Power, Speed, Technique)
- **Intro modal popup** with project description
- Arcade-style cursor and visual feedback
- Fully responsive layout


## Technologies Used

- **React + TypeScript** — Component-based UI and type safety
- **Vite** — Fast development and optimized production build
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations and transitions
- **Howler.js** — Audio playback and sound management
- **Cloudflare Pages** — Free static deployment


## Project Structure

```text
public/
├── bg/                 # Background images
├── bgm/                # Background music
├── sfx/                # Sound effects
├── characters/
│   ├── profile/        # Grid character tiles
│   └── portrait/       # Large character portraits
├── intro/              # Intro modal images
├── icons/
│   └── favicon.png     # App icon


src/
├── app/
│   ├── App.tsx         # Main application
│   └── main.tsx        # React entry point
├── features/
│   └── character-select
│       ├── components
│       │   ├── IntroModal.tsx
│       │   └── StatsBar.tsx
│       ├── data
│       │   └── characters.ts
│       ├── hooks       # Custom hooks (audio, logic, etc.)
│       │   └── useCharacterSelect.ts
│       │   └── useSfx.ts
│       └── CharacterSelectPage.tsx
├── shared/
│   └── types/
│       └── character.ts
├── styles/
│   └── index.css
```  
## Deployed Web App
https://kof-character-selection.pages.dev/
