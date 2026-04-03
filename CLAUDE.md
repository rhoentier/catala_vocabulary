# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Catala is a React web app that generates and displays Catalan-German vocabulary sheets in A4 format with PDF export. Vocabulary lists are generated via an LLM (OpenAI-compatible API through LiteLLM) and rendered as clean, downloadable pages.

## Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # TypeScript check + Vite production build (output: dist/)
npm run lint         # ESLint
npm run vocab -- "Category Name" [count]  # Generate vocabulary via LLM (default: 10 words; requires LITELLM_API_KEY, LITELLM_MODEL, LITELLM_BASE_URL in .env)
```

No test framework is configured.

## Architecture

**Two main parts:**

1. **React App (`src/`)** — Displays vocabulary on a simulated A4 page (794x1123px at 96 DPI) with PDF export via `@react-pdf/renderer`. Uses Mantine v9 for UI components and Phosphor Icons.

2. **Vocabulary Generator (`data/generate_vocabulary.ts`)** — CLI script that calls an OpenAI-compatible API with structured tool calling, validates the response with Zod, and writes JSON files to `data/vocabulary/`. New JSON files are automatically picked up by the app via Vite's `import.meta.glob`.

**Data flow:** `generate_vocabulary.ts` -> `data/vocabulary/*.json` -> `App.tsx` (glob import) -> `Nomen.tsx` / `Verb.tsx`

**Word types use a discriminated union (`wordType` field):**
- `noun` — singular/plural forms (each with catalan + german strings)
- `verb` — 6 conjugation forms (jo, tu, ellElla, nosaltres, vosaltres, ellsElles)

## Key Conventions

- UI language is German; vocabulary pairs are Catalan-German
- Accent color is `#aa3bff` (purple)
- Deployment target is GitHub Pages at base path `/catala_vocabulary/` (configured in `vite.config.ts`)
- TypeScript strict mode is enabled; no unused locals/parameters allowed
- A Mantine UI MCP server is configured in `.claude/.mcp.json` (version 7.16.2)
