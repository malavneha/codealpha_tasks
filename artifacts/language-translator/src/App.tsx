import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  Copy,
  Info,
  Languages,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Volume2,
  WandSparkles,
} from 'lucide-react';

type Language = {
  code: string;
  name: string;
  native: string;
};

type Feedback = 'idle' | 'translated' | 'copied' | 'speaking' | 'empty' | 'error';
type MyMemoryResponse = {
  responseData?: {
    translatedText?: string;
  };
  responseStatus?: number;
  responseDetails?: string;
};

const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
];

const examples = ['Hello, how are you?', 'Good morning', 'Thank you for your help.'];
const MYMEMORY_ENDPOINT = 'https://api.mymemory.translated.net/get';

function getLanguage(code: string) {
  return languages.find((language) => language.code === code) ?? languages[0];
}

function TranslatorApp() {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState('');
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const source = getLanguage(sourceLanguage);
  const target = getLanguage(targetLanguage);

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    window.speechSynthesis?.cancel();
  }, []);

  const showTemporaryFeedback = (nextFeedback: Feedback, duration = 2200) => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(nextFeedback);
    feedbackTimer.current = setTimeout(() => setFeedback(translatedText ? 'translated' : 'idle'), duration);
  };

  const handleTranslate = () => {
    const text = sourceText.trim();
    if (!text) {
      setTranslatedText('');
      setTranslationError('');
      setFeedback('empty');
      return;
    }

    setFeedback('idle');
    setTranslatedText('');
    setTranslationError('');
    setIsTranslating(true);

    const url = new URL(MYMEMORY_ENDPOINT);
    url.searchParams.set('q', text);
    url.searchParams.set('langpair', `${sourceLanguage}|${targetLanguage}`);

    fetch(url)
      .then(async (response) => {
        const payload = (await response.json()) as MyMemoryResponse;
        const result = payload.responseData?.translatedText?.trim();

        if (!response.ok || payload.responseStatus !== 200 || !result) {
          throw new Error(payload.responseDetails || 'The translation service could not translate that text.');
        }

        return result;
      })
      .then((result) => {
        setTranslatedText(result);
        setFeedback('translated');
      })
      .catch((error: unknown) => {
        setTranslationError(error instanceof Error ? error.message : 'The translation service is temporarily unavailable. Please try again.');
        setFeedback('error');
      })
      .finally(() => setIsTranslating(false));
  };

  const handleSwap = () => {
    setTranslationError('');
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    setFeedback(translatedText ? 'translated' : 'idle');
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
    } catch {
      const helper = document.createElement('textarea');
      helper.value = translatedText;
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    showTemporaryFeedback('copied');
  };

  const handleSpeak = () => {
    if (!translatedText || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = target.code;
    utterance.onend = () => setFeedback('translated');
    window.speechSynthesis.speak(utterance);
    showTemporaryFeedback('speaking', 4000);
  };

  const handleExample = (example: string) => {
    setTranslationError('');
    setSourceText(example);
    setFeedback('idle');
    setTimeout(() => document.getElementById('source-textarea')?.focus(), 0);
  };

  const statusCopy: Record<Feedback, { label: string; detail: string }> = {
    idle: { label: 'Ready when you are', detail: 'Your translation stays in this browser.' },
    translated: { label: 'Translation ready', detail: 'Review, copy, or listen to your result.' },
    copied: { label: 'Copied to clipboard', detail: 'Your translation is ready to paste anywhere.' },
    speaking: { label: 'Reading translation aloud', detail: 'Use your device volume controls to adjust playback.' },
    empty: { label: 'Add a few words first', detail: 'Type something above, then try translating again.' },
    error: { label: 'Translation failed', detail: 'The service could not complete that request. Try again.' },
  };
  const status = statusCopy[feedback];

  return (
    <main className="app-grain min-h-[100dvh] overflow-hidden bg-background">
      <div className="soft-grid pointer-events-none absolute inset-x-0 top-0 h-[360px] opacity-70" />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1240px] flex-col px-5 sm:px-8 lg:px-12">
        <header className="animate-fade-up flex items-center justify-between py-6 sm:py-8" data-testid="header-app">
          <div className="flex items-center gap-3" data-testid="brand-language-translator">
            <div className="wordmark-mark flex h-10 w-10 items-center justify-center rounded-[13px] text-card">
              <Languages size={20} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <div>
              <div className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary" data-testid="text-brand-kicker">Clear words</div>
              <div className="text-[15px] font-extrabold tracking-[-0.03em] text-foreground" data-testid="text-brand-name">lingua</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground sm:flex" data-testid="text-local-privacy">
            <ShieldCheck size={15} className="text-primary" aria-hidden="true" />
            Private by design
          </div>
        </header>

        <section className="animate-fade-up animate-delay-1 pb-8 pt-7 sm:pb-11 sm:pt-10" data-testid="section-introduction">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary" data-testid="text-section-label">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            A simpler way to say it
          </div>
          <h1 className="max-w-2xl text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.065em] text-foreground sm:text-6xl" data-testid="heading-translator">
            Move from thought<br className="hidden sm:block" /> to <span className="text-primary">clear words.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-muted-foreground sm:text-base" data-testid="text-introduction">
            A focused translation workspace for the words that matter. No accounts, no clutter — just a thoughtful result.
          </p>
        </section>

        <section className="animate-fade-up animate-delay-2 flex-1" aria-label="Translation workspace" data-testid="section-translator-workspace">
          <div className="relative grid items-stretch gap-3 lg:grid-cols-[1fr_48px_1fr]">
            <article className="flex min-h-[330px] flex-col overflow-hidden rounded-[22px] border border-card-border bg-card shadow-[var(--shadow-soft)] transition-shadow duration-300 focus-within:shadow-[0_20px_60px_rgba(39,69,70,0.14)]" data-testid="card-source-language">
              <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
                <label className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground" htmlFor="source-language" data-testid="label-source-language">From</label>
                <select
                  id="source-language"
                  value={sourceLanguage}
                    onChange={(event) => {
                      setTranslationError('');
                      setSourceLanguage(event.target.value);
                      setTranslatedText('');
                      setFeedback('idle');
                    }}
                  className="select-chevron w-[145px] cursor-pointer rounded-lg border border-border bg-secondary/65 px-3 py-2 text-right text-sm font-bold text-secondary-foreground outline-none transition-colors hover:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  aria-label="Source language"
                  data-testid="select-source-language"
                >
                  {languages.map((language) => <option key={language.code} value={language.code}>{language.name} · {language.native}</option>)}
                </select>
              </div>
              <div className="flex flex-1 flex-col px-5 pb-4 pt-5 sm:px-6">
                <textarea
                  id="source-textarea"
                  value={sourceText}
                  onChange={(event) => {
                    setTranslationError('');
                    setSourceText(event.target.value);
                    if (feedback === 'empty' || feedback === 'error') setFeedback('idle');
                  }}
                  placeholder="Start with a sentence..."
                  maxLength={1000}
                  className="min-h-[175px] flex-1 resize-none bg-transparent text-[19px] font-semibold leading-8 tracking-[-0.02em] text-foreground outline-none placeholder:text-muted-foreground/45 sm:text-[21px]"
                  aria-label={`Text to translate from ${source.name}`}
                  data-testid="input-source-text"
                />
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground/75" data-testid="text-character-count">{sourceText.length} / 1,000</span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground" data-testid="text-source-language-name">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {source.name}
                  </span>
                </div>
              </div>
            </article>

            <div className="flex items-center justify-center lg:relative">
              <button
                type="button"
                onClick={handleSwap}
                className="group z-10 flex h-11 w-11 items-center justify-center rounded-full border border-card-border bg-card text-primary shadow-[0_8px_22px_rgba(39,69,70,0.1)] transition-all duration-200 hover:-rotate-180 hover:border-primary hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-4 focus:ring-primary/15 active:scale-95 max-lg:-my-5"
                aria-label="Swap source and target languages"
                title="Swap languages"
                data-testid="button-swap-languages"
              >
                <ArrowLeftRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>

            <article className="flex min-h-[330px] flex-col overflow-hidden rounded-[22px] border border-primary/20 bg-[#eef5f1] shadow-[var(--shadow-soft)] transition-shadow duration-300 dark:bg-card" data-testid="card-translation-result">
              <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4 sm:px-6">
                <label className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-primary/75" htmlFor="target-language" data-testid="label-target-language">To</label>
                <select
                  id="target-language"
                  value={targetLanguage}
                    onChange={(event) => {
                      setTranslationError('');
                      setTargetLanguage(event.target.value);
                      setTranslatedText('');
                      setFeedback('idle');
                    }}
                  className="select-chevron w-[145px] cursor-pointer rounded-lg border border-primary/15 bg-card/60 px-3 py-2 text-right text-sm font-bold text-primary outline-none transition-colors hover:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  aria-label="Target language"
                  data-testid="select-target-language"
                >
                  {languages.map((language) => <option key={language.code} value={language.code}>{language.name} · {language.native}</option>)}
                </select>
              </div>
              <div className="flex flex-1 flex-col px-5 pb-4 pt-5 sm:px-6">
                <div className="flex min-h-[175px] flex-1 items-start" aria-live="polite" data-testid="display-translated-text">
                  {isTranslating ? (
                    <div className="flex items-center gap-2 pt-1 text-primary" data-testid="status-translating">
                      <span className="flex gap-1"><i className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-primary" /><i className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-primary [animation-delay:.15s]" /><i className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-primary [animation-delay:.3s]" /></span>
                      <span className="text-sm font-semibold">Finding the right words...</span>
                    </div>
                  ) : translationError ? (
                    <div className="max-w-[280px] pt-1" data-testid="status-translation-error">
                      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                        <Info size={18} aria-hidden="true" />
                      </div>
                      <p className="text-sm font-bold text-foreground">We couldn’t translate that.</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{translationError}</p>
                    </div>
                  ) : translatedText ? (
                    <p className="animate-fade-up text-[19px] font-semibold leading-8 tracking-[-0.02em] text-foreground sm:text-[21px]" data-testid="text-translated-result">{translatedText}</p>
                  ) : (
                    <div className="max-w-[230px] pt-1" data-testid="empty-translation-state">
                      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><WandSparkles size={18} aria-hidden="true" /></div>
                      <p className="text-sm font-bold text-foreground">Your translation will appear here.</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">A small step for your sentence, a big step for understanding.</p>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-primary/70" data-testid="text-target-language-name">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {target.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={handleCopy} disabled={!translatedText} className="group flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Copy translation" data-testid="button-copy-translation">
                      {feedback === 'copied' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                      <span>{feedback === 'copied' ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button type="button" onClick={handleSpeak} disabled={!translatedText} className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Listen to translation" data-testid="button-speak-translation">
                      <Volume2 size={15} aria-hidden="true" />
                      <span>Listen</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-5 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="order-2 flex items-center gap-2 text-xs text-muted-foreground sm:order-1" aria-live="polite" data-testid="status-feedback">
              {feedback === 'copied' ? <Check size={15} className="text-primary" aria-hidden="true" /> : feedback === 'speaking' ? <Volume2 size={15} className="text-primary" aria-hidden="true" /> : feedback === 'empty' || feedback === 'error' ? <Info size={15} className={feedback === 'error' ? 'text-destructive' : 'text-accent-foreground'} aria-hidden="true" /> : <Sparkles size={15} className="text-accent-foreground" aria-hidden="true" />}
              <span><strong className="font-bold text-foreground" data-testid="text-feedback-label">{status.label}</strong><span className="ml-1.5 hidden sm:inline" data-testid="text-feedback-detail">· {feedback === 'error' ? translationError : status.detail}</span></span>
            </div>
            <button type="button" onClick={handleTranslate} disabled={isTranslating} className="order-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-primary-foreground shadow-[0_9px_22px_hsl(var(--primary)/.2)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_13px_28px_hsl(var(--primary)/.28)] focus:outline-none focus:ring-4 focus:ring-primary/20 active:translate-y-0 disabled:cursor-wait disabled:opacity-75 sm:order-2 sm:min-w-[150px]" data-testid="button-translate">
              <MessageSquareText size={17} strokeWidth={2.4} aria-hidden="true" />
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </section>

        <section className="animate-fade-up animate-delay-3 border-t border-border/80 py-8 sm:mt-10 sm:py-10" data-testid="section-examples">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground" data-testid="text-examples-kicker">Try a phrase</p>
              <p className="mt-1 text-sm font-semibold text-foreground" data-testid="text-examples-description">Start with something familiar.</p>
            </div>
            <div className="flex flex-wrap gap-2" data-testid="list-example-phrases">
              {examples.map((example) => (
                <button key={example} type="button" onClick={() => handleExample(example)} className="rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20" data-testid={`button-example-${example.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                  {example}
                </button>
              ))}
            </div>
          </div>
          <footer className="mt-8 flex items-center justify-between text-[11px] text-muted-foreground" data-testid="footer-app">
            <span data-testid="text-footer-note">Made for clearer conversations.</span>
             <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]" data-testid="text-footer-mode"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Live translation</span>
          </footer>
        </section>
      </div>
    </main>
  );
}

function App() {
  return <TranslatorApp />;
}

export default App;