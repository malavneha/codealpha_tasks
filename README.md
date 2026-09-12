# CodeAlpha Task 1 — AI Language Translator

A responsive AI Language Translator web application created for the CodeAlpha internship Task 1 submission.

The app provides a focused translation workspace with language selection, translation, copy, language swapping, and text-to-speech support. It runs entirely in the browser and does not require an account, server-side API key, or paid AI service.

## live demo

https://lingua-bridge--malavneha855mal.replit.app⁠

## Features

- Translate text between 15 supported languages:
  - English
  - Hindi
  - Bengali
  - Spanish
  - French
  - German
  - Italian
  - Japanese
  - Korean
  - Tamil
  - Telugu
  - Marathi
  - Gujarati
  - Kannada
  - Malayalam
- Source and target language selectors
- Swap source and target languages
- Copy translated text to the clipboard
- Read translated text aloud with the browser's Web Speech API
- Loading, empty, success, and error states
- Responsive layout for desktop and mobile screens
- No login or account required

## How translation works

The app uses the free [MyMemory Translation API](https://mymemory.translated.net/doc/spec.php) directly from the browser.

When the user selects **Translate**, the app sends a request to:

```text
https://api.mymemory.translated.net/get
```

The request includes:

- `q` — the text entered by the user
- `langpair` — the selected language codes in the format `source|target`

For example, an English-to-Hindi request uses:

```text
langpair=en|hi
```

No OpenAI service, OpenAI API key, or other private API key is used.

## Project structure

```text
.
├── artifacts/
│   └── language-translator/
│       ├── public/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── main.tsx
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Requirements

- Node.js 20 or newer
- pnpm 9 or newer
- Internet access for MyMemory translation requests

## Run locally

From the repository root:

```bash
pnpm install
PORT=4173 BASE_PATH=/ pnpm --filter @workspace/language-translator run dev
```

Vite will print the local development URL in the terminal.

To create a production build:

```bash
PORT=4173 BASE_PATH=/ pnpm --filter @workspace/language-translator run build
```

To preview the production build:

```bash
PORT=4173 BASE_PATH=/ pnpm --filter @workspace/language-translator run serve
```

## Verification

The completed project has been checked with:

```bash
pnpm --filter @workspace/language-translator run typecheck
PORT=4173 BASE_PATH=/ pnpm --filter @workspace/language-translator run build
```

## Task 1 submission

This repository contains the completed CodeAlpha Task 1 AI Language Translator project, including the application source code, styling, configuration, and setup instructions needed to run it locally.