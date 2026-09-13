# CodeAlpha Tasks — AI Language Translator and FAQ Chatbot

This repository contains two CodeAlpha internship submissions in one responsive React/Vite project:

- **Task 1 — AI Language Translator**
- **Task 2 — AI FAQ Assistant for Learning and Student Support**

The app provides a focused translation workspace with language selection, translation, copy, language swapping, and text-to-speech support. It runs entirely in the browser and does not require an account, server-side API key, or paid AI service.

## live demo:task 1

https://lnkd.in/dyRUwz4W⁠

## live demo:Task 2
https://lingua-bridge--malavneha855mal.replit.app⁠

## GitHub:
https://github.com/malavneha855mal/codealpha_tasks⁠
## blog post

https://www.linkedin.com/posts/dr-neha-malav-743a25332_codealpha-aiinternship-artificialintelligence-activity-7504508828550565888-GgJo?utm_source=share&utm_medium=member_android&rcm=ACoAAFPNH-MBXp2sRv4_I_GZ4b73lZqB8QJm3hQ

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

## Task 2 — AI FAQ Assistant

Task 2 is a separate FAQ Chatbot page available from the **FAQ Chatbot** navigation option at `/faq-chatbot`.

It uses the topic **AI Learning & Student Support** and includes 21 curated FAQs covering:

- Courses and beginner learning
- Assignments, projects, deadlines, and submissions
- AI/ML learning paths and resources
- Technical support and debugging
- Internships, certificates, attendance, and participation
- GitHub, portfolios, and career preparation

The chatbot works locally without an external AI or translation service. It:

1. Converts FAQ questions and user questions to lowercase.
2. Tokenizes the text with the browser-compatible `compromise` NLP library.
3. Removes punctuation, common stop words, and low-value filler words.
4. Normalizes a small set of transparent synonyms for better paraphrase matching.
5. Builds term-frequency vectors and ranks FAQ questions with explicit cosine similarity.
6. Returns the best answer only when it meets the similarity threshold; otherwise it asks the user to rephrase.

Task 2 source locations:

- FAQ dataset: `artifacts/language-translator/src/data/faqData.ts`
- NLP preprocessing and cosine similarity: `artifacts/language-translator/src/lib/faqMatcher.ts`
- Chatbot page and UI: `artifacts/language-translator/src/pages/faq-chatbot.tsx`
- Shared task navigation: `artifacts/language-translator/src/components/task-navigation.tsx`

No OpenAI service, paid API, API key, or secret credential is required for Task 2.

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
│       │   ├── components/
│       │   ├── data/faqData.ts
│       │   ├── index.css
│       │   ├── lib/faqMatcher.ts
│       │   ├── main.tsx
│       │   └── pages/faq-chatbot.tsx
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
- Internet access for MyMemory translation requests when using Task 1

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

## CodeAlpha submissions

This repository preserves the completed CodeAlpha Task 1 AI Language Translator and adds Task 2 as a separate FAQ Chatbot page. Both tasks share the existing project, styling, and build configuration without requiring user-provided API keys.