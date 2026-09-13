import { useEffect, useRef, useState } from 'react';
import { BookOpenCheck, BrainCircuit, Check, CircleHelp, Send, Sparkles, Trash2 } from 'lucide-react';

import { TaskNavigation } from '@/components/task-navigation';
import { faqItems, faqTopic, type FaqItem } from '@/data/faqData';
import { matchFaqQuestion, type FaqMatch } from '@/lib/faqMatcher';

type ChatMessage = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  match?: FaqMatch;
};

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  content:
    'Welcome. Ask me about courses, assignments, projects, internships, GitHub, or preparing for an AI career. I will look for the closest answer in the student support knowledge base.',
};

const suggestedQuestions = [
  'Can I learn AI as a complete beginner?',
  'What should a project README contain?',
  'How should I submit my completed project?',
  'How can I build a strong portfolio?',
];

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function FaqChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [question, setQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
    },
    [],
  );

  const sendQuestion = (nextQuestion = question) => {
    const trimmedQuestion = nextQuestion.trim();
    if (!trimmedQuestion || isTyping) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: trimmedQuestion,
    };
    const match = matchFaqQuestion(trimmedQuestion, faqItems);

    setMessages((current) => [...current, userMessage]);
    setQuestion('');
    setIsTyping(true);

    typingTimer.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: 'bot',
          content: match
            ? match.faq.answer
            : "I'm not confident I found the right answer. Please try asking your question in a different way.",
          match: match ?? undefined,
        },
      ]);
      setIsTyping(false);
      typingTimer.current = null;
    }, 480);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendQuestion();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendQuestion();
    }
  };

  const clearChat = () => {
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    typingTimer.current = null;
    setIsTyping(false);
    setQuestion('');
    setMessages([welcomeMessage]);
  };

  return (
    <main className="app-grain min-h-[100dvh] overflow-hidden bg-background">
      <div className="soft-grid pointer-events-none absolute inset-x-0 top-0 h-[360px] opacity-70" />
      <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-[1240px] flex-col px-5 sm:px-8 lg:px-12">
        <header className="animate-fade-up flex flex-col gap-5 py-6 sm:py-8 lg:flex-row lg:items-center lg:justify-between" data-testid="header-faq-chatbot">
          <div className="flex items-center gap-3">
            <div className="wordmark-mark flex h-10 w-10 items-center justify-center rounded-[13px] text-card">
              <BrainCircuit size={20} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <div>
              <div className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary" data-testid="text-faq-kicker">
                CodeAlpha Task 2
              </div>
              <div className="text-[15px] font-extrabold tracking-[-0.03em] text-foreground" data-testid="text-faq-brand">
                AI FAQ Assistant
              </div>
            </div>
          </div>
          <TaskNavigation />
        </header>

        <section className="animate-fade-up animate-delay-1 pb-7 pt-5 sm:pb-9 sm:pt-8" data-testid="section-faq-introduction">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {faqTopic}
          </div>
          <h1 className="max-w-3xl text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.065em] text-foreground sm:text-6xl" data-testid="heading-faq-chatbot">
            Learn with <span className="text-primary">clear answers.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base" data-testid="text-faq-description">
            Ask a question and I&apos;ll find the most relevant answer from our FAQ knowledge base.
          </p>
        </section>

        <section className="animate-fade-up animate-delay-2 grid flex-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]" aria-label="FAQ chatbot workspace">
          <div className="flex min-h-[540px] flex-col overflow-hidden rounded-[24px] border border-card-border bg-card shadow-[var(--shadow-soft)]" data-testid="card-chatbot">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles size={16} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-foreground">Student support assistant</p>
                  <p className="text-[11px] text-muted-foreground">Answers from a local FAQ knowledge base</p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearChat}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="Clear chat"
                data-testid="button-clear-chat"
              >
                <Trash2 size={14} aria-hidden="true" />
                Clear
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite" data-testid="list-chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2.5 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`} data-testid={`message-${message.role}-${message.id}`}>
                  {message.role === 'bot' && (
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <BrainCircuit size={15} aria-hidden="true" />
                    </div>
                  )}
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-secondary/70 text-foreground'}`}>
                    <p>{message.content}</p>
                    {message.match && (
                      <div className="mt-3 border-t border-primary/10 pt-2.5 text-xs text-muted-foreground" data-testid={`match-details-${message.match.faq.id}`}>
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-bold text-primary">{message.match.faq.topic}</span>
                          <span className="font-mono text-[10px]">{message.match.confidence}% match</span>
                        </div>
                        <p className="mt-1 leading-5">Matched: {message.match.faq.question}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2.5" data-testid="status-chatbot-typing">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <BrainCircuit size={15} aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-secondary/70 px-4 py-3">
                    <i className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
                    <i className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-primary [animation-delay:.15s]" />
                    <i className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-primary [animation-delay:.3s]" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border/70 p-4 sm:p-5" data-testid="form-faq-question">
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-background p-2 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your learning journey..."
                  rows={2}
                  maxLength={500}
                  className="min-h-[46px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground/60"
                  aria-label="Ask a student support question"
                  data-testid="input-faq-question"
                />
                <button
                  type="submit"
                  disabled={!question.trim() || isTyping}
                  className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-3.5 text-xs font-extrabold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_18px_hsl(var(--primary)/.24)] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send question"
                  data-testid="button-send-question"
                >
                  <Send size={15} aria-hidden="true" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
                <span>Press Enter to send · Shift + Enter for a new line</span>
                <span>{question.length}/500</span>
              </div>
            </form>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[22px] border border-primary/15 bg-[#eef5f1] p-5 shadow-[var(--shadow-soft)] dark:bg-card sm:p-6" data-testid="card-suggested-questions">
              <div className="mb-4 flex items-center gap-2">
                <CircleHelp size={17} className="text-primary" aria-hidden="true" />
                <h2 className="text-sm font-extrabold text-foreground">Try asking</h2>
              </div>
              <div className="flex flex-col gap-2">
                {suggestedQuestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendQuestion(suggestion)}
                    disabled={isTyping}
                    className="rounded-xl border border-primary/10 bg-card/75 px-3.5 py-3 text-left text-xs font-semibold leading-5 text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid={`button-suggestion-${suggestion.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6" data-testid="card-about-faq-knowledge-base">
              <div className="mb-3 flex items-center gap-2 text-primary">
                <BookOpenCheck size={17} aria-hidden="true" />
                <h2 className="text-sm font-extrabold text-foreground">Knowledge base</h2>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                This assistant searches {faqItems.length} curated questions using local NLP preprocessing and cosine similarity. It does not call an AI service or send your question anywhere.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                <Check size={14} className="text-primary" aria-hidden="true" />
                <span>Private and available offline</span>
              </div>
            </div>
          </aside>
        </section>

        <footer className="mt-8 flex items-center justify-between border-t border-border/80 py-7 text-[11px] text-muted-foreground sm:mt-10" data-testid="footer-faq-chatbot">
          <span>Built for clearer learning paths.</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Local FAQ matching
          </span>
        </footer>
      </div>
    </main>
  );
}